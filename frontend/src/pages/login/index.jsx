import React, { useState } from 'react'
import Card from '../../components/ui/Card'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import { login } from '../../services/auth'
import logo from '../../logos/Artificiall_Positivo_Hor_RGB.png'

export default function Login({ onSuccess }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [hoverEye, setHoverEye] = useState(false)
  const [emailError, setEmailError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    setEmailError('')
    // validação básica do e-mail
    if (!email) {
      setEmailError('Informe seu e-mail.')
      return
    }
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    if (!emailOk) {
      setEmailError('Digite um e-mail válido.')
      return
    }
    setLoading(true)
    const res = login(email, password)
    setLoading(false)
    if (res.ok) {
      onSuccess?.()
    } else {
      setError(res.message || 'Erro ao entrar, tente novamente.')
    }
  }

  const container = {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #f8fafc 0%, #eef2ff 100%)',
    padding: 20,
  }

  const cardStyle = { maxWidth: 420 }

  const header = (
    <div style={{ textAlign: 'center' }}>
      <img src={logo} alt="Imobiliária Artificiall" style={{ height: 40, marginBottom: 8 }} />
      <div style={{ fontSize: 12, color: '#6b7280', textTransform: 'uppercase', letterSpacing: 1, marginTop: -2 }}>
        Imobiliária
      </div>
      <div style={{ fontSize: 18, color: '#111827', marginTop: 6 }}>Acesse sua conta</div>
    </div>
  )

  return (
    <div style={container}>
      <Card style={cardStyle} header={header}>
        <form onSubmit={handleSubmit} noValidate>
          <div style={{ display: 'grid', gap: 12 }}>
            <Input
              label="E-mail"
              type="email"
              placeholder="seuemail@exemplo.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                if (emailError) setEmailError('')
              }}
              error={emailError}
            />
            <div style={{ position: 'relative' }}>
              <Input
                label="Senha"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ paddingRight: 44 }}
              />
              {/* TODO: Mover o toggle de visibilidade de senha para o componente Input do Design System. */}
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                title={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                style={{
                  position: 'absolute',
                  right: 10,
                  top: 27,
                  border: '1px solid ' + (hoverEye ? '#e5e7eb' : 'transparent'),
                  background: hoverEye ? '#f9fafb' : 'transparent',
                  cursor: 'pointer',
                  color: hoverEye ? '#374151' : '#9ca3af',
                  padding: 6,
                  borderRadius: 8,
                }}
                onMouseEnter={() => setHoverEye(true)}
                onMouseLeave={() => setHoverEye(false)}
              >
                {showPassword ? (
                  // eye-off (custom small)
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17.94 17.94A10.94 10.94 0 0112 20C7 20 2.73 16.89 1 12.5a12.47 12.47 0 013.75-4.66" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M9.9 4.24A10.94 10.94 0 0112 4c5 0 9.27 3.11 11 7.5a12.51 12.51 0 01-2.06 3.05" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M14.12 14.12A3 3 0 019.88 9.88" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M1 1l22 22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                ) : (
                  // eye (custom small)
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                )}
              </button>
            </div>
            {error && (
              <div style={{ color: '#ef4444', fontSize: 13 }}>{error}</div>
            )}
            <Button type="submit" disabled={loading}>
              {loading ? 'Entrando...' : 'Entrar'}
            </Button>
            {/* TODO: Externalizar as credenciais de demonstração para variáveis de ambiente ou arquivo de configuração. */}
            <div style={{ fontSize: 12, color: '#6b7280', textAlign: 'center' }}>
              Use demo@imob.com e 123456 para acessar
            </div>
          </div>
        </form>
      </Card>
    </div>
  )
}
