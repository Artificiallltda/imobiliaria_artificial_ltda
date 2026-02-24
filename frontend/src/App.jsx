import { useEffect, useMemo, useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { Button, Card, Input, Modal, Select, StatusTag, useToast } from './components/ui/index.js'
import Sidebar from './components/Sidebar.jsx'
import { MenuIcon, SettingsIcon } from './components/Icons/index.jsx'
import Login from './pages/login/index.jsx'
import Leads from './pages/Leads/index.jsx'
import LeadDetail from './pages/LeadDetail/index.jsx'
import Favorites from './pages/Favorites.jsx'
import Messages from './pages/Messages.jsx'
import Properties from './pages/Properties/index.jsx'
import PropertyDetail from './pages/PropertyDetail/index.jsx'
import Settings from './pages/Settings/index.jsx'
import AdminProperties from './pages/AdminProperties/index.jsx'
import AdminPropertyForm from './pages/AdminPropertyForm/index.jsx'
import { isAuthenticated, logout as doLogout } from './services/auth.js'
import { useTheme } from './context/ThemeContext.jsx'
import { useI18n } from './i18n/index.jsx'
import { socket } from './services/socket' // ✅ sem .js (mais compatível)

function App() {
  const [auth, setAuth] = useState(false)

  useEffect(() => {
    setAuth(isAuthenticated())
  }, [])

  // ✅ Conecta no socket somente quando estiver autenticado
  useEffect(() => {
  if (!auth) return

  console.log('🟦 Preparando socket... conectado agora?', socket.connected)

  const onConnect = () => console.log('✅ Socket conectado:', socket.id)
  const onDisconnect = () => console.log('⚠️ Socket desconectou')
  const onConnectError = (err) => console.log('❌ Socket connect_error:', err?.message || err)

  socket.on('connect', onConnect)
  socket.on('disconnect', onDisconnect)
  socket.on('connect_error', onConnectError)

  // ✅ Conecta DEPOIS de registrar listeners
  socket.connect()

  return () => {
    socket.off('connect', onConnect)
    socket.off('disconnect', onDisconnect)
    socket.off('connect_error', onConnectError)
    socket.disconnect()
  }
}, [auth]) 

  // TODO: Migrar este controle simples de auth para ProtectedRoute e/ou AuthContext.
  if (!auth) {
    return <Login onSuccess={() => setAuth(true)} />
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout onLogout={() => setAuth(false)} />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          <Route path="/dashboard" element={<DashboardPage />} />

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

function DashboardPage() {
  const { toast } = useToast()
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false)

  const selectOptions = useMemo(
    () => [
      { value: '1', label: 'Opção 1' },
      { value: '2', label: 'Opção 2' },
      { value: '3', label: 'Opção 3' },
    ],
    [],
  )

  return (
    <>
      <section className="search-section">
        <h2>Encontrar Imóvel</h2>

        <div className="search-grid">
          <Input placeholder="Localização" />
          <Input placeholder="Preço mín." />
          <Input placeholder="Preço máx." />
          <Input placeholder="Km máx." />
          <Select placeholder="Tipo" defaultValue="" options={selectOptions} />
          <Select placeholder="Quartos" defaultValue="" options={selectOptions} />
          <Select placeholder="Banheiros" defaultValue="" options={selectOptions} />
          <Select placeholder="Cidade" defaultValue="" options={selectOptions} />
          <Select placeholder="País" defaultValue="" options={selectOptions} />

          <Button className="btn-search" onClick={() => toast({ type: 'success', message: 'Busca iniciada (mock).' })}>
            Buscar
          </Button>
        </div>
      </section>

      <section className="listings-section">
        <div className="listings-header">
          <h2>Imóveis Disponíveis</h2>
          <span className="results-count">0 encontrados</span>
          <Button variant="outline" className="btn-filter" onClick={() => setIsFilterModalOpen(true)}>
            Filtrar por
          </Button>
        </div>

        <div className="property-cards">
          {[1, 2, 3].map((i) => (
            <div key={i} className="property-card">
              <div className="card-image">
                <div className="img-placeholder" />
                <StatusTag status="active" className="badge">
                  Ativo
                </StatusTag>
              </div>

              <div className="card-content">
                <h3>Imóvel exemplo {i}</h3>
                <p className="card-location">Cidade, Estado • há pouco</p>
                <p className="card-price">R$ 0,00</p>
                <p className="card-details">— quartos • — banheiros • — m²</p>
                <p className="card-desc">Descrição do imóvel.</p>

                <div className="card-actions">
                  <Button variant="outline">Favoritar</Button>
                  <Button>Fazer Oferta</Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Modal
        open={isFilterModalOpen}
        title="Filtros"
        onClose={() => setIsFilterModalOpen(false)}
        actions={
          <>
            <Button variant="outline" onClick={() => setIsFilterModalOpen(false)}>
              Cancelar
            </Button>
            <Button
              onClick={() => {
                setIsFilterModalOpen(false)
                toast({ type: 'warning', message: 'Filtros aplicados (mock).' })
              }}
            >
              Aplicar
            </Button>
          </>
        }
      >
        Ajuste seus filtros e clique em &quot;Aplicar&quot;.
      </Modal>
    </>
  )
}