import React from 'react'
import kakaoIcon from '../images/kakao.png'

const KAKAO_SDK_URL = 'https://t1.kakaocdn.net/kakao_js_sdk/2.7.5/kakao.min.js'
const KAKAO_JAVASCRIPT_KEY = process.env.REACT_APP_KAKAO_JAVASCRIPT_KEY || ''
const SHARE_URL = 'https://crimama.github.io/react-wedding-card/'
const SHARE_IMAGE_URL = 'https://crimama.github.io/react-wedding-card/wedding.jpg'

function loadKakaoSdk() {
  if (window.Kakao) return Promise.resolve(window.Kakao)

  return new Promise((resolve, reject) => {
    const existingScript = document.querySelector(`script[src="${KAKAO_SDK_URL}"]`)

    if (existingScript) {
      existingScript.addEventListener('load', () => resolve(window.Kakao), { once: true })
      existingScript.addEventListener('error', reject, { once: true })
      return
    }

    const script = document.createElement('script')
    script.src = KAKAO_SDK_URL
    script.async = true
    script.onload = () => resolve(window.Kakao)
    script.onerror = reject
    document.head.appendChild(script)
  })
}

async function copyShareLink() {
  try {
    await navigator.clipboard.writeText(SHARE_URL)
    alert('청첩장 링크가 복사되었습니다.')
  } catch {
    window.prompt('청첩장 링크를 복사해주세요.', SHARE_URL)
  }
}

function Footer() {
  const shareToKakao = async () => {
    if (!KAKAO_JAVASCRIPT_KEY) {
      await copyShareLink()
      return
    }

    try {
      const Kakao = await loadKakaoSdk()

      if (!Kakao) throw new Error('Kakao SDK를 불러오지 못했습니다.')
      if (!Kakao.isInitialized()) Kakao.init(KAKAO_JAVASCRIPT_KEY)

      Kakao.Share.sendDefault({
        objectType: 'feed',
        content: {
          title: '임훈 ♥ 오윤경 결혼합니다',
          description: '2026년 11월 28일 토요일 오후 5시, 서울대학교 연구공원 웨딩홀',
          imageUrl: SHARE_IMAGE_URL,
          link: {
            mobileWebUrl: SHARE_URL,
            webUrl: SHARE_URL,
          },
        },
        buttons: [
          {
            title: '청첩장 보기',
            link: {
              mobileWebUrl: SHARE_URL,
              webUrl: SHARE_URL,
            },
          },
        ],
      })
    } catch {
      await copyShareLink()
    }
  }

  return (
    <div className='footer'>
      <button type='button' className='footer__kakao-share' onClick={shareToKakao}>
        <img src={kakaoIcon} alt='' className='footer__kakao-icon' />
        카카오톡 공유하기
      </button>
      <div className='footer__text'>임훈 ♥ 오윤경</div>
      <div className='footer__text'>2026.11.28 서울대학교 연구공원 웨딩홀</div>
      <div className='footer__text footer__credit'>Based on YOUNGEUN100/react-wedding-card</div>
    </div>
  )
}

export default Footer
