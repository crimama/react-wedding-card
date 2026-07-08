import React from 'react'
import flower from '../images/flower.png'
import { useSiteSettings } from '../SiteSettingsContext'

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
        <div className='calendar__date-line'>{calendar.dateLine}</div>
        <div>{calendar.placeLine}</div>
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
