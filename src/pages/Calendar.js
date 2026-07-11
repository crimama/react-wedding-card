import React from 'react'
import flower from '../images/flower.png'
import { useSiteSettings } from '../SiteSettingsContext'

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

function Calendar() {
  const { settings } = useSiteSettings()
  const { calendar } = settings
  const googleCalendarUrl = `https://calendar.google.com/calendar/render?${new URLSearchParams({
    action: 'TEMPLATE',
    text: calendar.googleTitle,
    dates: calendar.googleDates,
    ctz: 'Asia/Seoul',
    details: calendar.googleDetails,
    location: calendar.googleLocation,
  }).toString()}`;

  return (
    <div className='container calendar save-date'>
      <img src={flower} className="flower" alt='flower'/>
      <div className='calendar__title'>{calendar.title}</div>
      <div className='calendar__details'>
        <div
          className='calendar__date-line calendar__date-line--rich'
          dangerouslySetInnerHTML={{ __html: sanitizeHtml(calendar.dateHtml || linesToHtml([calendar.dateLine])) }}
        />
        <div
          className='calendar__place-line calendar__place-line--rich'
          dangerouslySetInnerHTML={{ __html: sanitizeHtml(calendar.placeHtml || linesToHtml([calendar.placeLine])) }}
        />
      </div>
      <a
        className='calendar__google-btn'
        href={googleCalendarUrl}
        target='_blank'
        rel='noreferrer'
      >
        {calendar.googleButtonText}
      </a>
    </div>
  )
}

export default Calendar
