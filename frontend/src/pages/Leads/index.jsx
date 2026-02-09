import { Link } from 'react-router-dom'
import { Card, StatusTag } from '../../components/ui/index.js'
import styles from './styles.module.css'

const leadsMock = [
  {
    id: '1',
    name: 'Gean Carlos',
    email: 'gean.carlos@exemplo.com',
    status: 'pending',
    createdAt: '2026-02-07T12:45:00.000Z',
  },
  {
    id: '2',
    name: 'Deborah Victoria',
    email: 'deborah.victoria@exemplo.com',
    status: 'active',
    createdAt: '2026-02-06T09:10:00.000Z',
  },
]

const statusLabelMap = {
  pending: 'Pendente',
  active: 'Em atendimento',
  inactive: 'Inativo',
  converted: 'Convertido',
  archived: 'Arquivado',
  error: 'Erro',
}

function getStatusLabel(status) {
  return statusLabelMap[status] ?? String(status ?? '')
}

function getStatusTone(status) {
  if (status === 'active') return 'active'
  if (status === 'pending') return 'pending'
  if (status === 'error') return 'error'
  return 'inactive'
}

function formatDate(iso) {
  try {
    return new Date(iso).toLocaleDateString('pt-BR')
  } catch {
    return ''
  }
}

export default function Leads() {
  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h2 className={styles.title}>Leads</h2>
          <div className={styles.subtitle}>Clique em um lead para ver o detalhe (mock).</div>
        </div>
      </div>

      <div className={styles.list}>
        {leadsMock.map((lead) => (
          <Card key={lead.id} variant="shadow" className={styles.card}>
            <div className={styles.row}>
              <div className={styles.left}>
                <div className={styles.name}>{lead.name}</div>
                <div className={styles.email}>{lead.email}</div>
                <div className={styles.meta}>Criado em {formatDate(lead.createdAt)}</div>
              </div>

              <div className={styles.right}>
                <StatusTag status={getStatusTone(lead.status)}>
                  {getStatusLabel(lead.status)}
                </StatusTag>
                <Link
                  to={`/leads/${lead.id}`}
                  className={styles.detailLink}
                >
                  Ver detalhe →
                </Link>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
