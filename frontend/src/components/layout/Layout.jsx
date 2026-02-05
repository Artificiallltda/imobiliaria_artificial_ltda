// src/components/layout/Layout.jsx
import { Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import Sidebar from "./Sidebar";

export default function Layout() {
  // Sidebar recolhida (desktop)
  const [collapsed, setCollapsed] = useState(false);

  // Sidebar aberta (mobile)
  const [mobileOpen, setMobileOpen] = useState(false);

  // Fecha o drawer ao voltar para desktop
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth > 768) {
        setMobileOpen(false);
      }
    };

    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <div className="app">
      {/* Sidebar esquerda */}
      <Sidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      {/* Conteúdo principal */}
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
            {/* Botão hamburguer (mobile) */}
            <button
              className="icon-btn mobile-menu-btn"
              onClick={() => setMobileOpen(true)}
              aria-label="Abrir menu"
              type="button"
            >
              ☰
            </button>

            <button
              className="icon-btn"
              aria-label="Configurações"
              type="button"
            >
              ⚙
            </button>

            <div className="avatar">U</div>

            <button className="btn-primary" type="button">
              Sair
            </button>
          </div>
        </header>

        {/* Área central */}
        <div className="content-area">
          <main className="main-content">
            <Outlet />
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
              <button className="btn-primary" type="button">
                Personalizar
              </button>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
