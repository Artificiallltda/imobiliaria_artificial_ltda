import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Button, StatusTag, Modal } from '../../components/ui/index.js';
import Gallery from '../../components/Properties/Gallery/index.jsx';
import { 
  getPropertyDetailMockById, 
  formatPrice, 
  getStatusLabel, 
  getStatusTone 
} from '../../mocks/propertyDetailMock.jsx';
import styles from './styles.module.css';

const PropertyDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);

  // TODO - Integrar dados do imóvel com backend
  useEffect(() => {
    // Simular carregamento dos dados
    const loadProperty = async () => {
      setLoading(true);
      
      // Simular delay de rede
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const propertyData = getPropertyDetailMockById(id);
      
      if (!propertyData) {
        // Imóvel não encontrado
        navigate('/properties');
        return;
      }
      
      setProperty(propertyData);
      setLoading(false);
    };

    loadProperty();
  }, [id, navigate]);

  const handleContactRealtor = () => {
    setIsChatModalOpen(true);
  };

  const handleScheduleVisit = () => {
    // TODO - Implementar agendamento de visita
    console.log('Agendar visita para:', property?.id);
  };

  const handleWhatsApp = () => {
    if (property?.contact?.whatsapp) {
      const message = encodeURIComponent(`Olá! Tenho interesse no imóvel: ${property.title}`);
      window.open(`https://wa.me/${property.contact.whatsapp.replace(/\D/g,)}?text=${message}`, '_blank');
    }
  };

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.loadingSpinner}>⏳</div>
        <p>Carregando detalhes do imóvel...</p>
      </div>
    );
  }

  if (!property) {
    return (
      <div className={styles.error}>
        <h2>Imóvel não encontrado</h2>
        <p>O imóvel que você procura não foi encontrado.</p>
        <Button onClick={() => navigate('/properties')}>
          Voltar para a lista
        </Button>
      </div>
    );
  }

  return (
    <div className={styles.propertyDetail}>
      {/* Header com informações principais */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.titleSection}>
            <h1 className={styles.title}>{property.title}</h1>
            <div className={styles.meta}>
              <StatusTag status={getStatusTone(property.status)}>
                {getStatusLabel(property.status)}
              </StatusTag>
              <span className={styles.type}>{property.type}</span>
            </div>
          </div>
          
          <div className={styles.priceSection}>
            <div className={styles.price}>{formatPrice(property.price)}</div>
            <div className={styles.location}>📍 {property.location}</div>
          </div>
        </div>
      </div>

      <div className={styles.content}>
        {/* Galeria de imagens */}
        <div className={styles.gallerySection}>
          <Gallery images={property.images} />
        </div>

        {/* Card único com todas as informações */}
        <Card className={styles.unifiedCard}>
          {/* Header com informações principais e CTA */}
          <div className={styles.cardHeader}>
            <div className={styles.propertyInfo}>
              <h2 className={styles.sectionTitle}>Informações do Imóvel</h2>
              
              {/* Grid de informações principais */}
              <div className={styles.infoGrid}>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Área Total</span>
                  <span className={styles.infoValue}>{property.area}m²</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Área Útil</span>
                  <span className={styles.infoValue}>{property.usableArea}m²</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Quartos</span>
                  <span className={styles.infoValue}>{property.bedrooms}</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Suítes</span>
                  <span className={styles.infoValue}>{property.suites || 0}</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Banheiros</span>
                  <span className={styles.infoValue}>{property.bathrooms}</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Vagas</span>
                  <span className={styles.infoValue}>{property.parkingSpaces || 0}</span>
                </div>
              </div>
            </div>

            {/* Sidebar de contato integrada */}
            <div className={styles.contactSidebar}>
              <h3 className={styles.contactTitle}>Interessado neste imóvel?</h3>
              <p className={styles.contactDescription}>
                Fale com um de nossos corretores para mais informações.
              </p>
              
              <div className={styles.contactButtons}>
                <Button 
                  className={styles.primaryButton}
                  onClick={handleContactRealtor}
                >
                  Falar com Corretor
                </Button>
                
                <Button 
                  variant="outline"
                  className={styles.secondaryButton}
                  onClick={handleScheduleVisit}
                >
                  Agendar Visita
                </Button>
                
                <Button 
                  variant="outline"
                  className={styles.whatsappButton}
                  onClick={handleWhatsApp}
                >
                  📱 WhatsApp
                </Button>
              </div>
              
              <div className={styles.realtorInfo}>
                <div className={styles.realtorName}>{property.contact.realtor}</div>
                <div className={styles.realtorPhone}>{property.contact.phone}</div>
                <div className={styles.realtorEmail}>{property.contact.email}</div>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className={styles.divider}></div>

          {/* Descrição */}
          <div className={styles.descriptionSection}>
            <h3 className={styles.subsectionTitle}>Descrição</h3>
            <div className={styles.description}>
              {property.description.split('\n').map((paragraph, index) => (
                <p key={index} className={styles.descriptionParagraph}>
                  {paragraph.trim()}
                </p>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className={styles.divider}></div>

          {/* Características e informações adicionais combinadas */}
          <div className={styles.combinedInfo}>
            <div className={styles.featuresSection}>
              <h3 className={styles.subsectionTitle}>Características</h3>
              <div className={styles.featuresGrid}>
                {property.features.map((feature, index) => (
                  <div key={index} className={styles.feature}>
                    <span className={styles.featureIcon}>✓</span>
                    <span className={styles.featureText}>{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.additionalSection}>
              <h3 className={styles.subsectionTitle}>Informações Adicionais</h3>
              <div className={styles.additionalInfoGrid}>
                <div className={styles.additionalInfoItem}>
                  <span className={styles.additionalInfoLabel}>Ano de Construção</span>
                  <span className={styles.additionalInfoValue}>{property.additionalInfo.yearBuilt}</span>
                </div>
                <div className={styles.additionalInfoItem}>
                  <span className={styles.additionalInfoLabel}>Andar</span>
                  <span className={styles.additionalInfoValue}>{property.additionalInfo.floor || 'Térreo'}</span>
                </div>
                <div className={styles.additionalInfoItem}>
                  <span className={styles.additionalInfoLabel}>Condomínio</span>
                  <span className={styles.additionalInfoValue}>{formatPrice(property.additionalInfo.condominiumFee)}/mês</span>
                </div>
                <div className={styles.additionalInfoItem}>
                  <span className={styles.additionalInfoLabel}>IPTU</span>
                  <span className={styles.additionalInfoValue}>{formatPrice(property.additionalInfo.iptu)}/ano</span>
                </div>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className={styles.divider}></div>

          {/* Locais próximos */}
          <div className={styles.nearbySection}>
            <h3 className={styles.subsectionTitle}>Locais Próximos</h3>
            <div className={styles.nearbyList}>
              {property.nearbyPlaces.map((place, index) => (
                <div key={index} className={styles.nearbyItem}>
                  <span className={styles.nearbyName}>{place.name}</span>
                  <span className={styles.nearbyDistance}>{place.distance}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* Modal de Chat */}
      <Modal
        open={isChatModalOpen}
        title="Iniciar Conversa"
        onClose={() => setIsChatModalOpen(false)}
        actions={
          <>
            <Button variant="outline" onClick={() => setIsChatModalOpen(false)}>
              Cancelar
            </Button>
            <Button
              onClick={() => {
                // TODO - Integrar CTA com sistema de chat
                console.log('Iniciar chat sobre imóvel:', property.id);
                setIsChatModalOpen(false);
              }}
            >
              Iniciar Conversa
            </Button>
          </>
        }
      >
        <div className={styles.chatModalContent}>
          <p>
            Você está iniciando uma conversa sobre o imóvel:
          </p>
          <div className={styles.chatPropertyInfo}>
            <strong>{property.title}</strong>
            <div>{formatPrice(property.price)}</div>
            <div>{property.location}</div>
          </div>
          <p>
            Um de nossos corretores entrará em contato em breve para fornecer 
            mais informações sobre este imóvel.
          </p>
        </div>
      </Modal>
    </div>
  );
};

export default PropertyDetail;
