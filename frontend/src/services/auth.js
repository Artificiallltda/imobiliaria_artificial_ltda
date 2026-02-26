const AUTH_KEY = 'ia_authenticated'
const AUTH_TOKEN_KEY = 'ia_token'
const AUTH_USER_KEY = 'ia_user'
const API_BASE_URL = 'http://127.0.0.1:8000'

export function isAuthenticated() {
  try {
    return localStorage.getItem(AUTH_KEY) === 'true' && !!localStorage.getItem(AUTH_TOKEN_KEY)
  } catch {
    return false
  }
}

export async function login(email, password) {
  if (!email || !password) {
    return { ok: false, message: 'Preencha e-mail e senha.' }
  }
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  if (!emailOk) {
    return { ok: false, message: 'E-mail inválido.' }
  }
  try {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      return { ok: false, message: data.detail || 'Credenciais inválidas.' }
    }
    const data = await res.json()
    localStorage.setItem(AUTH_KEY, 'true')
    localStorage.setItem(AUTH_TOKEN_KEY, data.access_token)
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(data.user))
    return { ok: true }
  } catch {
    return { ok: false, message: 'Erro de conexão com o servidor.' }
  }
}

export function logout() {
  try {
    localStorage.removeItem(AUTH_KEY)
    localStorage.removeItem(AUTH_TOKEN_KEY)
    localStorage.removeItem(AUTH_USER_KEY)
  } catch {}
}

export function getCurrentUser() {
  try {
    const userStr = localStorage.getItem(AUTH_USER_KEY)
    return userStr ? JSON.parse(userStr) : null
  } catch {
    return null
  }
}
