import { useEffect, useMemo, useState } from 'react'
import { Button, StatusTag } from '../../components/ui/index.js'
import { useI18n } from '../../i18n/index.jsx'
import { useNavigate } from 'react-router-dom'
import { getLeads } from '../../services/leadsService.js'

function mapStatusToDisplay(backendStatus) {
  switch (backendStatus) {
    case 'novo':
      return 'pending'
    case 'em_atendimento':
      return 'inService'
    case 'proposta_enviada':
      return 'warning'
    case 'fechado':
      return 'success'
    case 'perdido':
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
  const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 10 })

  const [statusFilter, setStatusFilter] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  const fetchLeads = async (filters = {}) => {
    try {
      setLoading(true)
      setError(null)
      const response = await getLeads(filters)
      setLeads(response.data || [])
      setPagination({
        total: response.total || 0,
        page: response.page || 1,
        limit: response.limit || 10
      })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLeads({
      status: statusFilter || undefined,
      search: searchTerm || undefined,
      page: currentPage,
      limit: 10
    })
  }, [statusFilter, searchTerm, currentPage])

  const statusLabel = (status) => {
    switch (status) {
      case 'pending':
        return t('leads.statusOptions.new')
      case 'inService':
        return t('leads.statusOptions.inService')
      case 'warning':
        return t('leads.statusOptions.proposalSent')
      case 'success':
        return t('leads.statusOptions.closed')
      case 'lost':
        return t('leads.statusOptions.lost')
      default:
        return status
    }
  }

  const statusVariant = (status) => {
    switch (status) {
      case 'pending':
        return 'warning'
      case 'inService':
        return 'active'
      case 'warning':
        return 'warning'
      case 'success':
        return 'success'
      case 'lost':
        return 'inactive'
      default:
        return 'active'
    }
  }

  const statusOptions = useMemo(() => [
    { value: '', label: t('leads.statusOptions.all') },
    { value: 'novo', label: t('leads.statusOptions.new') },
    { value: 'em_atendimento', label: t('leads.statusOptions.inService') },
    { value: 'proposta_enviada', label: t('leads.statusOptions.proposalSent') },
    { value: 'fechado', label: t('leads.statusOptions.closed') },
    { value: 'perdido', label: t('leads.statusOptions.lost') }
  ], [t])

  const applyFilters = () => {
    setCurrentPage(1)
    fetchLeads({
      status: statusFilter || undefined,
      search: searchTerm || undefined,
      page: 1,
      limit: 10
    })
  }

  const clearFilters = () => {
    setStatusFilter('')
    setSearchTerm('')
    setCurrentPage(1)
    fetchLeads({ page: 1, limit: 10 })
  }

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage)
  }

  if (loading) {
    return (
      <div className="page">
        <h2>{t('leads.title')}</h2>
        <p>{t('leads.loading')}</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="page">
        <h2>{t('leads.title')}</h2>
        <p>{t('leads.error', { message: error })}</p>
        <Button onClick={() => fetchLeads({ page: currentPage, limit: 10 })}>
          {t('favorites.retry')}
        </Button>
      </div>
    )
  }

  return (
    <div className="page">
      <h2>{t('leads.title')}</h2>
      <p className="muted">{t('leads.subtitle')}</p>

      <div style={{ marginTop: 20, marginBottom: 20, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <label style={{ fontSize: 14, fontWeight: 600 }}>{t('leads.filters.searchLabel')}</label>
          <input
            type="text"
            placeholder={t('leads.filters.searchPlaceholder')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              padding: '8px 12px',
              border: '1px solid #ccc',
              borderRadius: 4,
              minWidth: 200
            }}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <label style={{ fontSize: 14, fontWeight: 600 }}>{t('leads.filters.statusLabel')}</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{
              padding: '8px 12px',
              border: '1px solid #ccc',
              borderRadius: 4,
              minWidth: 150
            }}
          >
            {statusOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div style={{ display: 'flex', alignItems: 'end', gap: 8 }}>
          <Button onClick={applyFilters} variant="primary">
            {t('leads.filters.apply')}
          </Button>
          <Button onClick={clearFilters} variant="outline">
            {t('leads.filters.clear')}
          </Button>
        </div>
      </div>

      <div style={{ marginBottom: 12, fontSize: 14, color: '#666' }}>
        {pagination.total > 0 ? (
          t('leads.foundCount', { count: pagination.total })
        ) : (
          t('leads.table.empty')
        )}
      </div>

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
      </div>

      {pagination.total > pagination.limit && (
        <div style={{ marginTop: 20, display: 'flex', justifyContent: 'center', gap: 8 }}>
          <Button
            variant="outline"
            disabled={currentPage <= 1}
            onClick={() => handlePageChange(currentPage - 1)}
          >
            {t('leads.pagination.prev')}
          </Button>

          <span style={{ padding: '8px 16px', alignSelf: 'center' }}>
            {t('leads.pagination.page', { current: currentPage, total: Math.ceil(pagination.total / pagination.limit) })}
          </span>

          <Button
            variant="outline"
            disabled={currentPage >= Math.ceil(pagination.total / pagination.limit)}
            onClick={() => handlePageChange(currentPage + 1)}
          >
            {t('leads.pagination.next')}
          </Button>
        </div>
      )}

      {leads.length === 0 && !loading && (
        <p className="muted" style={{ textAlign: 'center', marginTop: 40 }}>
          {t('leads.table.empty')}
        </p>
      )}
    </div>
  )
}
