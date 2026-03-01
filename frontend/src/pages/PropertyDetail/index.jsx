import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Button, StatusTag, Modal, useToast } from '../../components/ui/index.js';
import Gallery from '../../components/Properties/Gallery/index.jsx';
import styles from './styles.module.css';
import { useI18n } from '../../i18n/index.jsx';

import { getPropertyById } from '../../services/propertiesService';
import { addFavorite, removeFavorite, checkFavorite, generatePublicLink } from '../../services/favoritesService';
import { formatPriceBRL, getStatusLabel, getStatusTone } from '../../utils/propertyUtils';

const PropertyDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useI18n();
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
      toast({ type: 'error', message: t('propertyDetail.visit.missingFields') });
      return;
    }
    const msg = encodeURIComponent(
      `${t('propertyDetail.visit.property')}: "${property.title}"\n` +
      `${t('propertyDetail.visit.date')}: ${visitDate} - ${visitTime}\n` +
      `${t('propertyDetail.visit.name')}: ${visitName}\n` +
      `${t('propertyDetail.visit.phone')}: ${visitPhone}`
    );
    window.open(`https://wa.me/?text=${msg}`, '_blank');
    setIsVisitModalOpen(false);
    toast({ type: 'success', message: t('propertyDetail.visit.successMessage') });
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
          message: t('propertyDetail.toast.favoriteRemoved'),
        });
      } else {
        const result = await addFavorite(id);
        setIsFavorited(true);
        setFavoriteId(result.id);
        toast({
          type: 'success',
          message: t('propertyDetail.toast.favoriteAdded'),
        });
      }
    } catch (err) {
      console.error('[Favorito] Erro:', err?.status, err?.message, err);
      if (err.status === 409) {
        setIsFavorited(true);
        toast({ type: 'info', message: t('propertyDetail.toast.alreadyFavorited') });
      } else if (err.status === 401 || err.status === 403) {
        toast({ type: 'error', message: t('propertyDetail.toast.loginRequired') });
        setTimeout(() => navigate('/login'), 1500);
      } else {
        toast({ type: 'error', message: t('propertyDetail.toast.favoriteError') });
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
      toast({ type: 'success', message: t('propertyDetail.toast.linkCopied') });
    } catch (err) {
      try {
        await navigator.clipboard.writeText(window.location.href);
        toast({ type: 'success', message: t('propertyDetail.toast.linkCopiedShort') });
      } catch {
        toast({ type: 'error', message: t('propertyDetail.toast.linkError') });
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
      alt: property?.title ? t('propertyDetail.imageAlt', { title: property.title }) : t('propertyDetail.imageAltDefault'),
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
        <p>{t('propertyDetail.loading')}</p>
      </div>
    );
  }

  if (error === "NOT_FOUND") {
    return (
      <div className={styles.error}>
        <h2>{t('propertyDetail.notFound.title')}</h2>
        <p>{t('propertyDetail.notFound.description')}</p>
        <Button onClick={() => navigate('/properties')}>
          {t('propertyDetail.notFound.back')}
        </Button>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.error}>
        <h2>{t('propertyDetail.error.title')}</h2>
        <p>{t('propertyDetail.error.description')}</p>
        <Button onClick={() => navigate('/properties')}>
          {t('propertyDetail.error.back')}
        </Button>
      </div>
    );
  }

  if (!property) {
    return (
      <div className={styles.error}>
        <h2>{t('propertyDetail.notFound.title')}</h2>
        <p>{t('propertyDetail.notFound.description')}</p>
        <Button onClick={() => navigate('/properties')}>
          {t('propertyDetail.notFound.back')}
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
              <h2 className={styles.sectionTitle}>{t('propertyDetail.sectionTitle')}</h2>

              <div className={styles.infoGrid}>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>{t('propertyDetail.info.totalArea')}</span>
                  <span className={styles.infoValue}>{property.area}m²</span>
                </div>

                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>{t('propertyDetail.info.usableArea')}</span>
                  <span className={styles.infoValue}>
                    {usableArea ? `${usableArea}m²` : '-'}
                  </span>
                </div>

                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>{t('propertyDetail.info.bedrooms')}</span>
                  <span className={styles.infoValue}>{property.bedrooms}</span>
                </div>

                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>{t('propertyDetail.info.suites')}</span>
                  <span className={styles.infoValue}>{suites}</span>
                </div>

                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>{t('propertyDetail.info.bathrooms')}</span>
                  <span className={styles.infoValue}>{property.bathrooms}</span>
                </div>

                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>{t('propertyDetail.info.parkingSpaces')}</span>
                  <span className={styles.infoValue}>{parkingSpaces}</span>
                </div>
              </div>

              <div className={styles.infoGrid} style={{ marginTop: 12 }}>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>{t('propertyDetail.info.pool')}</span>
                  <span className={styles.infoValue}>{property.has_pool ? t('propertyDetail.info.yes') : t('propertyDetail.info.no')}</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>{t('propertyDetail.info.garden')}</span>
                  <span className={styles.infoValue}>{property.has_garden ? t('propertyDetail.info.yes') : t('propertyDetail.info.no')}</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>{t('propertyDetail.info.furnished')}</span>
                  <span className={styles.infoValue}>{property.furnished ? t('propertyDetail.info.yes') : t('propertyDetail.info.no')}</span>
                </div>
              </div>
            </div>

            {/* Sidebar de contato integrada */}
            <div className={styles.contactSidebar}>
              <h3 className={styles.contactTitle}>{t('propertyDetail.contact.title')}</h3>
              <p className={styles.contactDescription}>
                {t('propertyDetail.contact.description')}
              </p>

              <div className={styles.contactButtons}>
                <Button className={styles.primaryButton} onClick={handleContactRealtor}>
                  {t('propertyDetail.contact.talkToAgent')}
                </Button>

                <Button variant="outline" className={styles.secondaryButton} onClick={handleScheduleVisit}>
                  {t('propertyDetail.contact.scheduleVisit')}
                </Button>

                <Button variant="outline" className={styles.whatsappButton} onClick={handleWhatsApp}>
                  📱 {t('propertyDetail.contact.whatsapp')}
                </Button>

                <Button
                  variant="outline"
                  className={styles.favoriteButton}
                  onClick={handleToggleFavorite}
                  disabled={isLoadingFavorite}
                  title={isFavorited ? t('propertyDetail.contact.removeFavoriteTitle') : t('propertyDetail.contact.addFavoriteTitle')}
                >
                  {isFavorited ? '❤️' : '🤍'} {isFavorited ? t('propertyDetail.contact.favorited') : t('propertyDetail.contact.favorite')}
                </Button>

                <Button
                  variant="outline"
                  className={styles.shareButton}
                  onClick={handleShareFavorite}
                  disabled={isSharing}
                  title={t('propertyDetail.contact.shareTitle')}
                >
                  {isSharing ? `🔄 ${t('propertyDetail.contact.sharing')}` : `🔗 ${t('propertyDetail.contact.share')}`}
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
            <h3 className={styles.subsectionTitle}>{t('propertyDetail.description')}</h3>
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
              <h3 className={styles.subsectionTitle}>{t('propertyDetail.features')}</h3>
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
              <h3 className={styles.subsectionTitle}>{t('propertyDetail.additionalInfo.title')}</h3>
              <div className={styles.additionalInfoGrid}>
                {safeAdditionalInfo ? (
                  <>
                    <div className={styles.additionalInfoItem}>
                      <span className={styles.additionalInfoLabel}>{t('propertyDetail.additionalInfo.yearBuilt')}</span>
                      <span className={styles.additionalInfoValue}>{safeAdditionalInfo.yearBuilt}</span>
                    </div>
                    <div className={styles.additionalInfoItem}>
                      <span className={styles.additionalInfoLabel}>{t('propertyDetail.additionalInfo.floor')}</span>
                      <span className={styles.additionalInfoValue}>{safeAdditionalInfo.floor || t('propertyDetail.additionalInfo.ground')}</span>
                    </div>
                    <div className={styles.additionalInfoItem}>
                      <span className={styles.additionalInfoLabel}>{t('propertyDetail.additionalInfo.condo')}</span>
                      <span className={styles.additionalInfoValue}>
                        {formatPriceBRL(safeAdditionalInfo.condominiumFee)}{t('propertyDetail.additionalInfo.perMonth')}
                      </span>
                    </div>
                    <div className={styles.additionalInfoItem}>
                      <span className={styles.additionalInfoLabel}>{t('propertyDetail.additionalInfo.iptu')}</span>
                      <span className={styles.additionalInfoValue}>
                        {formatPriceBRL(safeAdditionalInfo.iptu)}{t('propertyDetail.additionalInfo.perYear')}
                      </span>
                    </div>
                  </>
                ) : (
                  <div className={styles.additionalInfoItem}>
                    <span className={styles.additionalInfoLabel}>—</span>
                    <span className={styles.additionalInfoValue}>{t('propertyDetail.additionalInfo.none')}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className={styles.divider}></div>

          {/* Locais próximos */}
          <div className={styles.nearbySection}>
            <h3 className={styles.subsectionTitle}>{t('propertyDetail.nearbyPlaces.title')}</h3>
            <div className={styles.nearbyList}>
              {safeNearbyPlaces.length === 0 ? (
                <div className={styles.nearbyItem}>
                  <span className={styles.nearbyName}>{t('propertyDetail.nearbyPlaces.none')}</span>
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

      <Modal
        open={isChatModalOpen}
        title={t('propertyDetail.chat.title')}
        onClose={() => setIsChatModalOpen(false)}
        actions={
          <>
            <Button variant="outline" onClick={() => setIsChatModalOpen(false)}>
              {t('propertyDetail.chat.cancel')}
            </Button>
            <Button onClick={() => { setIsChatModalOpen(false); navigate('/mensagens'); }}>
              {t('propertyDetail.chat.goToChat')}
            </Button>
          </>
        }
      >
        <div className={styles.chatModalContent}>
          <p>{t('propertyDetail.chat.about')}</p>
          <div className={styles.chatPropertyInfo}>
            <strong>{property.title}</strong>
            <div>{formatPriceBRL(property.price)}</div>
            {locationText ? <div>{locationText}</div> : null}
          </div>
        </div>
      </Modal>

      <Modal
        open={isVisitModalOpen}
        title={t('propertyDetail.visit.title')}
        onClose={() => setIsVisitModalOpen(false)}
        actions={
          <>
            <Button variant="outline" onClick={() => setIsVisitModalOpen(false)}>
              {t('propertyDetail.visit.cancel')}
            </Button>
            <Button onClick={handleConfirmVisit}>
              {t('propertyDetail.visit.confirm')}
            </Button>
          </>
        }
      >
        <div className={styles.chatModalContent}>
          <p>{t('propertyDetail.visit.property')}: <strong>{property.title}</strong></p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 12 }}>
            <label style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: 14 }}>
              {t('propertyDetail.visit.name')}
              <input type="text" value={visitName} onChange={e => setVisitName(e.target.value)}
                placeholder={t('propertyDetail.visit.namePlaceholder')}
                style={{ padding: '8px 12px', borderRadius: 6, border: '1px solid #e2e8f0', fontSize: 14 }} />
            </label>
            <label style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: 14 }}>
              {t('propertyDetail.visit.phone')}
              <input type="tel" value={visitPhone} onChange={e => setVisitPhone(e.target.value)}
                placeholder={t('propertyDetail.visit.phonePlaceholder')}
                style={{ padding: '8px 12px', borderRadius: 6, border: '1px solid #e2e8f0', fontSize: 14 }} />
            </label>
            <label style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: 14 }}>
              {t('propertyDetail.visit.date')}
              <input type="date" value={visitDate} onChange={e => setVisitDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                style={{ padding: '8px 12px', borderRadius: 6, border: '1px solid #e2e8f0', fontSize: 14 }} />
            </label>
            <label style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: 14 }}>
              {t('propertyDetail.visit.time')}
              <input type="time" value={visitTime} onChange={e => setVisitTime(e.target.value)}
                style={{ padding: '8px 12px', borderRadius: 6, border: '1px solid #e2e8f0', fontSize: 14 }} />
            </label>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default PropertyDetail;
