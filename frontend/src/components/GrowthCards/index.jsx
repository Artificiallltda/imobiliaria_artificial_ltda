import React from 'react';
import styles from './styles.module.css';

export default function GrowthCards({ growth }) {
  const formatGrowth = (value) => {
    const formatted = value.toFixed(1);
    const sign = value > 0 ? '+' : '';
    return `${sign}${formatted}%`;
  };

  const getGrowthColor = (value) => {
    if (value > 0) return styles.positive;
    if (value < 0) return styles.negative;
    return styles.neutral;
  };

  const getGrowthIcon = (value) => {
    if (value > 0) return '📈';
    if (value < 0) return '📉';
    return '➡️';
  };

  return (
    <div className={styles.growthGrid}>
      <div className={`${styles.growthCard} ${getGrowthColor(growth?.leads || 0)}`}>
        <div className={styles.growthIcon}>
          <span>{getGrowthIcon(growth?.leads || 0)}</span>
        </div>
        <div className={styles.growthContent}>
          <div className={styles.growthLabel}>Leads</div>
          <div className={styles.growthValue}>
            {formatGrowth(growth?.leads || 0)}
          </div>
        </div>
      </div>

      <div className={`${styles.growthCard} ${getGrowthColor(growth?.revenue || 0)}`}>
        <div className={styles.growthIcon}>
          <span>{getGrowthIcon(growth?.revenue || 0)}</span>
        </div>
        <div className={styles.growthContent}>
          <div className={styles.growthLabel}>Receita</div>
          <div className={styles.growthValue}>
            {formatGrowth(growth?.revenue || 0)}
          </div>
        </div>
      </div>

      <div className={`${styles.growthCard} ${getGrowthColor(growth?.closed_deals || 0)}`}>
        <div className={styles.growthIcon}>
          <span>{getGrowthIcon(growth?.closed_deals || 0)}</span>
        </div>
        <div className={styles.growthContent}>
          <div className={styles.growthLabel}>Negócios Fechados</div>
          <div className={styles.growthValue}>
            {formatGrowth(growth?.closed_deals || 0)}
          </div>
        </div>
      </div>
    </div>
  );
}
