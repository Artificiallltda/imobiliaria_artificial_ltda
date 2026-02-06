// src/pages/Dashboard.jsx
import StatCard from "../components/Dashboard/StatCard";
import { dashboardMock } from "../mocks/dashboardMock";

export default function Dashboard() {
  // TODO - Substituir dados mockados futuramente pela API
  // Esses dados estão sendo usados apenas para desenvolvimento do frontend
  const { stats, overview } = dashboardMock;

  return (
    <div className="page">
      <div className="dashboard-header">
        <div>
          <h2>Dashboard</h2>
          <p className="muted">
            Visão geral do painel para corretor/gestor.
          </p>
        </div>

        <div className="dashboard-meta">
          <span className="meta-pill">🕒 {overview.ultimaAtualizacao}</span>
          <span className="meta-pill">ℹ️ {overview.observacao}</span>
        </div>
      </div>

      <section className="dashboard-grid" aria-label="Indicadores principais">
        {stats.map((item) => (
          <StatCard
            key={item.key}
            icon={item.icon}
            label={item.label}
            value={item.value}
            tone={item.tone}
          />
        ))}
      </section>

      <section className="panel">
        <h2>Próximos passos</h2>
        <p className="muted">
          Sugestões de evolução do painel (frontend).
        </p>

        <ul className="dashboard-list">
          <li>Adicionar gráfico de visitas por período</li>
          <li>Listar últimas mensagens recebidas</li>
          <li>Mostrar últimos imóveis cadastrados</li>
          <li>Conectar dados reais quando a API estiver disponível</li>
        </ul>
      </section>
    </div>
  );
}
