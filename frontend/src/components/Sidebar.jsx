// src/components/Sidebar.jsx
import { NavLink } from "react-router-dom";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  CloseIcon,
  DashboardIcon,
  HomeIcon,
  LeadsIcon,
  LogoutIcon,
  MessagesIcon,
  SettingsIcon,
  StarIcon,
} from "./Icons";
import { useI18n } from "../i18n/index.jsx";

const MenuLink = ({ to, icon, label, onNavigate, collapsed }) => {
  return (
    <NavLink
      to={to}
      end
      onClick={onNavigate}
      className={({ isActive }) =>
        ["nav-item", isActive ? "active" : ""].filter(Boolean).join(" ")
      }
      title={collapsed ? label : undefined}
      aria-label={label}
    >
      <span className="nav-icon">{icon}</span>
      {!collapsed && label}
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
  const { t } = useI18n();

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
        aria-label={t("sidebar.aria")}
      >
        <div className="logo">
          {collapsed ? t("sidebar.logoShort") : t("sidebar.logo")}

          <button
            type="button"
            className="icon-btn desktop-only"
            onClick={() => setCollapsed((v) => !v)}
            aria-label={
              collapsed ? t("sidebar.actions.expand") : t("sidebar.actions.collapse")
            }
            title={
              collapsed ? t("sidebar.actions.expand") : t("sidebar.actions.collapse")
            }
            style={{ marginLeft: "auto" }}
          >
            {collapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </button>

          <button
            type="button"
            className="icon-btn sidebar-close-btn"
            onClick={() => setMobileOpen(false)}
            aria-label={t("sidebar.actions.closeMenu")}
            title={t("sidebar.actions.closeMenu")}
          >
            <CloseIcon />
          </button>
        </div>

        <nav className="nav-section" aria-label={t("sidebar.sections.main")}>
          {!collapsed && <span className="nav-label">{t("sidebar.sections.main")}</span>}

          <MenuLink
            to="/dashboard"
            icon={<DashboardIcon />}
            collapsed={collapsed}
            onNavigate={handleNavigate}
            label={t("sidebar.links.dashboard")}
          />

          {/* ✅ MANTÉM LEADS AQUI */}
          <MenuLink
            to="/leads"
            icon={<LeadsIcon />}
            collapsed={collapsed}
            onNavigate={handleNavigate}
            label={t("sidebar.links.leads")}
          />

          <MenuLink
            to="/mensagens"
            icon={<MessagesIcon />}
            collapsed={collapsed}
            onNavigate={handleNavigate}
            label={t("sidebar.links.messages")}
          />
        </nav>

        <nav className="nav-section" aria-label={t("sidebar.sections.myProperties")}>
          {!collapsed && (
            <span className="nav-label">{t("sidebar.sections.myProperties")}</span>
          )}

          <MenuLink
            to="/imoveis"
            icon={<HomeIcon />}
            collapsed={collapsed}
            onNavigate={handleNavigate}
            label={t("sidebar.links.propertiesList")}
          />

          <MenuLink
            to="/admin/properties"
            icon={<HomeIcon />}
            collapsed={collapsed}
            onNavigate={handleNavigate}
            label={t("sidebar.links.adminProperties")}
          />

          <MenuLink
            to="/meus-favoritos"
            icon={<StarIcon />}
            collapsed={collapsed}
            onNavigate={handleNavigate}
            label={t("sidebar.links.myFavorites")}
          />

          <MenuLink
            to="/personalizar"
            icon={<SettingsIcon />}
            collapsed={collapsed}
            onNavigate={handleNavigate}
            label={t("sidebar.links.customize")}
          />
        </nav>

        <button
          className="nav-item nav-logout"
          type="button"
          onClick={onLogout}
          aria-label={t("sidebar.actions.logout")}
          title={collapsed ? t("sidebar.actions.logout") : undefined}
        >
          <span className="nav-icon">
            <LogoutIcon />
          </span>
          {!collapsed && t("sidebar.actions.logout")}
        </button>
      </aside>
    </>
  );
}
