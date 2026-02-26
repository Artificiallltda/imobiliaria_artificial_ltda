import { useEffect, useState } from 'react'
import { Card, Button, useToast } from '../ui/index.js'
import { getLeadFavorites, addFavorite, removeFavorite } from '../../services/favoritesService.js'
import { useI18n } from '../../i18n/index.jsx'
import styles from './styles.module.css'

export default function LeadFavorites({ leadId }) {
  const { toast } = useToast()
  const { t } = useI18n()
  
  const [favorites, setFavorites] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await getLeadFavorites(leadId)
        setFavorites(data)
      } catch (err) {
        setError(err.message)
        toast({ type: 'error', message: 'Erro ao carregar favoritos do lead' })
      } finally {
        setLoading(false)
      }
    }

    if (leadId) {
      fetchFavorites()
    }
  }, [leadId, toast])

  const handleRemoveFavorite = async (propertyId) => {
    try {
      await removeFavorite(propertyId)
      setFavorites(prev => prev.filter(fav => fav.property_id !== propertyId))
      toast({ type: 'success', message: 'Imóvel removido dos favoritos' })
    } catch (err) {
      toast({ type: 'error', message: 'Erro ao remover favorito' })
    }
  }

  if (loading) {
    return (
      <Card className={styles.card}>
        <div className={styles.header}>
          <h3 className={styles.title}>Imóveis Favoritos deste Cliente</h3>
        </div>
        <div className={styles.loading}>Carregando favoritos...</div>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className={styles.card}>
        <div className={styles.header}>
          <h3 className={styles.title}>Imóveis Favoritos deste Cliente</h3>
        </div>
        <div className={styles.error}>Erro: {error}</div>
      </Card>
    )
  }

  if (favorites.length === 0) {
    return (
      <Card className={styles.card}>
        <div className={styles.header}>
          <h3 className={styles.title}>Imóveis Favoritos deste Cliente</h3>
        </div>
        <div className={styles.empty}>
          <p>Este lead ainda não possui imóveis favoritos.</p>
          <p className={styles.emptyHint}>
            Ao adicionar imóveis como favorito para este cliente, eles aparecerão aqui.
          </p>
        </div>
      </Card>
    )
  }

  return (
    <Card className={styles.card}>
      <div className={styles.header}>
        <h3 className={styles.title}>
          Imóveis Favoritos deste Cliente ({favorites.length})
        </h3>
      </div>
      
      <div className={styles.grid}>
        {favorites.map((favorite) => (
          <div key={favorite.id} className={styles.propertyCard}>
            {favorite.property.images?.[0] && (
              <div className={styles.imageContainer}>
                <img
                  src={favorite.property.images[0].image_url}
                  alt={favorite.property.title}
                  className={styles.image}
                />
              </div>
            )}
            
            <div className={styles.content}>
              <h4 className={styles.propertyTitle}>{favorite.property.title}</h4>
              <p className={styles.propertyDescription}>
                {favorite.property.description}
              </p>
              
              <div className={styles.propertyInfo}>
                <span className={styles.price}>
                  R$ {favorite.property.price.toLocaleString('pt-BR')}
                </span>
                <span className={styles.location}>
                  {favorite.property.city}
                </span>
              </div>
              
              <div className={styles.propertyDetails}>
                <span>{favorite.property.bedrooms} quartos</span>
                <span>{favorite.property.bathrooms} banheiros</span>
                <span>{favorite.property.area}m²</span>
                {favorite.property.parking_spaces > 0 && (
                  <span>{favorite.property.parking_spaces} vagas</span>
                )}
              </div>
              
              <div className={styles.actions}>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleRemoveFavorite(favorite.property_id)}
                >
                  Remover dos Favoritos
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
