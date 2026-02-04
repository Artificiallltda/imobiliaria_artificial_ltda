import Button from './components/Button'
import Input from './components/Input'

function App() {
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
        <a href="#" className="nav-item nav-logout">
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
                <select><option>Tipo</option></select>
                <select><option>Quartos</option></select>
                <select><option>Banheiros</option></select>
                <select><option>Cidade</option></select>
                <select><option>País</option></select>
                <Button className="btn-search">Buscar</Button>
              </div>
            </section>

            <section className="listings-section">
              <div className="listings-header">
                <h2>Imóveis Disponíveis</h2>
                <span className="results-count">0 encontrados</span>
                <Button variant="outline" className="btn-filter">Filtrar por</Button>
              </div>
              <div className="property-cards">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="property-card">
                    <div className="card-image">
                      <div className="img-placeholder" />
                      <span className="badge">Ativo</span>
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
            <div className="featured-card">
              <div className="img-placeholder large" />
              <span className="badge">Ativo</span>
              <p className="card-location">Cidade, Estado</p>
              <p className="card-price">R$ 0,00</p>
            </div>
            <div className="contact-card">
              <span className="badge">Ativo</span>
              <p>Local: Cidade, Estado</p>
              <p>Tel: (00) 00000-0000</p>
              <p>Email: email@exemplo.com</p>
              <Button>Personalizar</Button>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}

export default App
