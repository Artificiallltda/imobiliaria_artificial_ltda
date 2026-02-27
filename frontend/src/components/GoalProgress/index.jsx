import React from 'react';
import styles from './styles.module.css';

export default function GoalProgress({ goals }) {
  if (!goals) {
    return null;
  }

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const getProgressColor = (percent) => {
    if (percent >= 100) return styles.success;
    if (percent >= 75) return styles.good;
    if (percent >= 50) return styles.warning;
    return styles.danger;
  };

  return (
    <div className={styles.goalContainer}>
      <h3 className={styles.goalTitle}>Meta do Mês</h3>
      
      <div className={styles.goalItem}>
        <div className={styles.goalHeader}>
          <span className={styles.goalLabel}>Receita</span>
          <span className={styles.goalValues}>
            {formatCurrency(goals.currentValue)} / {formatCurrency(goals.targetValue)}
          </span>
        </div>
        <div className={styles.progressBar}>
          <div 
            className={`${styles.progressFill} ${getProgressColor(goals.progressPercent)}`}
            style={{ width: `${Math.min(goals.progressPercent, 100)}%` }}
          />
        </div>
        <div className={styles.goalPercent}>
          {goals.progressPercent.toFixed(1)}% atingido
        </div>
      </div>

      <div className={styles.goalItem}>
        <div className={styles.goalHeader}>
          <span className={styles.goalLabel}>Negócios</span>
          <span className={styles.goalValues}>
            {goals.currentDeals} / {goals.targetDeals}
          </span>
        </div>
        <div className={styles.progressBar}>
          <div 
            className={`${styles.progressFill} ${getProgressColor((goals.currentDeals / goals.targetDeals) * 100)}`}
            style={{ width: `${Math.min((goals.currentDeals / goals.targetDeals) * 100, 100)}%` }}
          />
        </div>
        <div className={styles.goalPercent}>
          {goals.targetDeals > 0 ? ((goals.currentDeals / goals.targetDeals) * 100).toFixed(1) : 0}% atingido
        </div>
      </div>
    </div>
  );
}
