import React from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import styles from './styles.module.css';

const PropertyMap = ({ latitude, longitude, title }) => {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  
  // Verificar se a API key está configurada
  if (!apiKey) {
    return (
      <div className={styles.mapContainer}>
        <div className={styles.mapError}>
          <div className={styles.mapErrorIcon}>🗺️</div>
          <h3>Mapa Indisponível</h3>
          <p>Configure uma API key válida do Google Maps para visualizar o mapa.</p>
          <p>Edite o arquivo <code>.env</code> e adicione:</p>
          <code>VITE_GOOGLE_MAPS_API_KEY=sua_api_key_aqui</code>
          <br />
          <small>Obtenha em: <a href="https://console.cloud.google.com/apis/credentials" target="_blank" rel="noopener noreferrer">Google Cloud Console</a></small>
        </div>
      </div>
    );
  }

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: apiKey
  });

  // Verificar se as coordenadas são válidas (não null, undefined, ou string vazia)
  const hasValidCoordinates = (
    latitude !== null && 
    latitude !== undefined && 
    longitude !== null && 
    longitude !== undefined &&
    latitude !== '' &&
    longitude !== '' &&
    !isNaN(parseFloat(latitude)) &&
    !isNaN(parseFloat(longitude))
  );

  // Se não tiver coordenadas válidas, não renderiza nada
  if (!hasValidCoordinates) {
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

  const position = {
    lat: parseFloat(latitude),
    lng: parseFloat(longitude)
  };

  const mapContainerStyle = {
    width: '100%',
    height: '300px'
  };

  const mapOptions = {
    zoom: 15,
    center: position,
    mapTypeControl: false,
    streetViewControl: false,
    fullscreenControl: false,
    disableDefaultUI: true,
    styles: [
      {
        featureType: 'poi',
        elementType: 'labels',
        stylers: [{ visibility: 'off' }]
      }
    ]
  };

  if (!isLoaded) {
    return (
      <div className={styles.mapContainer}>
        <div className={styles.mapLoading}>
          <div className={styles.spinner}></div>
          <p>Carregando mapa...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.mapContainer}>
      {/* Header externo */}
      <div className={styles.mapHeader}>
        <h3>📍 Localização</h3>
        <a
          href={`https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.directionsButton}
        >
          🧭 Como chegar
        </a>
      </div>
      
      {/* Mapa preenchendo toda a largura */}
      <div className={styles.mapWrapper} style={{ 
        width: '100%', 
        height: '400px'
      }}>
        <GoogleMap
          mapContainerStyle={{
            width: '100%',
            height: '100%'
          }}
          options={mapOptions}
        >
          <Marker
            position={position}
            title={title}
            animation={window.google.maps.Animation.DROP}
          />
        </GoogleMap>
      </div>
      
      {/* Footer externo */}
      <div className={styles.mapFooter}>
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
  );
};

export default PropertyMap;
