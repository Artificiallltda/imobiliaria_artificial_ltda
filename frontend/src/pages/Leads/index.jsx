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
  const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 10 })

  // Estados para filtros
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
      console.error('Erro ao carregar leads:', err)
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

  // Opções para filtro de status
  const statusOptions = useMemo(() => [
    { value: '', label: 'Todos os status' },
    { value: 'NEW', label: 'Novo' },
    { value: 'QUALIFYING', label: 'Qualificando' },
    { value: 'QUALIFIED', label: 'Qualificado' },
    { value: 'LOST', label: 'Perdido' }
  ], [])

  // Função para aplicar filtros
  const applyFilters = () => {
    setCurrentPage(1) // Reset para primeira página
    fetchLeads({
      status: statusFilter || undefined,
      search: searchTerm || undefined,
      page: 1,
      limit: 10
    })
  }

  // Função para limpar filtros
  const clearFilters = () => {
    setStatusFilter('')
    setSearchTerm('')
    setCurrentPage(1)
    fetchLeads({ page: 1, limit: 10 })
  }

  // Função para mudar página
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage)
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
        <Button onClick={() => fetchLeads({ page: currentPage, limit: 10 })}>
          Tentar novamente
        </Button>
      </div>
    )
  }

  return (
    <div className="page">
      <h2>{t('leads.title')}</h2>
      <p className="muted">{t('leads.subtitle')}</p>

      {/* Filtros */}
      <div style={{ marginTop: 20, marginBottom: 20, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <label style={{ fontSize: 14, fontWeight: 600 }}>Buscar</label>
          <input
            type="text"
            placeholder="Nome, email ou telefone..."
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
          <label style={{ fontSize: 14, fontWeight: 600 }}>Status</label>
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
            Aplicar filtros
          </Button>
          <Button onClick={clearFilters} variant="outline">
            Limpar
          </Button>
        </div>
      </div>

      {/* Contador de resultados */}
      <div style={{ marginBottom: 12, fontSize: 14, color: '#666' }}>
        {pagination.total > 0 ? (
          <>Encontrados {pagination.total} lead{pagination.total !== 1 ? 's' : ''}</>
        ) : (
          'Nenhum lead encontrado'
        )}
      </div>

      {/* Lista de leads */}
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

      {/* Paginação */}
      {pagination.total > pagination.limit && (
        <div style={{ marginTop: 20, display: 'flex', justifyContent: 'center', gap: 8 }}>
          <Button
            variant="outline"
            disabled={currentPage <= 1}
            onClick={() => handlePageChange(currentPage - 1)}
          >
            Anterior
          </Button>

          <span style={{ padding: '8px 16px', alignSelf: 'center' }}>
            Página {currentPage} de {Math.ceil(pagination.total / pagination.limit)}
          </span>

          <Button
            variant="outline"
            disabled={currentPage >= Math.ceil(pagination.total / pagination.limit)}
            onClick={() => handlePageChange(currentPage + 1)}
          >
            Próxima
          </Button>
        </div>
      )}

      {leads.length === 0 && !loading && (
        <p className="muted" style={{ textAlign: 'center', marginTop: 40 }}>
          Nenhum lead encontrado com os filtros aplicados.
        </p>
      )}
    </div>
  )
}
