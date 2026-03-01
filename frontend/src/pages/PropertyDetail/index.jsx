import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Button, StatusTag, Modal, useToast } from '../../components/ui/index.js';
import Gallery from '../../components/Properties/Gallery/index.jsx';
import styles from './styles.module.css';

import { getPropertyById } from '../../services/propertiesService';
import { addFavorite, removeFavorite, checkFavorite, generatePublicLink } from '../../services/favoritesService';
import { formatPriceBRL, getStatusLabel, getStatusTone } from '../../utils/propertyUtils';

const PropertyDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // "NOT_FOUND" | "GENERIC" | null
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const [isVisitModalOpen, setIsVisitModalOpen] = useState(false);
  const [visitDate, setVisitDate] = useState('');
  const [visitTime, setVisitTime] = useState('10:00');
  const [visitName, setVisitName] = useState('');
  const [visitPhone, setVisitPhone] = useState('');
  const [isFavorited, setIsFavorited] = useState(false);
  const [isLoadingFavorite, setIsLoadingFavorite] = useState(false);
  const [favoriteId, setFavoriteId] = useState(null);
  const [isSharing, setIsSharing] = useState(false);

  useEffect(() => {
    let alive = true;

    const loadProperty = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await getPropertyById(id);
        if (!alive) return;
        setProperty(data);

        // Verificar se está nos favoritos
        try {
          const favorited = await checkFavorite(id);
          if (alive) setIsFavorited(favorited);
        } catch (err) {
          // Silenciar erro de check - não é crítico
        }
      } catch (err) {
        if (!alive) return;

        const status = err?.status || err?.response?.status;
        if (status === 404) {
          setError("NOT_FOUND");
        } else {
          setError("GENERIC");
        }
        setProperty(null);
      } finally {
        if (!alive) return;
        setLoading(false);
      }
    };

    loadProperty();

    return () => {
      alive = false;
    };
  }, [id, navigate]);

  const handleContactRealtor = () => {
    setIsChatModalOpen(true);
  };

  const handleScheduleVisit = () => {
    setIsVisitModalOpen(true);
  };

  const handleConfirmVisit = () => {
    if (!visitDate || !visitName || !visitPhone) {
      toast({ type: 'error', message: 'Preencha todos os campos para agendar.' });
      return;
    }
    const msg = encodeURIComponent(
      `Olá! Gostaria de agendar uma visita ao imóvel "${property.title}".\n` +
      `Data: ${visitDate} às ${visitTime}\n` +
      `Nome: ${visitName}\n` +
      `Telefone: ${visitPhone}`
    );
    window.open(`https://wa.me/?text=${msg}`, '_blank');
    setIsVisitModalOpen(false);
    toast({ type: 'success', message: 'Redirecionando para WhatsApp para confirmar a visita!' });
  };

  const handleWhatsApp = () => {
    const whatsapp = property?.contact?.whatsapp;
    const message = encodeURIComponent(`Olá! Tenho interesse no imóvel: ${property.title} — ${window.location.href}`);
    if (whatsapp) {
      window.open(`https://wa.me/${String(whatsapp).replace(/\D/g, '')}?text=${message}`, '_blank');
    } else {
      window.open(`https://wa.me/?text=${message}`, '_blank');
    }
  };

  const handleToggleFavorite = async () => {
    if (isLoadingFavorite) return;

    setIsLoadingFavorite(true);
    try {
      if (isFavorited) {
        await removeFavorite(id);
        setIsFavorited(false);
        setFavoriteId(null);
        // Toast de sucesso ao remover
        toast({
          type: 'success',
          message: 'Imóvel removido dos favoritos',
        });
      } else {
        const result = await addFavorite(id);
        setIsFavorited(true);
        setFavoriteId(result.id);
        // Toast de sucesso ao adicionar
        toast({
          type: 'success',
          message: 'Imóvel adicionado aos favoritos',
        });
      }
    } catch (err) {
      // Erro 409 = já favoritado, considerar como sucesso
      if (err.status === 409) {
        setIsFavorited(true);
        toast({
          type: 'info',
          message: 'Imóvel já está nos favoritos',
        });
      } else {
        // Toast de erro genérico
        toast({
          type: 'error',
          message: 'Erro ao atualizar favoritos. Tente novamente.',
        });
      }
    } finally {
      setIsLoadingFavorite(false);
    }
  };

  const handleShareFavorite = async () => {
    setIsSharing(true);
    try {
      if (favoriteId) {
        const result = await generatePublicLink(favoriteId);
        await navigator.clipboard.writeText(result.public_url);
      } else {
        await navigator.clipboard.writeText(window.location.href);
      }
      toast({ type: 'success', message: 'Link copiado! Compartilhe com seus clientes.' });
    } catch (err) {
      try {
        await navigator.clipboard.writeText(window.location.href);
        toast({ type: 'success', message: 'Link copiado!' });
      } catch {
        toast({ type: 'error', message: 'Não foi possível copiar o link.' });
      }
    } finally {
      setIsSharing(false);
    }
  };

  // Adapta imagens do backend para o formato do Gallery (provável { url, alt, thumbnail })
  const galleryImages = useMemo(() => {
    const imgs = Array.isArray(property?.images) ? property.images : [];
    return imgs.map((img, idx) => ({
      id: img.id ?? String(idx),
      url: img.image_url,
      alt: property?.title ? `Imagem do imóvel - ${property.title}` : "Imagem do imóvel",
      thumbnail: img.image_url,
    }));
  }, [property]);

  // Fallbacks para campos que o backend ainda não retorna
  const safeFeatures = Array.isArray(property?.features) ? property.features : [];
  const safeNearbyPlaces = Array.isArray(property?.nearbyPlaces) ? property.nearbyPlaces : [];
  const safeAdditionalInfo = property?.additionalInfo || null;

  // Para manter seu layout sem quebrar:
  const locationText = property?.location || (property?.city ? property.city : "");
  const propertyType = property?.type || ""; // backend não manda ainda
  const suites = property?.suites ?? 0; // backend não manda ainda
  const usableArea = property?.usableArea ?? null; // backend não manda ainda

  // Backend manda parking_spaces (snake_case). Seu layout usa parkingSpaces.
  const parkingSpaces =
    property?.parkingSpaces ?? property?.parking_spaces ?? 0;

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.loadingSpinner}>⏳</div>
        <p>Carregando detalhes do imóvel...</p>
      </div>
    );
  }

  if (error === "NOT_FOUND") {
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

  if (error) {
    return (
      <div className={styles.error}>
        <h2>Erro ao carregar imóvel</h2>
        <p>Não foi possível carregar os detalhes agora. Tente novamente.</p>
        <Button onClick={() => navigate('/properties')}>
          Voltar para a lista
        </Button>
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

              {/* backend não manda type ainda */}
              {propertyType ? (
                <span className={styles.type}>{propertyType}</span>
              ) : null}
            </div>
          </div>

          <div className={styles.priceSection}>
            <div className={styles.price}>{formatPriceBRL(property.price)}</div>

            {locationText ? (
              <div className={styles.location}>📍 {locationText}</div>
            ) : null}
          </div>
        </div>
      </div>

      <div className={styles.content}>
        {/* Galeria de imagens */}
        <div className={styles.gallerySection}>
          <Gallery images={galleryImages} />
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

                {/* backend não tem usableArea ainda */}
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Área Útil</span>
                  <span className={styles.infoValue}>
                    {usableArea ? `${usableArea}m²` : '-'}
                  </span>
                </div>

                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Quartos</span>
                  <span className={styles.infoValue}>{property.bedrooms}</span>
                </div>

                {/* backend não tem suites ainda */}
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Suítes</span>
                  <span className={styles.infoValue}>{suites}</span>
                </div>

                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Banheiros</span>
                  <span className={styles.infoValue}>{property.bathrooms}</span>
                </div>

                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Vagas</span>
                  <span className={styles.infoValue}>{parkingSpaces}</span>
                </div>
              </div>

              {/* Características MVP que o backend manda */}
              <div className={styles.infoGrid} style={{ marginTop: 12 }}>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Piscina</span>
                  <span className={styles.infoValue}>{property.has_pool ? "Sim" : "Não"}</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Jardim</span>
                  <span className={styles.infoValue}>{property.has_garden ? "Sim" : "Não"}</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Mobiliado</span>
                  <span className={styles.infoValue}>{property.furnished ? "Sim" : "Não"}</span>
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

                <Button
                  variant="outline"
                  className={styles.favoriteButton}
                  onClick={handleToggleFavorite}
                  disabled={isLoadingFavorite}
                  title={isFavorited ? "Remover dos favoritos" : "Adicionar aos favoritos"}
                >
                  {isFavorited ? '❤️' : '🤍'} {isFavorited ? 'Favoritado' : 'Favoritar'}
                </Button>

                <Button
                  variant="outline"
                  className={styles.shareButton}
                  onClick={handleShareFavorite}
                  disabled={isSharing}
                  title="Copiar link do imóvel"
                >
                  {isSharing ? '🔄 Copiando...' : '🔗 Compartilhar'}
                </Button>
              </div>

              {/* backend não manda contact ainda, então mostra só se existir */}
              {property?.contact ? (
                <div className={styles.realtorInfo}>
                  <div className={styles.realtorName}>{property.contact.realtor}</div>
                  <div className={styles.realtorPhone}>{property.contact.phone}</div>
                  <div className={styles.realtorEmail}>{property.contact.email}</div>
                </div>
              ) : null}
            </div>
          </div>

          {/* Divider */}
          <div className={styles.divider}></div>

          {/* Descrição */}
          <div className={styles.descriptionSection}>
            <h3 className={styles.subsectionTitle}>Descrição</h3>
            <div className={styles.description}>
              {String(property.description || '')
                .split('\n')
                .map((paragraph, index) => (
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
                {safeFeatures.length === 0 ? (
                  <div className={styles.feature}>
                    <span className={styles.featureText}>-</span>
                  </div>
                ) : (
                  safeFeatures.map((feature, index) => (
                    <div key={index} className={styles.feature}>
                      <span className={styles.featureIcon}>✓</span>
                      <span className={styles.featureText}>{feature}</span>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className={styles.additionalSection}>
              <h3 className={styles.subsectionTitle}>Informações Adicionais</h3>
              <div className={styles.additionalInfoGrid}>
                {safeAdditionalInfo ? (
                  <>
                    <div className={styles.additionalInfoItem}>
                      <span className={styles.additionalInfoLabel}>Ano de Construção</span>
                      <span className={styles.additionalInfoValue}>{safeAdditionalInfo.yearBuilt}</span>
                    </div>
                    <div className={styles.additionalInfoItem}>
                      <span className={styles.additionalInfoLabel}>Andar</span>
                      <span className={styles.additionalInfoValue}>{safeAdditionalInfo.floor || 'Térreo'}</span>
                    </div>
                    <div className={styles.additionalInfoItem}>
                      <span className={styles.additionalInfoLabel}>Condomínio</span>
                      <span className={styles.additionalInfoValue}>
                        {formatPriceBRL(safeAdditionalInfo.condominiumFee)}/mês
                      </span>
                    </div>
                    <div className={styles.additionalInfoItem}>
                      <span className={styles.additionalInfoLabel}>IPTU</span>
                      <span className={styles.additionalInfoValue}>
                        {formatPriceBRL(safeAdditionalInfo.iptu)}/ano
                      </span>
                    </div>
                  </>
                ) : (
                  <div className={styles.additionalInfoItem}>
                    <span className={styles.additionalInfoLabel}>—</span>
                    <span className={styles.additionalInfoValue}>Sem informações adicionais.</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className={styles.divider}></div>

          {/* Locais próximos */}
          <div className={styles.nearbySection}>
            <h3 className={styles.subsectionTitle}>Locais Próximos</h3>
            <div className={styles.nearbyList}>
              {safeNearbyPlaces.length === 0 ? (
                <div className={styles.nearbyItem}>
                  <span className={styles.nearbyName}>Sem dados de locais próximos.</span>
                </div>
              ) : (
                safeNearbyPlaces.map((place, index) => (
                  <div key={index} className={styles.nearbyItem}>
                    <span className={styles.nearbyName}>{place.name}</span>
                    <span className={styles.nearbyDistance}>{place.distance}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </Card>
      </div>

      {/* Modal de Chat */}
      <Modal
        open={isChatModalOpen}
        title="Falar com Corretor"
        onClose={() => setIsChatModalOpen(false)}
        actions={
          <>
            <Button variant="outline" onClick={() => setIsChatModalOpen(false)}>
              Cancelar
            </Button>
            <Button
              onClick={() => {
                setIsChatModalOpen(false);
                navigate('/messages');
              }}
            >
              Ir para o Chat
            </Button>
          </>
        }
      >
        <div className={styles.chatModalContent}>
          <p>Você está iniciando uma conversa sobre o imóvel:</p>
          <div className={styles.chatPropertyInfo}>
            <strong>{property.title}</strong>
            <div>{formatPriceBRL(property.price)}</div>
            {locationText ? <div>{locationText}</div> : null}
          </div>
          <p>Clique em "Ir para o Chat" para falar diretamente com um corretor.</p>
        </div>
      </Modal>

      {/* Modal de Agendamento */}
      <Modal
        open={isVisitModalOpen}
        title="Agendar Visita"
        onClose={() => setIsVisitModalOpen(false)}
        actions={
          <>
            <Button variant="outline" onClick={() => setIsVisitModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleConfirmVisit}>
              Confirmar pelo WhatsApp
            </Button>
          </>
        }
      >
        <div className={styles.chatModalContent}>
          <p>Imóvel: <strong>{property.title}</strong></p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 12 }}>
            <label style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: 14 }}>
              Seu nome *
              <input
                type="text"
                value={visitName}
                onChange={e => setVisitName(e.target.value)}
                placeholder="Digite seu nome"
                style={{ padding: '8px 12px', borderRadius: 6, border: '1px solid #e2e8f0', fontSize: 14 }}
              />
            </label>
            <label style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: 14 }}>
              Seu telefone *
              <input
                type="tel"
                value={visitPhone}
                onChange={e => setVisitPhone(e.target.value)}
                placeholder="(11) 99999-9999"
                style={{ padding: '8px 12px', borderRadius: 6, border: '1px solid #e2e8f0', fontSize: 14 }}
              />
            </label>
            <label style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: 14 }}>
              Data preferida *
              <input
                type="date"
                value={visitDate}
                onChange={e => setVisitDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                style={{ padding: '8px 12px', borderRadius: 6, border: '1px solid #e2e8f0', fontSize: 14 }}
              />
            </label>
            <label style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: 14 }}>
              Horário preferido
              <input
                type="time"
                value={visitTime}
                onChange={e => setVisitTime(e.target.value)}
                style={{ padding: '8px 12px', borderRadius: 6, border: '1px solid #e2e8f0', fontSize: 14 }}
              />
            </label>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default PropertyDetail;
