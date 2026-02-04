import styles from './styles.module.css'

function Card({ variant = 'shadow', className = '', children, ...props }) {
  return (
    <div className={`${styles.card} ${styles[variant]} ${className}`.trim()} {...props}>
      {children}
    </div>
  )
}

export default Card
