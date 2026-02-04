import React from 'react'

export default function Button({ children, style = {}, variant = 'primary', ...props }) {
  const baseStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    padding: '10px 16px',
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
    border: '1px solid transparent',
    transition: 'background-color 0.2s ease, border-color 0.2s ease, color 0.2s ease',
  }

  const variants = {
    primary: {
      backgroundColor: '#2563eb',
      color: '#ffffff',
      borderColor: '#2563eb',
    },
    outline: {
      backgroundColor: '#ffffff',
      color: '#374151',
      borderColor: '#d1d5db',
    },
    ghost: {
      backgroundColor: 'transparent',
      color: '#374151',
      borderColor: 'transparent',
    },
  }

  const merged = { ...baseStyle, ...(variants[variant] || variants.primary), ...style }

  return (
    <button style={merged} {...props}>
      {children}
    </button>
  )
}
