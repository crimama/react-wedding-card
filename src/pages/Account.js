import React, { useState } from 'react'
import flower from '../images/flower.png'
import { useSiteSettings } from '../SiteSettingsContext'

function AccountRow({ role, name, account }) {
  return (
    <div className='account__row'>
      <div className='account__person'>
        <span className='account__role'>{role}</span>
        <span className='account__name'>{name}</span>
      </div>
      <span className='account__pending' aria-label={`${name} 계좌번호 ${account || '추후 안내'}`}>
        {account || '추후 안내'}
      </span>
    </div>
  )
}

function AccountGroup({ group }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className={`account__group${isOpen ? ' account__group--open' : ''}`}>
      <button
        type='button'
        className='account__group-toggle'
        aria-expanded={isOpen}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{group.title}</span>
        <span className='account__chevron' aria-hidden='true'>⌄</span>
      </button>
      {isOpen && (
        <div className='account__panel'>
          {group.people.map((person) => (
            <AccountRow key={`${group.title}-${person.name}`} {...person} />
          ))}
        </div>
      )}
    </div>
  )
}

function Account() {
  const { settings } = useSiteSettings()
  const { account } = settings

  return (
    <div className='container account'>
      <img src={flower} className='flower' alt='flower'/>
      <div className='account__title'>{account.title}</div>
      <div className='account__groups' aria-label='마음 전하실 곳 계좌 안내'>
        {account.groups.map((group) => (
          <AccountGroup group={group} key={group.title} />
        ))}
      </div>
    </div>
  )
}

export default Account
