export default {
 properties: {
  title: 'Catálogo de Inmuebles',
  subtitle: 'Encuentra el inmueble perfecto para ti',

  stats: {
    results: 'Resultados',
    available: 'Disponibles',
    reserved: 'Reservados',
    featured: 'Destacados',
  },

  filters: {
    title: 'Filtros',
    show: 'Mostrar filtros',
    hide: 'Ocultar filtros',
    statusAll: 'Todos los estados',
    bedroomsAll: 'Cualquiera',
    cityPlaceholder: 'Buscar por ciudad...',
    searchPlaceholder: 'Buscar por título o ubicación...',
    type: 'Tipo de inmueble',
    status: 'Estado',
    bedrooms: 'Habitaciones',
    minPrice: 'Precio mínimo',
    maxPrice: 'Precio máximo',
    location: 'Ubicación',
    clear: 'Limpiar filtros',
  },

  types: {
    apartamento: 'Apartamento',
    casa: 'Casa',
    cobertura: 'Ático',
    studio: 'Estudio',
    terreno: 'Terreno',
  },

  status: {
    available: 'Disponible',
    reserved: 'Reservado',
    sold: 'Vendido',
    disponivel: 'Disponible',
    reservado: 'Reservado',
    vendido: 'Vendido',
  },

  loading: {
    title: 'Cargando inmuebles...',
    subtitle: 'Buscando las mejores oportunidades para ti.',
  },

  error: {
    title: 'Error al cargar inmuebles',
    retry: 'Intentar de nuevo',
  },

  bedrooms: {
    '1': '1',
    '2': '2',
    '3': '3',
    '4plus': '4+',
  },

  empty: {
    title: 'No se encontraron inmuebles',
    subtitle: 'Prueba ajustando los filtros o buscando de nuevo.',
    action: 'Limpiar filtros',
  },
},
  leadDetail: {
  backToLeads: '← Volver a Leads',
  title: 'Detalle del Lead',
  id: 'ID: {id}',

  summary: {
    title: 'Resumen del lead',
    createdAt: 'Creado el {date}',
    name: 'Nombre',
    email: 'Correo',
    phone: 'Teléfono',
    status: 'Estado',
  },

  quickActions: {
    title: 'Acciones rápidas',
    subtitle: 'Simuladas para validar el flujo',
    changeStatus: 'Cambiar estado',

    openConversation: 'Abrir conversación',
    sendMessage: 'Enviar mensaje',
    markConverted: 'Marcar como convertido',
    archiveLead: 'Archivar lead',
  },

  toast: {
    statusUpdated: 'Estado actualizado (mock).',
    messageSent: 'Mensaje enviado (simulado).',
    leadConverted: 'Lead marcado como convertido (mock).',
    leadArchived: 'Lead archivado (mock).',
  },

  statusOptions: {
    pending: 'Pendiente',
    active: 'En atención',
    inactive: 'Inactivo',
    converted: 'Convertido',
    archived: 'Archivado',
  },

  modals: {
    convert: {
      title: 'Marcar como convertido',
      body: 'Esta acción es simulada. ¿Confirmas marcar el lead como convertido?',
      cancel: 'Cancelar',
      confirm: 'Confirmar',
    },
    archive: {
      title: 'Archivar lead',
      body: 'Esta acción es simulada. ¿Confirmas archivar este lead?',
      cancel: 'Cancelar',
      confirm: 'Archivar',
    },
    chat: {
      title: 'Historial de conversación',
      close: 'Cerrar',
    },
  },
},
  leads: {
  title: 'Leads',
  subtitle: 'Sigue el embudo de atención (datos mock).',

  resultsPill: '{count} resultado(s)',

  filters: {
    searchLabel: 'Buscar',
    searchPlaceholder: 'Buscar por nombre o correo...',
    statusLabel: 'Estado',
    clear: 'Limpiar',
  },

  table: {
    name: 'Nombre',
    email: 'Correo',
    phone: 'Teléfono',
    status: 'Estado',
    createdAt: 'Creado el',
    empty: 'No se encontraron leads con los filtros actuales.',
  },

  mobile: {
    phone: 'Teléfono',
    createdAt: 'Creado el',
    id: 'ID',
  },

  status: {
    all: 'Todos',
    new: 'Nuevo',
    contacting: 'En contacto',
    pending: 'Pendiente',
    inService: 'En atención',
    converted: 'Convertido',
    lost: 'Perdido',
  },

  list: {
    viewDetail: 'Ver detalle →',
    createdAt: 'Creado el {date}',
  },
},
  favorites: {
  title: 'Favoritos',
  subtitle: 'Propiedades guardadas para retomar después.',

  resultsPill: '{count} favorito(s)',

  empty: {
    title: 'Aún no hay favoritos',
    subtitle: 'Guarda propiedades para acceder rápidamente después.',
    action: 'Ver lista de propiedades',
  },

  actions: {
    remove: 'Eliminar',
    contactAgent: 'Hablar con agente',
  },

  toast: {
    removed: 'Eliminado de favoritos.',
    contactShortcut: 'Acceso directo de contacto activado.',
  },

  modal: {
    title: 'Contacto',
    close: 'Cerrar',
    startChat: 'Iniciar conversación',
    intro: 'Estás a punto de iniciar contacto sobre:',
    footnote: '*Sin tiempo real en esta etapa. En el futuro esto abrirá el chat con el agente.',
  },

  status: {
    active: 'Activo',
    reserved: 'Reservado',
    inactive: 'Inactivo',
  },
},
  messages: {
  title: 'Mensajes',
  subtitle: 'Conversaciones simuladas (mock).',
  viewChat: 'Ver chat',

  empty: {
    title: 'Sin conversación',
    subtitle: 'Selecciona una conversación para ver.',
  },

  chat: {
    back: 'Volver',
    inputPlaceholder: 'Escribe tu mensaje…',
    send: 'Enviar',
    footnote: 'El envío es simulado y solo se guarda en el estado local.',
  },

  status: {
    unread: 'No leída',
    active: 'Activa',
    archived: 'Archivada',
  },

  noMessages: 'Sin mensajes',
},
  sidebar: {
  logo: 'Inmobiliaria',

  sections: {
    main: 'MENÚ PRINCIPAL',
    myProperties: 'MIS INMUEBLES',
  },

  links: {
    dashboard: 'Panel',
    leads: 'Leads',
    favoritesList: 'Lista de Favoritos',
    messages: 'Mensajes',
    propertiesList: 'Inmuebles',
    adminProperties: 'Administrar Inmuebles',
    myFavorites: 'Mis Favoritos',
    customize: 'Personalizar',
  },

  actions: {
    expand: 'Expandir barra lateral',
    collapse: 'Colapsar barra lateral',
    closeMenu: 'Cerrar menú',
    logout: 'Salir',
  },
},

  app: {
    brand: {
      title: 'Inmobiliaria Artificial',
      tagline: 'Inteligencia que valora cada propiedad',
    },
  },

  header: {
    user: 'Usuario',
    greeting: 'Buenos días',
    stats: {
      active: 'Propiedades activas: {count}',
      new: 'Nuevas: {count}',
      messages: 'Mensajes: {count}',
    },
    actions: {
      settings: 'Configuración',
      themeToLight: 'Cambiar a claro',
      themeToDark: 'Cambiar a oscuro',
      logout: 'Salir',
    },
  },

  language: {
    label: 'Idioma',
    ptBR: 'Portugués (Brasil)',
    enUS: 'Inglés',
    esES: 'Español',
  },

  rightSidebar: {
    title: 'Mis Propiedades',
    status: 'Activo',
    location: 'Ciudad, Estado',
    price: '$ 0,00',
    contact: {
      location: 'Ubicación: Ciudad, Estado',
      phone: 'Tel: (00) 00000-0000',
      email: 'Email: email@ejemplo.com',
      action: 'Personalizar',
    },
  },

  pages: {
    myFavorites: 'Mis Favoritos',
    customize: 'Personalizar',
    notFound: '404 - No encontrado',
    simpleMock: 'Página simulada (frontend).',
  },

  dashboard: {
    findProperty: 'Buscar Propiedad',

    placeholders: {
      location: 'Ubicación',
      minPrice: 'Precio mín.',
      maxPrice: 'Precio máx.',
      maxKm: 'Km máx.',
      type: 'Tipo',
      bedrooms: 'Habitaciones',
      bathrooms: 'Baños',
      city: 'Ciudad',
      country: 'País',
    },

    search: 'Buscar',
    toastSearchStarted: 'Búsqueda iniciada (mock).',

    listings: {
      title: 'Propiedades Disponibles',
      resultsCount: '{count} encontradas',
      filterBy: 'Filtrar por',
    },

    card: {
      status: 'Activo',
      exampleTitle: 'Propiedad ejemplo {n}',
      locationRecent: 'Ciudad, Estado • hace poco',
      priceZero: '$ 0,00',
      details: '— habs • — baños • — m²',
      desc: 'Descripción de la propiedad.',
      actions: {
        favorite: 'Favorito',
        offer: 'Hacer Oferta',
      },
    },

    modal: {
      filters: {
        title: 'Filtros',
        cancel: 'Cancelar',
        apply: 'Aplicar',
        toastApplied: 'Filtros aplicados (mock).',
        body: 'Ajusta tus filtros y haz clic en "Aplicar".',
      },
    },
  },
}
