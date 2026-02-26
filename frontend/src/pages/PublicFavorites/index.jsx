import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Card, Button, useToast } from '../../components/ui/index.js'
import { getPublicFavorites } from '../../services/favoritesService.js'
import { useI18n } from '../../i18n/index.jsx'
import styles from './styles.module.css'

export default function PublicFavorites() {
  const { token } = useParams()
  const { toast } = useToast()
  const { t } = useI18n()
  
  const [favorites, setFavorites] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchPublicFavorites = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await getPublicFavorites(token)
        setFavorites(data)
      } catch (err) {
        setError(err.message)
        toast({ type: 'error', message: 'Erro ao carregar favoritos públicos' })
      } finally {
        setLoading(false)
      }
    }

    if (token) {
      fetchPublicFavorites()
    }
  }, [token, toast])

  if (loading) {
    return (
      <div className={styles.page}>
        <div className={styles.container}>
          <div className={styles.header}>
            <h1 className={styles.title}>Carregando favoritos...</h1>
          </div>
          <div className={styles.loading}>Carregando imóveis compartilhados...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={styles.page}>
        <div className={styles.container}>
          <div className={styles.header}>
            <h1 className={styles.title}>Link Inválido</h1>
            <p className={styles.subtitle}>O link de compartilhamento não foi encontrado ou expirou.</p>
          </div>
          <div className={styles.error}>
            <p>Erro: {error}</p>
            <Link to="/" className={styles.homeLink}>
              <Button variant="outline">Voltar para a página inicial</Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (favorites.length === 0) {
    return (
      <div className={styles.page}>
        <div className={styles.container}>
          <div className={styles.header}>
            <h1 className={styles.title}>Nenhum imóvel encontrado</h1>
            <p className={styles.subtitle}>Este link não possui imóveis para exibir.</p>
          </div>
          <div className={styles.empty}>
            <Link to="/" className={styles.homeLink}>
              <Button>Voltar para a página inicial</Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>Imóveis Compartilhados</h1>
          <p className={styles.subtitle}>
            {favorites.length} imóvel{favorites.length > 1 ? 's' : ''} selecionado{favorites.length > 1 ? 's' : ''} para você
          </p>
        </div>
        
        <div className={styles.grid}>
          {favorites.map((property) => (
            <div key={property.id} className={styles.propertyCard}>
              {property.images?.[0] && (
                <div className={styles.imageContainer}>
                  <img
                    src={property.images[0].image_url}
                    alt={property.title}
                    className={styles.image}
                  />
                </div>
              )}
              
              <div className={styles.content}>
                <h2 className={styles.propertyTitle}>{property.title}</h2>
                <p className={styles.propertyDescription}>
                  {property.description}
                </p>
                
                <div className={styles.propertyInfo}>
                  <span className={styles.price}>
                    R$ {property.price.toLocaleString('pt-BR')}
                  </span>
                  <span className={styles.location}>
                    📍 {property.city}
                  </span>
                </div>
                
                <div className={styles.propertyDetails}>
                  <span>🛏️ {property.bedrooms} quartos</span>
                  <span>🚿 {property.bathrooms} banheiros</span>
                  <span>📐 {property.area}m²</span>
                  {property.parking_spaces > 0 && (
                    <span>🚗 {property.parking_spaces} vaga{property.parking_spaces > 1 ? 's' : ''}</span>
                  )}
                  {property.has_pool && (
                    <span>🏊 Piscina</span>
                  )}
                  {property.has_garden && (
                    <span>🌳 Jardim</span>
                  )}
                  {property.furnished && (
                    <span>🪑 Mobiliado</span>
                  )}
                </div>
                
                <div className={styles.status}>
                  <span className={`${styles.statusBadge} ${styles[property.status]}`}>
                    {property.status === 'AVAILABLE' && 'Disponível'}
                    {property.status === 'SOLD' && 'Vendido'}
                    {property.status === 'RESERVED' && 'Reservado'}
                  </span>
                </div>
                
                <div className={styles.actions}>
                  <Link to="/" className={styles.contactLink}>
                    <Button>
                      Entrar em contato
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className={styles.footer}>
          <p className={styles.footerText}>
            Compartilhado através da Imobiliária Artificiall
          </p>
          <Link to="/" className={styles.homeLink}>
            <Button variant="outline">
              Ver mais imóveis
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
