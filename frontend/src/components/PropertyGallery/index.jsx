import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Thumbs } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/thumbs';
import styles from './styles.module.css';

const PropertyGallery = ({ images = [] }) => {
  const [thumbsSwiper, setThumbsSwiper] = useState(null);

  if (!images || images.length === 0) {
    return (
      <div className={styles.galleryContainer}>
        <div className={styles.noImages}>
          <div className={styles.noImagesIcon}>📷</div>
          <p>Nenhuma imagem disponível</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.galleryContainer}>
      {/* Carrossel Principal */}
      <Swiper
        spaceBetween={10}
        slidesPerView={1}
        navigation={{
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        }}
        thumbs={{
          swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null,
        }}
        modules={[Navigation, Thumbs]}
        className={styles.mainSwiper}
      >
        {images.map((image, index) => (
          <SwiperSlide key={image.id || index}>
            <div className={styles.slideContainer}>
              <img
                src={image.image_url}
                alt={`Imóvel - Imagem ${index + 1}`}
                className={styles.mainImage}
                loading="lazy"
              />
              <div className={styles.imageOverlay}>
                <span className={styles.imageNumber}>{index + 1}/{images.length}</span>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Navegação Desktop */}
      <div className="swiper-button-prev"></div>
      <div className="swiper-button-next"></div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <Swiper
          onSwiper={setThumbsSwiper}
          spaceBetween={8}
          slidesPerView={4}
          centeredSlides={false}
          watchSlidesProgress
          modules={[Thumbs]}
          className={styles.thumbsSwiper}
        >
          {images.map((image, index) => (
            <SwiperSlide key={image.id || index}>
              <div className={styles.thumbContainer}>
                <img
                  src={image.image_url}
                  alt={`Thumbnail ${index + 1}`}
                  className={styles.thumbImage}
                  loading="lazy"
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </div>
  );
};

export default PropertyGallery;
