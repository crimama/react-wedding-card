import React from 'react'
import naverMapIcon from '../images/nmap-icon.png';
import kakaoNaviIcon from '../images/knavi-icon.png';
import tmapIcon from '../images/tmap-icon.png';
import locationMap from '../images/location-map.png';
import { useSiteSettings } from '../SiteSettingsContext'

const LAT = 37.4657134;
const LNG = 126.9594982;
const NMAP_PLACE_ID = 13321741;
const KMAP_PLACE_ID = 8634826;

function linesToHtml(lines) {
  return lines.map((line) => `<p>${line}</p>`).join('')
}

function sanitizeHtml(html) {
  const template = document.createElement('template')
  template.innerHTML = html
  template.content.querySelectorAll('script, style, iframe, object, embed, link, meta').forEach((node) => node.remove())
  template.content.querySelectorAll('*').forEach((node) => {
    Array.from(node.attributes).forEach((attribute) => {
      const name = attribute.name.toLowerCase()
      const value = attribute.value.toLowerCase()
      const unsafeProtocol = ['java', 'script:'].join('')
      if (name.startsWith('on') || value.includes(unsafeProtocol)) {
        node.removeAttribute(attribute.name)
      }
    })
  })
  return template.innerHTML
}

function Location() {
  const { settings } = useSiteSettings()
  const { location } = settings

  const checkDevice = () => {
    const userAgent = window.navigator.userAgent;
    if (userAgent.match(/(iPhone|iPod|iPad)/)) return 'ios';
    if (userAgent.match(/(Android)/)) return 'android';
    return 'other';
  };

  const openNaverMap = () => {
    if (checkDevice() === 'other') {
      window.open(`https://map.naver.com/p/entry/place/${NMAP_PLACE_ID}`, '_blank');
    } else {
      window.open(`nmap://place?id=${NMAP_PLACE_ID}`, '_self');
      setTimeout(() => window.open(`https://map.naver.com/p/entry/place/${NMAP_PLACE_ID}`, '_blank'), 800);
    }
  };

  const openKakaoMap = () => {
    window.open(`https://map.kakao.com/link/map/${KMAP_PLACE_ID}`, '_blank');
  };

  const openTmap = () => {
    if (checkDevice() === 'other') {
      alert('티맵 길찾기는 모바일에서 확인하실 수 있습니다.');
      return;
    }
    const params = new URLSearchParams({
      goalx: LNG.toString(),
      goaly: LAT.toString(),
      goalName: location.name,
    });
    window.open(`tmap://route?${params.toString()}`, '_self');
  };

  return (
    <div className='container'>
      <div className='title'>{location.title}</div>
      <div className='location__details'>
        <div className='location__name'>{location.name}</div>
        <div className='location__address'>{location.address}</div>
      </div>

      <img
        className='location__map'
        src={locationMap}
        alt='서울대학교 연구공원 웨딩홀 약도'
      />

      <div className='location__map-icon-box'>
        <button type='button' className='location__map-item' onClick={openNaverMap}>
          <img src={naverMapIcon} className='location__map-icon' alt='naver map'/>
          <span>네이버지도</span>
        </button>
        <button type='button' className='location__map-item' onClick={openKakaoMap}>
          <img src={kakaoNaviIcon} className='location__map-icon' alt='kakao map'/>
          <span>카카오지도</span>
        </button>
        <button type='button' className='location__map-item' onClick={openTmap}>
          <img src={tmapIcon} className='location__map-icon' alt='tmap'/>
          <span>티맵</span>
        </button>
      </div>

      <div className='location__info'>
        <div className='location__section-title'>{location.transitTitle}</div>
        <div className='location__content location__content--rich' dangerouslySetInnerHTML={{ __html: sanitizeHtml(location.transitHtml) }} />

        <div className='location__section-title'>{location.parkingTitle}</div>
        <div className='location__content location__content--rich' dangerouslySetInnerHTML={{ __html: sanitizeHtml(location.parkingHtml) }} />
        <div
          className='location__notice location__notice--rich'
          dangerouslySetInnerHTML={{ __html: sanitizeHtml(location.noticeHtml || linesToHtml([location.notice])) }}
        />
      </div>
    </div>
  )
}

export default Location
