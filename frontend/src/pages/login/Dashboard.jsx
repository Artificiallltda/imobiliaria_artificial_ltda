// src/pages/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import StatCard from "../../components/ui/Dashboard/StatCard";
import LeadsChart from "../../components/LeadsChart";
import RankingTable from "../../components/RankingTable";
import { api } from '../../services/api';
import styles from './Dashboard.module.css';

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [period, setPeriod] = useState('30d');

  useEffect(() => {
    fetchDashboard();
  }, [period]);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      console.log('Buscando dados do dashboard...');
      const url = `http://127.0.0.1:8000/dashboard/overview?period=${period}`;
      console.log('URL completa:', url);
      
      // Tentando com fetch direto
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      console.log('Status da resposta:', response.status);
      console.log('Status OK?', response.ok);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Dados recebidos:', data);
      setData(data);
      setError(null);
    } catch (err) {
      console.error('Erro ao buscar dados do dashboard:', err);
      setError('Não foi possível carregar os dados do dashboard');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatPercentage = (value) => {
    return `${value.toFixed(1)}%`;
  };

  const formatStatusText = (status) => {
    const statusMap = {
      'novo': 'Novo',
      'em_atendimento': 'Em Atendimento',
      'proposta_enviada': 'Proposta Enviada',
      'fechado': 'Fechado',
      'perdido': 'Perdido'
    };
    return statusMap[status] || status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  if (loading && !data) {
    return (
      <div className={styles.dashboardPage}>
        <div className={styles.loadingContainer}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>⏳</div>
          <p>Carregando dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.dashboardPage}>
        <div className={styles.errorContainer}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>❌</div>
          <p>{error}</p>
          <button onClick={fetchDashboard}>
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  const stats = data?.totals || {};
  console.log('Renderizando dashboard com dados:', { data, stats, period });

  return (
    <div className={styles.dashboardPage}>
      <div className={styles.dashboardHeader}>
        <div>
          <h2>Dashboard</h2>
          <p>
            Visão geral do painel para corretor/gestor.
          </p>
        </div>

        <div className={styles.dashboardControls}>
          <select 
            value={period} 
            onChange={(e) => setPeriod(e.target.value)}
            className={styles.periodSelect}
          >
            <option value="7d">Últimos 7 dias</option>
            <option value="30d">Últimos 30 dias</option>
            <option value="12m">Últimos 12 meses</option>
          </select>
        </div>
      </div>

      <section className={styles.dashboardGrid} aria-label="Indicadores principais">
        <StatCard
          icon="📊"
          label="Total de Leads"
          value={stats.totalLeads || 0}
          tone="primary"
        />
        <StatCard
          icon="💰"
          label="Receita Estimada"
          value={formatCurrency(data?.estimatedRevenue || 0)}
          tone="success"
        />
        <StatCard
          icon="📈"
          label="Taxa de Conversão"
          value={formatPercentage(data?.conversionRate || 0)}
          tone="warning"
        />
        <StatCard
          icon="🏠"
          label="Imóveis Ativos"
          value={stats.activeProperties || 0}
          tone="info"
        />
      </section>

      <div className={styles.dashboardRow}>
        <section className={styles.dashboardCol}>
          <LeadsChart 
            data={data?.leadsByMonth || []} 
            loading={loading}
          />
        </section>

        <section className={styles.dashboardCol}>
          <RankingTable 
            data={data?.ranking || []} 
            loading={loading}
          />
        </section>
      </div>

      <section className={styles.dashboardCol}>
        <h2 style={{ marginBottom: '16px', color: '#1e293b' }}>Status dos Leads</h2>
        <div className={styles.leadsStatusGrid}>
          {Object.entries(stats.leadsByStatus || {}).map(([status, count]) => (
            <div key={status} className={`${styles.statusItem} ${styles[`status-${status}`]}`}>
              <span className={styles.statusCount}>{count}</span>
              <span className={styles.statusLabel}>{formatStatusText(status)}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
