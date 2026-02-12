// src/pages/Favorites.jsx
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { favoritesMock } from '../mocks/favoritesMock.jsx'
import { Button, Card, Modal, StatusTag, useToast } from '../components/ui/index.js'
import { useI18n } from '../i18n/index.jsx'

// TODO - Substituir dados mockados futuramente pela API
// TODO - Persistir favoritos no backend
// TODO - Integrar atalho de contato com chat

export default function Favorites() {
  const { toast } = useToast()
  const navigate = useNavigate()
  const { t } = useI18n()

  const [favorites, setFavorites] = useState(favoritesMock)

  const [contactOpen, setContactOpen] = useState(false)
  const [selected, setSelected] = useState(null)

  const total = useMemo(() => favorites.length, [favorites])

  const handleContact = (property) => {
    setSelected(property)
    setContactOpen(true)
  }

  const handleRemove = (id) => {
    setFavorites((prev) => prev.filter((p) => p.id !== id))
    toast({ type: 'success', message: t('favorites.toast.removed') })
  }

  const goToProperties = () => {
    navigate('/imoveis')
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
          {favorites.map((p) => (
            <Card key={p.id} className="fav-card" variant="flat">
              <div className="fav-cover">
                <div className="fav-cover-placeholder" />
                <StatusPill status={p.status} />
              </div>

              <div className="fav-content">
                <div className="fav-top">
                  <div>
                    {/* título e infos do imóvel vêm do mock/API, não traduz */}
                    <div className="fav-title">{p.title}</div>
                    <div className="fav-sub">{p.location}</div>
                  </div>

                  <div className="fav-id">{p.id}</div>
                </div>

                <div className="fav-price">{p.price}</div>

                <div className="fav-actions">
                  <Button variant="outline" onClick={() => handleRemove(p.id)}>
                    {t('favorites.actions.remove')}
                  </Button>

                  <Button onClick={() => handleContact(p)}>{t('favorites.actions.contactAgent')}</Button>
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
            <div className="fav-sub">{selected?.location}</div>
            <div className="fav-price">{selected?.price}</div>
          </div>

          <p className="muted" style={{ marginTop: 10 }}>
            {t('favorites.modal.footnote')}
          </p>
        </div>
      </Modal>
    </div>
  )
}

function StatusPill({ status }) {
  const { t } = useI18n()

  // mock mantém PT: "Ativo" | "Reservado" | "Inativo"
  const dsStatus = status === 'Ativo' ? 'active' : status === 'Reservado' ? 'pending' : 'inactive'

  const label =
    status === 'Ativo'
      ? t('favorites.status.active')
      : status === 'Reservado'
        ? t('favorites.status.reserved')
        : t('favorites.status.inactive')

  return (
    <StatusTag status={dsStatus} className="fav-badge">
      {label}
    </StatusTag>
  )
}
