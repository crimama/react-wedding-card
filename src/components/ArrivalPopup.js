import React, { useEffect, useState } from 'react'
import locationMap from '../images/location-map.png'
import { useSiteSettings } from '../SiteSettingsContext'

function ArrivalPopup() {
  const { settings } = useSiteSettings()
  const { location } = settings
  const [open, setOpen] = useState(true)

  useEffect(() => {
    if (!open) return undefined
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (event) => { if (event.key === 'Escape') setOpen(false) }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = previous
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  if (!open) return null

  const goToLocation = () => {
    setOpen(false)
    setTimeout(() => {
      const target = document.querySelector('.location__map')
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }, 50)
  }

  return (
    <div className='arrival-popup__backdrop' onClick={() => setOpen(false)}>
      <div className='arrival-popup' role='dialog' aria-modal='true' aria-labelledby='arrival-popup-title' onClick={(event) => event.stopPropagation()}>
        <button type='button' className='arrival-popup__close' aria-label='닫기' onClick={() => setOpen(false)}>×</button>
        <div className='arrival-popup__eyebrow'>오시는 길 안내</div>
        <h2 id='arrival-popup-title' className='arrival-popup__title'>{location.name}</h2>

        <div className='arrival-popup__when'>
          <div><span className='arrival-popup__label'>일시</span>2026년 11월 28일 (토) 오후 5시</div>
          <div><span className='arrival-popup__label'>장소</span>{location.address}</div>
        </div>

        <img className='arrival-popup__map' src={locationMap} alt='서울대학교 연구공원 웨딩홀 약도' />

        <div className='arrival-popup__route'>
          <div className='arrival-popup__route-title'>대중교통 이용 시 꼭 확인해 주세요</div>
          <div className='arrival-popup__steps'>
            <div className='arrival-popup__step'>
              <span className='arrival-popup__step-num'>1</span>
              <div>지하철 2호선<br /><strong className='arrival-popup__strong'>낙성대역</strong> 4번 출구</div>
            </div>
            <div className='arrival-popup__arrow' aria-hidden='true'>→</div>
            <div className='arrival-popup__step'>
              <span className='arrival-popup__step-num'>2</span>
              <div>마을버스<br /><strong className='arrival-popup__strong'>관악02</strong> 승차</div>
            </div>
          </div>
          <p className='arrival-popup__note'>서울대입구역이 아닌 <strong>낙성대역</strong>에서 내려 주세요.</p>
        </div>

        <div className='arrival-popup__actions'>
          <button type='button' className='arrival-popup__button arrival-popup__button--ghost' onClick={() => setOpen(false)}>닫기</button>
          <button type='button' className='arrival-popup__button' onClick={goToLocation}>오시는 길 자세히</button>
        </div>
      </div>
    </div>
  )
}

export default ArrivalPopup
