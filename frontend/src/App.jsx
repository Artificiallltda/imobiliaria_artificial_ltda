import { useMemo, useState } from 'react'
import {
  Button,
  Card,
  Input,
  Modal,
  Select,
  StatusTag,
  useToast,
} from './components/ui/index.js'

function App() {
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

import React, { useEffect, useState } from 'react'
import Login from './pages/login/index.jsx'
import { isAuthenticated, logout as doLogout } from './services/auth.js'

function App() {
  // TODO: Migrar este controle simples de auth para react-router com ProtectedRoute e/ou AuthContext.
  const [auth, setAuth] = useState(false)

  useEffect(() => {
    setAuth(isAuthenticated())
  }, [])

  if (!auth) {
    return <Login onSuccess={() => setAuth(true)} />
  }

  const handleLogout = () => {
    doLogout()
    setAuth(false)
  }
  return (
    <div className="app">
      {/* Sidebar esquerda */}
      <aside className="sidebar">
        <div className="logo">Imobiliária</div>
        <nav className="nav-section">
          <span className="nav-label">MENU PRINCIPAL</span>
          <a href="#" className="nav-item active">
            <span className="nav-icon">▢</span> Dashboard
          </a>
          <a href="#" className="nav-item">
            <span className="nav-icon">★</span> Lista de Favoritos
          </a>
          <a href="#" className="nav-item">
            <span className="nav-icon">✉</span> Mensagens
          </a>
        </nav>
        <nav className="nav-section">
          <span className="nav-label">MEUS IMÓVEIS</span>
          <a href="#" className="nav-item">
            <span className="nav-icon">⌂</span> Lista de Imóveis
          </a>
          <a href="#" className="nav-item">
            <span className="nav-icon">☆</span> Meus Favoritos
          </a>
          <a href="#" className="nav-item">
            <span className="nav-icon">⚙</span> Personalizar
          </a>
        </nav>
        <a href="#" className="nav-item nav-logout" onClick={handleLogout}>
          <span className="nav-icon">→</span> Sair
        </a>
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
            <Button>Sair</Button>
            <button className="btn-primary" onClick={handleLogout}>Sair</button>
          </div>
        </header>

        <div className="content-area">
          {/* Centro - Busca e listagem */}
          <main className="main-content">
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
        Ajuste seus filtros e clique em “Aplicar”.
      </Modal>
    </div>
  )
}

export default App
