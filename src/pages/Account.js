import React from 'react'
import flower from '../images/flower.png'

const accountGroups = [
  {
    title: '신랑측 혼주',
    people: [
      { role: '아버지', name: '임혁' },
      { role: '어머니', name: '서정하' },
    ],
  },
  {
    title: '신부측 혼주',
    people: [
      { role: '어머니', name: '박경순' },
    ],
  },
]

function AccountRow({ role, name }) {
  return (
    <div className='account__row'>
      <div className='account__person'>
        <span className='account__role'>{role}</span>
        <span className='account__name'>{name}</span>
      </div>
      <div className='account__empty' aria-label={`${name} 계좌번호 미입력`} />
    </div>
  )
}

function Account() {
  return (
    <div className='container account'>
      <img src={flower} className='flower' alt='flower'/>
      <div className='account__title'>축하의 마음 전하기</div>
      <div className='account__description'>
        축하의 마음을 전하실 계좌번호는 추후 안내드리겠습니다.
      </div>
      <div className='account__groups'>
        {accountGroups.map((group) => (
          <div className='account__group' key={group.title}>
            <div className='account__group-title'>{group.title}</div>
            {group.people.map((person) => (
              <AccountRow key={`${group.title}-${person.name}`} {...person} />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

export default Account
