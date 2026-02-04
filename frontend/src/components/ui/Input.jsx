import React from 'react'

export default function Input({ label, error, style = {}, ...props }) {
  const baseInput = {
    width: '100%',
    padding: '10px 12px',
    borderRadius: 8,
    border: `1px solid ${error ? '#ef4444' : '#d1d5db'}`,
    fontSize: 14,
    outline: 'none',
  }
  const labelStyle = {
    display: 'block',
    marginBottom: 6,
    fontSize: 13,
    color: '#374151',
    fontWeight: 600,
  }
  const errorStyle = {
    marginTop: 6,
    color: '#ef4444',
    fontSize: 12,
  }

  return (
    <div style={{ width: '100%' }}>
      {label && <label style={labelStyle}>{label}</label>}
      <input style={{ ...baseInput, ...style }} {...props} />
      {error && <div style={errorStyle}>{error}</div>}
    </div>
  )
}
