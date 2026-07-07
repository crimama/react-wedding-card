import React from 'react'
import kakaoTalkIcon from '../images/kakaotalk.svg'

const SHARE_URL = 'https://crimama.github.io/react-wedding-card/'
const SHARE_TITLE = '임훈 ♥ 오윤경 결혼합니다'
const SHARE_TEXT = '2026년 11월 28일 토요일 오후 5시, 서울대학교 연구공원 웨딩홀'

async function copyShareLink() {
  try {
    await navigator.clipboard.writeText(SHARE_URL)
    alert('청첩장 링크가 복사되었습니다.')
  } catch {
    window.prompt('청첩장 링크를 복사해주세요.', SHARE_URL)
  }
}

function Footer() {
  const shareInvitation = async () => {
    const shareData = {
      title: SHARE_TITLE,
      text: SHARE_TEXT,
      url: SHARE_URL,
    }

    if (navigator.share && (!navigator.canShare || navigator.canShare(shareData))) {
      try {
        await navigator.share(shareData)
        return
      } catch (error) {
        if (error?.name === 'AbortError') return
      }
    }

    await copyShareLink()
  }

  return (
    <div className='footer'>
      <button type='button' className='footer__kakao-share' onClick={shareInvitation}>
        <img src={kakaoTalkIcon} alt='' className='footer__kakao-icon' />
        카카오톡 공유하기
      </button>
      <div className='footer__text'>임훈 ♥ 오윤경</div>
      <div className='footer__text'>2026.11.28 서울대학교 연구공원 웨딩홀</div>
      <div className='footer__text footer__credit'>Based on YOUNGEUN100/react-wedding-card</div>
    </div>
  )
}

export default Footer
