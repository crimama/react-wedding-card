import React, { useMemo, useState } from 'react'

const PHOTO_UPLOAD_ENDPOINT = 'https://script.google.com/macros/s/AKfycbwXjruiVY1yfJkvXMAkwtrytSw2_nk8EGTUufAC5lGkLrXpxxTW8GJ9xCIHzLyVPS4jtA/exec'
const MAX_FILES = 5
const MAX_FILE_BYTES = 10 * 1024 * 1024
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif', 'image/gif']

function readFileAsBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const result = String(reader.result || '')
      const base64 = result.includes(',') ? result.split(',')[1] : result
      resolve(base64)
    }
    reader.onerror = () => reject(new Error('사진을 읽지 못했습니다.'))
    reader.readAsDataURL(file)
  })
}

function formatBytes(bytes) {
  if (bytes < 1024 * 1024) return `${Math.ceil(bytes / 1024)}KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)}MB`
}

function PhotoUpload() {
  const [uploaderName, setUploaderName] = useState('')
  const [memo, setMemo] = useState('')
  const [files, setFiles] = useState([])
  const [status, setStatus] = useState('')
  const [uploading, setUploading] = useState(false)

  const isConfigured = PHOTO_UPLOAD_ENDPOINT.startsWith('https://script.google.com/macros/s/')

  const totalSize = useMemo(
    () => files.reduce((sum, file) => sum + file.size, 0),
    [files],
  )

  const onFileChange = (event) => {
    const selectedFiles = Array.from(event.target.files || [])

    if (selectedFiles.length > MAX_FILES) {
      alert(`사진은 한 번에 최대 ${MAX_FILES}장까지 업로드할 수 있습니다.`)
      event.target.value = ''
      return
    }

    const invalidFile = selectedFiles.find((file) => !ALLOWED_IMAGE_TYPES.includes(file.type))
    if (invalidFile) {
      alert('이미지 파일만 업로드할 수 있습니다.')
      event.target.value = ''
      return
    }

    const oversizedFile = selectedFiles.find((file) => file.size > MAX_FILE_BYTES)
    if (oversizedFile) {
      alert('사진은 장당 10MB 이하만 업로드할 수 있습니다.')
      event.target.value = ''
      return
    }

    setFiles(selectedFiles)
    setStatus('')
  }

  const onPhotoSubmit = async (event) => {
    event.preventDefault()

    if (!isConfigured) {
      alert('사진 업로드 연결을 준비 중입니다. 잠시 후 다시 시도해주세요.')
      return
    }

    if (files.length === 0) {
      alert('업로드할 사진을 선택해주세요.')
      return
    }

    setUploading(true)
    setStatus('사진을 업로드하는 중입니다. 창을 닫지 말아주세요.')

    try {
      const encodedFiles = await Promise.all(
        files.map(async (file) => ({
          name: file.name,
          mimeType: file.type,
          data: await readFileAsBase64(file),
        })),
      )

      const payload = {
        name: uploaderName.trim() || '하객',
        memo: memo.trim(),
        files: encodedFiles,
      }

      const body = new URLSearchParams({ payload: JSON.stringify(payload) })

      await fetch(PHOTO_UPLOAD_ENDPOINT, {
        method: 'POST',
        mode: 'no-cors',
        body,
      })

      setUploaderName('')
      setMemo('')
      setFiles([])
      event.target.reset()
      setStatus('사진 업로드 요청이 완료되었습니다. 소중한 사진 고맙습니다.')
    } catch (error) {
      console.error('Error uploading guest photos:', error)
      setStatus('사진 업로드에 실패했습니다. 네트워크 상태를 확인 후 다시 시도해주세요.')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className='container photo-upload'>
      <div className='photo-upload__eyebrow'>PHOTO</div>
      <div className='photo-upload__title'>하객 사진 업로드</div>
      <div className='photo-upload__guide'>
        예식장에서 찍은 사진을 남겨주세요.<br />
        업로드된 사진은 신랑신부의 Google Drive로 저장됩니다.
      </div>

      <form className='photo-upload__form' onSubmit={onPhotoSubmit}>
        <input
          className='photo-upload__input'
          type='text'
          placeholder='이름 또는 별명'
          value={uploaderName}
          maxLength={40}
          onChange={(event) => setUploaderName(event.target.value)}
        />
        <textarea
          className='photo-upload__memo'
          placeholder='사진과 함께 남길 메모가 있다면 적어주세요.'
          value={memo}
          maxLength={120}
          onChange={(event) => setMemo(event.target.value)}
        />
        <label className='photo-upload__file-label'>
          <span>{files.length > 0 ? `${files.length}장 선택됨` : '사진 선택하기'}</span>
          <input
            type='file'
            accept='image/jpeg,image/png,image/webp,image/heic,image/heif,image/gif'
            multiple
            onChange={onFileChange}
          />
        </label>

        {files.length > 0 && (
          <div className='photo-upload__file-list'>
            {files.map((file) => (
              <div className='photo-upload__file' key={`${file.name}-${file.size}`}>
                <span>{file.name}</span>
                <span>{formatBytes(file.size)}</span>
              </div>
            ))}
            <div className='photo-upload__total'>총 {formatBytes(totalSize)}</div>
          </div>
        )}

        <div className='photo-upload__notice'>한 번에 최대 5장, 장당 10MB 이하의 이미지만 업로드할 수 있습니다.</div>
        <button className='photo-upload__button' type='submit' disabled={uploading}>
          {uploading ? '업로드 중...' : '사진 업로드하기'}
        </button>
        {status && <div className='photo-upload__status'>{status}</div>}
      </form>
    </div>
  )
}

export default PhotoUpload
