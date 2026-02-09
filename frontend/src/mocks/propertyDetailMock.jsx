// TODO - Substituir dados mockados futuramente pela API

export const propertyDetailMock = {
  1: {
    id: 1,
    title: "Apartamento de Luxo em Copacabana",
    type: "apartamento",
    price: 850000,
    status: "disponivel",
    location: "Copacabana, Rio de Janeiro - RJ",
    neighborhood: "Copacabana",
    city: "Rio de Janeiro",
    state: "RJ",
    address: "Avenida Atlântica, 1500",
    bedrooms: 3,
    bathrooms: 2,
    suites: 1,
    parkingSpaces: 2,
    area: 120,
    usableArea: 100,
    description: `
      Excelente apartamento de luxo na prestigiosa Avenida Atlântica, com vista deslumbrante para o mar. 
      Imóvel totalmente reformado com acabamentos de alta qualidade, pisos em porcelanato, armários embutidos 
      e cozinha planejada com granito.
      
      O apartamento oferece 3 quartos espaçosos, sendo 1 suíte master com closet e banheiro privativo, 
      2 banheiros sociais, sala de estar e jantar integradas, cozinha completa e área de serviço.
      
      Localização privilegiada a poucos metros da praia, próximo ao comércio, restaurantes, escolas e 
      transporte público. Edifício com portaria 24h, piscina, academia e salão de festas.
      
      Perfeito para quem busca conforto, segurança e uma das melhores localizações do Rio de Janeiro.
    `,
    features: [
      "Vista para o mar",
      "Portaria 24h",
      "Piscina",
      "Academia",
      "Salão de festas",
      "Ar-condicionado",
      "Armários embutidos",
      "Cozinha planejada",
      "Banheiro social",
      "Área de serviço"
    ],
    images: [
      {
        id: 1,
        url: "apartamento1-sala.jpg",
        alt: "Sala de estar com vista para o mar",
        thumbnail: "apartamento1-sala-thumb.jpg"
      },
      {
        id: 2,
        url: "apartamento1-quarto.jpg", 
        alt: "Suíte master com closet",
        thumbnail: "apartamento1-quarto-thumb.jpg"
      },
      {
        id: 3,
        url: "apartamento1-cozinha.jpg",
        alt: "Cozinha planejada com granito",
        thumbnail: "apartamento1-cozinha-thumb.jpg"
      },
      {
        id: 4,
        url: "apartamento1-banheiro.jpg",
        alt: "Banheiro social com acabamento moderno",
        thumbnail: "apartamento1-banheiro-thumb.jpg"
      },
      {
        id: 5,
        url: "apartamento1-fachada.jpg",
        alt: "Fachada do edifício",
        thumbnail: "apartamento1-fachada-thumb.jpg"
      },
      {
        id: 6,
        url: "apartamento1-piscina.jpg",
        alt: "Piscina do condomínio",
        thumbnail: "apartamento1-piscina-thumb.jpg"
      }
    ],
    contact: {
      realtor: "João Silva",
      phone: "(21) 98765-4321",
      email: "joao.silva@imobiliaria.com",
      whatsapp: "(21) 98765-4321"
    },
    additionalInfo: {
      yearBuilt: 2010,
      floor: 8,
      totalFloors: 12,
      condominiumFee: 850,
      iptu: 320,
      propertyTax: "Isento"
    },
    nearbyPlaces: [
      { name: "Praia de Copacabana", distance: "100m", type: "praia" },
      { name: "Shopping Rio Sul", distance: "1.2km", type: "shopping" },
      { name: "Metrô Cardeal Arcoverde", distance: "800m", type: "transporte" },
      { name: "Hospital Copa D'Or", distance: "1.5km", type: "saude" },
      { name: "Colégio Santo Américo", distance: "500m", type: "educacao" }
    ]
  },
  2: {
    id: 2,
    title: "Casa com Piscina em Barra da Tijuca",
    type: "casa",
    price: 1200000,
    status: "disponivel",
    location: "Barra da Tijuca, Rio de Janeiro - RJ",
    neighborhood: "Barra da Tijuca",
    city: "Rio de Janeiro", 
    state: "RJ",
    address: "Rua das Pedras, 450",
    bedrooms: 4,
    bathrooms: 3,
    suites: 2,
    parkingSpaces: 3,
    area: 280,
    usableArea: 240,
    description: `
      Espaçosa casa de padrão alto na Barra da Tijuca, perfeita para famílias que buscam conforto e privacidade.
      Imóvel com 280m² de área construída, jardim bem cuidado, piscina privativa e garagem para 3 carros.
      
      A casa possui 4 quartos, sendo 2 suítes, sala ampla com pé-direito duplo, cozinha gourmet, 
      churrasqueira e área de lazer completa. Todos os ambientes são arejados e com excelente iluminação natural.
      
      Localização privilegiada em rua tranquila, próximo aos melhores shoppings, escolas e acesso rápido 
      às principais vias da Barra. Bairro seguro e com excelente infraestrutura.
    `,
    features: [
      "Piscina privativa",
      "Jardim",
      "Churrasqueira",
      "Cozinha gourmet",
      "Pé-direito duplo",
      "Garagem coberta",
      "Suíte master",
      "Sala de estar",
      "Área de lazer",
      "Segurança 24h"
    ],
    images: [
      {
        id: 1,
        url: "casa1-fachada.jpg",
        alt: "Fachada da casa com jardim",
        thumbnail: "casa1-fachada-thumb.jpg"
      },
      {
        id: 2,
        url: "casa1-sala.jpg",
        alt: "Sala com pé-direito duplo",
        thumbnail: "casa1-sala-thumb.jpg"
      },
      {
        id: 3,
        url: "casa1-piscina.jpg",
        alt: "Piscina privativa com área de lazer",
        thumbnail: "casa1-piscina-thumb.jpg"
      },
      {
        id: 4,
        url: "casa1-cozinha.jpg",
        alt: "Cozinha gourmet planejada",
        thumbnail: "casa1-cozinha-thumb.jpg"
      }
    ],
    contact: {
      realtor: "Maria Santos",
      phone: "(21) 91234-5678",
      email: "maria.santos@imobiliaria.com",
      whatsapp: "(21) 91234-5678"
    },
    additionalInfo: {
      yearBuilt: 2015,
      totalFloors: 2,
      condominiumFee: 450,
      iptu: 580,
      propertyTax: "Isento"
    },
    nearbyPlaces: [
      { name: "Shopping Barra", distance: "2.0km", type: "shopping" },
      { name: "Praia da Barra", distance: "3.0km", type: "praia" },
      { name: "Escola Americana", distance: "1.5km", type: "educacao" },
      { name: "Hospital Barra D'Or", distance: "2.5km", type: "saude" }
    ]
  }
};

// Função para obter detalhes do imóvel por ID
export const getPropertyDetailMockById = (id) => {
  return propertyDetailMock[id] || null;
};

// Função para formatar preço em reais
export const formatPrice = (price) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(price);
};

// Função para obter label do status
export const getStatusLabel = (status) => {
  const statusMap = {
    disponivel: "Disponível",
    reservado: "Reservado",
    vendido: "Vendido"
  };
  return statusMap[status] || status;
};

// Função para obter cor do status
export const getStatusTone = (status) => {
  const toneMap = {
    disponivel: "active",
    reservado: "pending",
    vendido: "inactive"
  };
  return toneMap[status] || "default";
};
