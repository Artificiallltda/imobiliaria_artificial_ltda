import React from 'react';
import styles from './styles.module.css';

const RankingTable = ({ data = [], loading = false }) => {
  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Carregando ranking...</div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.noData}>
          <p>Nenhum corretor com negócios fechados no período</p>
        </div>
      </div>
    );
  }

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>🏆 Ranking de Corretores</h3>
      
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Posição</th>
              <th>Nome</th>
              <th>Negócios</th>
              <th>Receita</th>
            </tr>
          </thead>
          <tbody>
            {data.map((corretor, index) => (
              <tr key={corretor.id} className={styles.row}>
                <td className={styles.position}>
                  {index === 0 && '🥇'}
                  {index === 1 && '🥈'}
                  {index === 2 && '🥉'}
                  {index > 2 && `#${index + 1}`}
                </td>
                <td className={styles.name}>{corretor.name}</td>
                <td className={styles.deals}>{corretor.closedDeals}</td>
                <td className={styles.value}>{formatCurrency(corretor.totalValue)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RankingTable;
