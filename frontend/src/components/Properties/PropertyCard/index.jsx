import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, StatusTag, Button } from '../../ui/index.js';
import { formatPrice, getStatusLabel, getStatusTone } from '../../../mocks/propertiesMock.jsx';
import styles from './styles.module.css';

const PropertyCard = ({ property }) => {
  const navigate = useNavigate();
  const {
    id,
    title,
    type,
    price,
    status,
    location,
    bedrooms,
    bathrooms,
    area,
    featured
  } = property;

  const handleViewDetails = () => {
    navigate(`/properties/${id}`);
  };

  const handleScheduleVisit = () => {
    console.log('Agendar visita:', id);
    // TODO: Implementar modal de agendamento
  };

  return (
    <Card className={`${styles.propertyCard} ${featured ? styles.featured : ''}`}>
      {/* Imagem do imóvel */}
      <div className={styles.cardImage}>
        <div className={styles.imagePlaceholder}>
          <span className={styles.imageIcon}>🏠</span>
        </div>
        {featured && (
          <div className={styles.featuredBadge}>
            ⭐ Destaque
          </div>
        )}
        <StatusTag 
          status={getStatusTone(status)} 
          className={styles.statusBadge}
        >
          {getStatusLabel(status)}
        </StatusTag>
      </div>

      {/* Conteúdo do card */}
      <div className={styles.cardContent}>
        <div className={styles.cardHeader}>
          <h3 className={styles.title}>{title}</h3>
          <span className={styles.type}>{type}</span>
        </div>

        <p className={styles.location}>📍 {location}</p>
        
        <div className={styles.price}>
          {formatPrice(price)}
        </div>

        <div className={styles.details}>
          <span className={styles.detail}>
            🛏️ {bedrooms} {bedrooms === 1 ? 'quarto' : 'quartos'}
          </span>
          <span className={styles.detail}>
            🚿 {bathrooms} {bathrooms === 1 ? 'banheiro' : 'banheiros'}
          </span>
          <span className={styles.detail}>
            📐 {area}m²
          </span>
        </div>

        <div className={styles.cardActions}>
          <Button 
            variant="outline" 
            size="small"
            onClick={handleViewDetails}
          >
            Ver Detalhes
          </Button>
          <Button 
            size="small"
            onClick={handleScheduleVisit}
          >
            Agendar Visita
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default PropertyCard;
