import React from 'react'
import flower from '../images/flower.png'

const GOOGLE_CALENDAR_URL = `https://calendar.google.com/calendar/render?${new URLSearchParams({
  action: 'TEMPLATE',
  text: '임훈 ♥ 오윤경 결혼식',
  dates: '20261128T170000/20261128T190000',
  ctz: 'Asia/Seoul',
  details: '임훈과 오윤경의 결혼식에 초대합니다.',
  location: '서울대학교 연구공원 웨딩홀, 서울시 관악구 관악로 1 연구공원 본관 1층',
}).toString()}`;

function Calendar() {
  return (
    <div className='container calendar save-date'>
      <img src={flower} className="flower" alt='flower'/>
      <div className='calendar__title'>SAVE THE DATE</div>
      <div className='calendar__details'>
        <div className='calendar__date-line'>2026년 11월 28일 토요일 오후 5시 00분</div>
        <div>서울대학교 연구공원 웨딩홀, 연구공원 본관 1층</div>
      </div>
      <a
        className='calendar__google-btn'
        href={GOOGLE_CALENDAR_URL}
        target='_blank'
        rel='noreferrer'
      >
        구글 캘린더에 추가
      </a>
    </div>
  )
}

export default Calendar
