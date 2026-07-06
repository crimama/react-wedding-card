import React from 'react';
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";

const PHOTO_COUNT = 53;

function ImgGallery() {
  const images = Array.from({ length: PHOTO_COUNT }, (_, index) => {
    const number = String(index + 1).padStart(2, '0');
    return {
      original: `${process.env.PUBLIC_URL}/gallery/wedding-gallery-${number}.jpg`,
      thumbnail: `${process.env.PUBLIC_URL}/gallery/wedding-gallery-${number}-thumb.jpg`,
      originalAlt: `임훈 오윤경 웨딩사진 ${index + 1}`,
      thumbnailAlt: `임훈 오윤경 웨딩사진 ${index + 1}`,
    };
  });

  return (
    <div className='bc-pink container'>
      <div className='title gallery__title'>Gallery</div>
      <ImageGallery
        items={images}
        lazyLoad={true}
        showIndex={true}
        showPlayButton={false}
        showFullscreenButton={false}
      />
    </div>
  )
}

export default ImgGallery
