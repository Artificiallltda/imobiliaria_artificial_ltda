// src/pages/Leads.jsx
import { useMemo, useState } from 'react'
import { leadsMock } from '../mocks/leadsMock.jsx'
import StatusTag from '../components/ui/Leads/StatusTag.jsx'
import { useI18n } from '../i18n/index.jsx'

// mock mantém PT para bater com leadsMock.status
const STATUS_VALUES = ['Todos', 'Novo', 'Em contato', 'Convertido', 'Perdido']

export default function Leads() {
  const { t } = useI18n()

  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('Todos')

  // TODO - Substituir dados mockados futuramente pela API
  const leads = leadsMock

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()

    return leads.filter((lead) => {
      const matchText =
        !q || lead.nome?.toLowerCase().includes(q) || lead.email?.toLowerCase().includes(q)

      const matchStatus = status === 'Todos' || lead.status === status

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
      {/* Cabeçalho */}
      <div className="leads-header">
        <div>
          <h2>{t('leads.title')}</h2>
          <p className="muted">{t('leads.subtitle')}</p>
        </div>

        <span className="results-pill">{t('leads.resultsPill', { count: filtered.length })}</span>
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
              {filtered.map((lead) => (
                <tr key={lead.id}>
                  <td className="lead-name">
                    <div className="lead-primary">{lead.nome}</div>
                    <div className="lead-secondary">{lead.id}</div>
                  </td>

                  <td>{lead.email}</td>
                  <td>{lead.telefone}</td>

                  <td>
                    <StatusTag status={lead.status}>{statusLabel(lead.status)}</StatusTag>
                  </td>

                  <td>{formatDateBR(lead.criadoEm)}</td>
                </tr>
              ))}

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
        {filtered.map((lead) => (
          <div key={lead.id} className="lead-card">
            <div className="lead-card-top">
              <div>
                <div className="lead-primary">{lead.nome}</div>
                <div className="lead-secondary">{lead.email}</div>
              </div>

              <StatusTag status={lead.status}>{statusLabel(lead.status)}</StatusTag>
            </div>

            <div className="lead-card-row">
              <span className="lead-k">{t('leads.mobile.phone')}</span>
              <span className="lead-v">{lead.telefone}</span>
            </div>

            <div className="lead-card-row">
              <span className="lead-k">{t('leads.mobile.createdAt')}</span>
              <span className="lead-v">{formatDateBR(lead.criadoEm)}</span>
            </div>

            <div className="lead-card-row">
              <span className="lead-k">{t('leads.mobile.id')}</span>
              <span className="lead-v">{lead.id}</span>
            </div>
          </div>
        ))}
      </section>
    </div>
  )
}

function formatDateBR(iso) {
  // YYYY-MM-DD -> DD/MM/YYYY
  const [y, m, d] = iso.split('-')
  return `${d}/${m}/${y}`
}
