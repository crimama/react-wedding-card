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

import Cover from './pages/Cover.js'
import Invitation from './pages/Invitation.js';
import Calendar from './pages/Calendar.js';
import Location from './pages/Location.js';
import ImgGallery from './pages/ImgGallery.js';
import Footer from './components/Footer.js';
import Account from './pages/Account.js';
import Comment from './pages/Comment.js';

function App() {
  return (
    <div className="App">
      <Cover />
      <Invitation />
      <Calendar />
      <ImgGallery />
      <Location />
      <Account />
      <Comment />
      <Footer />
    </div>
  );
}

export default App;
