import { useEffect, useMemo, useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate, NavLink, Outlet } from 'react-router-dom'
import {
  Button,
  Card,
  Input,
  Modal,
  Select,
  StatusTag,
  useToast,
} from './components/ui/index.js'
import Login from './pages/login/index.jsx'
import Leads from './pages/Leads.jsx'
import { isAuthenticated, logout as doLogout } from './services/auth.js'

function App() {
  const [auth, setAuth] = useState(false)

  useEffect(() => {
    setAuth(isAuthenticated())
  }, [])

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
          <Route path="/leads" element={<Leads />} />

          {/* Rotas placeholders (mantém menu) */}
          <Route path="/favoritos" element={<SimplePage title="Lista de Favoritos" />} />
          <Route path="/mensagens" element={<SimplePage title="Mensagens" />} />
          <Route path="/imoveis" element={<SimplePage title="Lista de Imóveis" />} />
          <Route path="/meus-favoritos" element={<SimplePage title="Meus Favoritos" />} />
          <Route path="/personalizar" element={<SimplePage title="Personalizar" />} />

          <Route path="*" element={<SimplePage title="404 - Não encontrado" />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App

function AppLayout({ onLogout }) {
  const handleLogout = () => {
    doLogout()
    onLogout()
  }

  return (
    <div className="app">
      {/* Sidebar esquerda */}
      <aside className="sidebar">
        <div className="logo">Imobiliária</div>

        <nav className="nav-section">
          <span className="nav-label">MENU PRINCIPAL</span>

          <NavItem to="/dashboard" icon="▢" label="Dashboard" />
          <NavItem to="/leads" icon="👥" label="Leads" />
          <NavItem to="/favoritos" icon="★" label="Lista de Favoritos" />
          <NavItem to="/mensagens" icon="✉" label="Mensagens" />
        </nav>

        <nav className="nav-section">
          <span className="nav-label">MEUS IMÓVEIS</span>

          <NavItem to="/imoveis" icon="⌂" label="Lista de Imóveis" />
          <NavItem to="/meus-favoritos" icon="☆" label="Meus Favoritos" />
          <NavItem to="/personalizar" icon="⚙" label="Personalizar" />
        </nav>

        <button className="nav-item nav-logout" type="button" onClick={handleLogout}>
          <span className="nav-icon">→</span> Sair
        </button>
      </aside>

      {/* Área principal */}
      <div className="main-wrapper">
        {/* Header */}
        <header className="header">
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
            <button className="icon-btn">⚙</button>
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

function NavItem({ to, icon, label }) {
  return (
    <NavLink
      to={to}
      end
      className={({ isActive }) =>
        ['nav-item', isActive ? 'active' : ''].filter(Boolean).join(' ')
      }
    >
      <span className="nav-icon">{icon}</span> {label}
    </NavLink>
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

          <Button
            className="btn-search"
            onClick={() => toast({ type: 'success', message: 'Busca iniciada (mock).' })}
          >
            Buscar
          </Button>
        </div>
      </section>

      <section className="listings-section">
        <div className="listings-header">
          <h2>Imóveis Disponíveis</h2>
          <span className="results-count">0 encontrados</span>

          <Button
            variant="outline"
            className="btn-filter"
            onClick={() => setIsFilterModalOpen(true)}
          >
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
                // TODO - Aplicar filtros e busca via backend quando a API estiver disponível
                setIsFilterModalOpen(false)
                toast({ type: 'warning', message: 'Filtros aplicados (mock).' })
              }}
            >
              Aplicar
            </Button>
          </>
        }
      >
        Ajuste seus filtros e clique em “Aplicar”.
      </Modal>
    </>
  )
}
