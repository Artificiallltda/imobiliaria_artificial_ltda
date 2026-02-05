// TODO: Substituir mock por integração real com backend (login/logout/refresh) e armazenar token com segurança.
const AUTH_KEY = 'ia_authenticated'

export function isAuthenticated() {
  try {
    return localStorage.getItem(AUTH_KEY) === 'true'
  } catch {
    return false
  }
}

export function login(email, password) {
  // Mock simples: aceita apenas estas credenciais
  const validEmail = 'demo@imob.com'
  const validPass = '123456'

  if (!email || !password) {
    return { ok: false, message: 'Preencha e-mail e senha.' }
  }
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  if (!emailOk) {
    return { ok: false, message: 'E-mail inválido.' }
  }
  if (email === validEmail && password === validPass) {
    localStorage.setItem(AUTH_KEY, 'true')
    return { ok: true }
  }
  return { ok: false, message: 'Credenciais inválidas.' }
}

export function logout() {
  try {
    localStorage.removeItem(AUTH_KEY)
  } catch {}
}
