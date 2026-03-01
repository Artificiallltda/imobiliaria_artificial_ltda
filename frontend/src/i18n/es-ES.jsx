export default {
  supportBot: {
    title: 'Asistente Virtual',
    subtitle: 'En línea ahora',
    prompt: '¡Hola! ¿Necesitas ayuda? Habla con uno de nuestros agentes.',
    startButton: 'Llamar agente',
    choicePrompt: '¿Cómo prefieres ser atendido?',
    whatsappButton: 'WhatsApp',
    chatButton: 'Chat interno',
    cancel: 'Cancelar',
    done: '¡Un agente te responderá en breve!',
    restart: 'Nueva conversación',
    whatsappMessage: '¡Hola! Necesito ayuda con un inmueble.',
  },

  adminPropertyForm: {
    titleCreate: 'Crear Nuevo Inmueble',
    titleEdit: 'Editar Inmueble',
    back: '← Volver',
    fields: {
      title: 'Título *',
      titlePlaceholder: 'Ej: Casa en Condominio',
      city: 'Ciudad *',
      cityPlaceholder: 'Ej: Buenos Aires',
      description: 'Descripción *',
      descriptionPlaceholder: 'Descripción detallada del inmueble...',
      price: 'Precio *',
      area: 'Área (m²) *',
      bedrooms: 'Habitaciones *',
      bathrooms: 'Baños *',
      status: 'Estado *',
    },
    statusOptions: {
      available: 'Disponible',
      reserved: 'Reservado',
      sold: 'Vendido',
    },
    actions: {
      cancel: 'Cancelar',
      create: 'Crear',
      update: 'Actualizar',
      saving: 'Guardando...',
    },
    success: {
      created: '¡Inmueble creado con éxito!',
      updated: '¡Inmueble actualizado con éxito!',
    },
    errors: {
      load: 'Error al cargar inmueble',
      save: 'Error al guardar inmueble',
    },
  },

  adminProperties: {
    title: 'Administración de Inmuebles',
    subtitle: 'Gestiona todos los inmuebles del sistema',
    addButton: '+ Agregar Inmueble',
    filters: {
      cityPlaceholder: 'Filtrar por ciudad...',
      statusPlaceholder: 'Estado',
      clear: 'Limpiar',
      statusOptions: {
        all: 'Todos',
        available: 'Disponible',
        sold: 'Vendido',
        reserved: 'Reservado',
      },
    },
    loading: '⏳ Cargando inmuebles...',
    error: '❌ Error: {message}',
    retry: 'Intentar de nuevo',
    empty: {
      message: '🔍 No se encontraron inmuebles',
      action: 'Agregar primer inmueble',
    },
    total: '{count} inmuebles encontrados',
    table: {
      title: 'Título',
      city: 'Ciudad',
      price: 'Precio',
      status: 'Estado',
      actions: 'Acciones',
    },
    actions: {
      toggle: 'Acciones',
      edit: 'Editar',
      delete: 'Eliminar',
      viewDetails: 'Ver detalles',
    },
    details: '{bedrooms} habitaciones • {bathrooms} baños • {area}m²',
    confirmDelete: '¿Estás seguro de que deseas eliminar el inmueble "{title}"?',
    deleteError: 'Error al eliminar inmueble: {message}',
  },

  propertyDetail: {
    sectionTitle: 'Información del Inmueble',
    loading: 'Cargando detalles del inmueble...',
    notFound: {
      title: 'Inmueble no encontrado',
      description: 'El inmueble que buscas no fue encontrado.',
      back: 'Volver a la lista',
    },
    error: {
      title: 'Error al cargar inmueble',
      description: 'No se pudieron cargar los detalles ahora. Inténtalo de nuevo.',
      back: 'Volver a la lista',
    },
    info: {
      totalArea: 'Área Total',
      usableArea: 'Área Útil',
      bedrooms: 'Habitaciones',
      suites: 'Suites',
      bathrooms: 'Baños',
      parkingSpaces: 'Estacionamiento',
      pool: 'Piscina',
      garden: 'Jardín',
      furnished: 'Amueblado',
      yes: 'Sí',
      no: 'No',
    },
    contact: {
      title: '¿Interesado en este inmueble?',
      description: 'Habla con uno de nuestros agentes para más información.',
      talkToAgent: 'Hablar con Agente',
      scheduleVisit: 'Agendar Visita',
      whatsapp: 'WhatsApp',
      favorite: 'Guardar',
      favorited: 'Guardado',
      share: 'Compartir',
      sharing: 'Copiando...',
      removeFavoriteTitle: 'Eliminar de favoritos',
      addFavoriteTitle: 'Añadir a favoritos',
      shareTitle: 'Copiar enlace del inmueble',
    },
    description: 'Descripción',
    features: 'Características',
    additionalInfo: {
      title: 'Información Adicional',
      none: 'Sin información adicional.',
      yearBuilt: 'Año de Construcción',
      floor: 'Piso',
      ground: 'Planta baja',
      condo: 'Cuota de Condominio',
      iptu: 'Impuesto Predial',
      perMonth: '/mes',
      perYear: '/año',
    },
    nearbyPlaces: {
      title: 'Lugares Cercanos',
      none: 'Sin datos de lugares cercanos.',
    },
    chat: {
      title: 'Hablar con Agente',
      about: 'Estás iniciando una conversación sobre el inmueble:',
      goToChat: 'Ir al Chat',
      cancel: 'Cancelar',
    },
    visit: {
      title: 'Agendar Visita',
      property: 'Inmueble',
      name: 'Tu nombre *',
      namePlaceholder: 'Ingresa tu nombre',
      phone: 'Tu teléfono *',
      phonePlaceholder: '+54 (11) 9999-9999',
      date: 'Fecha preferida *',
      time: 'Hora preferida',
      confirm: 'Confirmar por WhatsApp',
      cancel: 'Cancelar',
      missingFields: 'Por favor llena todos los campos para agendar.',
      successMessage: '¡Redirigiendo a WhatsApp para confirmar la visita!',
    },
    toast: {
      favoriteAdded: 'Inmueble añadido a favoritos',
      favoriteRemoved: 'Inmueble eliminado de favoritos',
      alreadyFavorited: 'El inmueble ya está en favoritos',
      loginRequired: 'Inicia sesión para guardar inmuebles.',
      favoriteError: 'Error al actualizar favoritos. Inténtalo de nuevo.',
      linkCopied: '¡Enlace copiado! Compártelo con tus clientes.',
      linkCopiedShort: '¡Enlace copiado!',
      linkError: 'No se pudo copiar el enlace.',
    },
    imageAlt: 'Imagen del inmueble - {title}',
    imageAltDefault: 'Imagen del inmueble',
  },

  propertyCard: {
    bedroom: 'habitación',
    bedrooms: 'habitaciones',
    bathroom: 'baño',
    bathrooms: 'baños',
    viewDetails: 'Ver Detalles',
    edit: 'Editar',
    scheduleVisit: 'Agendar Visita',
  },

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
    title: 'Acciones Rápidas',
    subtitle: 'Gestionar estado y acciones del lead',
    changeStatus: 'Cambiar estado',

    openConversation: 'Abrir conversación',
    sendMessage: 'Enviar mensaje',
    markConverted: 'Marcar como convertido',
    archiveLead: 'Archivar lead',
  },

  toast: {
    statusUpdated: 'Estado actualizado con éxito.',
    messageSent: 'Mensaje enviado con éxito.',
    leadConverted: 'Lead marcado como convertido con éxito.',
    leadArchived: 'Lead archivado con éxito.',
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
      title: 'Marcar como Convertido',
      body: '¿Confirmar marcar este lead como convertido? El estado cambiará a "cerrado".',
      cancel: 'Cancelar',
      confirm: 'Confirmar',
    },
    archive: {
      title: 'Archivar Lead',
      body: '¿Confirmar archivar este lead? No aparecerá más en la lista activa.',
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
  subtitle: 'Sigue el embudo de atención.',

  resultsPill: '{count} resultado(s)',

  loading: 'Cargando leads...',
  error: 'Error al cargar leads: {message}',
  foundCount: 'Encontrados {count} lead(s)',

  filters: {
    searchLabel: 'Buscar',
    searchPlaceholder: 'Buscar por nombre o correo...',
    statusLabel: 'Estado',
    apply: 'Aplicar filtros',
    clear: 'Limpiar',
  },

  statusOptions: {
    all: 'Todos',
    new: 'Nuevo',
    inService: 'En Atención',
    proposalSent: 'Propuesta Enviada',
    closed: 'Cerrado',
    lost: 'Perdido',
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

  pagination: {
    prev: 'Anterior',
    next: 'Siguiente',
    page: 'Página {current} de {total}',
  },
},
  favorites: {
  title: 'Favoritos',
  subtitle: 'Propiedades guardadas para retomar después.',

  resultsPill: '{count} favorito(s)',

  loading: 'Cargando favoritos...',
  retry: 'Intentar de nuevo',

  errors: {
    sessionExpired: 'Sesión expirada. Por favor inicie sesión de nuevo.',
    serverOffline: 'No se pudo conectar al servidor. Verifique si el backend está en ejecución.',
    loadFailed: 'Error al cargar favoritos.',
    removeFailed: 'Error al eliminar favorito.',
  },

  empty: {
    title: 'Aún no hay favoritos',
    subtitle: 'Guarda propiedades para acceder rápidamente después.',
    action: 'Ver lista de propiedades',
  },

  actions: {
    remove: 'Eliminar',
    contactAgent: 'Hablar con agente',
    viewDetails: 'Ver Detalles',
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
    sold: 'Vendido',
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

  login: {
    brand: 'Inmobiliaria',
    title: 'Accede a tu cuenta',
    emailLabel: 'Correo electrónico',
    emailPlaceholder: 'tucorreo@ejemplo.com',
    passwordLabel: 'Contraseña',
    passwordPlaceholder: '••••••',
    showPassword: 'Mostrar contraseña',
    hidePassword: 'Ocultar contraseña',
    submit: 'Entrar',
    submitting: 'Entrando...',
    errors: {
      emailRequired: 'Por favor ingresa tu correo.',
      emailInvalid: 'Por favor ingresa un correo válido.',
      loginFailed: 'Error al entrar, intenta de nuevo.',
    },
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
      active: 'Activo',
      bedrooms: 'habitaciones',
      bathrooms: 'baños',
      favorited: '¡agregado a favoritos!',
      alreadyFavorited: 'La propiedad ya está en favoritos.',
      loginToFavorite: 'Inicia sesión para guardar favoritos.',
      favoriteError: 'Error al guardar. Inténtalo de nuevo.',
      favorite: 'Favorito',
      offer: 'Hacer Oferta',
      actions: {
        favorite: 'Favorito',
        offer: 'Hacer Oferta',
      },
    },

    modal: {
      title: 'Filtros',
      cancel: 'Cancelar',
      apply: 'Aplicar',
      text: 'Ajusta tus filtros y haz clic en "Aplicar".',
      wip: 'Filtros en desarrollo.',
      filters: {
        title: 'Filtros',
        cancel: 'Cancelar',
        apply: 'Aplicar',
        toastApplied: 'Filtros aplicados (mock).',
        body: 'Ajusta tus filtros y haz clic en "Aplicar".',
      },
    },

    searchForm: {
      title: 'Buscar Propiedad',
      location: 'Ubicación',
      priceMin: 'Precio mín.',
      priceMax: 'Precio máx.',
      maxKm: 'Km máx.',
      type: 'Tipo',
      bedrooms: 'Habitaciones',
      bathrooms: 'Baños',
      city: 'Ciudad',
      country: 'País',
      button: 'Buscar',
      started: 'Búsqueda iniciada.',
      option1: 'Opción 1',
      option2: 'Opción 2',
      option3: 'Opción 3',
    },
  },

  header: {
    user: 'Usuario',
    greeting: 'Buenos días',
    logout: 'Salir',
    activeProperties: 'Propiedades activas',
    new: 'Nuevos',
    messages: 'Mensajes',
  },

  sidebar: {
    myProperties: 'Mis Propiedades',
    active: 'Activo',
    city: 'Ciudad, Estado',
    location: 'Local: Ciudad, Estado',
    phone: 'Tel: (00) 00000-0000',
    email: 'Email: email@ejemplo.com',
    customize: 'Personalizar',
  },
}
