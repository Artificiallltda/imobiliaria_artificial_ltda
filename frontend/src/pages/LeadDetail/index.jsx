import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Button, Card, Modal, Select, StatusTag, useToast } from '../../components/ui/index.js'
import Conversation from '../../components/Leads/Conversation/index.jsx'
import { getLeadDetailMockById } from '../../mocks/leadDetailMock.jsx'
import styles from './styles.module.css'

function formatDate(iso) {
  try {
    return new Date(iso).toLocaleDateString('pt-BR')
  } catch {
    return ''
  }
}

export default function LeadDetail() {
  const { id } = useParams()
  const { toast } = useToast()

  const detail = useMemo(() => getLeadDetailMockById(id), [id])

  const [status, setStatus] = useState(detail.lead.status)
  const [isConvertModalOpen, setIsConvertModalOpen] = useState(false)
  const [isArchiveModalOpen, setIsArchiveModalOpen] = useState(false)
  const [isChatModalOpen, setIsChatModalOpen] = useState(false)

  const statusOptions = useMemo(
    () => [
      { value: 'pending', label: 'Pendente' },
      { value: 'active', label: 'Em atendimento' },
      { value: 'inactive', label: 'Inativo' },
      { value: 'converted', label: 'Convertido' },
      { value: 'archived', label: 'Arquivado' },
    ],
    [],
  )

  const statusTag = useMemo(() => {
    if (status === 'active') return 'active'
    if (status === 'pending') return 'pending'
    if (status === 'error') return 'error'
    return 'inactive'
  }, [status])

  const statusLabel = useMemo(() => {
    const found = statusOptions.find((opt) => opt.value === status)
    return found?.label ?? String(status ?? '')
  }, [status, statusOptions])

  const handleStatusChange = (next) => {
    setStatus(next)
    // TODO - Integrar ações com backend
    toast({ type: 'success', message: 'Status atualizado (mock).' })
  }

  const handleSendMessage = () => {
    // TODO - Persistir histórico de mensagens
    // TODO - Integrar ações com backend
    toast({ type: 'success', message: 'Mensagem enviada (simulado).' })
  }

  const handleConvert = () => {
    setIsConvertModalOpen(false)
    setStatus('converted')
    // TODO - Integrar ações com backend
    toast({ type: 'success', message: 'Lead marcado como convertido (mock).' })
  }

  const handleArchive = () => {
    setIsArchiveModalOpen(false)
    setStatus('archived')
    // TODO - Integrar ações com backend
    toast({ type: 'success', message: 'Lead arquivado (mock).' })
  }

  return (
    <div className={styles.page}>
      <div className={styles.topbar}>
        <div>
          <div className={styles.breadcrumb}>
            <Link to="/leads" className={styles.backLink}>
              ← Voltar para Leads
            </Link>
          </div>
          <div className={styles.titleRow}>
            <h2 className={styles.title}>Detalhe do Lead</h2>
            <StatusTag status={statusTag}>{statusLabel}</StatusTag>
          </div>
          <div className={styles.subtitle}>ID: {detail.lead.id}</div>
        </div>
      </div>

      <Card className={styles.card}>
        <div className={styles.section}>
          <div className={styles.cardHeader}>
            <div>
              <div className={styles.cardTitle}>Resumo do lead</div>
              <div className={styles.cardSub}>Criado em {formatDate(detail.lead.createdAt)}</div>
            </div>
          </div>

          <div className={styles.summaryGrid}>
            <div className={styles.field}>
              <div className={styles.label}>Nome</div>
              <div className={styles.value}>{detail.lead.name}</div>
            </div>
            <div className={styles.field}>
              <div className={styles.label}>E-mail</div>
              <div className={styles.value}>{detail.lead.email}</div>
            </div>
            <div className={styles.field}>
              <div className={styles.label}>Telefone</div>
              <div className={styles.value}>{detail.lead.phone}</div>
            </div>
            <div className={styles.field}>
              <div className={styles.label}>Status</div>
              <div className={styles.value}>
                <StatusTag status={statusTag}>{statusLabel}</StatusTag>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.divider} />

        <div className={styles.section}>
          <div className={styles.cardHeader}>
            <div>
              <div className={styles.cardTitle}>Ações rápidas</div>
              <div className={styles.cardSub}>Simuladas para validação de fluxo</div>
            </div>
          </div>

          <div className={styles.actionsGrid}>
            <Select
              label="Alterar status"
              value={status}
              options={statusOptions}
              onChange={(e) => handleStatusChange(e.target.value)}
            />

            <div className={styles.actionsButtons}>
              <Button variant="outline" onClick={() => setIsChatModalOpen(true)}>
                Abrir conversa
              </Button>
              <Button variant="outline" onClick={handleSendMessage}>
                Enviar mensagem
              </Button>
              <Button variant="outline" onClick={() => setIsConvertModalOpen(true)}>
                Marcar como convertido
              </Button>
              <Button variant="outline" onClick={() => setIsArchiveModalOpen(true)}>
                Arquivar lead
              </Button>
            </div>
          </div>
        </div>
      </Card>

      <Modal
        open={isConvertModalOpen}
        title="Marcar como convertido"
        onClose={() => setIsConvertModalOpen(false)}
        actions={
          <>
            <Button variant="outline" onClick={() => setIsConvertModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleConvert}>Confirmar</Button>
          </>
        }
      >
        Esta ação é simulada. Confirma marcar o lead como convertido?
      </Modal>

      <Modal
        open={isArchiveModalOpen}
        title="Arquivar lead"
        onClose={() => setIsArchiveModalOpen(false)}
        actions={
          <>
            <Button variant="outline" onClick={() => setIsArchiveModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleArchive}>Arquivar</Button>
          </>
        }
      >
        Esta ação é simulada. Confirma arquivar este lead?
      </Modal>

      <Modal
        open={isChatModalOpen}
        title="Histórico de conversa"
        onClose={() => setIsChatModalOpen(false)}
        actions={
          <>
            <Button variant="outline" onClick={() => setIsChatModalOpen(false)}>
              Fechar
            </Button>
          </>
        }
      >
        <div className={styles.modalConversationWrap}>
          <Conversation messages={detail.messages} />
        </div>
      </Modal>
    </div>
  )
}
