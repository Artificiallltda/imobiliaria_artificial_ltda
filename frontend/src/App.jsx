import { useEffect, useMemo, useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { Button, Card, Input, Modal, Select, StatusTag, useToast } from './components/ui/index.js'
import Sidebar from './components/Sidebar.jsx'
import { MenuIcon, SettingsIcon } from './components/Icons/index.jsx'
import Login from './pages/login/index.jsx'
import Dashboard from './pages/login/Dashboard.jsx'
import Leads from './pages/Leads/index.jsx'
import LeadDetail from './pages/LeadDetail/index.jsx'
import Favorites from './pages/Favorites.jsx'
import Messages from './pages/Messages.jsx'
import Properties from './pages/Properties/index.jsx'
import PropertyDetail from './pages/PropertyDetail/index.jsx'
import Settings from './pages/Settings/index.jsx'
import AdminProperties from './pages/AdminProperties/index.jsx'
import AdminPropertyForm from './pages/AdminPropertyForm/index.jsx'
import PublicFavorites from './pages/PublicFavorites/index.jsx'
import { isAuthenticated, logout as doLogout, getCurrentUser } from './services/auth.js'
import { useTheme } from './context/ThemeContext.jsx'
import { useI18n } from './i18n/index.jsx'
import { useWebSocket } from './hooks/useWebSocket.js'

function App() {
  const [auth, setAuth] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    setAuth(isAuthenticated())
  }, [])

  // Conectar WebSocket quando autenticado
  useEffect(() => {
    if (auth) {
      const user = getCurrentUser()
      if (user && user.id) {
        // WebSocket será conectado automaticamente pelo hook
        console.log('Usuário autenticado, WebSocket pronto para conectar')
      }
    }
  }, [auth])

  // TODO: Migrar este controle simples de auth para ProtectedRoute e/ou AuthContext.
  if (!auth) {
    return <Login onSuccess={() => setAuth(true)} />
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Rota pública - fora da autenticação */}
        <Route path="/shared/:token" element={<PublicFavorites />} />
        
        <Route element={<AppLayout onLogout={() => setAuth(false)} />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          <Route path="/dashboard" element={<Dashboard />} />

          {/* Leads (NÃO REMOVER) */}
          <Route path="/leads" element={<Leads />} />
          <Route path="/leads/:id" element={<LeadDetail />} />

          {/* Favoritos / Mensagens */}
          <Route path="/favoritos" element={<Favorites />} />
          <Route path="/mensagens" element={<Messages />} />

          {/* Imóveis */}
          <Route path="/imoveis" element={<Properties />} />
          <Route path="/imoveis/:id" element={<PropertyDetail />} />

          {/* Administração */}
          <Route path="/admin/properties" element={<AdminProperties />} />
          <Route path="/admin/properties/new" element={<AdminPropertyForm />} />
          <Route path="/admin/properties/:id/edit" element={<AdminPropertyForm />} />

          {/* Outros */}
          <Route path="/meus-favoritos" element={<Favorites />} />
          <Route path="/personalizar" element={<Settings />} />

          <Route path="*" element={<SimplePage title="404 - Não encontrado" />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App

function AppLayout({ onLogout }) {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  const { theme, toggleTheme } = useTheme()
  const { t, locale, setLocale } = useI18n()
  
  // Conectar WebSocket para notificações em tempo real
  const user = getCurrentUser()
  const { isConnected } = useWebSocket(user?.id)

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth > 768) setMobileOpen(false)
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const handleLogout = () => {
    doLogout()
    onLogout()
  }

  return (
    <div className="app">
      {/* Sidebar (componentizada) */}
      <Sidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        onLogout={handleLogout}
      />

      {/* Área principal */}
      <div className="main-wrapper">
        {/* Header */}
        <header className="header">
          <div className="header-brand">
            <div className="brand-mark">IA</div>
            <div>
              <strong className="brand-title">Imobiliária Artificial</strong>
              <span className="brand-tagline">Inteligência que valoriza cada imóvel</span>
            </div>
          </div>

          <div className="header-user">
            <strong>Usuário</strong>
            <span className="header-greeting">Bom dia</span>
          </div>

          <div className="header-stats">
            <span>Imóveis ativos: 2</span>
            <span>Novos: 27</span>
            <span>Mensagens: 105</span>
          </div>

          <div className="header-actions">
            {/* Botão mobile para abrir sidebar */}
            <button
              className="icon-btn mobile-menu-btn"
              type="button"
              onClick={() => setMobileOpen(true)}
              aria-label="Abrir menu"
            >
              <MenuIcon />
            </button>

            {/* Idioma */}
            <button
              className="icon-btn"
              type="button"
              onClick={() => {
                const order = ['pt-BR', 'en-US', 'es-ES']
                const idx = Math.max(0, order.indexOf(locale))
                setLocale(order[(idx + 1) % order.length])
              }}
              aria-label={t('language.label')}
              title={`${t('language.label')}: ${locale}`}
            >
              🌐
            </button>

            {/* Toggle tema */}
            <button
              className="icon-btn"
              type="button"
              onClick={toggleTheme}
              aria-label="Alternar tema"
              title={theme === 'dark' ? 'Mudar para claro' : 'Mudar para escuro'}
            >
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>

            <div className="avatar">U</div>
            <Button onClick={handleLogout}>Sair</Button>
          </div>
        </header>

        <div className="content-area">
          <main className="main-content">
            <Outlet />
          </main>

          {/* Sidebar direita */}
          <aside className="right-sidebar">
            <h2>Meus Imóveis</h2>

            <Card className="featured-card" variant="flat">
              <div className="img-placeholder large" />
              <StatusTag status="active" className="badge">
                Ativo
              </StatusTag>
              <p className="card-location">Cidade, Estado</p>
              <p className="card-price">R$ 0,00</p>
            </Card>

            <Card className="contact-card" variant="flat">
              <StatusTag status="active" className="badge">
                Ativo
              </StatusTag>
              <p>Local: Cidade, Estado</p>
              <p>Tel: (00) 00000-0000</p>
              <p>Email: email@exemplo.com</p>
              <Button>Personalizar</Button>
            </Card>
          </aside>
        </div>
      </div>
    </div>
  )
}

function SimplePage({ title }) {
  return (
    <div className="page">
      <h2>{title}</h2>
      <p className="muted">Página mockada (frontend).</p>
    </div>
  )
}

