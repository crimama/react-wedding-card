import React from 'react'
import flower from '../images/flower.png'

function Invitation() {
  return (
    <div className='bc-pink container'>
      <img src={flower} className='flower' alt='flower'/>
      <div className='invitation__title'>초대합니다</div>
      <div className='invitation__content'>
        <div>각자의 트랙을 달리던 저희 두 사람이 만나</div>
        <div>서로의 발걸음을 맞추는 완벽한 짝이 되었습니다.</div>
        <div>힘들 땐 서로의 페이스메이커가 되어주며</div>
        <div>삶이라는 인생 마라톤을 함께 완주해 나가겠습니다.</div>
        <div>부부라는 이름으로 서는 첫 번째 출발선,</div>
        <div>귀한 걸음으로 오셔서 힘차게 축복해주세요.</div>
      </div>
      <div className='invitation__family'>
        <div>
          <span className='invitation__parents'>임혁 · 서정하</span>
          <span>의 차남 </span>
          <span className='invitation__child'>임 훈</span>
        </div>
        <div>
          <span className='invitation__parents'>박경순</span>
          <span>의 장녀 </span>
          <span className='invitation__child'>오윤경</span>
        </div>
      </div>
    </div>
  )
}

export default Invitation
