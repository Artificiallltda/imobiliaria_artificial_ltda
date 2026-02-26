import React, { useState, useRef, useEffect } from 'react';
// import { Swiper, SwiperSlide } from 'swiper/react';
// import { Navigation, Pagination, Thumbs } from 'swiper/modules';
// import 'swiper/css';
import styles from './styles.module.css';

const PropertyGallery = ({ images = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const carouselRef = useRef(null);

  // Minimum swipe distance (in px)
  const minSwipeDistance = 50;

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => setTouchEnd(e.targetTouches[0].clientX);

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && currentIndex < images.length - 1) {
      nextImage();
    }
    if (isRightSwipe && currentIndex > 0) {
      prevImage();
    }
  };

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const goToImage = (index) => {
    setCurrentIndex(index);
  };

  // Add touch event listeners
  useEffect(() => {
    const carousel = carouselRef.current;
    if (carousel) {
      carousel.addEventListener('touchstart', onTouchStart, { passive: false });
      carousel.addEventListener('touchmove', onTouchMove, { passive: false });
      carousel.addEventListener('touchend', onTouchEnd, { passive: false });

      return () => {
        carousel.removeEventListener('touchstart', onTouchStart);
        carousel.removeEventListener('touchmove', onTouchMove);
        carousel.removeEventListener('touchend', onTouchEnd);
      };
    }
  }, [touchStart, touchEnd, currentIndex]);

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
      <div ref={carouselRef} className={styles.carousel}>
        {/* Imagem principal */}
        <div className={styles.mainImageContainer}>
          <img
            src={images[currentIndex].image_url || images[currentIndex].url || images[currentIndex]}
            alt={`Imagem ${currentIndex + 1}`}
            className={styles.mainImage}
          />

          {/* Botões de navegação */}
          {images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className={`${styles.navButton} ${styles.prevButton}`}
                aria-label="Imagem anterior"
              >
                ‹
              </button>
              <button
                onClick={nextImage}
                className={`${styles.navButton} ${styles.nextButton}`}
                aria-label="Próxima imagem"
              >
                ›
              </button>
            </>
          )}
        </div>

        {/* Indicadores */}
        {images.length > 1 && (
          <div className={styles.indicators}>
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => goToImage(index)}
                className={`${styles.indicator} ${index === currentIndex ? styles.active : ''}`}
                aria-label={`Ir para imagem ${index + 1}`}
              />
            ))}
          </div>
        )}

        {/* Thumbnails */}
        {images.length > 1 && (
          <div className={styles.thumbnails}>
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => goToImage(index)}
                className={`${styles.thumbnail} ${index === currentIndex ? styles.active : ''}`}
              >
                <img
                  src={image.image_url || image.url || image}
                  alt={`Thumbnail ${index + 1}`}
                  className={styles.thumbnailImage}
                />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertyGallery;
