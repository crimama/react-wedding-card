import React, { useMemo, useState } from 'react'
import { useSiteSettings } from '../SiteSettingsContext'

const PHOTO_UPLOAD_ENDPOINT = 'https://script.google.com/macros/s/AKfycbz0igMoMR-TwtcbYu-3ftZmZBTnBx8ka4qCUqmeD_OlbMv8JprTBZE_6je7ESueKfgz0w/exec'
const MAX_FILES = 30
const MAX_FILE_BYTES = 20 * 1024 * 1024
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif', 'image/gif']
const MAX_VIDEO_BYTES = 500 * 1024 * 1024
const VIDEO_CHUNK_BYTES = 8 * 1024 * 1024
const VIDEO_EXTENSIONS = { mp4: 'video/mp4', mov: 'video/quicktime', m4v: 'video/x-m4v', webm: 'video/webm', '3gp': 'video/3gpp' }

function getVideoType(file) {
  if (file.type && file.type.startsWith('video/')) return file.type
  const extension = String(file.name || '').split('.').pop().toLowerCase()
  return VIDEO_EXTENSIONS[extension] || ''
}

function isVideoFile(file) {
  return Boolean(getVideoType(file))
}

async function postJson(payload) {
  const response = await fetch(PHOTO_UPLOAD_ENDPOINT, {
    method: 'POST',
    body: new URLSearchParams({ payload: JSON.stringify(payload) }),
  })
  const result = await response.json()
  if (!result.ok) throw new Error(result.error || 'upload failed')
  return result
}

async function uploadVideo(file, uploaderName, memo, onProgress) {
  const mimeType = getVideoType(file)
  const { session } = await postJson({
    action: 'videoStart',
    name: uploaderName,
    memo,
    fileName: file.name,
    mimeType,
    size: file.size,
  })

  let start = 0
  while (start < file.size) {
    const end = Math.min(start + VIDEO_CHUNK_BYTES, file.size)
    const data = await readFileAsBase64(file.slice(start, end))
    let result = null
    for (let attempt = 0; attempt < 3 && !result; attempt += 1) {
      try {
        result = await postJson({ action: 'videoChunk', session, start, total: file.size, data })
      } catch (error) {
        if (attempt === 2) throw error
        await new Promise((resolve) => setTimeout(resolve, 1500))
      }
    }
    start = end
    onProgress(Math.round((start / file.size) * 100))
    if (result.done) break
  }
}

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

    const invalidFile = selectedFiles.find((file) => !ALLOWED_IMAGE_TYPES.includes(file.type) && !isVideoFile(file))
    if (invalidFile) {
      alert(photoUpload.invalidFileMessage)
      event.target.value = ''
      return
    }

    const oversizedFile = selectedFiles.find((file) => file.size > (isVideoFile(file) ? MAX_VIDEO_BYTES : MAX_FILE_BYTES))
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

        if (isVideoFile(file)) {
          await uploadVideo(file, trimmedName, trimmedMemo, (percent) => {
            setStatus(`동영상 업로드 중 (${index + 1}/${files.length}) ${percent}% · 화면을 닫지 말아 주세요`)
          })
          continue
        }

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
            accept='image/*,video/*'
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
