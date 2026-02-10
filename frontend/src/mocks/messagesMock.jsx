// src/mocks/messagesMock.jsx

// TODO - Substituir dados mockados futuramente pela API
// Esses dados estão sendo usados apenas para desenvolvimento do frontend

export const messagesMock = {
  me: {
    id: "agent-1",
    name: "Corretor",
  },

  conversations: [
    {
      id: "c1",
      leadName: "João Silva",
      property: "Apto 2Q • Centro",
      status: "Não lida", // Ativa | Arquivada | Não lida
      unreadCount: 2,
      updatedAt: "2026-02-08T09:10:00",
      messages: [
        {
          id: "m1",
          from: "lead",
          text: "Olá! Vi o anúncio do apartamento no Centro.",
          at: "2026-02-08T08:50:00",
        },
        {
          id: "m2",
          from: "agent",
          text: "Oi João! Claro. Você quer comprar ou alugar?",
          at: "2026-02-08T08:55:00",
        },
        {
          id: "m3",
          from: "lead",
          text: "Comprar. Ele tem vaga de garagem?",
          at: "2026-02-08T09:05:00",
        },
        {
          id: "m4",
          from: "lead",
          text: "E aceita financiamento?",
          at: "2026-02-08T09:10:00",
        },
      ],
    },
    {
      id: "c2",
      leadName: "Maria Oliveira",
      property: "Casa • Jardim Sul",
      status: "Ativa",
      unreadCount: 0,
      updatedAt: "2026-02-07T18:30:00",
      messages: [
        {
          id: "m1",
          from: "lead",
          text: "Boa tarde! Qual o valor do condomínio?",
          at: "2026-02-07T17:40:00",
        },
        {
          id: "m2",
          from: "agent",
          text: "Oi Maria! Nesse caso não há condomínio, é casa.",
          at: "2026-02-07T17:45:00",
        },
        {
          id: "m3",
          from: "lead",
          text: "Perfeito! Podemos agendar uma visita amanhã?",
          at: "2026-02-07T18:30:00",
        },
      ],
    },
    {
      id: "c3",
      leadName: "Pedro Santos",
      property: "Studio • Vila Nova",
      status: "Arquivada",
      unreadCount: 0,
      updatedAt: "2026-02-05T11:15:00",
      messages: [
        {
          id: "m1",
          from: "lead",
          text: "Obrigado! Já fechei com outra opção.",
          at: "2026-02-05T11:15:00",
        },
        {
          id: "m2",
          from: "agent",
          text: "Tudo certo, Pedro! Se precisar no futuro estou à disposição.",
          at: "2026-02-05T11:18:00",
        },
      ],
    },
  ],
};
