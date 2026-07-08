import React, { useEffect, useMemo, useState } from 'react'
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

function splitLines(value) {
  return value.split('\n').map((line) => line.trim()).filter(Boolean)
}

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
          <TextAreaField label='본문 문구, 줄바꿈 기준' rows={7} value={draft.invitation.lines.join('\n')} onChange={(value) => setValue('invitation.lines', splitLines(value))} />
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
          <TextField label='날짜 문구' value={draft.calendar.dateLine} onChange={(value) => setValue('calendar.dateLine', value)} />
          <TextField label='장소 문구' value={draft.calendar.placeLine} onChange={(value) => setValue('calendar.placeLine', value)} />
          <TextField label='버튼 문구' value={draft.calendar.googleButtonText} onChange={(value) => setValue('calendar.googleButtonText', value)} />
          <TextField label='장소명' value={draft.location.name} onChange={(value) => setValue('location.name', value)} />
          <TextField label='주소' value={draft.location.address} onChange={(value) => setValue('location.address', value)} />
          <TextAreaField label='대중교통 안내, HTML 허용' value={draft.location.transitHtml} onChange={(value) => setValue('location.transitHtml', value)} />
          <TextAreaField label='주차 안내, HTML 허용' value={draft.location.parkingHtml} onChange={(value) => setValue('location.parkingHtml', value)} />
          <TextAreaField label='주의 문구' rows={3} value={draft.location.notice} onChange={(value) => setValue('location.notice', value)} />
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
