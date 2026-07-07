import React from 'react'
import naverMapIcon from '../images/nmap-icon.png';
import kakaoNaviIcon from '../images/knavi-icon.png';
import tmapIcon from '../images/tmap-icon.png';
import locationMap from '../images/location-map.png';

const LOCATION = '서울대학교 연구공원 웨딩홀';
const LOCATION_ADDRESS = '서울시 관악구 관악로 1, 연구공원 본관 1층';
const LAT = 37.4657134;
const LNG = 126.9594982;
const NMAP_PLACE_ID = 13321741;
const KMAP_PLACE_ID = 8634826;

function Location() {
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
      goalName: LOCATION,
    });
    window.open(`tmap://route?${params.toString()}`, '_self');
  };

  return (
    <div className='container'>
      <div className='title'>오시는 길</div>
      <div className='location__details'>
        <div className='location__name'>{LOCATION}</div>
        <div className='location__address'>{LOCATION_ADDRESS}</div>
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
        <div className='location__section-title'>대중교통</div>
        <div className='location__content'>
          지하철 2호선 <b><span className='location__highlight'>낙성대역</span> 4번 출구</b><br />
          → 마을버스 <b><span className='location__highlight'>관악02-1</span> 또는 <span className='location__highlight'>관악02-2</span></b> 승차
        </div>

        <div className='location__section-title'>주차</div>
        <div className='location__content'>
          주차요금 <b>무료(2시간)</b><br />
          주차장 이용시 웨딩홀과 바로 연결
        </div>
        <div className='location__notice'>
          ※ 서울대학교 정문/후문을 통과할 경우 통행료가 발생하므로 낙성대 방향으로 이용해주세요.
        </div>
      </div>
    </div>
  )
}

export default Location
