import React from 'react';
import styles from './styles.module.css';

const WhatsAppShare = ({ property }) => {
  if (!property) return null;

  const shareUrl = `${window.location.origin}/imoveis/${property.id}`;
  const shareText = `Olha esse imóvel que encontrei: ${property.title}\n\n💰 ${property.price ? `R$ ${Number(property.price).toLocaleString('pt-BR')}` : 'Preço sob consulta'}\n🏠 ${property.bedrooms || 0} quartos • ${property.bathrooms || 0} banheiros\n📍 ${property.city || ''}\n\n${shareUrl}`;
  
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;

  const handleShare = () => {
    // Abrir WhatsApp em nova janela
    window.open(whatsappUrl, '_blank', 'width=600,height=600');
  };

  return (
    <div className={styles.shareContainer}>
      <button
        onClick={handleShare}
        className={styles.whatsappButton}
        title="Compartilhar no WhatsApp"
      >
        <span className={styles.whatsappIcon}>📱</span>
        <span className={styles.buttonText}>Compartilhar</span>
      </button>
    </div>
  );
};

export default WhatsAppShare;
