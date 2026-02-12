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
import { isAuthenticated, logout as doLogout } from './services/auth.js'
import { useTheme } from './context/ThemeContext.jsx'
import { useI18n } from './i18n/index.jsx'

function App() {
  const [auth, setAuth] = useState(false)

  useEffect(() => {
    setAuth(isAuthenticated())
  }, [])

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

          {/* Outros */}
          <Route path="/meus-favoritos" element={<SimplePage titleKey="pages.myFavorites" />} />
          <Route path="/personalizar" element={<SimplePage titleKey="pages.customize" />} />

          <Route path="*" element={<SimplePage titleKey="pages.notFound" />} />
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
      <Sidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        onLogout={handleLogout}
      />

      <div className="main-wrapper">
        <header className="header">
          <div className="header-brand">
            <div className="brand-mark">IA</div>
            <div>
              <strong className="brand-title">{t('app.brand.title')}</strong>
              <span className="brand-tagline">{t('app.brand.tagline')}</span>
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
            <button
              className="icon-btn mobile-menu-btn"
              type="button"
              onClick={() => setMobileOpen(true)}
              aria-label={t('header.actions.settings')}
            >
              <MenuIcon />
            </button>

            <button className="icon-btn" type="button" aria-label={t('header.actions.settings')}>
              <SettingsIcon />
            </button>

            {/* Seletor de idioma */}
            <select
              value={locale}
              onChange={(e) => setLocale(e.target.value)}
              className="leads-select"
              style={{ height: 36, padding: '0 10px' }}
              aria-label={t('language.label')}
              title={t('language.label')}
            >
              <option value="pt-BR">{t('language.ptBR')}</option>
              <option value="en-US">{t('language.enUS')}</option>
              <option value="es-ES">{t('language.esES')}</option>
            </select>

            {/* Toggle tema */}
            <button
              className="icon-btn"
              type="button"
              onClick={toggleTheme}
              aria-label="Toggle theme"
              title={theme === 'dark' ? t('header.actions.themeToLight') : t('header.actions.themeToDark')}
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

          <aside className="right-sidebar">
            <h2>{t('rightSidebar.title')}</h2>

            <Card className="featured-card" variant="flat">
              <div className="img-placeholder large" />
              <StatusTag status="active" className="badge">
                {t('rightSidebar.status')}
              </StatusTag>
              <p className="card-location">{t('rightSidebar.location')}</p>
              <p className="card-price">{t('rightSidebar.price')}</p>
            </Card>

            <Card className="contact-card" variant="flat">
              <StatusTag status="active" className="badge">
                {t('rightSidebar.status')}
              </StatusTag>
              <p>{t('rightSidebar.contact.location')}</p>
              <p>{t('rightSidebar.contact.phone')}</p>
              <p>{t('rightSidebar.contact.email')}</p>
              <Button>{t('rightSidebar.contact.action')}</Button>
            </Card>
          </aside>
        </div>
      </div>
    </div>
  )
}

function SimplePage({ titleKey }) {
  const { t } = useI18n()
  return (
    <div className="page">
      <h2>{t(titleKey)}</h2>
      <p className="muted">{t('pages.simpleMock')}</p>
    </div>
  )
}

function DashboardPage() {
  const { toast } = useToast()
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false)
  const { t } = useI18n()

  const selectOptions = useMemo(
    () => [
      { value: '1', label: '1' },
      { value: '2', label: '2' },
      { value: '3', label: '3' },
    ],
    [],
  )

  return (
    <>
      <section className="search-section">
        <h2>{t('dashboard.findProperty')}</h2>

        <div className="search-grid">
          <Input placeholder={t('dashboard.placeholders.location')} />
          <Input placeholder={t('dashboard.placeholders.minPrice')} />
          <Input placeholder={t('dashboard.placeholders.maxPrice')} />
          <Input placeholder={t('dashboard.placeholders.maxKm')} />
          <Select placeholder={t('dashboard.placeholders.type')} defaultValue="" options={selectOptions} />
          <Select placeholder={t('dashboard.placeholders.bedrooms')} defaultValue="" options={selectOptions} />
          <Select placeholder={t('dashboard.placeholders.bathrooms')} defaultValue="" options={selectOptions} />
          <Select placeholder={t('dashboard.placeholders.city')} defaultValue="" options={selectOptions} />
          <Select placeholder={t('dashboard.placeholders.country')} defaultValue="" options={selectOptions} />

          <Button
            className="btn-search"
            onClick={() => toast({ type: 'success', message: t('dashboard.toastSearchStarted') })}
          >
            {t('dashboard.search')}
          </Button>
        </div>
      </section>

      <section className="listings-section">
        <div className="listings-header">
          <h2>{t('dashboard.listings.title')}</h2>
          <span className="results-count">{t('dashboard.listings.resultsCount', { count: 0 })}</span>
          <Button variant="outline" className="btn-filter" onClick={() => setIsFilterModalOpen(true)}>
            {t('dashboard.listings.filterBy')}
          </Button>
        </div>

        <div className="property-cards">
          {[1, 2, 3].map((i) => (
            <div key={i} className="property-card">
              <div className="card-image">
                <div className="img-placeholder" />
                <StatusTag status="active" className="badge">
                  {t('dashboard.card.status')}
                </StatusTag>
              </div>

              <div className="card-content">
                <h3>{t('dashboard.card.exampleTitle', { n: i })}</h3>
                <p className="card-location">{t('dashboard.card.locationRecent')}</p>
                <p className="card-price">{t('dashboard.card.priceZero')}</p>
                <p className="card-details">{t('dashboard.card.details')}</p>
                <p className="card-desc">{t('dashboard.card.desc')}</p>

                <div className="card-actions">
                  <Button variant="outline">{t('dashboard.card.actions.favorite')}</Button>
                  <Button>{t('dashboard.card.actions.offer')}</Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Modal
        open={isFilterModalOpen}
        title={t('dashboard.modal.filters.title')}
        onClose={() => setIsFilterModalOpen(false)}
        actions={
          <>
            <Button variant="outline" onClick={() => setIsFilterModalOpen(false)}>
              {t('dashboard.modal.filters.cancel')}
            </Button>
            <Button
              onClick={() => {
                setIsFilterModalOpen(false)
                toast({ type: 'warning', message: t('dashboard.modal.filters.toastApplied') })
              }}
            >
              {t('dashboard.modal.filters.apply')}
            </Button>
          </>
        }
      >
        {t('dashboard.modal.filters.body')}
      </Modal>
    </>
  )
}
