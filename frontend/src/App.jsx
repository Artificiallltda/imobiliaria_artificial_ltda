import { useEffect, useMemo, useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate, Outlet, useNavigate } from 'react-router-dom'
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
import PublicFavorites from './pages/PublicFavorites/index.jsx'
import { isAuthenticated, logout as doLogout, getCurrentUser } from './services/auth.js'
import { useTheme } from './context/ThemeContext.jsx'
import { useI18n } from './i18n/index.jsx'
import { getProperties, formatPrice } from './services/propertiesService.js'
import { addFavorite } from './services/favoritesService.js'
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
  const navigate = useNavigate()

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
            <strong>{t('header.user')}</strong>
            <span className="header-greeting">{t('header.greeting')}</span>
          </div>

          <div className="header-stats">
            <span>{t('header.stats.active', { count: 2 })}</span>
            <span>{t('header.stats.new', { count: 27 })}</span>
            <span>{t('header.stats.messages', { count: 105 })}</span>
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

            {/* Idioma — dropdown */}
            <select
              value={locale}
              onChange={e => setLocale(e.target.value)}
              aria-label={t('language.label')}
              title={t('language.label')}
              style={{
                background: 'transparent',
                border: '1px solid var(--color-border, #e2e8f0)',
                borderRadius: 6,
                padding: '4px 8px',
                fontSize: 13,
                cursor: 'pointer',
                color: 'inherit',
              }}
            >
              <option value="pt-BR">🇧🇷 PT</option>
              <option value="en-US">🇺🇸 EN</option>
              <option value="es-ES">🇪🇸 ES</option>
            </select>

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
            <Button onClick={handleLogout}>{t('header.actions.logout')}</Button>
          </div>
        </header>

        <div className="content-area">
          <main className="main-content">
            <Outlet />
          </main>

          {/* Sidebar direita */}
          <aside className="right-sidebar">
            <h2>{t('rightSidebar.title')}</h2>

            <Card className="featured-card" variant="flat">
              <div className="img-placeholder large" />
              <StatusTag status="active" className="badge">
                {t('rightSidebar.status')}
              </StatusTag>
              <p className="card-location">{t('rightSidebar.location')}</p>
              <p className="card-price">R$ 0,00</p>
            </Card>

            <Card className="contact-card" variant="flat">
              <StatusTag status="active" className="badge">
                {t('rightSidebar.status')}
              </StatusTag>
              <p>{t('rightSidebar.contact.location')}</p>
              <p>{t('rightSidebar.contact.phone')}</p>
              <p>{t('rightSidebar.contact.email')}</p>
              <Button onClick={() => navigate('/personalizar')}>{t('rightSidebar.contact.action')}</Button>
            </Card>

            <SupportBotCard />
          </aside>
        </div>
      </div>
    </div>
  )
}

