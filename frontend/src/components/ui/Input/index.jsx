import { useId } from 'react'
import styles from './styles.module.css'

function Input({
  label,
  error,
  id,
  className = '',
  inputClassName = '',
  ...props
}) {
  const autoId = useId()
  const inputId = id ?? autoId

  return (
    <div className={`${styles.field} ${className}`.trim()}>
      {label ? (
        <label className={styles.label} htmlFor={inputId}>
          {label}
        </label>
      ) : null}

      <input
        id={inputId}
        className={`${styles.input} ${error ? styles.error : ''} ${inputClassName}`.trim()}
        aria-invalid={error ? 'true' : 'false'}
        {...props}
      />

      {error ? <div className={styles.errorMessage}>{error}</div> : null}
    </div>
  )
}

export default Input
