// src/pages/Leads.jsx - UPDATED 1771849897000
import { useEffect, useMemo, useState } from 'react'
import { getLeads } from '../services/leadsService.js'
import { StatusTag } from '../components/ui/index.js'
import { useI18n } from '../i18n/index.jsx'

// FORÇAR REBUILD - Valores atualizados para o MVP - sem dependência de traduções
const STATUS_VALUES = [
  { value: 'Todos', label: 'Todos' },
  { value: 'Novo', label: 'Novo' },
  { value: 'Em Atendimento', label: 'Em Atendimento' },
  { value: 'Proposta Enviada', label: 'Proposta Enviada' },
  { value: 'Fechado', label: 'Fechado' },
  { value: 'Perdido', label: 'Perdido' }
]

// FORÇAR REBUILD - Funções atualizadas
function getStatusTag(status) {
  switch (status.toLowerCase()) {
    case 'novo':
      return 'pending'
    case 'em atendimento':
      return 'active'
    case 'proposta enviada':
      return 'warning'
    case 'fechado':
      return 'success'
    case 'perdido':
      return 'error'
    default:
      return 'inactive'
  }
}

// FORÇAR REBUILD - Função atualizada
function mapStatusToDisplay(backendStatus) {
  switch (backendStatus) {
    case 'novo':
      return 'Novo'
    case 'em_atendimento':
      return 'Em Atendimento'
    case 'proposta_enviada':
      return 'Proposta Enviada'
    case 'fechado':
      return 'Fechado'
    case 'perdido':
      return 'Perdido'
    default:
      return backendStatus
  }
}

// FORÇAR REBUILD - Componente atualizado
export default function Leads_UPDATED_1771849897000() {
  const { t } = useI18n()

  // Adicionar timestamp para forçar reload
const CACHE_BUSTER = Date.now()
console.log('STATUS_VALUES atuais:', STATUS_VALUES)
console.log('FORÇANDO REBUILD - Componente: Leads_UPDATED_1771849897000')

// Reset forçado do estado inicial
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
        const data = await getLeads({
        status: status !== 'Todos' ? status : undefined,
        search: query || undefined,
        page: 1,
        limit: 10
      })
      console.log('Status no componente:', status)
        console.log('Dados recebidos do backend:', data)
        setLeads(data.data || data)  
      } catch (err) {
        setError(err.message)
        console.error('Erro ao carregar leads:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchLeads()
  }, [status, query])

  // TODO - Substituir dados mockados futuramente pela API
  // const leads = leadsMock

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
                <option key={opt.value} value={opt.value}>
                  {opt.label}
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
                  {leads.map((lead) => {
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
                          <StatusTag status={getStatusTag(displayStatus)}>{displayStatus}</StatusTag>
                        </td>

                        <td>{formatDateBR(lead.created_at.split('T')[0])}</td>
                      </tr>
                    )
                  })}

                  {leads.length === 0 && (
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
            {leads.map((lead) => {
              const displayStatus = mapStatusToDisplay(lead.status)
              return (
                <div key={lead.id} className="lead-card">
                  <div className="lead-card-top">
                    <div>
                      <div className="lead-primary">{lead.name}</div>
                      <div className="lead-secondary">{lead.email}</div>
                    </div>

                    <StatusTag status={getStatusTag(displayStatus)}>{displayStatus}</StatusTag>
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
