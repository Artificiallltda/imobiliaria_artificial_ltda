import { useMemo } from 'react'
import { Button, StatusTag } from '../../components/ui/index.js'
import { useI18n } from '../../i18n/index.jsx'
import { useNavigate } from 'react-router-dom'

export default function Leads() {
  const { t } = useI18n()
  const navigate = useNavigate()

  // Mock (mantém seu layout atual)
  const items = useMemo(
    () => [
      {
        id: '1',
        name: 'Gean Carlos',
        email: 'gean.carlos@exemplo.com',
        createdAt: '07/02/2026',
        status: 'pending',
      },
      {
        id: '2',
        name: 'Deborah Victoria',
        email: 'deborah.victoria@exemplo.com',
        createdAt: '06/02/2026',
        status: 'inService',
      },
    ],
    [],
  )

  const statusLabel = (status) => {
    switch (status) {
      case 'pending':
        return t('leads.status.pending')
      case 'inService':
        return t('leads.status.inService')
      case 'converted':
        return t('leads.status.converted')
      case 'lost':
        return t('leads.status.lost')
      default:
        return status
    }
  }

  // Mantém as cores do StatusTag que você já tem (active/warning/etc)
  const statusVariant = (status) => {
    switch (status) {
      case 'pending':
        return 'warning'
      case 'inService':
        return 'active'
      case 'converted':
        return 'success'
      case 'lost':
        return 'inactive'
      default:
        return 'active'
    }
  }

  return (
    <div className="page">
      <h2>{t('leads.title')}</h2>
      <p className="muted">{t('leads.subtitle')}</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 14 }}>
        {items.map((lead) => (
          <div
            key={lead.id}
            className="property-card"
            style={{ padding: 16, display: 'flex', justifyContent: 'space-between', gap: 14 }}
          >
            <div style={{ minWidth: 0 }}>
              <div style={{ fontWeight: 800, fontSize: 16 }}>{lead.name}</div>
              <div className="muted" style={{ fontSize: 13 }}>{lead.email}</div>
              <div className="muted" style={{ fontSize: 13 }}>
                {t('leads.list.createdAt', { date: lead.createdAt })}
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
              <StatusTag status={statusVariant(lead.status)}>
                {statusLabel(lead.status)}
              </StatusTag>

              <Button variant="outline" onClick={() => navigate(`/leads/${lead.id}`)}>
                {t('leads.list.viewDetail')}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
