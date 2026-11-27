import React, { useEffect, useState } from 'react'
import { getApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth'
import './App.css';

import './css/Cover.css'
import './css/Invitation.css'
import './css/Calendar.css'
import './css/Gallery.css'
import './css/Location.css'
import './css/Footer.css'
import './css/Account.css'
import './css/Comment.css'
import './css/PhotoUpload.css'
import './css/Admin.css'

import Cover from './pages/Cover.js'
import Invitation from './pages/Invitation.js';
import Calendar from './pages/Calendar.js';
import Location from './pages/Location.js';
import ImgGallery from './pages/ImgGallery.js';
import Footer from './components/Footer.js';
import Account from './pages/Account.js';
import Comment from './pages/Comment.js';
import PhotoUpload from './pages/PhotoUpload.js';
import ArrivalPopup from './components/ArrivalPopup.js';
import './css/ArrivalPopup.css'
import Admin from './pages/Admin.js';
import VisitStats from './components/VisitStats.js';
import { excludeThisBrowser, logVisit } from './visitTracker';
import { SiteSettingsProvider, useSiteSettings } from './SiteSettingsContext';

function AdminGate() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const auth = getAuth(getApp())
  useEffect(() => onAuthStateChanged(auth, currentUser => {
    setUser(currentUser)
    setLoading(false)
  }), [auth])
  const authorized = user && user.email === 'crimama2@gmail.com' && user.emailVerified && user.providerData.some(provider => provider.providerId === 'google.com')
  useEffect(() => {
    if (authorized) excludeThisBrowser()
  }, [authorized])

  const login = async () => {
    setError('')
    try { await signInWithPopup(auth, new GoogleAuthProvider()) }
    catch (err) { setError('로그인하지 못했습니다. 팝업 차단 여부와 네트워크를 확인해 주세요. (' + err.code + ')') }
  }
  if (loading) return <main style={{padding: '3rem', textAlign: 'center'}}>로그인 상태를 확인하고 있습니다.</main>
  if (authorized) return <><div style={{padding: '1rem', textAlign: 'right'}}><button type="button" onClick={() => signOut(auth)}>로그아웃</button></div><VisitStats /><Admin /></>
  return <main style={{maxWidth: 480, margin: '5rem auto', padding: '2rem', textAlign: 'center', lineHeight: 1.8}}>
    <h1>청첩장 관리자 로그인</h1>
    <p>허용된 Google 계정으로 로그인해 주세요.</p>
    {user ? <><p>이 계정은 관리자 권한이 없습니다.</p><button type="button" onClick={() => signOut(auth)}>다른 계정으로 로그인</button></> : <button type="button" onClick={login}>Google로 로그인</button>}
    {error && <p role="alert">{error}</p>}
    <p><a href={process.env.PUBLIC_URL + '/'}>청첩장으로 돌아가기</a></p>
  </main>
}

function setMetaContent(selector, content, attributeName, attributeValue) {
  if (!content) return
  let meta = document.querySelector(selector)
  if (!meta && attributeName && attributeValue) {
    meta = document.createElement('meta')
    meta.setAttribute(attributeName, attributeValue)
    document.head.appendChild(meta)
  }
  if (meta) meta.setAttribute('content', content)
}

function InvitationApp() {
  const { settings } = useSiteSettings()

  useEffect(() => {
    setMetaContent('meta[property="og:url"]', settings.footer.shareUrl, 'property', 'og:url')
    setMetaContent('meta[property="og:title"]', settings.footer.shareTitle, 'property', 'og:title')
    setMetaContent('meta[property="og:description"]', settings.footer.shareText, 'property', 'og:description')
    setMetaContent('meta[property="og:image"]', settings.footer.shareImage, 'property', 'og:image')
    setMetaContent('meta[property="og:image:secure_url"]', settings.footer.shareImage, 'property', 'og:image:secure_url')
    setMetaContent('meta[name="twitter:card"]', 'summary_large_image', 'name', 'twitter:card')
    setMetaContent('meta[name="twitter:title"]', settings.footer.shareTitle, 'name', 'twitter:title')
    setMetaContent('meta[name="twitter:description"]', settings.footer.shareText, 'name', 'twitter:description')
    setMetaContent('meta[name="twitter:image"]', settings.footer.shareImage, 'name', 'twitter:image')
    document.title = settings.footer.shareTitle
  }, [settings.footer])

  useEffect(() => {
    logVisit()
  }, [])

  const themeStyle = {
    '--wedding-font-body': settings.style.bodyFont,
    '--wedding-font-title': settings.style.titleFont,
    '--wedding-font-cover': settings.style.coverFont,
    '--wedding-bg': settings.style.backgroundColor,
    '--wedding-paper': settings.style.paperColor,
    '--wedding-text': settings.style.textColor,
    '--wedding-muted': settings.style.mutedTextColor,
    '--wedding-accent': settings.style.accentColor,
    '--wedding-highlight': settings.style.highlightColor,
    '--wedding-button-text': settings.style.buttonTextColor,
  }

  const searchParams = new URLSearchParams(window.location.search)
  const isAdminRoute = window.location.pathname.replace(/\/$/, '').endsWith('/admin') || searchParams.has('admin')

  if (isAdminRoute) {
    return <AdminGate />
  }

  return (
    <div className="App" style={themeStyle}>
      <Cover />
      <Invitation />
      <Calendar />
      <ImgGallery />
      <Location />
      <Account />
      <Comment />
      <PhotoUpload />
      <Footer />
      <ArrivalPopup />
    </div>
  );
}

function App() {
  return (
    <SiteSettingsProvider>
      <InvitationApp />
    </SiteSettingsProvider>
  )
}

export default App;
