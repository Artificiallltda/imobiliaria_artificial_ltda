// src/mocks/dashboardMock.jsx

// TODO - Substituir dados mockados futuramente pela API
// Esses dados estão sendo usados apenas para desenvolvimento do frontend

export const dashboardMock = {
  stats: [
    {
      key: "totalImoveis",
      label: "Total de imóveis cadastrados",
      value: 128,
      icon: "🏠",
      tone: "primary",
    },
    {
      key: "imoveisAtivos",
      label: "Imóveis ativos",
      value: 87,
      icon: "✅",
      tone: "success",
    },
    {
      key: "imoveisVendidos",
      label: "Imóveis vendidos",
      value: 19,
      icon: "💰",
      tone: "warning",
    },
    {
      key: "novasMensagens",
      label: "Novas mensagens",
      value: 5,
      icon: "✉️",
      tone: "info",
    },
    {
      key: "favoritos",
      label: "Favoritos",
      value: 32,
      icon: "⭐",
      tone: "neutral",
    },
  ],

  overview: {
    ultimaAtualizacao: "Hoje • 09:40",
    observacao: "Indicadores baseados em dados simulados para frontend.",
  },
};
