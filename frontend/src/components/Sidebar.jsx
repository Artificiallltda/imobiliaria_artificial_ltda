// src/components/Sidebar.jsx
import { NavLink } from "react-router-dom";

const MenuLink = ({ to, icon, children, onNavigate, collapsed }) => {
  return (
    <NavLink
      to={to}
      end
      onClick={onNavigate}
      className={({ isActive }) =>
        ["nav-item", isActive ? "active" : ""].filter(Boolean).join(" ")
      }
      title={collapsed ? children : undefined}
    >
      <span className="nav-icon">{icon}</span>
      {!collapsed && children}
    </NavLink>
  );
};

export default function Sidebar({
  collapsed,
  setCollapsed,
  mobileOpen,
  setMobileOpen,
  onLogout,
}) {
  const handleNavigate = () => {
    if (mobileOpen) setMobileOpen(false);
  };

  return (
    <>
      {mobileOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside
        className={[
          "sidebar",
          collapsed ? "sidebar-collapsed" : "",
          mobileOpen ? "sidebar-mobile-open" : "",
        ].join(" ")}
      >
        <div className="logo">
          {collapsed ? "I" : "Imobiliária"}

          <button
            type="button"
            className="icon-btn desktop-only"
            onClick={() => setCollapsed((v) => !v)}
            aria-label={collapsed ? "Expandir sidebar" : "Recolher sidebar"}
            style={{ marginLeft: "auto" }}
          >
            {collapsed ? "»" : "«"}
          </button>

          <button
            type="button"
            className="icon-btn sidebar-close-btn"
            onClick={() => setMobileOpen(false)}
            aria-label="Fechar menu"
          >
            ✕
          </button>
        </div>

        <nav className="nav-section">
          {!collapsed && <span className="nav-label">MENU PRINCIPAL</span>}

          <MenuLink to="/dashboard" icon="▢" collapsed={collapsed} onNavigate={handleNavigate}>
            Dashboard
          </MenuLink>

          {/* ✅ MANTÉM LEADS AQUI */}
          <MenuLink to="/leads" icon="👥" collapsed={collapsed} onNavigate={handleNavigate}>
            Leads
          </MenuLink>

          <MenuLink to="/favoritos" icon="★" collapsed={collapsed} onNavigate={handleNavigate}>
            Lista de Favoritos
          </MenuLink>

          <MenuLink to="/mensagens" icon="✉" collapsed={collapsed} onNavigate={handleNavigate}>
            Mensagens
          </MenuLink>
        </nav>

        <nav className="nav-section">
          {!collapsed && <span className="nav-label">MEUS IMÓVEIS</span>}

          <MenuLink to="/imoveis" icon="⌂" collapsed={collapsed} onNavigate={handleNavigate}>
            Lista de Imóveis
          </MenuLink>

          <MenuLink to="/meus-favoritos" icon="☆" collapsed={collapsed} onNavigate={handleNavigate}>
            Meus Favoritos
          </MenuLink>

          <MenuLink to="/personalizar" icon="⚙" collapsed={collapsed} onNavigate={handleNavigate}>
            Personalizar
          </MenuLink>
        </nav>

        <button className="nav-item nav-logout" type="button" onClick={onLogout}>
          <span className="nav-icon">→</span>
          {!collapsed && "Sair"}
        </button>
      </aside>
    </>
  );
}
