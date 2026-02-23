
export default {
  properties: {
  title: 'Catálogo de Imóveis',
  subtitle: 'Encontre o imóvel perfeito para você',

  stats: {
    results: 'Resultados',
    available: 'Disponíveis',
    reserved: 'Reservados',
    featured: 'Destaques',
  },

  filters: {
    title: 'Filtros',
    show: 'Mostrar filtros',
    hide: 'Ocultar filtros',
    statusAll: 'Todos os status',
    bedroomsAll: 'Qualquer',
    cityPlaceholder: 'Buscar por cidade...',
    searchPlaceholder: 'Buscar por título ou localização...',
    type: 'Tipo de imóvel',
    status: 'Status',
    bedrooms: 'Quartos',
    minPrice: 'Preço mínimo',
    maxPrice: 'Preço máximo',
    location: 'Localização',
    clear: 'Limpar filtros',
  },

  // (opcional) traduções por value do mock
  types: {
    apartamento: 'Apartamento',
    casa: 'Casa',
    cobertura: 'Cobertura',
    studio: 'Studio',
    terreno: 'Terreno',
  },

  status: {
    available: 'Disponível',
    reserved: 'Reservado',
    sold: 'Vendido',
    disponivel: 'Disponível',
    reservado: 'Reservado',
    vendido: 'Vendido',
  },

  loading: {
    title: 'Carregando imóveis...',
    subtitle: 'Buscando as melhores oportunidades para você.',
  },

  error: {
    title: 'Erro ao carregar imóveis',
    retry: 'Tentar Novamente',
  },

  bedrooms: {
    '1': '1',
    '2': '2',
    '3': '3',
    '4plus': '4+',
  },

  empty: {
    title: 'Nenhum imóvel encontrado',
    subtitle: 'Tente ajustar os filtros ou fazer uma nova busca.',
    action: 'Limpar filtros',
  },
},
  leadDetail: {
  backToLeads: '← Voltar para Leads',
  title: 'Detalhe do Lead',
  id: 'ID: {id}',

  summary: {
    title: 'Resumo do lead',
    createdAt: 'Criado em {date}',
    name: 'Nome',
    email: 'E-mail',
    phone: 'Telefone',
    status: 'Status',
  },

  quickActions: {
    title: 'Ações rápidas',
    subtitle: 'Gerencie o status e ações do lead',
    changeStatus: 'Alterar status',

    openConversation: 'Abrir conversa',
    sendMessage: 'Enviar mensagem',
    markConverted: 'Marcar como convertido',
    archiveLead: 'Arquivar lead',
  },

  toast: {
    statusUpdated: 'Status atualizado com sucesso.',
    messageSent: 'Mensagem enviada com sucesso.',
    leadConverted: 'Lead marcado como convertido com sucesso.',
    leadArchived: 'Lead arquivado com sucesso.',
  },

  statusOptions: {
    pending: 'Pendente',
    active: 'Em atendimento',
    inactive: 'Inativo',
    converted: 'Convertido',
    archived: 'Arquivado',
  },

  modals: {
    convert: {
      title: 'Marcar como convertido',
      body: 'Confirma marcar este lead como convertido? O status será alterado para "fechado".',
      cancel: 'Cancelar',
      confirm: 'Confirmar',
    },
    archive: {
      title: 'Arquivar lead',
      body: 'Confirma arquivar este lead? Ele não aparecerá mais na lista ativa.',
      cancel: 'Cancelar',
      confirm: 'Arquivar',
    },
    chat: {
      title: 'Histórico de conversa',
      close: 'Fechar',
    },
  },
},
  leads: {
  title: 'Leads',
  subtitle: 'Acompanhe o funil de atendimento.',

  resultsPill: '{count} resultado(s)',

  filters: {
    searchLabel: 'Buscar',
    searchPlaceholder: 'Buscar por nome ou e-mail...',
    statusLabel: 'Status',
    clear: 'Limpar',
  },

  table: {
    name: 'Nome',
    email: 'E-mail',
    phone: 'Telefone',
    status: 'Status',
    createdAt: 'Criado em',
    empty: 'Nenhum lead encontrado com os filtros atuais.',
  },

  mobile: {
    phone: 'Telefone',
    createdAt: 'Criado em',
    id: 'ID',
  },

  status: {
    all: 'Todos',
    new: 'Novo',
    contacting: 'Em contato',
    pending: 'Pendente',
    inService: 'Em atendimento',
    converted: 'Convertido',
    lost: 'Perdido',
    // Novos valores para MVP
    'Em Atendimento': 'Em Atendimento',
    'Proposta Enviada': 'Proposta Enviada',
    'Fechado': 'Fechado',
  },

  list: {
    viewDetail: 'Ver detalhe →',
    createdAt: 'Criado em {date}',
  },
},
  favorites: {
  title: 'Favoritos',
  subtitle: 'Imóveis salvos para você retomar depois (mock).',

  resultsPill: '{count} favorito(s)',

  empty: {
    title: 'Nenhum favorito ainda',
    subtitle: 'Salve imóveis para acessar rapidamente depois.',
    action: 'Ver lista de imóveis',
  },

  actions: {
    remove: 'Remover',
    contactAgent: 'Falar com corretor',
  },

  toast: {
    removed: 'Removido dos favoritos (mock).',
    contactShortcut: 'Atalho de contato acionado (mock).',
  },

  modal: {
    title: 'Contato',
    close: 'Fechar',
    startChat: 'Iniciar conversa',
    intro: 'Você está prestes a iniciar contato sobre:',
    footnote: '*Sem tempo real nesta etapa. No futuro isso abrirá o chat com o corretor.',
  },

  status: {
    active: 'Ativo',
    reserved: 'Reservado',
    inactive: 'Inativo',
  },
},
  messages: {
  title: 'Mensagens',
  subtitle: 'Conversas simuladas (mock).',
  viewChat: 'Ver chat',

  empty: {
    title: 'Nenhuma conversa',
    subtitle: 'Selecione uma conversa para visualizar.',
  },

  chat: {
    back: 'Voltar',
    inputPlaceholder: 'Digite sua mensagem…',
    send: 'Enviar',
    footnote: 'Envio é mockado e salva apenas no estado local.',
  },

  status: {
    unread: 'Não lida',
    active: 'Ativa',
    archived: 'Arquivada',
  },

  noMessages: 'Sem mensagens',
},
  sidebar: {
  logo: 'Imobiliária',

  sections: {
    main: 'MENU PRINCIPAL',
    myProperties: 'MEUS IMÓVEIS',
  },

  links: {
    dashboard: 'Dashboard',
    leads: 'Leads',
    favoritesList: 'Lista de Favoritos',
    messages: 'Mensagens',
    propertiesList: 'Imóveis',
    adminProperties: 'Gerenciar Imóveis',
    myFavorites: 'Meus Favoritos',
    customize: 'Personalizar',
  },

  actions: {
    expand: 'Expandir sidebar',
    collapse: 'Recolher sidebar',
    closeMenu: 'Fechar menu',
    logout: 'Sair',
  },
},

  app: {
    brand: {
      title: 'Imobiliária Artificial',
      tagline: 'Inteligência que valoriza cada imóvel',
    },
  },

  header: {
    user: 'Usuário',
    greeting: 'Bom dia',
    stats: {
      active: 'Imóveis ativos: {count}',
      new: 'Novos: {count}',
      messages: 'Mensagens: {count}',
    },
    actions: {
      settings: 'Configurações',
      themeToLight: 'Mudar para claro',
      themeToDark: 'Mudar para escuro',
      logout: 'Sair',
    },
  },

  language: {
    label: 'Idioma',
    ptBR: 'Português (Brasil)',
    enUS: 'Inglês',
    esES: 'Espanhol',
  },

  rightSidebar: {
    title: 'Meus Imóveis',
    status: 'Ativo',
    location: 'Cidade, Estado',
    price: 'R$ 0,00',
    contact: {
      location: 'Local: Cidade, Estado',
      phone: 'Tel: (00) 00000-0000',
      email: 'Email: email@exemplo.com',
      action: 'Personalizar',
    },
  },

  pages: {
    myFavorites: 'Meus Favoritos',
    customize: 'Personalizar',
    notFound: '404 - Não encontrado',
    simpleMock: 'Página mockada (frontend).',
  },

  dashboard: {
    findProperty: 'Encontrar Imóvel',

    placeholders: {
      location: 'Localização',
      minPrice: 'Preço mín.',
      maxPrice: 'Preço máx.',
      maxKm: 'Km máx.',
      type: 'Tipo',
      bedrooms: 'Quartos',
      bathrooms: 'Banheiros',
      city: 'Cidade',
      country: 'País',
    },

    search: 'Buscar',
    toastSearchStarted: 'Busca iniciada (mock).',

    listings: {
      title: 'Imóveis Disponíveis',
      resultsCount: '{count} encontrados',
      filterBy: 'Filtrar por',
    },

    card: {
      status: 'Ativo',
      exampleTitle: 'Imóvel exemplo {n}',
      locationRecent: 'Cidade, Estado • há pouco',
      priceZero: 'R$ 0,00',
      details: '— quartos • — banheiros • — m²',
      desc: 'Descrição do imóvel.',
      actions: {
        favorite: 'Favoritar',
        offer: 'Fazer Oferta',
      },
    },

    modal: {
      filters: {
        title: 'Filtros',
        cancel: 'Cancelar',
        apply: 'Aplicar',
        toastApplied: 'Filtros aplicados (mock).',
        body: 'Ajuste seus filtros e clique em "Aplicar".',
      },
    },
  },
}
