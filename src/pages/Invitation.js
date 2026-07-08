import React from 'react'
import flower from '../images/flower.png'
import { useSiteSettings } from '../SiteSettingsContext'

function Invitation() {
  const { settings } = useSiteSettings()
  const { invitation } = settings

  return (
    <div className='bc-pink container'>
      <img src={flower} className='flower' alt='flower'/>
      <div className='invitation__title'>{invitation.title}</div>
      <div className='invitation__content'>
        {invitation.lines.map((line, index) => (
          <div key={`${line}-${index}`}>{line}</div>
        ))}
      </div>
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
