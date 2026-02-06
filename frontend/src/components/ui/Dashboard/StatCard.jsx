// src/components/Dashboard/StatCard.jsx
export default function StatCard({ icon, label, value, tone = "primary" }) {
  return (
    <div className={`stat-card stat-${tone}`}>
      <div className="stat-top">
        <div className="stat-icon" aria-hidden="true">
          {icon}
        </div>
        <span className="stat-label">{label}</span>
      </div>

      <div className="stat-value">{value}</div>
      <div className="stat-foot">Atualizado automaticamente</div>
    </div>
  );
}
