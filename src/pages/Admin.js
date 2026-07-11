import React, { useEffect, useMemo, useRef, useState } from 'react'
import { setDoc, serverTimestamp } from 'firebase/firestore'
import { defaultSiteConfig, getSettingsDocRef, mergeSettings, useSiteSettings } from '../SiteSettingsContext'

function updateNestedValue(source, path, value) {
  const keys = path.split('.')
  const clone = JSON.parse(JSON.stringify(source))
  let cursor = clone
  keys.slice(0, -1).forEach((key) => {
    cursor[key] = cursor[key] || {}
    cursor = cursor[key]
  })
  cursor[keys[keys.length - 1]] = value
  return clone
}

function escapeHtml(value) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

function linesToHtml(lines) {
  return lines.map((line) => `<p>${escapeHtml(line)}</p>`).join('')
}

function htmlToLines(html) {
  const element = document.createElement('div')
  element.innerHTML = html
  return element.innerText.split('\n').map((line) => line.trim()).filter(Boolean)
}

const EDITOR_FONT_OPTIONS = [
  { value: 'GmarketSansLight', label: 'Gmarket Light' },
  { value: 'GmarketSansMedium', label: 'Gmarket Medium' },
  { value: 'GmarketSansBold', label: 'Gmarket Bold' },
  { value: 'Gowun Dodum', label: 'Gowun Dodum' },
  { value: 'Gowun Batang', label: 'Gowun Batang' },
  { value: 'Noto Sans KR', label: 'Noto Sans KR' },
  { value: 'Noto Serif KR', label: 'Noto Serif KR' },
  { value: 'Nanum Gothic', label: 'Nanum Gothic' },
  { value: 'Nanum Myeongjo', label: 'Nanum Myeongjo' },
  { value: 'Hahmlet', label: 'Hahmlet' },
  { value: 'Song Myung', label: 'Song Myung' },
  { value: 'Black Han Sans', label: 'Black Han Sans' },
  { value: 'serif', label: 'Serif' },
  { value: 'sans-serif', label: 'Sans Serif' },
]

function TextField({ label, value, onChange, placeholder }) {
  return (
    <label className='admin__field'>
      <span>{label}</span>
      <input value={value || ''} placeholder={placeholder} onChange={(event) => onChange(event.target.value)} />
    </label>
  )
}

function TextAreaField({ label, value, onChange, rows = 5, placeholder }) {
  return (
    <label className='admin__field admin__field--full'>
      <span>{label}</span>
      <textarea rows={rows} value={value || ''} placeholder={placeholder} onChange={(event) => onChange(event.target.value)} />
    </label>
  )
}

function ColorField({ label, value, onChange }) {
  return (
    <label className='admin__field admin__color-field'>
      <span>{label}</span>
      <input type='color' value={value || '#ffffff'} onChange={(event) => onChange(event.target.value)} />
      <input value={value || ''} onChange={(event) => onChange(event.target.value)} />
    </label>
  )
}

