// src/pages/Leads.jsx
import { useEffect, useMemo, useState } from 'react'
import { getLeads } from '../services/leadsService.js'
import { StatusTag } from '../components/ui/index.js'
import { useI18n } from '../i18n/index.jsx'

// mock mantém PT para bater com leadsMock.status
const STATUS_VALUES = ['Todos', 'Novo', 'Em contato', 'Convertido', 'Perdido']

function mapStatusToDisplay(backendStatus) {
  switch (backendStatus) {
    case 'NEW':
      return 'Novo'
    case 'QUALIFYING':
      return 'Em contato'
    case 'QUALIFIED':
      return 'Convertido'
    case 'LOST':
      return 'Perdido'
    default:
      return backendStatus
  }
}

export default function Leads() {
  const { t } = useI18n()

  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('Todos')
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

  // TODO - Substituir dados mockados futuramente pela API
  // const leads = leadsMock

  const filtered = useMemo(() => {
    if (!leads.length) return []

    const q = query.trim().toLowerCase()

    return leads.filter((lead) => {
      // Map backend status to display
      const displayStatus = mapStatusToDisplay(lead.status)
      
      const matchText =
        !q || lead.name?.toLowerCase().includes(q) || lead.email?.toLowerCase().includes(q)

      const matchStatus = status === 'Todos' || displayStatus === status

      return matchText && matchStatus
    })
  }, [leads, query, status])

  const statusLabel = (s) => {
    switch (s) {
      case 'Todos':
        return t('leads.status.all')
      case 'Novo':
        return t('leads.status.new')
      case 'Em contato':
        return t('leads.status.contacting')
      case 'Convertido':
        return t('leads.status.converted')
      case 'Perdido':
        return t('leads.status.lost')
      default:
        return s
    }
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">{t('leads.title')}</h1>
          <p className="page-desc">{t('leads.description')}</p>
        </div>
      </div>

      {/* Filtros */}
      <section className="panel">
        <div className="leads-controls">
          <div className="control">
            <label>{t('leads.filters.searchLabel')}</label>
            <input
              className="leads-input"
              placeholder={t('leads.filters.searchPlaceholder')}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          <div className="control">
            <label>{t('leads.filters.statusLabel')}</label>
            <select className="leads-select" value={status} onChange={(e) => setStatus(e.target.value)}>
              {STATUS_VALUES.map((opt) => (
                <option key={opt} value={opt}>
                  {statusLabel(opt)}
                </option>
              ))}
            </select>
          </div>

          <button
            className="btn-outline leads-clear"
            type="button"
            onClick={() => {
              setQuery('')
              setStatus('Todos')
            }}
          >
            {t('leads.filters.clear')}
          </button>
        </div>
      </section>

      {loading && (
        <section className="panel">
          <div className="leads-loading">Carregando leads...</div>
        </section>
      )}

      {error && (
        <section className="panel">
          <div className="leads-error">Erro ao carregar leads: {error}</div>
        </section>
      )}

      {!loading && !error && (
        <>
          {/* Desktop: tabela */}
          <section className="panel leads-table-wrap">
            <div className="leads-table-scroll">
              <table className="leads-table">
                <thead>
                  <tr>
                    <th>{t('leads.table.name')}</th>
                    <th>{t('leads.table.email')}</th>
                    <th>{t('leads.table.phone')}</th>
                    <th>{t('leads.table.status')}</th>
                    <th>{t('leads.table.createdAt')}</th>
                  </tr>
                </thead>

                <tbody>
                  {filtered.map((lead) => {
                    const displayStatus = mapStatusToDisplay(lead.status)
                    return (
                      <tr key={lead.id}>
                        <td className="lead-name">
                          <div className="lead-primary">{lead.name}</div>
                          <div className="lead-secondary">{lead.id}</div>
                        </td>

                        <td>{lead.email}</td>
                        <td>{lead.phone || '-'}</td>

                        <td>
                          <StatusTag status={displayStatus.toLowerCase()}>{statusLabel(displayStatus)}</StatusTag>
                        </td>

                        <td>{formatDateBR(lead.created_at.split('T')[0])}</td>
                      </tr>
                    )
                  })}

                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={5} className="leads-empty">
                        {t('leads.table.empty')}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

          {/* Mobile: cards */}
          <section className="leads-cards">
            {filtered.map((lead) => {
              const displayStatus = mapStatusToDisplay(lead.status)
              return (
                <div key={lead.id} className="lead-card">
                  <div className="lead-card-top">
                    <div>
                      <div className="lead-primary">{lead.name}</div>
                      <div className="lead-secondary">{lead.email}</div>
                    </div>

                    <StatusTag status={displayStatus.toLowerCase()}>{statusLabel(displayStatus)}</StatusTag>
                  </div>

                  <div className="lead-card-row">
                    <span className="lead-k">{t('leads.mobile.phone')}</span>
                    <span className="lead-v">{lead.phone || '-'}</span>
                  </div>

                  <div className="lead-card-row">
                    <span className="lead-k">{t('leads.mobile.createdAt')}</span>
                    <span className="lead-v">{formatDateBR(lead.created_at.split('T')[0])}</span>
                  </div>

                  <div className="lead-card-row">
                    <span className="lead-k">{t('leads.mobile.id')}</span>
                    <span className="lead-v">{lead.id}</span>
                  </div>
                </div>
              )
            })}
          </section>
        </>
      )}
    </div>
  )
}

function formatDateBR(iso) {
  // YYYY-MM-DD -> DD/MM/YYYY
  const [y, m, d] = iso.split('-')
  return `${d}/${m}/${y}`
}
