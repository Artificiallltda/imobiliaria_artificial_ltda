// src/pages/Favorites.jsx
import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Card, Modal, StatusTag, useToast } from '../components/ui/index.js'
import { useI18n } from '../i18n/index.jsx'
import { getFavorites, removeFavorite } from '../services/favoritesService.js'

export default function Favorites() {
  const { toast } = useToast()
  const navigate = useNavigate()
  const { t } = useI18n()

  const [favorites, setFavorites] = useState([])
  const [loading, setLoading] = useState(true)

  const [contactOpen, setContactOpen] = useState(false)
  const [selected, setSelected] = useState(null)

  // Buscar favoritos da API
  const fetchFavorites = async () => {
    try {
      setLoading(true)
      const data = await getFavorites()
      setFavorites(data)
    } catch (error) {
      if (error.status === 401) {
        toast({ type: 'error', message: 'Sessão expirada. Faça login novamente.' })
        navigate('/login')
      } else {
        toast({ type: 'error', message: 'Erro ao carregar favoritos.' })
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchFavorites()
  }, [navigate, toast])

  // Recarregar quando a página ganha foco (volta de outra página)
  useEffect(() => {
    const handleFocus = () => {
      fetchFavorites()
    }

    window.addEventListener('focus', handleFocus)
    return () => window.removeEventListener('focus', handleFocus)
  }, [])

  const total = useMemo(() => favorites.length, [favorites])

  const handleContact = (property) => {
    setSelected(property)
    setContactOpen(true)
  }

  const handleRemove = async (propertyId) => {
    try {
      await removeFavorite(propertyId)
      setFavorites((prev) => prev.filter((f) => f.property_id !== propertyId))
      toast({ type: 'success', message: t('favorites.toast.removed') })
    } catch (error) {
      toast({ type: 'error', message: 'Erro ao remover favorito.' })
    }
  }

  const goToProperties = () => {
    navigate('/imoveis')
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price)
  }

  const getStatusLabel = (status) => {
    const statusMap = {
      'AVAILABLE': 'Ativo',
      'SOLD': 'Vendido',
      'RESERVED': 'Reservado'
    }
    return statusMap[status] || status
  }

  const getStatusTone = (status) => {
    switch (status) {
      case 'AVAILABLE': return 'active'
      case 'RESERVED': return 'pending'
      case 'SOLD': return 'inactive'
      default: return 'inactive'
    }
  }

  if (loading) {
    return (
      <div className="page">
        <div className="favorites-header">
          <h2>{t('favorites.title')}</h2>
        </div>
        <Card className="favorites-empty" variant="flat">
          <p className="muted">Carregando favoritos...</p>
        </Card>
      </div>
    )
  }

  return (
    <div className="page">
      <div className="favorites-header">
        <div>
          <h2>{t('favorites.title')}</h2>
          <p className="muted">{t('favorites.subtitle')}</p>
        </div>

        <span className="results-pill">{t('favorites.resultsPill', { count: total })}</span>
      </div>

      {favorites.length === 0 ? (
        <Card className="favorites-empty" variant="flat">
          <h3>{t('favorites.empty.title')}</h3>
          <p className="muted">{t('favorites.empty.subtitle')}</p>

          <div className="favorites-empty-actions">
            <Button onClick={goToProperties}>{t('favorites.empty.action')}</Button>
          </div>
        </Card>
      ) : (
        <div className="favorites-grid">
          {favorites.map((fav) => (
            <Card key={fav.id} className="fav-card" variant="flat">
              <div className="fav-cover">
                <div className="fav-cover-placeholder" />
                <StatusPill status={fav.property.status} getStatusLabel={getStatusLabel} getStatusTone={getStatusTone} t={t} />
              </div>

              <div className="fav-content">
                <div className="fav-top">
                  <div>
                    <div className="fav-title">{fav.property.title}</div>
                    <div className="fav-sub">{fav.property.city}</div>
                  </div>
                </div>

                <div className="fav-price">{formatPrice(fav.property.price)}</div>

                <div className="fav-actions">
                  <Button variant="outline" onClick={() => handleRemove(fav.property_id)}>
                    {t('favorites.actions.remove')}
                  </Button>

                  <Button onClick={() => handleContact(fav.property)}>{t('favorites.actions.contactAgent')}</Button>

                  <Button variant="secondary" onClick={() => navigate(`/imoveis/${fav.property_id}`)}>
                    Ver Detalhes
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal
        open={contactOpen}
        title={t('favorites.modal.title')}
        onClose={() => setContactOpen(false)}
        actions={
          <>
            <Button variant="outline" onClick={() => setContactOpen(false)}>
              {t('favorites.modal.close')}
            </Button>
            <Button
              onClick={() => {
                setContactOpen(false)
                toast({
                  type: 'warning',
                  message: t('favorites.toast.contactShortcut'),
                })

                // Se quiser, pode navegar direto para mensagens:
                // navigate("/mensagens");
              }}
            >
              {t('favorites.modal.startChat')}
            </Button>
          </>
        }
      >
        <div className="favorites-modal">
          <p>{t('favorites.modal.intro')}</p>

          <div className="favorites-modal-card">
            <div className="fav-title">{selected?.title}</div>
            <div className="fav-sub">{selected?.city}</div>
            <div className="fav-price">{selected?.price ? formatPrice(selected.price) : ''}</div>
          </div>

          <p className="muted" style={{ marginTop: 10 }}>
            {t('favorites.modal.footnote')}
          </p>
        </div>
      </Modal>
    </div>
  )
}

function StatusPill({ status, getStatusLabel, getStatusTone, t }) {
  const dsStatus = getStatusTone(status)
  const label = getStatusLabel(status)

  return (
    <StatusTag status={dsStatus} className="fav-badge">
      {label}
    </StatusTag>
  )
}
