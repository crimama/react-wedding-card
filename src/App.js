import React, { useEffect } from 'react'
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
import Admin from './pages/Admin.js';
import { SiteSettingsProvider, useSiteSettings } from './SiteSettingsContext';

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
    return <Admin />
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
