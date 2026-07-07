import React from 'react'
import mainPhoto from '../images/wedding-cover.jpg'

function Cover() {

  return (
    <div className="container cover">
      <div className="cover__frame">
        <div className="cover__image-wrap">
          <img className="cover__main-photo" src={mainPhoto} alt='임훈 오윤경 웨딩사진' />
        </div>
        <div className="cover__content">
          <div className="cover__date-mark">11.28</div>
          <div className="cover__time">SAT PM 5:00</div>
          <div className='cover__place'>서울대학교 연구공원 웨딩홀</div>
          <div className='cover__person'>
            <span>임훈</span>
            <span>오윤경</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cover
