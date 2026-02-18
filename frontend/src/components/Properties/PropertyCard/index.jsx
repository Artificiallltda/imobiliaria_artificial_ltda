import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, StatusTag, Button } from '../../ui/index.js';
import { formatPrice, translateStatus } from '../../../services/propertiesService.js';
import styles from './styles.module.css';

const PropertyCard = ({ property }) => {
  const navigate = useNavigate();
  const {
    id,
    title,
    price,
    status,
    city,
    bedrooms,
    bathrooms,
    area
  } = property;

  const handleViewDetails = () => {
    navigate(`/properties/${id}`);
  };

  const handleEdit = () => {
    navigate(`/admin/properties/${id}/edit`);
  };

  const handleScheduleVisit = () => {
    // TODO: Implementar modal de agendamento
  };

  // Mapear status para o tom do StatusTag
  const getStatusTone = (status) => {
    switch (status) {
      case 'AVAILABLE': return 'success';
      case 'SOLD': return 'danger';
      case 'RESERVED': return 'warning';
      default: return 'neutral';
    }
  };

  return (
    <Card className={styles.propertyCard}>
      {/* Imagem do imóvel */}
      <div className={styles.cardImage}>
        <div className={styles.imagePlaceholder}>
          <img 
            src="https://www.lopes.com.br/blog/wp-content/uploads/2014/10/Alphaville1.jpg" 
            alt="Imóvel"
            className={styles.propertyImage}
          />
        </div>
        <StatusTag 
          status={getStatusTone(status)} 
          className={styles.statusBadge}
        >
          {translateStatus(status)}
        </StatusTag>
      </div>

      {/* Conteúdo do card */}
      <div className={styles.cardContent}>
        <div className={styles.cardHeader}>
          <h3 className={styles.title}>{title}</h3>
        </div>

        <p className={styles.location}>📍 {city}</p>
        
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
          <span className={`${styles.detail} ${styles.statusDetail} ${styles[`status${status}`]}`}>
            {translateStatus(status)}
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
            variant="outline" 
            size="small"
            onClick={handleEdit}
          >
            Editar
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
