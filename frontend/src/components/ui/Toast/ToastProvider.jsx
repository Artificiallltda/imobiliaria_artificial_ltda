import { createContext, useCallback, useMemo, useState } from 'react'
import styles from './styles.module.css'

export const ToastContext = createContext(null)

function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const toast = useCallback(({ type = 'success', message, duration = 3000 } = {}) => {
    const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`

    setToasts((prev) => [{ id, type, message }, ...prev])

    window.setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, duration)
  }, [])

  const close = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const value = useMemo(() => ({ toast }), [toast])

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className={styles.viewport} role="region" aria-label="Notificações">
        {toasts.map((t) => (
          <div key={t.id} className={`${styles.toast} ${styles[t.type]}`.trim()} role="status">
            <div className={styles.message}>{t.message}</div>
            <button type="button" className={styles.close} onClick={() => close(t.id)}>
              ×
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export default ToastProvider
