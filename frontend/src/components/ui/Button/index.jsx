import styles from './styles.module.css'

function Button({
  variant = 'primary',
  loading = false,
  disabled = false,
  className = '',
  children,
  ...props
}) {
  const isDisabled = disabled || loading

  return (
    <button
      className={`${styles.button} ${styles[variant]} ${className}`.trim()}
      disabled={isDisabled}
      data-loading={loading ? 'true' : 'false'}
      {...props}
    >
      {children}
    </button>
  )
}

export default Button
