import React from 'react'
import mainPhoto from '../images/wedding-cover.jpg'
import { GoHeartFill } from "react-icons/go";

function Cover() {

  return (
    <div className="container">
      <div className='title'>&ldquo;우리 결혼합니다&rdquo;</div>
      <img className="cover__main-photo" src={mainPhoto} alt='임훈 오윤경 웨딩사진' />
      <div className='cover__person'>
        <div>임훈</div>
        <GoHeartFill className='cover__icon-heart' size="0.8em"/>
        <div>오윤경</div>
      </div>
      <div className='cover__date'>2026년 11월 28일 토요일 오후 5시</div>
      <div className='cover__place'>서울대학교 연구공원 웨딩홀</div>
      <div className='cover__line'></div>
    </div>
  )
}

export default Cover
