import React from 'react'

export default function Card({ children, style = {}, header, footer }) {
  const base = {
    width: '100%',
    backgroundColor: '#ffffff',
    border: '1px solid #e5e7eb',
    borderRadius: 12,
    boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
    overflow: 'hidden',
  }
  const section = { padding: 20 }
  const headerStyle = {
    ...section,
    borderBottom: '1px solid #e5e7eb',
    fontWeight: 700,
  }
  const footerStyle = {
    ...section,
    borderTop: '1px solid #e5e7eb',
  }

  return (
    <div style={{ ...base, ...style }}>
      {header && <div style={headerStyle}>{header}</div>}
      <div style={section}>{children}</div>
      {footer && <div style={footerStyle}>{footer}</div>}
    </div>
  )
}
