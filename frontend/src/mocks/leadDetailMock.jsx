// src/mocks/leadDetailMock.jsx

// TODO - Substituir dados mockados futuramente pela API

const now = new Date()

export const leadDetailMock = {
  '1': {
    lead: {
      id: '1',
      name: 'Gean Carlos',
      email: 'gean.carlos@exemplo.com',
      phone: '(11) 99111-2233',
      status: 'pending',
      createdAt: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    },
    messages: [
      {
        id: 'g1',
        sender: 'lead',
        text: 'Olá! Estou procurando um apê de 2 quartos perto do metrô. Tem algo na Vila Mariana?',
        createdAt: new Date(now.getTime() - 1000 * 60 * 60 * 26).toISOString(),
      },
      {
        id: 'g2',
        sender: 'agent',
        text: 'Oi Gean! Tenho sim. Qual faixa de valor e se precisa de vaga na garagem?',
        createdAt: new Date(now.getTime() - 1000 * 60 * 60 * 25.5).toISOString(),
      },
      {
        id: 'g3',
        sender: 'lead',
        text: 'Até R$ 900k e 1 vaga. Se tiver varanda, melhor ainda.',
        createdAt: new Date(now.getTime() - 1000 * 60 * 60 * 25).toISOString(),
      },
      {
        id: 'g4',
        sender: 'agent',
        text: 'Perfeito. Vou te enviar 3 opções com planta e condomínio. Prefere visita sábado ou domingo?',
        createdAt: new Date(now.getTime() - 1000 * 60 * 60 * 24.5).toISOString(),
      },
      {
        id: 'g5',
        sender: 'lead',
        text: 'Sábado de manhã seria ideal. Pode ser entre 10h e 12h.',
        createdAt: new Date(now.getTime() - 1000 * 60 * 60 * 24).toISOString(),
      },
      {
        id: 'g6',
        sender: 'agent',
        text: 'Fechado! Vou confirmar disponibilidade com o proprietário e te retorno ainda hoje.',
        createdAt: new Date(now.getTime() - 1000 * 60 * 60 * 23.5).toISOString(),
      },
    ],
  },
  '2': {
    lead: {
      id: '2',
      name: 'Deborah Victoria',
      email: 'deborah.victoria@exemplo.com',
      phone: '(21) 98876-1122',
      status: 'active',
      createdAt: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 3).toISOString(),
    },
    messages: [
      {
        id: 'd1',
        sender: 'lead',
        text: 'Oi! Gostei de um imóvel no Campo Belo. Ainda está disponível?',
        createdAt: new Date(now.getTime() - 1000 * 60 * 60 * 40).toISOString(),
      },
      {
        id: 'd2',
        sender: 'agent',
        text: 'Oi Deborah! Está sim. Você busca para morar ou investir?',
        createdAt: new Date(now.getTime() - 1000 * 60 * 60 * 39.5).toISOString(),
      },
      {
        id: 'd3',
        sender: 'lead',
        text: 'Para morar. Preciso de 3 quartos e pelo menos 2 banheiros.',
        createdAt: new Date(now.getTime() - 1000 * 60 * 60 * 39).toISOString(),
      },
      {
        id: 'd4',
        sender: 'agent',
        text: 'Entendi. Esse atende 3Q e 2B. Quer que eu te envie o vídeo do tour e detalhes do condomínio?',
        createdAt: new Date(now.getTime() - 1000 * 60 * 60 * 38.5).toISOString(),
      },
      {
        id: 'd5',
        sender: 'lead',
        text: 'Sim, por favor. E se tiver opção com 2 vagas também me interessa.',
        createdAt: new Date(now.getTime() - 1000 * 60 * 60 * 38).toISOString(),
      },
      {
        id: 'd6',
        sender: 'agent',
        text: 'Enviei o tour. Sobre as 2 vagas, tenho uma opção parecida a 4 quadras, posso te mandar?',
        createdAt: new Date(now.getTime() - 1000 * 60 * 60 * 37.5).toISOString(),
      },
      {
        id: 'd7',
        sender: 'lead',
        text: 'Pode mandar! Se der, quero agendar visita nessa semana.',
        createdAt: new Date(now.getTime() - 1000 * 60 * 60 * 37).toISOString(),
      },
    ],
  },
}

export function getLeadDetailMockById(id) {
  // TODO - Substituir por chamada ao backend
  const key = String(id)
  if (leadDetailMock[key]) return leadDetailMock[key]

  return {
    lead: {
      id: String(id),
      name: 'Lead não encontrado (mock)',
      email: '—',
      phone: '—',
      status: 'error',
      createdAt: new Date().toISOString(),
    },
    messages: [],
  }
}
