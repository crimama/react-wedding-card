import React from 'react';
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";
import g1 from '../images/wedding-gallery1.jpg';
import g2 from '../images/wedding-gallery2.jpg';
import g3 from '../images/wedding-gallery3.jpg';
import g4 from '../images/wedding-gallery4.jpg';
import g5 from '../images/wedding-gallery5.jpg';
import g6 from '../images/wedding-gallery6.jpg';
import t1 from '../images/wedding-gallery1-thumb.jpg';
import t2 from '../images/wedding-gallery2-thumb.jpg';
import t3 from '../images/wedding-gallery3-thumb.jpg';
import t4 from '../images/wedding-gallery4-thumb.jpg';
import t5 from '../images/wedding-gallery5-thumb.jpg';
import t6 from '../images/wedding-gallery6-thumb.jpg';

function ImgGallery() {
  const images = [
    { original: g1, thumbnail: t1 },
    { original: g2, thumbnail: t2 },
    { original: g3, thumbnail: t3 },
    { original: g4, thumbnail: t4 },
    { original: g5, thumbnail: t5 },
    { original: g6, thumbnail: t6 },
  ];

  return (
    <div className='bc-pink container'>
      <div className='title gallery__title'>Gallery</div>
      <ImageGallery items={images} showPlayButton={false} showFullscreenButton={false} />
    </div>
  )
}

export default ImgGallery
