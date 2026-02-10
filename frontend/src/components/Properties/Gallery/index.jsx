import React, { useState } from 'react';
import styles from './styles.module.css';

const Gallery = ({ images }) => {
  const [selectedImage, setSelectedImage] = useState(0);

  // TODO - Implementar carregamento dinâmico de imagens

  if (!images || images.length === 0) {
    return (
      <div className={styles.gallery}>
        <div className={styles.mainImage}>
          <div className={styles.imagePlaceholder}>
            <span className={styles.placeholderIcon}>🏠</span>
            <span className={styles.placeholderText}>Nenhuma imagem disponível</span>
          </div>
        </div>
      </div>
    );
  }

  const handleImageClick = (index) => {
    setSelectedImage(index);
  };

  const handleNext = () => {
    setSelectedImage((prev) => (prev + 1) % images.length);
  };

  const handlePrevious = () => {
    setSelectedImage((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className={styles.gallery}>
      {/* Imagem principal */}
      <div className={styles.mainImage}>
        <div className={styles.imageContainer}>
          <img
            src={images[selectedImage]?.url || ''}
            alt={images[selectedImage]?.alt || `Imagem ${selectedImage + 1}`}
            className={styles.mainImg}
            onError={(e) => {
              e.target.src = '';
              e.target.className = styles.imagePlaceholder;
              e.target.innerHTML = `
                <div class="${styles.imagePlaceholder}">
                  <span class="${styles.placeholderIcon}">🏠</span>
                  <span class="${styles.placeholderText}">Imagem não disponível</span>
                </div>
              `;
            }}
          />
          
          {/* Botões de navegação */}
          {images.length > 1 && (
            <>
              <button
                className={`${styles.navButton} ${styles.prevButton}`}
                onClick={handlePrevious}
                aria-label="Imagem anterior"
              >
                ‹
              </button>
              <button
                className={`${styles.navButton} ${styles.nextButton}`}
                onClick={handleNext}
                aria-label="Próxima imagem"
              >
                ›
              </button>
            </>
          )}
        </div>
        
        {/* Contador de imagens */}
        {images.length > 1 && (
          <div className={styles.imageCounter}>
            {selectedImage + 1} / {images.length}
          </div>
        )}
      </div>

      {/* Miniaturas */}
      {images.length > 1 && (
        <div className={styles.thumbnails}>
          {images.map((image, index) => (
            <button
              key={image.id}
              className={`${styles.thumbnail} ${selectedImage === index ? styles.active : ''}`}
              onClick={() => handleImageClick(index)}
              aria-label={`Ver imagem ${index + 1}`}
            >
              <img
                src={image.thumbnail || image.url}
                alt={image.alt || `Miniatura ${index + 1}`}
                className={styles.thumbnailImg}
                onError={(e) => {
                  e.target.src = '';
                  e.target.className = styles.thumbnailPlaceholder;
                  e.target.innerHTML = `<span class="${styles.thumbnailIcon}">🏠</span>`;
                }}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Gallery;
