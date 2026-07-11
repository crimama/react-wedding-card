import React, { useMemo, useState } from 'react'
import { useSiteSettings } from '../SiteSettingsContext'

const PHOTO_UPLOAD_ENDPOINT = 'https://script.google.com/macros/s/AKfycbwXjruiVY1yfJkvXMAkwtrytSw2_nk8EGTUufAC5lGkLrXpxxTW8GJ9xCIHzLyVPS4jtA/exec'
const MAX_FILES = 10
const MAX_FILE_BYTES = 20 * 1024 * 1024
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

function escapeHtml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

function linesToHtml(lines) {
  return lines.map((line) => `<p>${escapeHtml(line)}</p>`).join('')
}

function sanitizeHtml(html) {
  const template = document.createElement('template')
  template.innerHTML = html
  template.content.querySelectorAll('script, style, iframe, object, embed, link, meta').forEach((node) => node.remove())
  template.content.querySelectorAll('*').forEach((node) => {
    Array.from(node.attributes).forEach((attribute) => {
      const name = attribute.name.toLowerCase()
      const value = attribute.value.toLowerCase()
      const unsafeProtocol = ['java', 'script:'].join('')
      if (name.startsWith('on') || value.includes(unsafeProtocol)) {
        node.removeAttribute(attribute.name)
      }
    })
  })
  return template.innerHTML
}

function formatMessage(template, values) {
  return Object.entries(values).reduce(
    (message, [key, value]) => message.replace(`{${key}}`, value),
    template,
  )
}

function PhotoUpload() {
  const { settings } = useSiteSettings()
  const { photoUpload } = settings
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
      alert(formatMessage(photoUpload.tooManyFilesMessage, { max: MAX_FILES }))
      event.target.value = ''
      return
    }

    const invalidFile = selectedFiles.find((file) => !ALLOWED_IMAGE_TYPES.includes(file.type))
    if (invalidFile) {
      alert(photoUpload.invalidFileMessage)
      event.target.value = ''
      return
    }

    const oversizedFile = selectedFiles.find((file) => file.size > MAX_FILE_BYTES)
    if (oversizedFile) {
      alert(photoUpload.oversizedFileMessage)
      event.target.value = ''
      return
    }

    setFiles(selectedFiles)
    setStatus('')
  }

  const onPhotoSubmit = async (event) => {
    event.preventDefault()

    if (!isConfigured) {
      alert(photoUpload.notConfiguredMessage)
      return
    }

    if (files.length === 0) {
      alert(photoUpload.noFileMessage)
      return
    }

    setUploading(true)
    setStatus(photoUpload.uploadingMessage)

    const uploadForm = event.currentTarget
    const trimmedName = uploaderName.trim() || photoUpload.defaultUploaderName
    const trimmedMemo = memo.trim()

    try {
      for (let index = 0; index < files.length; index += 1) {
        const file = files[index]
        setStatus(formatMessage(photoUpload.uploadingProgressTemplate, { current: index + 1, total: files.length }))

        const encodedFile = {
          name: file.name,
          mimeType: file.type,
          data: await readFileAsBase64(file),
        }

        const payload = {
          name: trimmedName,
          memo: trimmedMemo,
          files: [encodedFile],
        }

        const body = new URLSearchParams({ payload: JSON.stringify(payload) })

        await fetch(PHOTO_UPLOAD_ENDPOINT, {
          method: 'POST',
          mode: 'no-cors',
          body,
        })
      }

      setUploaderName('')
      setMemo('')
      setFiles([])
      uploadForm.reset()
      setStatus(photoUpload.successMessage)
    } catch (error) {
      console.error('Error uploading guest photos:', error)
      setStatus(photoUpload.failureMessage)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className='container photo-upload'>
      <div className='photo-upload__eyebrow'>{photoUpload.eyebrow}</div>
      <div className='photo-upload__title'>{photoUpload.title}</div>
      <div
        className='photo-upload__guide photo-upload__guide--rich'
        dangerouslySetInnerHTML={{ __html: sanitizeHtml(photoUpload.guideHtml || linesToHtml([photoUpload.guide])) }}
      />

      <form className='photo-upload__form' onSubmit={onPhotoSubmit}>
        <input
          className='photo-upload__input'
          type='text'
          placeholder={photoUpload.namePlaceholder}
          value={uploaderName}
          maxLength={40}
          onChange={(event) => setUploaderName(event.target.value)}
        />
        <textarea
          className='photo-upload__memo'
          placeholder={photoUpload.memoPlaceholder}
          value={memo}
          maxLength={120}
          onChange={(event) => setMemo(event.target.value)}
        />
        <label className='photo-upload__file-label'>
          <span>{files.length > 0 ? `${files.length}${photoUpload.selectedTextSuffix}` : photoUpload.selectButtonText}</span>
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

        <div
          className='photo-upload__notice photo-upload__notice--rich'
          dangerouslySetInnerHTML={{ __html: sanitizeHtml(photoUpload.noticeHtml || linesToHtml([photoUpload.notice])) }}
        />
        <button className='photo-upload__button' type='submit' disabled={uploading}>
          {uploading ? photoUpload.uploadingButtonText : photoUpload.submitButtonText}
        </button>
        {status && <div className='photo-upload__status'>{status}</div>}
      </form>
    </div>
  )
}

export default PhotoUpload
