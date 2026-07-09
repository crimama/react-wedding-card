import React from 'react'
import flower from '../images/flower.png'
import { useSiteSettings } from '../SiteSettingsContext'

function linesToHtml(lines) {
  return lines.map((line) => `<p>${line}</p>`).join('')
}

function sanitizeInvitationHtml(html) {
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

function Invitation() {
  const { settings } = useSiteSettings()
  const { invitation } = settings

  return (
    <div className='bc-pink container'>
      <img src={flower} className='flower' alt='flower'/>
      <div className='invitation__title'>{invitation.title}</div>
      <div
        className='invitation__content invitation__content--rich'
        dangerouslySetInnerHTML={{ __html: sanitizeInvitationHtml(invitation.bodyHtml || linesToHtml(invitation.lines)) }}
      />
      <div className='invitation__family'>
        <div>
          <span className='invitation__parents'>{invitation.groomParents}</span>
          <span>의 {invitation.groomRelation} </span>
          <span className='invitation__child'>{invitation.groomName}</span>
        </div>
        <div>
          <span className='invitation__parents'>{invitation.brideParents}</span>
          <span>의 {invitation.brideRelation} </span>
          <span className='invitation__child'>{invitation.brideName}</span>
        </div>
      </div>
    </div>
  )
}

export default Invitation
