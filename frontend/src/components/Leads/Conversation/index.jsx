import MessageItem from '../MessageItem/index.jsx'
import styles from './styles.module.css'

function Conversation({ messages = [] }) {
  // TODO - Implementar chat em tempo real futuramente

  return (
    <div className={styles.container}>
      {messages.length === 0 ? (
        <div className={styles.empty}>Sem mensagens (mock).</div>
      ) : (
        messages.map((msg) => <MessageItem key={msg.id} message={msg} />)
      )}
    </div>
  )
}

export default Conversation
