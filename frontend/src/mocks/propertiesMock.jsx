// TODO - Substituir dados mockados futuramente pela API

export const propertiesMock = [
  {
    id: 1,
    title: "Apartamento de Luxo em Copacabana",
    type: "apartamento",
    price: 850000,
    status: "disponivel",
    location: "Copacabana, Rio de Janeiro - RJ",
    bedrooms: 3,
    bathrooms: 2,
    area: 120,
    description: "Apartamento nobre com vista para o mar, totalmente reformado.",
    images: ["apartamento1.jpg"],
    createdAt: "2024-01-15",
    featured: true
  },
  {
    id: 2,
    title: "Casa com Piscina em Barra da Tijuca",
    type: "casa",
    price: 1200000,
    status: "disponivel",
    location: "Barra da Tijuca, Rio de Janeiro - RJ",
    bedrooms: 4,
    bathrooms: 3,
    area: 280,
    description: "Casa espaçosa com jardim, piscina e garagem para 3 carros.",
    images: ["casa1.jpg"],
    createdAt: "2024-01-20",
    featured: true
  },
  {
    id: 3,
    title: "Studio Compacto no Centro",
    type: "studio",
    price: 320000,
    status: "reservado",
    location: "Centro, Rio de Janeiro - RJ",
    bedrooms: 1,
    bathrooms: 1,
    area: 45,
    description: "Studio otimizado, ideal para solteiros ou casais.",
    images: ["studio1.jpg"],
    createdAt: "2024-02-01",
    featured: false
  },
  {
    id: 4,
    title: "Terreno em Ipanema",
    type: "terreno",
    price: 650000,
    status: "disponivel",
    location: "Ipanema, Rio de Janeiro - RJ",
    bedrooms: 0,
    bathrooms: 0,
    area: 300,
    description: "Terreno plano com ótima localização, perfeito para construção.",
    images: ["terreno1.jpg"],
    createdAt: "2024-02-10",
    featured: false
  },
  {
    id: 5,
    title: "Cobertura Dupla no Leblon",
    type: "cobertura",
    price: 2500000,
    status: "disponivel",
    location: "Leblon, Rio de Janeiro - RJ",
    bedrooms: 4,
    bathrooms: 4,
    area: 350,
    description: "Cobertura de luxo com churrasqueira, sauna e vista panorâmica.",
    images: ["cobertura1.jpg"],
    createdAt: "2024-02-15",
    featured: true
  },
  {
    id: 6,
    title: "Kitnet em Botafogo",
    type: "kitnet",
    price: 180000,
    status: "vendido",
    location: "Botafogo, Rio de Janeiro - RJ",
    bedrooms: 1,
    bathrooms: 1,
    area: 35,
    description: "Kitnet econômica, bem localizada próxima ao metrô.",
    images: ["kitnet1.jpg"],
    createdAt: "2024-01-05",
    featured: false
  },
  {
    id: 7,
    title: "Casa de Praia em Búzios",
    type: "casa",
    price: 890000,
    status: "disponivel",
    location: "Búzios - RJ",
    bedrooms: 3,
    bathrooms: 2,
    area: 180,
    description: "Casa de praia aconchegante a poucos metros da praia.",
    images: ["casa-praia1.jpg"],
    createdAt: "2024-02-20",
    featured: false
  },
  {
    id: 8,
    title: "Apartamento em Ipanema",
    type: "apartamento",
    price: 750000,
    status: "reservado",
    location: "Ipanema, Rio de Janeiro - RJ",
    bedrooms: 2,
    bathrooms: 2,
    area: 85,
    description: "Apartamento bem localizado, próximo à praia e comércio.",
    images: ["apartamento2.jpg"],
    createdAt: "2024-02-18",
    featured: false
  }
];

// Opções para filtros
export const propertyTypes = [
  { value: "", label: "Todos os tipos" },
  { value: "apartamento", label: "Apartamento" },
  { value: "casa", label: "Casa" },
  { value: "studio", label: "Studio" },
  { value: "kitnet", label: "Kitnet" },
  { value: "terreno", label: "Terreno" },
  { value: "cobertura", label: "Cobertura" }
];

export const propertyStatuses = [
  { value: "", label: "Todos os status" },
  { value: "disponivel", label: "Disponível" },
  { value: "reservado", label: "Reservado" },
  { value: "vendido", label: "Vendido" }
];

export const bedroomOptions = [
  { value: "", label: "Qualquer" },
  { value: "1", label: "1 quarto" },
  { value: "2", label: "2 quartos" },
  { value: "3", label: "3 quartos" },
  { value: "4", label: "4+ quartos" }
];

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
