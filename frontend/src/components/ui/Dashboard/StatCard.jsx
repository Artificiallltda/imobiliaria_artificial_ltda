// src/components/Dashboard/StatCard.jsx
import styles from './StatCard.module.css';

export default function StatCard({ icon, label, value, tone = "primary" }) {
  return (
    <div className={`${styles.statCard} ${styles[`stat${tone.charAt(0).toUpperCase() + tone.slice(1)}`]}`}>
      <div className={styles.statTop}>
        <div className={styles.statIcon} aria-hidden="true">
          {icon}
        </div>
        <span className={styles.statLabel}>{label}</span>
      </div>

      <div className={styles.statValue}>{value}</div>
      <div className={styles.statFoot}>Atualizado automaticamente</div>
    </div>
  );
}
