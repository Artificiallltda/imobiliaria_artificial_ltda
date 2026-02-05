import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import styles from './styles.module.css'

function Modal({ open, title, children, actions, onClose }) {
  useEffect(() => {
    if (!open) return

    const onKeyDown = (e) => {
      if (e.key === 'Escape') onClose?.()
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open, onClose])

  if (!open) return null

  return createPortal(
    <div className={styles.overlay} onMouseDown={() => onClose?.()}>
      <div className={styles.modal} onMouseDown={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <div className={styles.title}>{title}</div>
          <button className={styles.closeButton} type="button" onClick={() => onClose?.()}>
            ×
          </button>
        </div>

        <div className={styles.body}>{children}</div>

        {actions ? <div className={styles.actions}>{actions}</div> : null}
      </div>
    </div>,
    document.body,
  )
}

export default Modal