function SupportBotCard() {
  const { t } = useI18n()
  const navigate = useNavigate()
  const [step, setStep] = useState('idle') // idle | asked | done

  const WHATSAPP_NUMBER = '5511999999999'

  const goWhatsApp = () => {
    const msg = encodeURIComponent(t('supportBot.whatsappMessage'))
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, '_blank')
    setStep('done')
  }

  const goMessages = () => {
    navigate('/mensagens')
    setStep('done')
  }

  return (
    <div style={{
      background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
      borderRadius: 14,
      padding: 16,
      color: '#fff',
      marginTop: 12,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
        <span style={{ fontSize: 22 }}>🤖</span>
        <div>
          <div style={{ fontWeight: 700, fontSize: 14 }}>{t('supportBot.title')}</div>
          <div style={{ fontSize: 11, opacity: 0.8 }}>{t('supportBot.subtitle')}</div>
        </div>
      </div>

      {step === 'idle' && (
        <>
          <p style={{ fontSize: 12, marginBottom: 12, opacity: 0.9 }}>
            {t('supportBot.prompt')}
          </p>
          <button
            onClick={() => setStep('asked')}
            style={{
              width: '100%',
              background: 'rgba(255,255,255,0.2)',
              border: '1px solid rgba(255,255,255,0.4)',
              borderRadius: 8,
              color: '#fff',
              padding: '8px 12px',
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            💬 {t('supportBot.startButton')}
          </button>
        </>
      )}

      {step === 'asked' && (
        <>
          <p style={{ fontSize: 12, marginBottom: 10, opacity: 0.9 }}>
            {t('supportBot.choicePrompt')}
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <button
              onClick={goWhatsApp}
              style={{
                background: '#25D366',
                border: 'none',
                borderRadius: 8,
                color: '#fff',
                padding: '8px 12px',
                fontSize: 13,
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              📱 {t('supportBot.whatsappButton')}
            </button>
            <button
              onClick={goMessages}
              style={{
                background: 'rgba(255,255,255,0.2)',
                border: '1px solid rgba(255,255,255,0.4)',
                borderRadius: 8,
                color: '#fff',
                padding: '8px 12px',
                fontSize: 13,
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              💬 {t('supportBot.chatButton')}
            </button>
            <button
              onClick={() => setStep('idle')}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'rgba(255,255,255,0.7)',
                fontSize: 11,
                cursor: 'pointer',
                textAlign: 'center',
                padding: 4,
              }}
            >
              {t('supportBot.cancel')}
            </button>
          </div>
        </>
      )}

      {step === 'done' && (
        <div style={{ textAlign: 'center', padding: '8px 0' }}>
          <div style={{ fontSize: 24, marginBottom: 4 }}>✅</div>
          <p style={{ fontSize: 12, opacity: 0.9, margin: 0 }}>{t('supportBot.done')}</p>
          <button
            onClick={() => setStep('idle')}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'rgba(255,255,255,0.7)',
              fontSize: 11,
              cursor: 'pointer',
              marginTop: 6,
            }}
          >
            {t('supportBot.restart')}
          </button>
        </div>
      )}
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
  const navigate = useNavigate()
  const { t } = useI18n()
  const [properties, setProperties] = useState([])
  const [loadingProps, setLoadingProps] = useState(true)
  const [favoritingId, setFavoritingId] = useState(null)
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false)

  useEffect(() => {
    getProperties()
      .then(data => setProperties(Array.isArray(data) ? data : (data?.data || data?.items || [])))
      .catch(() => toast({ type: 'error', message: t('dashboard.listings.error') }))
      .finally(() => setLoadingProps(false))
  }, [])

  const handleFavoritar = async (property) => {
    setFavoritingId(property.id)
    try {
      await addFavorite(property.id)
      toast({ type: 'success', message: `"${property.title}" ${t('dashboard.card.favorited')}` })
    } catch (err) {
      if (err?.status === 409) {
        toast({ type: 'info', message: t('dashboard.card.alreadyFavorited') })
      } else if (err?.status === 401) {
        toast({ type: 'error', message: t('dashboard.card.loginToFavorite') })
      } else {
        toast({ type: 'error', message: t('dashboard.card.favoriteError') })
      }
    } finally {
      setFavoritingId(null)
    }
  }

  const selectOptions = useMemo(
    () => [
      { value: '1', label: t('dashboard.search.option1') },
      { value: '2', label: t('dashboard.search.option2') },
      { value: '3', label: t('dashboard.search.option3') },
    ],
    [t],
  )

  return (
    <>
      <section className="search-section">
        <h2>{t('dashboard.searchForm.title')}</h2>

        <div className="search-grid">
          <Input placeholder={t('dashboard.searchForm.location')} />
          <Input placeholder={t('dashboard.searchForm.priceMin')} />
          <Input placeholder={t('dashboard.searchForm.priceMax')} />
          <Input placeholder={t('dashboard.searchForm.maxKm')} />
          <Select placeholder={t('dashboard.searchForm.type')} defaultValue="" options={selectOptions} />
          <Select placeholder={t('dashboard.searchForm.bedrooms')} defaultValue="" options={selectOptions} />
          <Select placeholder={t('dashboard.searchForm.bathrooms')} defaultValue="" options={selectOptions} />
          <Select placeholder={t('dashboard.searchForm.city')} defaultValue="" options={selectOptions} />
          <Select placeholder={t('dashboard.searchForm.country')} defaultValue="" options={selectOptions} />

          <Button
            className="btn-search"
            onClick={() => toast({ type: 'success', message: t('dashboard.searchForm.started') })}
          >
            {t('dashboard.searchForm.button')}
          </Button>
        </div>
      </section>

      <section className="listings-section">
        <div className="listings-header">
          <h2>{t('dashboard.listings.title')}</h2>
          <span className="results-count">{t('dashboard.listings.count', { count: properties.length })}</span>
          <Button variant="outline" className="btn-filter" onClick={() => setIsFilterModalOpen(true)}>
            {t('dashboard.listings.filter')}
          </Button>
        </div>

        <div className="property-cards">
          {loadingProps ? (
            <p style={{ color: '#64748b', padding: 16 }}>{t('dashboard.listings.loading')}</p>
          ) : properties.length === 0 ? (
            <p style={{ color: '#64748b', padding: 16 }}>{t('dashboard.listings.empty')}</p>
          ) : (
            properties.map((property) => (
              <div key={property.id} className="property-card">
                <div className="card-image">
                  <div className="img-placeholder" />
                  <StatusTag status="active" className="badge">
                    {t('dashboard.card.active')}
                  </StatusTag>
                </div>

                <div className="card-content">
                  <h3>{property.title}</h3>
                  <p className="card-location">{property.city}{property.state ? `, ${property.state}` : ''}</p>
                  <p className="card-price">{formatPrice(property.price)}</p>
                  <p className="card-details">
                    {property.bedrooms ?? '—'} {t('dashboard.card.bedrooms')} • {property.bathrooms ?? '—'} {t('dashboard.card.bathrooms')} • {property.area ?? '—'} m²
                  </p>
                  {property.description && <p className="card-desc">{property.description}</p>}

                  <div className="card-actions">
                    <Button
                      variant="outline"
                      disabled={favoritingId === property.id}
                      onClick={() => handleFavoritar(property)}
                    >
                      {favoritingId === property.id ? '...' : `🤍 ${t('dashboard.card.favorite')}`}
                    </Button>
                    <Button onClick={() => navigate(`/imoveis/${property.id}`)}>
                      {t('dashboard.card.offer')}
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      <Modal
        open={isFilterModalOpen}
        title={t('dashboard.modal.title')}
        onClose={() => setIsFilterModalOpen(false)}
        actions={
          <>
            <Button variant="outline" onClick={() => setIsFilterModalOpen(false)}>
              {t('dashboard.modal.cancel')}
            </Button>
            <Button
              onClick={() => {
                setIsFilterModalOpen(false)
                toast({ type: 'warning', message: t('dashboard.modal.wip') })
              }}
            >
              {t('dashboard.modal.apply')}
            </Button>
          </>
        }
      >
        {t('dashboard.modal.text')}
      </Modal>
    </>
  )
}
