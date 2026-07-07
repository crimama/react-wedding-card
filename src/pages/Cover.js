import React from 'react'
import mainPhoto from '../images/wedding-cover.jpg'

function Cover() {

  return (
    <div className="container cover">
      <div className="cover__frame">
        <div className="cover__image-wrap">
          <img className="cover__main-photo" src={mainPhoto} alt='임훈 오윤경 웨딩사진' />
        </div>
        <div className="cover__top-copy">
          <div className="cover__tagline">서로에게<br />가장 완벽한<br />러닝메이트</div>
          <div className="cover__headline">우리<br />결혼합니다</div>
          <div className="cover__hero-date">2026.11.28 pm5:00</div>
        </div>
        <div className="cover__content">
          <div className='cover__person'>
            <span>임훈</span>
            <span>오윤경</span>
          </div>
          <div className='cover__place'>서울대학교 연구공원 웨딩홀</div>
        </div>
      </div>
    </div>
  )
}

export default Cover
