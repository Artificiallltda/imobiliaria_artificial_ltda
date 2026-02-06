// src/pages/Dashboard.jsx
export default function Dashboard() {
  return (
    <div className="page">
      {/* HERO + FILTRO */}
      <section className="hero">
        <div className="hero-overlay" />

        <div className="hero-content">
          <div className="hero-top">
            <h1 className="hero-title">Encontre o imóvel ideal</h1>
            <p className="hero-subtitle">
              Busque por tipo, cidade, faixa de preço e características.
            </p>
          </div>

          <form className="filter-card" onSubmit={(e) => e.preventDefault()}>
            <div className="filter-grid">
              <div className="field">
                <label>Tipo de negócio</label>
                <select defaultValue="">
                  <option value="" disabled>Selecione</option>
                  <option>Venda</option>
                  <option>Locação</option>
                  <option>Temporada</option>
                </select>
              </div>

              <div className="field">
                <label>Tipo de imóvel</label>
                <select defaultValue="">
                  <option value="" disabled>Selecione</option>
                  <option>Apartamento</option>
                  <option>Casa</option>
                  <option>Terreno</option>
                  <option>Comercial</option>
                </select>
              </div>

              <div className="field">
                <label>Cidade</label>
                <select defaultValue="">
                  <option value="" disabled>Selecione</option>
                  <option>São Paulo</option>
                  <option>Rio de Janeiro</option>
                  <option>Belo Horizonte</option>
                </select>
              </div>

              <div className="field">
                <label>Bairro</label>
                <input type="text" placeholder="Ex: Centro" />
              </div>

              <div className="field">
                <label>Quartos</label>
                <select defaultValue="">
                  <option value="" disabled>Selecione</option>
                  <option>1</option>
                  <option>2</option>
                  <option>3</option>
                  <option>4+</option>
                </select>
              </div>

              <div className="field">
                <label>Banheiros</label>
                <select defaultValue="">
                  <option value="" disabled>Selecione</option>
                  <option>1</option>
                  <option>2</option>
                  <option>3+</option>
                </select>
              </div>

              <div className="field">
                <label>Valor mínimo</label>
                <input type="text" placeholder="R$ 0" />
              </div>

              <div className="field">
                <label>Valor máximo</label>
                <input type="text" placeholder="R$ 0" />
              </div>

              <div className="field field-code">
                <label>Buscar pelo código</label>
                <input type="text" placeholder="Ex: IMV-1023" />
              </div>

              <button className="btn-search-hero" type="submit">
                BUSCAR
              </button>
            </div>

            <div className="filter-footer">
              <button className="link-btn" type="button">
                + Filtros avançados
              </button>
              <span className="filter-hint">Dica: use o código para ir direto ao imóvel.</span>
            </div>
          </form>
        </div>
      </section>

      {/* LISTAGEM (mantive simples por enquanto) */}
      <section className="panel">
        <div className="listings-header">
          <div>
            <h2>Imóveis Disponíveis</h2>
            <p className="muted">Mostrando resultados com base nos filtros.</p>
          </div>

          <div className="listings-actions">
            <span className="results-pill">3 encontrados</span>
            <button className="btn-filter" type="button">
              Filtrar por
            </button>
          </div>
        </div>

        <div className="property-cards">
          {[1, 2, 3].map((i) => (
            <div key={i} className="property-card">
              <div className="card-image">
                <div className="img-placeholder" />
                <span className="badge">Ativo</span>
              </div>

              <div className="card-content">
                <div className="card-top">
                  <h3>Imóvel exemplo {i}</h3>
                  <span className="status-pill">Disponível</span>
                </div>

                <p className="card-location">Cidade, Estado • há pouco</p>
                <p className="card-price">R$ 0,00</p>
                <p className="card-details">— quartos • — banheiros • — m²</p>
                <p className="card-desc">
                  Descrição do imóvel. Texto curto para dar contexto e incentivar o clique.
                </p>

                <div className="card-actions">
                  <button className="btn-outline" type="button">
                    Favoritar
                  </button>
                  <button className="btn-primary" type="button">
                    Fazer Oferta
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
