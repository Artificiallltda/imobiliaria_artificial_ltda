
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

  loading: 'Carregando leads...',
  error: 'Erro ao carregar leads: {message}',
  foundCount: 'Encontrados {count} lead(s)',

  filters: {
    searchLabel: 'Buscar',
    searchPlaceholder: 'Buscar por nome ou e-mail...',
    statusLabel: 'Status',
    apply: 'Aplicar filtros',
    clear: 'Limpar',
  },

  statusOptions: {
    all: 'Todos',
    new: 'Novo',
    inService: 'Em Atendimento',
    proposalSent: 'Proposta Enviada',
    closed: 'Fechado',
    lost: 'Perdido',
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
    'Em Atendimento': 'Em Atendimento',
    'Proposta Enviada': 'Proposta Enviada',
    'Fechado': 'Fechado',
  },

  list: {
    viewDetail: 'Ver detalhe →',
    createdAt: 'Criado em {date}',
  },

  pagination: {
    prev: 'Anterior',
    next: 'Próxima',
    page: 'Página {current} de {total}',
  },
},
  favorites: {
  title: 'Favoritos',
  subtitle: 'Imóveis salvos para você retomar depois.',

  resultsPill: '{count} favorito(s)',

  loading: 'Carregando favoritos...',
  retry: 'Tentar novamente',

  errors: {
    sessionExpired: 'Sessão expirada. Faça login novamente.',
    serverOffline: 'Não foi possível conectar ao servidor. Verifique se o backend está rodando.',
    loadFailed: 'Erro ao carregar favoritos.',
    removeFailed: 'Erro ao remover favorito.',
  },

  empty: {
    title: 'Nenhum favorito ainda',
    subtitle: 'Salve imóveis para acessar rapidamente depois.',
    action: 'Ver lista de imóveis',
  },

  actions: {
    remove: 'Remover',
    contactAgent: 'Falar com corretor',
    viewDetails: 'Ver Detalhes',
  },

  toast: {
    removed: 'Removido dos favoritos.',
    contactShortcut: 'Atalho de contato acionado.',
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
    sold: 'Vendido',
    inactive: 'Inativo',
  },
},
  messages: {
  title: 'Mensagens',
  subtitle: 'Gerencie suas conversas em tempo real.',
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

  login: {
    brand: 'Imobiliária',
    title: 'Acesse sua conta',
    emailLabel: 'E-mail',
    emailPlaceholder: 'seuemail@exemplo.com',
    passwordLabel: 'Senha',
    passwordPlaceholder: '••••••',
    showPassword: 'Mostrar senha',
    hidePassword: 'Ocultar senha',
    submit: 'Entrar',
    submitting: 'Entrando...',
    errors: {
      emailRequired: 'Informe seu e-mail.',
      emailInvalid: 'Digite um e-mail válido.',
      loginFailed: 'Erro ao entrar, tente novamente.',
    },
  },

  supportBot: {
    title: 'Assistente Virtual',
    subtitle: 'Online agora',
    prompt: 'Olá! Precisa de ajuda? Fale com um de nossos atendentes.',
    startButton: 'Chamar atendente',
    choicePrompt: 'Como prefere ser atendido?',
    whatsappButton: 'WhatsApp',
    chatButton: 'Chat interno',
    cancel: 'Cancelar',
    done: 'Em breve um atendente irá te responder!',
    restart: 'Nova conversa',
    whatsappMessage: 'Olá! Preciso de ajuda com um imóvel.',
  },

  adminPropertyForm: {
    titleCreate: 'Criar Novo Imóvel',
    titleEdit: 'Editar Imóvel',
    back: '← Voltar',
    fields: {
      title: 'Título *',
      titlePlaceholder: 'Ex: Casa em Condomínio',
      city: 'Cidade *',
      cityPlaceholder: 'Ex: Campinas',
      description: 'Descrição *',
      descriptionPlaceholder: 'Descrição detalhada do imóvel...',
      price: 'Preço (R$) *',
      area: 'Área (m²) *',
      bedrooms: 'Quartos *',
      bathrooms: 'Banheiros *',
      status: 'Status *',
    },
    statusOptions: {
      available: 'Disponível',
      reserved: 'Reservado',
      sold: 'Vendido',
    },
    actions: {
      cancel: 'Cancelar',
      create: 'Criar',
      update: 'Atualizar',
      saving: 'Salvando...',
    },
    success: {
      created: 'Imóvel criado com sucesso!',
      updated: 'Imóvel atualizado com sucesso!',
    },
    errors: {
      load: 'Erro ao carregar imóvel',
      save: 'Erro ao salvar imóvel',
    },
  },

  adminProperties: {
    title: 'Administração de Imóveis',
    subtitle: 'Gerencie todos os imóveis do sistema',
    addButton: '+ Adicionar Imóvel',
    filters: {
      cityPlaceholder: 'Filtrar por cidade...',
      statusPlaceholder: 'Status',
      clear: 'Limpar',
      statusOptions: {
        all: 'Todos',
        available: 'Disponível',
        sold: 'Vendido',
        reserved: 'Reservado',
      },
    },
    loading: '⏳ Carregando imóveis...',
    error: '❌ Erro: {message}',
    retry: 'Tentar novamente',
    empty: {
      message: '🔍 Nenhum imóvel encontrado',
      action: 'Adicionar primeiro imóvel',
    },
    total: '{count} imóveis encontrados',
    table: {
      title: 'Título',
      city: 'Cidade',
      price: 'Preço',
      status: 'Status',
      actions: 'Ações',
    },
    actions: {
      toggle: 'Ações',
      edit: 'Editar',
      delete: 'Excluir',
      viewDetails: 'Ver detalhes',
    },
    details: '{bedrooms} quartos • {bathrooms} banheiros • {area}m²',
    confirmDelete: 'Tem certeza que deseja excluir o imóvel "{title}"?',
    deleteError: 'Erro ao excluir imóvel: {message}',
  },

  propertyDetail: {
    sectionTitle: 'Informações do Imóvel',
    loading: 'Carregando detalhes do imóvel...',
    notFound: {
      title: 'Imóvel não encontrado',
      description: 'O imóvel que você procura não foi encontrado.',
      back: 'Voltar para a lista',
    },
    error: {
      title: 'Erro ao carregar imóvel',
      description: 'Não foi possível carregar os detalhes agora. Tente novamente.',
      back: 'Voltar para a lista',
    },
    info: {
      totalArea: 'Área Total',
      usableArea: 'Área Útil',
      bedrooms: 'Quartos',
      suites: 'Suítes',
      bathrooms: 'Banheiros',
      parkingSpaces: 'Vagas',
      pool: 'Piscina',
      garden: 'Jardim',
      furnished: 'Mobiliado',
      yes: 'Sim',
      no: 'Não',
    },
    contact: {
      title: 'Interessado neste imóvel?',
      description: 'Fale com um de nossos corretores para mais informações.',
      talkToAgent: 'Falar com Corretor',
      scheduleVisit: 'Agendar Visita',
      whatsapp: 'WhatsApp',
      favorite: 'Favoritar',
      favorited: 'Favoritado',
      share: 'Compartilhar',
      sharing: 'Copiando...',
      removeFavoriteTitle: 'Remover dos favoritos',
      addFavoriteTitle: 'Adicionar aos favoritos',
      shareTitle: 'Copiar link do imóvel',
    },
    description: 'Descrição',
    features: 'Características',
    additionalInfo: {
      title: 'Informações Adicionais',
      none: 'Sem informações adicionais.',
      yearBuilt: 'Ano de Construção',
      floor: 'Andar',
      ground: 'Térreo',
      condo: 'Condomínio',
      iptu: 'IPTU',
      perMonth: '/mês',
      perYear: '/ano',
    },
    nearbyPlaces: {
      title: 'Locais Próximos',
      none: 'Sem dados de locais próximos.',
    },
    chat: {
      title: 'Falar com Corretor',
      about: 'Você está iniciando uma conversa sobre o imóvel:',
      goToChat: 'Ir para o Chat',
      cancel: 'Cancelar',
    },
    visit: {
      title: 'Agendar Visita',
      property: 'Imóvel',
      name: 'Seu nome *',
      namePlaceholder: 'Digite seu nome',
      phone: 'Seu telefone *',
      phonePlaceholder: '(11) 99999-9999',
      date: 'Data preferida *',
      time: 'Horário preferido',
      confirm: 'Confirmar pelo WhatsApp',
      cancel: 'Cancelar',
      missingFields: 'Preencha todos os campos para agendar.',
      successMessage: 'Redirecionando para WhatsApp para confirmar a visita!',
    },
    toast: {
      favoriteAdded: 'Imóvel adicionado aos favoritos',
      favoriteRemoved: 'Imóvel removido dos favoritos',
      alreadyFavorited: 'Imóvel já está nos favoritos',
      loginRequired: 'Faça login para favoritar imóveis.',
      favoriteError: 'Erro ao atualizar favoritos. Tente novamente.',
      linkCopied: 'Link copiado! Compartilhe com seus clientes.',
      linkCopiedShort: 'Link copiado!',
      linkError: 'Não foi possível copiar o link.',
    },
    imageAlt: 'Imagem do imóvel - {title}',
    imageAltDefault: 'Imagem do imóvel',
  },

  propertyCard: {
    bedroom: 'quarto',
    bedrooms: 'quartos',
    bathroom: 'banheiro',
    bathrooms: 'banheiros',
    viewDetails: 'Ver Detalhes',
    edit: 'Editar',
    scheduleVisit: 'Agendar Visita',
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
      count: '{count} encontrados',
      filter: 'Filtrar por',
      loading: 'Carregando imóveis...',
      empty: 'Nenhum imóvel encontrado.',
      error: 'Erro ao carregar imóveis.',
    },

    card: {
      status: 'Ativo',
      active: 'Ativo',
      exampleTitle: 'Imóvel exemplo {n}',
      locationRecent: 'Cidade, Estado • há pouco',
      priceZero: 'R$ 0,00',
      details: '— quartos • — banheiros • — m²',
      desc: 'Descrição do imóvel.',
      bedrooms: 'quartos',
      bathrooms: 'banheiros',
      favorited: 'adicionado aos favoritos!',
      alreadyFavorited: 'Imóvel já está nos favoritos.',
      loginToFavorite: 'Faça login para favoritar.',
      favoriteError: 'Erro ao favoritar. Tente novamente.',
      favorite: 'Favoritar',
      offer: 'Fazer Oferta',
      actions: {
        favorite: 'Favoritar',
        offer: 'Fazer Oferta',
      },
    },

    modal: {
      title: 'Filtros',
      cancel: 'Cancelar',
      apply: 'Aplicar',
      text: 'Ajuste seus filtros e clique em "Aplicar".',
      wip: 'Filtros em desenvolvimento.',
      filters: {
        title: 'Filtros',
        cancel: 'Cancelar',
        apply: 'Aplicar',
        toastApplied: 'Filtros aplicados (mock).',
        body: 'Ajuste seus filtros e clique em "Aplicar".',
      },
    },

    searchForm: {
      title: 'Encontrar Imóvel',
      location: 'Localização',
      priceMin: 'Preço mín.',
      priceMax: 'Preço máx.',
      maxKm: 'Km máx.',
      type: 'Tipo',
      bedrooms: 'Quartos',
      bathrooms: 'Banheiros',
      city: 'Cidade',
      country: 'País',
      button: 'Buscar',
      started: 'Busca iniciada.',
      option1: 'Opção 1',
      option2: 'Opção 2',
      option3: 'Opção 3',
    },
  },
}
