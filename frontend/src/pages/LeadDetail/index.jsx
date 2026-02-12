import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Button, Card, Modal, Select, StatusTag, useToast } from '../../components/ui/index.js'
import Conversation from '../../components/Leads/Conversation/index.jsx'
import { getLeadDetailMockById } from '../../mocks/leadDetailMock.jsx'
import { useI18n } from '../../i18n/index.jsx'
import styles from './styles.module.css'

function formatDate(iso, locale) {
  try {
    return new Date(iso).toLocaleDateString(locale)
  } catch {
    return ''
  }
}

export default function LeadDetail() {
  const { id } = useParams()
  const { toast } = useToast()
  const { t, locale } = useI18n()

  const detail = useMemo(() => getLeadDetailMockById(id), [id])

  const [status, setStatus] = useState(detail.lead.status)
  const [isConvertModalOpen, setIsConvertModalOpen] = useState(false)
  const [isArchiveModalOpen, setIsArchiveModalOpen] = useState(false)
  const [isChatModalOpen, setIsChatModalOpen] = useState(false)

  const statusOptions = useMemo(
    () => [
      { value: 'pending', label: t('leadDetail.statusOptions.pending') },
      { value: 'active', label: t('leadDetail.statusOptions.active') },
      { value: 'inactive', label: t('leadDetail.statusOptions.inactive') },
      { value: 'converted', label: t('leadDetail.statusOptions.converted') },
      { value: 'archived', label: t('leadDetail.statusOptions.archived') },
    ],
    [t],
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
    toast({ type: 'success', message: t('leadDetail.toast.statusUpdated') })
  }

  const handleSendMessage = () => {
    // TODO - Persistir histórico de mensagens
    // TODO - Integrar ações com backend
    toast({ type: 'success', message: t('leadDetail.toast.messageSent') })
  }

  const handleConvert = () => {
    setIsConvertModalOpen(false)
    setStatus('converted')
    // TODO - Integrar ações com backend
    toast({ type: 'success', message: t('leadDetail.toast.leadConverted') })
  }

  const handleArchive = () => {
    setIsArchiveModalOpen(false)
    setStatus('archived')
    // TODO - Integrar ações com backend
    toast({ type: 'success', message: t('leadDetail.toast.leadArchived') })
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

          <div className={styles.subtitle}>{t('leadDetail.id', { id: detail.lead.id })}</div>
        </div>
      </div>

      <Card className={styles.card}>
        <div className={styles.section}>
          <div className={styles.cardHeader}>
            <div>
              <div className={styles.cardTitle}>{t('leadDetail.summary.title')}</div>
              <div className={styles.cardSub}>
                {t('leadDetail.summary.createdAt', {
                  date: formatDate(detail.lead.createdAt, locale),
                })}
              </div>
            </div>
          </div>

          <div className={styles.summaryGrid}>
            <div className={styles.field}>
              <div className={styles.label}>{t('leadDetail.summary.name')}</div>
              <div className={styles.value}>{detail.lead.name}</div>
            </div>

            <div className={styles.field}>
              <div className={styles.label}>{t('leadDetail.summary.email')}</div>
              <div className={styles.value}>{detail.lead.email}</div>
            </div>

            <div className={styles.field}>
              <div className={styles.label}>{t('leadDetail.summary.phone')}</div>
              <div className={styles.value}>{detail.lead.phone}</div>
            </div>

            <div className={styles.field}>
              <div className={styles.label}>{t('leadDetail.summary.status')}</div>
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
              <div className={styles.cardTitle}>{t('leadDetail.quickActions.title')}</div>
              <div className={styles.cardSub}>{t('leadDetail.quickActions.subtitle')}</div>
            </div>
          </div>

          <div className={styles.actionsGrid}>
            <Select
              label={t('leadDetail.quickActions.changeStatus')}
              value={status}
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
          <Conversation messages={detail.messages} />
        </div>
      </Modal>
    </div>
  )
}
