import React, { useState, useEffect } from 'react'
import flower from '../images/flower.png'

function CalendarDay({ day, isWeddingDay, isHoliday }) {
  const dayOfWeekClass = day % 7 === 1 ? 'red' : day % 7 === 0 ? 'blue' : '';
  const holidayClass = isHoliday ? 'red' : '';
  const specialDayClass = isWeddingDay ? 'heart red' : '';

  return (
    <div className={`calendar__day ${dayOfWeekClass} ${specialDayClass} ${holidayClass}`}>
      {day}
    </div>
  );
}

function Calendar() {
  const daysInMonth = 30;
  const firstDayOfWeek = 0; // 2026년 11월 1일은 일요일
  const emptyDays = Array.from({ length: firstDayOfWeek }, () => null);
  const days = Array.from({ length: daysInMonth }, (_, index) => index + 1);

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const updateTimer = () => {
      const currentDate = new Date();
      const targetDate = new Date('2026-11-28T17:00:00+09:00');
      const timeDiff = targetDate - currentDate;

      if (timeDiff > 0) {
        const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    updateTimer();
    const timer = setInterval(updateTimer, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className='container calendar'>
      <img src={flower} className="flower" alt='flower'/>
      <h3>2026년 11월 28일 토요일 오후 5시</h3>
      <div className='calendar__line'></div>
      <div className="calendar__body">
        <div className="calendar__weekdays">
          {['일', '월', '화', '수', '목', '금', '토'].map((day) => (
            <span key={day}>{day}</span>
          ))}
        </div>
        <div className="calendar__days">
          {emptyDays.map((_, index) => (
            <div key={`empty-${index}`}></div>
          ))}
          {days.map((day) => (
            <CalendarDay key={day} day={day} isWeddingDay={day === 28} isHoliday={false}/>
          ))}
        </div>
      </div>
      <div className='calendar__remain'>
        <span>{timeLeft.days}일</span>
        <span>{timeLeft.hours}시간</span>
        <span>{timeLeft.minutes}분</span>
        <span>{timeLeft.seconds}초</span>
      </div>
      <div>임훈♥오윤경의 결혼식 <span className='calendar__remain-day'>{timeLeft.days}일</span> 전</div>
    </div>
  )
}

export default Calendar
