import React, { useState, useRef, useEffect } from 'react'
import mainPhoto from '../images/wedding-cover.jpg'
import { TbPlayerTrackPrevFilled, TbPlayerSkipBackFilled, TbPlayerSkipForwardFilled, TbPlayerTrackNextFilled } from "react-icons/tb";
import { BsPlayCircle, BsStopCircle } from "react-icons/bs";
import { GoHeartFill } from "react-icons/go";
import myMusic from '../media/taeyeon_poem.mp3';

function Cover() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(new Audio(myMusic));

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  useEffect(() => {
    const audio = audioRef.current;
    isPlaying ? audio.play() : audio.pause();

    return () => {
      audio.pause();
      audio.currentTime = 0;
    };
  }, [isPlaying]);

  return (
    <div className="container">
      <div className='title'>&ldquo;우리 결혼합니다&rdquo;</div>
      <img className="cover__main-photo" src={mainPhoto} alt='임훈 오윤경 웨딩사진' />
      <div className='cover__person'>
        <div>임훈</div>
        <GoHeartFill className='cover__icon-heart' size="0.8em"/>
        <div>오윤경</div>
      </div>
      <div className='cover__date'>2026년 11월 28일 토요일 오후 5시</div>
      <div className='cover__place'>서울대학교 연구공원 웨딩홀</div>
      <div className='cover__line'></div>
      <div className='cover__icon-box' aria-label="background music controls">
        <TbPlayerTrackPrevFilled size="1.5em"/>
        <TbPlayerSkipBackFilled size="1.5em"/>
        {isPlaying ? (
          <BsStopCircle size="3em" className='cover__music-btn' onClick={togglePlay} aria-label="음악 정지"/>
        ) : (
          <BsPlayCircle size="3em" className='cover__music-btn' onClick={togglePlay} aria-label="음악 재생"/>
        )}
        <TbPlayerSkipForwardFilled size="1.5em"/>
        <TbPlayerTrackNextFilled size="1.5em"/>
      </div>
    </div>
  )
}

export default Cover
