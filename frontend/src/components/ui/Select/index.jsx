import { useId } from 'react'
import styles from './styles.module.css'

function Select({
  label,
  error,
  id,
  placeholder = 'Selecione...',
  options = [],
  className = '',
  selectClassName = '',
  ...props
}) {
  const autoId = useId()
  const selectId = id ?? autoId

  const hasValue = props.value !== undefined && props.value !== null && String(props.value) !== ''

  return (
    <div className={`${styles.field} ${className}`.trim()}>
      {label ? (
        <label className={styles.label} htmlFor={selectId}>
          {label}
        </label>
      ) : null}

      <select
        id={selectId}
        className={`${styles.select} ${error ? styles.error : ''} ${selectClassName}`.trim()}
        aria-invalid={error ? 'true' : 'false'}
        data-has-value={hasValue ? 'true' : 'false'}
        {...props}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((opt) => (
          <option key={String(opt.value)} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      {error ? <div className={styles.errorMessage}>{error}</div> : null}
    </div>
  )
}

export default Select
