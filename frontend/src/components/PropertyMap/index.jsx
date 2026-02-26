import React from 'react';
import styles from './styles.module.css';

const PropertyMap = ({ latitude, longitude, title }) => {
  // Verificar se tem coordenadas válidas
  if (!latitude || !longitude) {
    return (
      <div className={styles.mapContainer}>
        <div className={styles.mapPlaceholder}>
          <div className={styles.mapPlaceholderIcon}>📍</div>
          <p>Localização não disponível</p>
          <small>Adicione latitude e longitude para visualizar o mapa</small>
        </div>
      </div>
    );
  }

  // URL do Google Maps embed
  const mapUrl = `https://www.google.com/maps/embed/v1/place?key=AIzaSyD42ZxF28Ji-RLa66l-zhqKNEpK3nSNjgk&q=${latitude},${longitude}&zoom=15`;

  return (
    <div className={styles.mapContainer}>
      <div className={styles.mapHeader}>
        <h3>📍 Localização Exata</h3>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '12px' }}>
          <a
            href={`https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.directionsButton}
          >
            🧭 Como chegar
          </a>
          <button
            onClick={() => {
              const url = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
              window.open(url, '_blank');
            }}
            className={styles.mapButton}
          >
            🗺️ Ver no Google Maps
          </button>
        </div>
      </div>

      <div className={styles.mapWrapper}>
        <iframe
          src={mapUrl}
          width="100%"
          height="400"
          style={{ border: 0, borderRadius: '12px' }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title={`Localização: ${title}`}
        />
      </div>

      <div className={styles.mapFooter}>
        <div style={{ fontSize: '12px', color: '#64748b' }}>
          📍 Lat: {latitude} | Lng: {longitude}
        </div>
      </div>
    </div>
  );
};

export default PropertyMap;
