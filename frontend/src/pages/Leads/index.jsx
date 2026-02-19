import { useEffect, useMemo, useState } from 'react'
import { Button, StatusTag } from '../../components/ui/index.js'
import { useI18n } from '../../i18n/index.jsx'
import { useNavigate } from 'react-router-dom'
import { getLeads } from '../../services/leadsService.js'

function mapStatusToDisplay(backendStatus) {
  switch (backendStatus) {
    case 'NEW':
      return 'pending'
    case 'QUALIFYING':
      return 'inService'
    case 'QUALIFIED':
      return 'converted'
    case 'LOST':
      return 'lost'
    default:
      return 'pending'
  }
}

export default function Leads() {
  const { t } = useI18n()
  const navigate = useNavigate()

  const [leads, setLeads] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await getLeads()
        setLeads(data)
      } catch (err) {
        setError(err.message)
        console.error('Erro ao carregar leads:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchLeads()
  }, [])

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

  if (loading) {
    return (
      <div className="page">
        <h2>{t('leads.title')}</h2>
        <p>Carregando leads...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="page">
        <h2>{t('leads.title')}</h2>
        <p>Erro ao carregar leads: {error}</p>
      </div>
    )
  }

  return (
    <div className="page">
      <h2>{t('leads.title')}</h2>
      <p className="muted">{t('leads.subtitle')}</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 14 }}>
        {leads.map((lead) => {
          const displayStatus = mapStatusToDisplay(lead.status)
          return (
            <div
              key={lead.id}
              className="property-card"
              style={{ padding: 16, display: 'flex', justifyContent: 'space-between', gap: 14 }}
            >
              <div style={{ minWidth: 0 }}>
                <div style={{ fontWeight: 800, fontSize: 16 }}>{lead.name}</div>
                <div className="muted" style={{ fontSize: 13 }}>{lead.email}</div>
                <div className="muted" style={{ fontSize: 13 }}>
                  {t('leads.list.createdAt', { date: lead.created_at.split('T')[0].split('-').reverse().join('/') })}
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
                <StatusTag status={statusVariant(displayStatus)}>
                  {statusLabel(displayStatus)}
                </StatusTag>

                <Button variant="outline" onClick={() => navigate(`/leads/${lead.id}`)}>
                  {t('leads.list.viewDetail')}
                </Button>
              </div>
            </div>
          )
        })}

        {leads.length === 0 && (
          <p className="muted">Nenhum lead encontrado.</p>
        )}
      </div>
    </div>
  )
}
