import styles from './styles.module.css'

function formatDateTime(iso) {
  try {
    const dt = new Date(iso)
    return dt.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch {
    return ''
  }
}

function MessageItem({ message }) {
  const isAgent = message?.sender === 'agent'

  return (
    <div className={`${styles.row} ${isAgent ? styles.agent : styles.lead}`.trim()}>
      <div className={styles.bubble}>
        <div className={styles.text}>{message?.text}</div>
        <div className={styles.meta}>{formatDateTime(message?.createdAt)}</div>
      </div>
    </div>
  )
}

export default MessageItem
