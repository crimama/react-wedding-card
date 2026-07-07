import React from 'react'
import flower from '../images/flower.png'

function Calendar() {
  return (
    <div className='container calendar save-date'>
      <img src={flower} className="flower" alt='flower'/>
      <div className='calendar__title'>SAVE THE DATE</div>
      <div className='calendar__details'>
        <div className='calendar__date-line'>2026년 11월 28일 토요일 오후 5시 00분</div>
        <div>서울대학교 연구공원 웨딩홀, 연구공원 본관 1층</div>
      </div>
    </div>
  )
}

export default Calendar
