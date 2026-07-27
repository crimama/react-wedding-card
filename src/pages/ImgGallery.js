import React, { useEffect, useState } from 'react';
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";
import { collection, getDocs, orderBy, query } from 'firebase/firestore'
import db from '../firebase-config'
import { useSiteSettings } from '../SiteSettingsContext'

const GALLERY_IMAGES_COLLECTION = 'galleryImages'

const PHOTO_NUMBERS = [
  1, 2, 3, 4, 5,
  7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
  21, 22, 23, 24, 25, 26, 27, 28, 29, 30,
  32, 33, 34, 35, 36, 37, 38, 39, 40,
  41, 42, 43, 44, 45, 46, 48, 50, 51, 52, 53,
];

function sortBySavedOrder(items, savedOrder) {
  if (!Array.isArray(savedOrder) || savedOrder.length === 0) return items

  const orderMap = new Map(savedOrder.map((id, index) => [id, index]))
  return [...items].sort((a, b) => {
    const aOrder = orderMap.has(a.id) ? orderMap.get(a.id) : Number.MAX_SAFE_INTEGER
    const bOrder = orderMap.has(b.id) ? orderMap.get(b.id) : Number.MAX_SAFE_INTEGER
    if (aOrder !== bOrder) return aOrder - bOrder
    return a.fallbackOrder - b.fallbackOrder
  })
}

function getDefaultImages() {
  return PHOTO_NUMBERS.map((photoNumber, index) => {
    const number = String(photoNumber).padStart(2, '0');
    return {
      id: `default-${number}`,
      fallbackOrder: index,
      original: `${process.env.PUBLIC_URL}/gallery/wedding-gallery-${number}.jpg`,
      thumbnail: `${process.env.PUBLIC_URL}/gallery/wedding-gallery-${number}-thumb.jpg`,
      originalAlt: `임훈 오윤경 웨딩사진 ${index + 1}`,
      thumbnailAlt: `임훈 오윤경 웨딩사진 ${index + 1}`,
    };
  });
}

function ImgGallery() {
  const { settings } = useSiteSettings()
  const [uploadedImages, setUploadedImages] = useState([])

  useEffect(() => {
    const fetchGalleryImages = async () => {
      try {
        const snapshot = await getDocs(query(collection(db, GALLERY_IMAGES_COLLECTION), orderBy('order', 'asc')))
        setUploadedImages(snapshot.docs.map((item) => ({ id: item.id, ...item.data() })))
      } catch (error) {
        console.error('Failed to load gallery images:', error)
      }
    }

    fetchGalleryImages()
  }, [])

  const legacyUploadedImages = Array.isArray(settings.gallery?.images) ? settings.gallery.images : []
  const uploadedGalleryImages = [...legacyUploadedImages, ...uploadedImages].map((image, index) => {
    const uploadId = image.id ? `upload-${image.id}` : `legacy-upload-${index}`
    return {
      id: uploadId,
      fallbackOrder: PHOTO_NUMBERS.length + index,
      original: image.src,
      thumbnail: image.thumbnail || image.src,
      originalAlt: image.alt || `임훈 오윤경 추가 웨딩사진 ${index + 1}`,
      thumbnailAlt: image.alt || `임훈 오윤경 추가 웨딩사진 ${index + 1}`,
    }
  })
  const images = sortBySavedOrder([...getDefaultImages(), ...uploadedGalleryImages], settings.gallery?.photoOrder)

  return (
    <div className='bc-pink container'>
      <div className='title gallery__title'>{settings.gallery?.title || 'Gallery'}</div>
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
