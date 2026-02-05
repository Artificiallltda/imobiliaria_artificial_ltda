import styles from './styles.module.css'

function StatusTag({ status = 'active', className = '', children, ...props }) {
  return (
    <span className={`${styles.tag} ${styles[status]} ${className}`.trim()} {...props}>
      {children}
    </span>
  )
}

export default StatusTag