function SelectField({ label, value, onChange, options }) {
  return (
    <label className='admin__field'>
      <span>{label}</span>
      <select value={value || ''} onChange={(event) => onChange(event.target.value)}>
        {options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
      </select>
    </label>
  )
}

function RichTextEditor({
  html,
  onChange,
  defaultHtml,
  label = '본문 에디터',
  description = '본문 안에서 자유롭게 쓰고 지우고, 선택한 문장에 굵게·밑줄·색상·정렬을 적용할 수 있습니다.',
  placeholder = '여기에 문구를 자유롭게 작성해주세요.',
  previewTitle = '청첩장 반영 미리보기',
}) {
  const editorRef = useRef(null)
  const selectionRef = useRef(null)
  const [isEditing, setIsEditing] = useState(false)
  const plainText = htmlToLines(html).join('\n')
  const charCount = plainText.replace(/\s/g, '').length
  const lineCount = htmlToLines(html).length

  useEffect(() => {
    if (!isEditing && editorRef.current && editorRef.current.innerHTML !== html) {
      editorRef.current.innerHTML = html || ''
    }
  }, [html, isEditing])

  const emitChange = () => {
    const nextHtml = editorRef.current?.innerHTML || ''
    onChange(nextHtml, htmlToLines(nextHtml))
  }

  const saveSelection = () => {
    const selection = window.getSelection()
    if (!selection || selection.rangeCount === 0 || !editorRef.current) return
    const range = selection.getRangeAt(0)
    if (editorRef.current.contains(range.commonAncestorContainer)) {
      selectionRef.current = range.cloneRange()
    }
  }

  const restoreSelection = () => {
    const selection = window.getSelection()
    if (!selection || !selectionRef.current) return
    selection.removeAllRanges()
    selection.addRange(selectionRef.current)
  }

  const runCommand = (command, value = null) => {
    editorRef.current?.focus()
    restoreSelection()
    document.execCommand(command, false, value)
    saveSelection()
    emitChange()
  }

  const toolbarMouseDown = (event) => {
    event.preventDefault()
  }

  const resetToDefault = () => {
    if (editorRef.current) editorRef.current.innerHTML = defaultHtml
    onChange(defaultHtml, htmlToLines(defaultHtml))
  }

  const clearAll = () => {
    if (editorRef.current) editorRef.current.innerHTML = ''
    onChange('', [])
  }

  return (
    <div className='admin__body-editor admin__field--full'>
      <div className='admin__body-editor-head'>
        <div>
          <span className='admin__field-label'>{label}</span>
          <p>{description}</p>
        </div>
        <div className='admin__body-editor-count'>
          <strong>{lineCount}</strong>줄 · <strong>{charCount}</strong>자
        </div>
      </div>

      <div className='admin__editor-toolbar' aria-label='초대글 본문 스타일 도구'>
        <button type='button' onMouseDown={toolbarMouseDown} onClick={() => runCommand('bold')}>굵게</button>
        <button type='button' onMouseDown={toolbarMouseDown} onClick={() => runCommand('italic')}>기울임</button>
        <button type='button' onMouseDown={toolbarMouseDown} onClick={() => runCommand('underline')}>밑줄</button>
        <span className='admin__toolbar-divider' />
        <button type='button' onMouseDown={toolbarMouseDown} onClick={() => runCommand('justifyLeft')}>왼쪽</button>
        <button type='button' onMouseDown={toolbarMouseDown} onClick={() => runCommand('justifyCenter')}>가운데</button>
        <button type='button' onMouseDown={toolbarMouseDown} onClick={() => runCommand('justifyRight')}>오른쪽</button>
        <span className='admin__toolbar-divider' />
        <button type='button' onMouseDown={toolbarMouseDown} onClick={() => runCommand('fontSize', '2')}>작게</button>
        <button type='button' onMouseDown={toolbarMouseDown} onClick={() => runCommand('fontSize', '3')}>보통</button>
        <button type='button' onMouseDown={toolbarMouseDown} onClick={() => runCommand('fontSize', '4')}>크게</button>
        <label className='admin__toolbar-select'>
          폰트
          <select
            defaultValue=''
            onMouseDown={saveSelection}
            onFocus={saveSelection}
            onChange={(event) => {
              if (!event.target.value) return
              runCommand('fontName', event.target.value)
              event.target.value = ''
            }}
          >
            <option value='' disabled>선택</option>
            {EDITOR_FONT_OPTIONS.map((option) => (
              <option value={option.value} key={option.value}>{option.label}</option>
            ))}
          </select>
        </label>
        <label className='admin__toolbar-color' onMouseDown={toolbarMouseDown}>
          글자색
          <input type='color' defaultValue='#5f4a3d' onChange={(event) => runCommand('foreColor', event.target.value)} />
        </label>
        <label className='admin__toolbar-color' onMouseDown={toolbarMouseDown}>
          형광펜
          <input type='color' defaultValue='#fff1c8' onChange={(event) => runCommand('hiliteColor', event.target.value)} />
        </label>
        <span className='admin__toolbar-divider' />
        <button type='button' onMouseDown={toolbarMouseDown} onClick={() => runCommand('removeFormat')}>서식 지우기</button>
        <button type='button' onMouseDown={toolbarMouseDown} onClick={resetToDefault}>기본 문구</button>
        <button type='button' onMouseDown={toolbarMouseDown} onClick={clearAll}>전체 지우기</button>
      </div>

      <div
        ref={editorRef}
        className='admin__rich-editor'
        contentEditable
        suppressContentEditableWarning
        role='textbox'
        aria-label='초대글 본문 자유 편집기'
        data-placeholder={placeholder}
        onFocus={() => setIsEditing(true)}
        onBlur={() => {
          setIsEditing(false)
          saveSelection()
          emitChange()
        }}
        onMouseUp={saveSelection}
        onKeyUp={saveSelection}
        onInput={() => {
          saveSelection()
          emitChange()
        }}
      />

      <div className='admin__editor-preview' aria-label='초대글 미리보기'>
        <div className='admin__editor-preview-title'>{previewTitle}</div>
        <div
          className='admin__editor-preview-paper admin__editor-preview-paper--rich'
          dangerouslySetInnerHTML={{ __html: html || '<p class="admin__editor-preview-empty">아직 입력된 본문이 없습니다.</p>' }}
        />
      </div>
    </div>
  )
}

function Admin() {
  const { settings, isLoadingSettings } = useSiteSettings()
  const [draft, setDraft] = useState(defaultSiteConfig)
  const [accountGroupsText, setAccountGroupsText] = useState(JSON.stringify(defaultSiteConfig.account.groups, null, 2))
  const [status, setStatus] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    setDraft(settings)
    setAccountGroupsText(JSON.stringify(settings.account.groups, null, 2))
  }, [settings])

  const previewStyle = useMemo(() => ({
    background: draft.style.backgroundColor,
    color: draft.style.textColor,
    borderColor: draft.style.accentColor,
    fontFamily: `${draft.style.bodyFont}, sans-serif`,
  }), [draft.style])

  const setValue = (path, value) => {
    setDraft((current) => updateNestedValue(current, path, value))
  }

  const saveSettings = async () => {
    setIsSaving(true)
    setStatus('저장 중입니다...')
    try {
      await setDoc(getSettingsDocRef(), {
        ...draft,
        updatedAt: serverTimestamp(),
      }, { merge: true })
      setStatus('저장 완료. 청첩장 페이지에 곧 반영됩니다.')
    } catch (error) {
      console.error(error)
      setStatus(`저장 실패: ${error.message}`)
    } finally {
      setIsSaving(false)
    }
  }

  const resetDraft = () => {
    const resetSettings = mergeSettings(defaultSiteConfig, settings)
    setDraft(resetSettings)
    setAccountGroupsText(JSON.stringify(resetSettings.account.groups, null, 2))
    setStatus('현재 저장된 값으로 되돌렸습니다.')
  }

  return (
    <div className='admin'>
      <div className='admin__header'>
        <div>
          <div className='admin__eyebrow'>Wedding Invitation Admin</div>
          <h1>청첩장 내용·스타일 관리</h1>
          <p>기존 페이지 구조는 유지하고, 문구와 색상·폰트만 Firebase 설정으로 바꿉니다.</p>
        </div>
        <a className='admin__view-link' href='/react-wedding-card/'>청첩장 보기</a>
      </div>

      {isLoadingSettings && <div className='admin__notice'>저장된 설정을 불러오는 중입니다.</div>}

      <section className='admin__section'>
        <h2>대문</h2>
        <div className='admin__grid'>
          <TextField label='날짜 표기' value={draft.cover.dateMark} onChange={(value) => setValue('cover.dateMark', value)} />
          <TextField label='시간 표기' value={draft.cover.time} onChange={(value) => setValue('cover.time', value)} />
          <TextField label='장소' value={draft.cover.place} onChange={(value) => setValue('cover.place', value)} />
          <TextField label='신랑 이름' value={draft.cover.groomName} onChange={(value) => setValue('cover.groomName', value)} />
          <TextField label='신부 이름' value={draft.cover.brideName} onChange={(value) => setValue('cover.brideName', value)} />
        </div>
      </section>

      <section className='admin__section'>
        <h2>초대글</h2>
        <div className='admin__grid'>
          <TextField label='제목' value={draft.invitation.title} onChange={(value) => setValue('invitation.title', value)} />
          <RichTextEditor
            label='초대글 본문'
            html={draft.invitation.bodyHtml || linesToHtml(draft.invitation.lines)}
            defaultHtml={defaultSiteConfig.invitation.bodyHtml}
            placeholder='초대글 본문을 자유롭게 작성해주세요.'
            onChange={(bodyHtml, lines) => {
              setDraft((current) => ({
                ...current,
                invitation: {
                  ...current.invitation,
                  bodyHtml,
                  lines,
                },
              }))
            }}
          />
          <TextField label='신랑 부모님' value={draft.invitation.groomParents} onChange={(value) => setValue('invitation.groomParents', value)} />
          <TextField label='신랑 관계' value={draft.invitation.groomRelation} onChange={(value) => setValue('invitation.groomRelation', value)} />
          <TextField label='신랑 표기' value={draft.invitation.groomName} onChange={(value) => setValue('invitation.groomName', value)} />
          <TextField label='신부 부모님' value={draft.invitation.brideParents} onChange={(value) => setValue('invitation.brideParents', value)} />
          <TextField label='신부 관계' value={draft.invitation.brideRelation} onChange={(value) => setValue('invitation.brideRelation', value)} />
          <TextField label='신부 표기' value={draft.invitation.brideName} onChange={(value) => setValue('invitation.brideName', value)} />
        </div>
      </section>

      <section className='admin__section'>
        <h2>일정·장소</h2>
        <div className='admin__grid'>
          <TextField label='캘린더 제목' value={draft.calendar.title} onChange={(value) => setValue('calendar.title', value)} />
          <RichTextEditor
            label='일정 문구'
            description='SAVE THE DATE 아래 날짜·시간 문구를 자유롭게 편집합니다.'
            html={draft.calendar.dateHtml || linesToHtml([draft.calendar.dateLine])}
            defaultHtml={defaultSiteConfig.calendar.dateHtml}
            placeholder='일정 문구를 입력해주세요.'
            previewTitle='일정 문구 미리보기'
            onChange={(dateHtml, lines) => {
              setDraft((current) => ({
                ...current,
                calendar: {
                  ...current.calendar,
                  dateHtml,
                  dateLine: lines.join('\n'),
                },
              }))
            }}
          />
          <RichTextEditor
            label='장소 문구'
            description='SAVE THE DATE 아래 장소 문구를 자유롭게 편집합니다.'
            html={draft.calendar.placeHtml || linesToHtml([draft.calendar.placeLine])}
            defaultHtml={defaultSiteConfig.calendar.placeHtml}
            placeholder='장소 문구를 입력해주세요.'
            previewTitle='장소 문구 미리보기'
            onChange={(placeHtml, lines) => {
              setDraft((current) => ({
                ...current,
                calendar: {
                  ...current.calendar,
                  placeHtml,
                  placeLine: lines.join('\n'),
                },
              }))
            }}
          />
          <TextField label='캘린더 버튼 문구' value={draft.calendar.googleButtonText} onChange={(value) => setValue('calendar.googleButtonText', value)} />
          <TextField label='Google 일정 제목' value={draft.calendar.googleTitle} onChange={(value) => setValue('calendar.googleTitle', value)} />
          <TextField label='Google 일정 시간' value={draft.calendar.googleDates} onChange={(value) => setValue('calendar.googleDates', value)} />
          <TextField label='Google 일정 설명' value={draft.calendar.googleDetails} onChange={(value) => setValue('calendar.googleDetails', value)} />
          <TextField label='Google 일정 장소' value={draft.calendar.googleLocation} onChange={(value) => setValue('calendar.googleLocation', value)} />
          <TextField label='오시는 길 장소명' value={draft.location.name} onChange={(value) => setValue('location.name', value)} />
          <TextField label='오시는 길 주소' value={draft.location.address} onChange={(value) => setValue('location.address', value)} />
          <RichTextEditor
            label='대중교통 안내'
            description='오시는 길 대중교통 문구를 자유롭게 편집합니다. 선택한 텍스트의 폰트·색상·정렬을 바꿀 수 있습니다.'
            html={draft.location.transitHtml}
            defaultHtml={defaultSiteConfig.location.transitHtml}
            placeholder='대중교통 안내를 입력해주세요.'
            previewTitle='대중교통 미리보기'
            onChange={(value) => setValue('location.transitHtml', value)}
          />
          <RichTextEditor
            label='주차 안내'
            description='주차 안내 문구를 자유롭게 편집합니다.'
            html={draft.location.parkingHtml}
            defaultHtml={defaultSiteConfig.location.parkingHtml}
            placeholder='주차 안내를 입력해주세요.'
            previewTitle='주차 안내 미리보기'
            onChange={(value) => setValue('location.parkingHtml', value)}
          />
          <RichTextEditor
            label='주의 문구'
            description='오시는 길 하단 주의 문구를 자유롭게 편집합니다.'
            html={draft.location.noticeHtml || linesToHtml([draft.location.notice])}
            defaultHtml={defaultSiteConfig.location.noticeHtml}
            placeholder='주의 문구를 입력해주세요.'
            previewTitle='주의 문구 미리보기'
            onChange={(noticeHtml, lines) => {
              setDraft((current) => ({
                ...current,
                location: {
                  ...current.location,
                  noticeHtml,
                  notice: lines.join('\n'),
                },
              }))
            }}
          />
        </div>
      </section>

      <section className='admin__section'>
        <h2>하객 사진 업로드</h2>
        <div className='admin__grid'>
          <TextField label='상단 영문 표기' value={draft.photoUpload.eyebrow} onChange={(value) => setValue('photoUpload.eyebrow', value)} />
          <TextField label='제목' value={draft.photoUpload.title} onChange={(value) => setValue('photoUpload.title', value)} />
          <RichTextEditor
            label='사진 업로드 안내문'
            description='하객 사진 업로드 제목 아래 안내 문구를 자유롭게 편집합니다.'
            html={draft.photoUpload.guideHtml || linesToHtml([draft.photoUpload.guide])}
            defaultHtml={defaultSiteConfig.photoUpload.guideHtml}
            placeholder='사진 업로드 안내문을 입력해주세요.'
            previewTitle='사진 업로드 안내문 미리보기'
            onChange={(guideHtml, lines) => {
              setDraft((current) => ({
                ...current,
                photoUpload: {
                  ...current.photoUpload,
                  guideHtml,
                  guide: lines.join('\n'),
                },
              }))
            }}
          />
          <TextField label='이름 입력 placeholder' value={draft.photoUpload.namePlaceholder} onChange={(value) => setValue('photoUpload.namePlaceholder', value)} />
          <TextField label='메모 입력 placeholder' value={draft.photoUpload.memoPlaceholder} onChange={(value) => setValue('photoUpload.memoPlaceholder', value)} />
          <TextField label='사진 선택 버튼' value={draft.photoUpload.selectButtonText} onChange={(value) => setValue('photoUpload.selectButtonText', value)} />
          <TextField label='선택 완료 접미사' value={draft.photoUpload.selectedTextSuffix} onChange={(value) => setValue('photoUpload.selectedTextSuffix', value)} />
          <RichTextEditor
            label='업로드 제한 안내문'
            description='사진 선택 버튼 아래 제한 안내 문구를 자유롭게 편집합니다.'
            html={draft.photoUpload.noticeHtml || linesToHtml([draft.photoUpload.notice])}
            defaultHtml={defaultSiteConfig.photoUpload.noticeHtml}
            placeholder='업로드 제한 안내문을 입력해주세요.'
            previewTitle='업로드 제한 안내문 미리보기'
            onChange={(noticeHtml, lines) => {
              setDraft((current) => ({
                ...current,
                photoUpload: {
                  ...current.photoUpload,
                  noticeHtml,
                  notice: lines.join('\n'),
                },
              }))
            }}
          />
          <TextField label='업로드 버튼' value={draft.photoUpload.submitButtonText} onChange={(value) => setValue('photoUpload.submitButtonText', value)} />
          <TextField label='업로드 중 버튼' value={draft.photoUpload.uploadingButtonText} onChange={(value) => setValue('photoUpload.uploadingButtonText', value)} />
          <TextField label='기본 업로더 이름' value={draft.photoUpload.defaultUploaderName} onChange={(value) => setValue('photoUpload.defaultUploaderName', value)} />
          <TextField label='성공 메시지' value={draft.photoUpload.successMessage} onChange={(value) => setValue('photoUpload.successMessage', value)} />
          <TextField label='업로드 시작 메시지' value={draft.photoUpload.uploadingMessage} onChange={(value) => setValue('photoUpload.uploadingMessage', value)} />
          <TextField label='업로드 진행 메시지' value={draft.photoUpload.uploadingProgressTemplate} onChange={(value) => setValue('photoUpload.uploadingProgressTemplate', value)} />
          <TextField label='실패 메시지' value={draft.photoUpload.failureMessage} onChange={(value) => setValue('photoUpload.failureMessage', value)} />
          <TextField label='미연결 메시지' value={draft.photoUpload.notConfiguredMessage} onChange={(value) => setValue('photoUpload.notConfiguredMessage', value)} />
          <TextField label='파일 없음 메시지' value={draft.photoUpload.noFileMessage} onChange={(value) => setValue('photoUpload.noFileMessage', value)} />
          <TextField label='파일 개수 초과 메시지' value={draft.photoUpload.tooManyFilesMessage} onChange={(value) => setValue('photoUpload.tooManyFilesMessage', value)} />
          <TextField label='잘못된 파일 메시지' value={draft.photoUpload.invalidFileMessage} onChange={(value) => setValue('photoUpload.invalidFileMessage', value)} />
          <TextField label='용량 초과 메시지' value={draft.photoUpload.oversizedFileMessage} onChange={(value) => setValue('photoUpload.oversizedFileMessage', value)} />
        </div>
      </section>

      <section className='admin__section'>
        <h2>마음 전하실 곳</h2>
        <p className='admin__hint'>계좌번호는 한 줄 JSON으로 관리합니다. 지금은 추후 안내 상태를 유지합니다.</p>
        <TextAreaField rows={12} label='계좌 그룹 JSON' value={accountGroupsText} onChange={(value) => {
          setAccountGroupsText(value)
          try {
            const parsed = JSON.parse(value)
            setValue('account.groups', parsed)
            setStatus('계좌 JSON 반영 완료')
          } catch {
            setStatus('계좌 JSON 형식이 아직 올바르지 않습니다.')
          }
        }} />
      </section>

      <section className='admin__section'>
        <h2>공유·하단</h2>
        <div className='admin__grid'>
          <TextField label='공유 URL' value={draft.footer.shareUrl} onChange={(value) => setValue('footer.shareUrl', value)} />
          <TextField label='공유 제목' value={draft.footer.shareTitle} onChange={(value) => setValue('footer.shareTitle', value)} />
          <TextField label='공유 문구' value={draft.footer.shareText} onChange={(value) => setValue('footer.shareText', value)} />
          <TextField label='공유 버튼' value={draft.footer.shareButtonText} onChange={(value) => setValue('footer.shareButtonText', value)} />
          <TextField label='하단 이름' value={draft.footer.names} onChange={(value) => setValue('footer.names', value)} />
          <TextField label='하단 날짜·장소' value={draft.footer.datePlace} onChange={(value) => setValue('footer.datePlace', value)} />
        </div>
      </section>

      <section className='admin__section'>
        <h2>스타일</h2>
        <div className='admin__grid'>
          <SelectField label='본문 폰트' value={draft.style.bodyFont} onChange={(value) => setValue('style.bodyFont', value)} options={[
            { value: 'GmarketSansLight', label: 'Gmarket Sans Light' },
            { value: 'GmarketSansMedium', label: 'Gmarket Sans Medium' },
            { value: 'Gowun Dodum', label: 'Gowun Dodum' },
            { value: 'serif', label: 'Serif' },
            { value: 'sans-serif', label: 'Sans Serif' },
          ]} />
          <SelectField label='제목·버튼 폰트' value={draft.style.titleFont} onChange={(value) => setValue('style.titleFont', value)} options={[
            { value: 'GmarketSansMedium', label: 'Gmarket Sans Medium' },
            { value: 'GmarketSansLight', label: 'Gmarket Sans Light' },
            { value: 'Gowun Dodum', label: 'Gowun Dodum' },
            { value: 'serif', label: 'Serif' },
            { value: 'sans-serif', label: 'Sans Serif' },
          ]} />
          <SelectField label='대문 폰트' value={draft.style.coverFont} onChange={(value) => setValue('style.coverFont', value)} options={[
            { value: 'Gowun Dodum', label: 'Gowun Dodum' },
            { value: 'GmarketSansLight', label: 'Gmarket Sans Light' },
            { value: 'GmarketSansMedium', label: 'Gmarket Sans Medium' },
          ]} />
          <ColorField label='배경색' value={draft.style.backgroundColor} onChange={(value) => setValue('style.backgroundColor', value)} />
          <ColorField label='종이색' value={draft.style.paperColor} onChange={(value) => setValue('style.paperColor', value)} />
          <ColorField label='본문색' value={draft.style.textColor} onChange={(value) => setValue('style.textColor', value)} />
          <ColorField label='보조색' value={draft.style.mutedTextColor} onChange={(value) => setValue('style.mutedTextColor', value)} />
          <ColorField label='강조색' value={draft.style.accentColor} onChange={(value) => setValue('style.accentColor', value)} />
          <ColorField label='하이라이트색' value={draft.style.highlightColor} onChange={(value) => setValue('style.highlightColor', value)} />
        </div>
        <div className='admin__preview' style={previewStyle}>
          <strong style={{ color: draft.style.accentColor, fontFamily: `${draft.style.titleFont}, sans-serif` }}>미리보기</strong>
          <span>배경과 글자색, 폰트가 이런 느낌으로 적용됩니다.</span>
        </div>
      </section>

      <div className='admin__actions'>
        <button type='button' className='admin__secondary-btn' onClick={resetDraft} disabled={isSaving}>되돌리기</button>
        <button type='button' className='admin__primary-btn' onClick={saveSettings} disabled={isSaving}>{isSaving ? '저장 중...' : 'Firebase에 저장'}</button>
      </div>
      {status && <div className='admin__status'>{status}</div>}
    </div>
  )
}

export default Admin
