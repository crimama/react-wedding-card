import React from 'react'
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

function InvitationApp() {
  const { settings } = useSiteSettings()
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
