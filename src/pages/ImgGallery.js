import React from 'react';
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";

const PHOTO_NUMBERS = [
  1, 2, 3, 4, 5,
  7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
  21, 22, 23, 24, 25, 26, 27, 28, 29, 30,
  32, 33, 34, 35, 36, 37, 38, 39, 40,
  41, 42, 43, 44, 45, 46, 48, 50, 51, 52, 53,
];

function ImgGallery() {
  const images = PHOTO_NUMBERS.map((photoNumber, index) => {
    const number = String(photoNumber).padStart(2, '0');
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
