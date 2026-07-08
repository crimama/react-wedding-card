import React from 'react'
import mainPhoto from '../images/wedding-cover.jpg'
import { useSiteSettings } from '../SiteSettingsContext'

function Cover() {
  const { settings } = useSiteSettings()
  const { cover } = settings

  return (
    <div className="container cover">
      <div className="cover__frame">
        <div className="cover__image-wrap">
          <img className="cover__main-photo" src={mainPhoto} alt='임훈 오윤경 웨딩사진' />
        </div>
        <div className="cover__content">
          <div className="cover__date-mark">{cover.dateMark}</div>
          <div className="cover__time">{cover.time}</div>
          <div className='cover__place'>{cover.place}</div>
          <div className='cover__person'>
            <span>{cover.groomName}</span>
            <span>{cover.brideName}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cover
