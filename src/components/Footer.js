import React from 'react'
import kakaoTalkIcon from '../images/kakaotalk.svg'
import { useSiteSettings } from '../SiteSettingsContext'

function Footer() {
  const { settings } = useSiteSettings()
  const { footer } = settings

  const copyShareLink = async () => {
    try {
      await navigator.clipboard.writeText(footer.shareUrl)
      alert('청첩장 링크가 복사되었습니다.')
    } catch {
      window.prompt('청첩장 링크를 복사해주세요.', footer.shareUrl)
    }
  }

  const shareInvitation = async () => {
    const shareData = {
      title: footer.shareTitle,
      text: footer.shareText,
      url: footer.shareUrl,
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
        {footer.shareButtonText}
      </button>
      <div className='footer__text'>{footer.names}</div>
      <div className='footer__text'>{footer.datePlace}</div>
      <div className='footer__text footer__credit'>{footer.credit}</div>
    </div>
  )
}

export default Footer
