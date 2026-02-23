import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Button, Card, Modal, Select, StatusTag, useToast } from '../../components/ui/index.js'
import Conversation from '../../components/Leads/Conversation/index.jsx'
import { getLeadById, updateLead } from '../../services/leadsService.js'
import { useI18n } from '../../i18n/index.jsx'
import styles from './styles.module.css'

function formatDate(iso, locale) {
  try {
    if (!iso) return 'Data não disponível'
    const date = new Date(iso)
    // Check if the date is valid
    if (isNaN(date.getTime())) {
      return 'Data inválida'
    }
    return date.toLocaleDateString(locale || 'pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  } catch (error) {
    return 'Erro ao formatar data'
  }
}

export default function LeadDetail() {
  const { id } = useParams()
  const { toast } = useToast()
  const { t, locale } = useI18n()

  const [lead, setLead] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isConvertModalOpen, setIsConvertModalOpen] = useState(false)
  const [isArchiveModalOpen, setIsArchiveModalOpen] = useState(false)
  const [isChatModalOpen, setIsChatModalOpen] = useState(false)

  useEffect(() => {
    const fetchLead = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await getLeadById(id)
        setLead(data)
      } catch (err) {
        setError(err.message)
        toast({ type: 'error', message: 'Erro ao carregar dados do lead' })
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchLead()
    } else {
      setError('ID do lead não fornecido')
      setLoading(false)
    }
  }, [id, toast])

  const statusOptions = useMemo(
    () => [
      { value: 'novo', label: 'Novo' },
      { value: 'em_atendimento', label: 'Em Atendimento' },
      { value: 'proposta_enviada', label: 'Proposta Enviada' },
      { value: 'fechado', label: 'Fechado' },
      { value: 'perdido', label: 'Perdido' },
    ],
    [],
  )

  const statusTag = useMemo(() => {
    if (lead?.status === 'novo') return 'pending'
    if (lead?.status === 'em_atendimento') return 'active'
    if (lead?.status === 'proposta_enviada') return 'warning'
    if (lead?.status === 'fechado') return 'success'
    if (lead?.status === 'perdido') return 'error'
    return 'inactive'
  }, [lead?.status])

  const statusLabel = useMemo(() => {
    const found = statusOptions.find((opt) => opt.value === lead?.status)
    return found?.label ?? String(lead?.status ?? '')
  }, [lead?.status, statusOptions])

  const handleStatusChange = async (next) => {
    try {
      const updatedLead = await updateLead(id, { status: next })
      setLead(updatedLead)
      toast({ type: 'success', message: 'Status atualizado com sucesso' })
    } catch (err) {
      toast({ type: 'error', message: 'Erro ao atualizar status' })
    }
  }

  const handleSendMessage = () => {
    // TODO - Persistir histórico de mensagens
    // TODO - Integrar ações com backend
    toast({ type: 'success', message: t('leadDetail.toast.messageSent') })
  }

  const handleConvert = async () => {
    setIsConvertModalOpen(false)
    try {
      const updatedLead = await updateLead(lead.id, { convert: true })
      setLead(updatedLead)
      toast({ type: 'success', message: t('leadDetail.toast.leadConverted') })
    } catch (err) {
      toast({ type: 'error', message: 'Erro ao converter lead' })
    }
  }

  const handleArchive = async () => {
    setIsArchiveModalOpen(false)
    try {
      const updatedLead = await updateLead(lead.id, { is_archived: true })
      setLead(updatedLead)
      toast({ type: 'success', message: t('leadDetail.toast.leadArchived') })
    } catch (err) {
      toast({ type: 'error', message: 'Erro ao arquivar lead' })
    }
  }

  if (loading) {
    return (
      <div className={styles.page}>
        <div className={styles.loading}>Carregando...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={styles.page}>
        <div className={styles.error}>Erro: {error}</div>
      </div>
    )
  }

  if (!lead) {
    return (
      <div className={styles.page}>
        <div className={styles.error}>
          <p>Lead não encontrado ou não foi possível carregar os dados.</p>
          <p>ID: {id}</p>
          <p>Erro: {error || 'Nenhum erro específico'}</p>
          <p>
            <Link to="/leads" className={styles.backLink}>
              Voltar para a lista de leads
            </Link>
          </p>
        </div>
      </div>
    )
  }


  return (
    <div className={styles.page}>
      <div className={styles.topbar}>
        <div>
          <div className={styles.breadcrumb}>
            <Link to="/leads" className={styles.backLink}>
              {t('leadDetail.backToLeads')}
            </Link>
          </div>

          <div className={styles.titleRow}>
            <h2 className={styles.title}>{t('leadDetail.title')}</h2>
            <StatusTag status={statusTag}>{statusLabel}</StatusTag>
          </div>

          <div className={styles.subtitle}>
            {t('leadDetail.id', { id: lead.id })}
          </div>
        </div>
      </div>

      <Card className={styles.card}>
        <div className={styles.section}>
          <div className={styles.cardHeader}>
            <div>
              <div className={styles.cardTitle}>{t('leadDetail.summary.title')}</div>
              <div className={styles.cardSub}>
                ID: {lead.id}
              </div>
            </div>
          </div>

          <div className={styles.summaryGrid}>
            <div className={styles.field}>
              <div className={styles.label}>{t('leadDetail.summary.name')}</div>
              <div className={styles.value}>{lead.name}</div>
            </div>

            <div className={styles.field}>
              <div className={styles.label}>{t('leadDetail.summary.email')}</div>
              <div className={styles.value}>{lead.email}</div>
            </div>

            <div className={styles.field}>
              <div className={styles.label}>{t('leadDetail.summary.phone')}</div>
              <div className={styles.value}>{lead.phone || '-'}</div>
            </div>

            <div className={styles.field}>
              <div className={styles.label}>{t('leadDetail.summary.status')}</div>
              <div className={styles.value}>
                <StatusTag status={statusTag}>{statusLabel}</StatusTag>
              </div>
            </div>

            {lead.property && (
              <div className={styles.field}>
                <div className={styles.label}>Imóvel</div>
                <div className={styles.value}>{lead.property.title}</div>
              </div>
            )}
          </div>
        </div>

        <div className={styles.divider} />

        <div className={styles.section}>
          <div className={styles.cardHeader}>
            <div>
              <div className={styles.cardTitle}>{t('leadDetail.quickActions.title')}</div>
              <div className={styles.cardSub}>{t('leadDetail.quickActions.subtitle')}</div>
            </div>
          </div>

          <div className={styles.actionsGrid}>
            <Select
              label={t('leadDetail.quickActions.changeStatus')}
              value={lead?.status || ''}
              options={statusOptions}
              onChange={(e) => handleStatusChange(e.target.value)}
            />

            <div className={styles.actionsButtons}>
              <Button variant="outline" onClick={() => setIsChatModalOpen(true)}>
                {t('leadDetail.quickActions.openConversation')}
              </Button>

              <Button variant="outline" onClick={handleSendMessage}>
                {t('leadDetail.quickActions.sendMessage')}
              </Button>

              <Button variant="outline" onClick={() => setIsConvertModalOpen(true)}>
                {t('leadDetail.quickActions.markConverted')}
              </Button>

              <Button variant="outline" onClick={() => setIsArchiveModalOpen(true)}>
                {t('leadDetail.quickActions.archiveLead')}
              </Button>
            </div>
          </div>
        </div>
      </Card>

      <Modal
        open={isConvertModalOpen}
        title={t('leadDetail.modals.convert.title')}
        onClose={() => setIsConvertModalOpen(false)}
        actions={
          <>
            <Button variant="outline" onClick={() => setIsConvertModalOpen(false)}>
              {t('leadDetail.modals.convert.cancel')}
            </Button>
            <Button onClick={handleConvert}>{t('leadDetail.modals.convert.confirm')}</Button>
          </>
        }
      >
        {t('leadDetail.modals.convert.body')}
      </Modal>

      <Modal
        open={isArchiveModalOpen}
        title={t('leadDetail.modals.archive.title')}
        onClose={() => setIsArchiveModalOpen(false)}
        actions={
          <>
            <Button variant="outline" onClick={() => setIsArchiveModalOpen(false)}>
              {t('leadDetail.modals.archive.cancel')}
            </Button>
            <Button onClick={handleArchive}>{t('leadDetail.modals.archive.confirm')}</Button>
          </>
        }
      >
        {t('leadDetail.modals.archive.body')}
      </Modal>

      <Modal
        open={isChatModalOpen}
        title={t('leadDetail.modals.chat.title')}
        onClose={() => setIsChatModalOpen(false)}
        actions={
          <>
            <Button variant="outline" onClick={() => setIsChatModalOpen(false)}>
              {t('leadDetail.modals.chat.close')}
            </Button>
          </>
        }
      >
        <div className={styles.modalConversationWrap}>
          <Conversation messages={lead.messages} />
        </div>
      </Modal>
    </div>
  )
}
