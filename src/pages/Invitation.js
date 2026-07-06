import React from 'react'
import flower from '../images/flower.png'

function Invitation() {
  return (
    <div className='bc-pink container'>
      <img src={flower} className='flower' alt='flower'/>
      <div className='invitation__title'>초대합니다</div>
      <div className='invitation__content'>
        <div>서로의 곁에서 가장 편안한 사람이 되어</div>
        <div>이제 한 가정을 이루려 합니다.</div>
        <div>소중한 분들을 모시고</div>
        <div>저희의 새로운 시작을 약속하려 하오니</div>
        <div>귀한 걸음으로 함께 축복해주시면</div>
        <div>더없는 기쁨으로 간직하겠습니다.</div>
      </div>
      <div className='invitation__couple'>
        <span>신랑 임훈</span>
        <span className='invitation__divider'>·</span>
        <span>신부 오윤경</span>
      </div>
    </div>
  )
}

export default Invitation
