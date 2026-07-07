import React, { useEffect, useState } from 'react'
import bcrypt from '../vendor/bcrypt-browser'
import db from '../firebase-config'
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
} from 'firebase/firestore'

const GUESTBOOK_COLLECTION = 'guestbook'
const MAX_NAME_LENGTH = 20
const MAX_PASSWORD_LENGTH = 20
const MAX_MESSAGE_LENGTH = 500

function formatDate(timestamp) {
  const date = timestamp?.toDate ? timestamp.toDate() : new Date()
  const year = date.getFullYear()
  const month = `${date.getMonth() + 1}`.padStart(2, '0')
  const day = `${date.getDate()}`.padStart(2, '0')
  const minutes = `${date.getMinutes()}`.padStart(2, '0')
  const meridiem = date.getHours() < 12 ? 'am' : 'pm'
  const hours = date.getHours() % 12 || 12

  return `${year}.${month}.${day} ${hours}:${minutes}${meridiem}`
}

function Comment() {
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [showPasswordFor, setShowPasswordFor] = useState(null)
  const [deletePassword, setDeletePassword] = useState('')
  const [visibleComments, setVisibleComments] = useState(5)
  const [isExpanded, setIsExpanded] = useState(false)
  const [isWritingOpen, setIsWritingOpen] = useState(false)

  const fetchComments = async () => {
    setLoading(true)
    try {
      const snapshot = await getDocs(
        query(collection(db, GUESTBOOK_COLLECTION), orderBy('createdAt', 'desc')),
      )
      const items = snapshot.docs.map((item) => ({
        id: item.id,
        ...item.data(),
        date: formatDate(item.data().createdAt),
      }))
      setComments(items)
    } catch (error) {
      console.error('Error fetching guestbook:', error)
      alert('방명록을 불러오지 못했습니다. 잠시 후 다시 시도해주세요.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchComments()
  }, [])

  const resetForm = () => {
    setName('')
    setPassword('')
    setMessage('')
  }

  const closeWriter = () => {
    if (submitting) return
    setIsWritingOpen(false)
    resetForm()
  }

  const onCommentSubmit = async (event) => {
    event.preventDefault()

    const trimmedName = name.trim()
    const trimmedMessage = message.trim()

    if (!trimmedName || !password || !trimmedMessage) {
      alert('이름, 비밀번호, 축하메시지를 모두 입력해주세요.')
      return
    }

    if (trimmedName.length > MAX_NAME_LENGTH || trimmedMessage.length > MAX_MESSAGE_LENGTH) {
      alert('입력 가능한 글자 수를 초과했습니다.')
      return
    }

    setSubmitting(true)
    try {
      const passwordHash = await bcrypt.hash(password, 10)
      await addDoc(collection(db, GUESTBOOK_COLLECTION), {
        name: trimmedName,
        message: trimmedMessage,
        passwordHash,
        createdAt: serverTimestamp(),
      })
      resetForm()
      setIsWritingOpen(false)
      await fetchComments()
      alert('방명록이 등록되었습니다.')
    } catch (error) {
      console.error('Error adding guestbook message:', error)
      alert('방명록 등록에 실패했습니다. 다시 시도해주세요.')
    } finally {
      setSubmitting(false)
    }
  }

  const toggleCommentsVisibility = () => {
    if (isExpanded) {
      setVisibleComments(5)
      setIsExpanded(false)
    } else {
      setVisibleComments(comments.length)
      setIsExpanded(true)
    }
  }

  const requestDelete = (commentId) => {
    setShowPasswordFor(showPasswordFor === commentId ? null : commentId)
    setDeletePassword('')
  }

  const deleteComment = async (comment) => {
    if (!deletePassword) {
      alert('비밀번호를 입력해주세요.')
      return
    }

    try {
      const isPasswordMatched = await bcrypt.compare(deletePassword, comment.passwordHash)
      if (!isPasswordMatched) {
        alert('비밀번호가 일치하지 않습니다.')
        return
      }

      await deleteDoc(doc(db, GUESTBOOK_COLLECTION, comment.id))
      setComments(comments.filter((item) => item.id !== comment.id))
      setShowPasswordFor(null)
      setDeletePassword('')
      alert('메시지가 삭제되었습니다.')
    } catch (error) {
      console.error('Error deleting guestbook message:', error)
      alert('메시지 삭제에 실패했습니다. 다시 시도해주세요.')
    }
  }

  return (
    <div className='bc-pink container comment'>
      <div className='title comment__title'>방명록</div>

      <div className='comment__container-data'>
        {loading ? (
          <div className='comment__empty'>방명록을 불러오는 중입니다.</div>
        ) : comments.length === 0 ? (
          <div className='comment__empty'>아직 남겨진 메시지가 없습니다.</div>
        ) : (
          comments.slice(0, visibleComments).map((comment) => (
            <div className='comment__data' key={comment.id}>
              <div className='comment__data-head'>
                <div className='comment__from'>From.{comment.name}</div>
                <button
                  type='button'
                  className='comment__delete-link'
                  onClick={() => requestDelete(comment.id)}
                >
                  삭제
                </button>
              </div>
              <div className='comment__data-com'>{comment.message}</div>
              <div className='comment__date'>{comment.date}</div>
              {showPasswordFor === comment.id && (
                <div className='comment__password'>
                  <input
                    type='password'
                    placeholder='비밀번호 입력'
                    value={deletePassword}
                    onChange={(e) => setDeletePassword(e.target.value)}
                  />
                  <button type='button' onClick={() => deleteComment(comment)}>삭제</button>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {comments.length > 5 && (
        <button type='button' onClick={toggleCommentsVisibility} className='comment__btn-more'>
          {isExpanded ? '닫기' : '더보기'}
        </button>
      )}

      <button type='button' className='comment__btn comment__btn-open' onClick={() => setIsWritingOpen(true)}>
        방명록 작성하기
      </button>

      {isWritingOpen && (
        <div className='comment__modal-backdrop' onClick={closeWriter}>
          <form className='comment__modal' onSubmit={onCommentSubmit} onClick={(event) => event.stopPropagation()}>
            <div className='comment__modal-head'>
              <div>
                <div className='comment__modal-title'>방명록 작성하기</div>
                <div className='comment__modal-guide'>축하 메시지를 남겨주세요.</div>
              </div>
              <button
                type='button'
                className='comment__modal-close'
                onClick={closeWriter}
                aria-label='작성 창 닫기'
              >
                &times;
              </button>
            </div>
            <div className='commment_content'>
              <div>
                <input
                  type='text'
                  value={name}
                  placeholder='이름'
                  onChange={(e) => setName(e.target.value)}
                  maxLength={MAX_NAME_LENGTH}
                />
                <input
                  type='password'
                  value={password}
                  placeholder='비밀번호'
                  onChange={(e) => setPassword(e.target.value)}
                  maxLength={MAX_PASSWORD_LENGTH}
                />
              </div>
              <textarea
                className='comment__message'
                value={message}
                placeholder='축하메시지'
                onChange={(e) => setMessage(e.target.value)}
                maxLength={MAX_MESSAGE_LENGTH}
              />
              <div className='comment__count'>{message.length}/{MAX_MESSAGE_LENGTH}</div>
              <button className='comment__btn comment__btn-submit' type='submit' disabled={submitting}>
                {submitting ? '작성 중...' : '메시지 작성하기'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}

export default Comment
