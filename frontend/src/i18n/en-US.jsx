export default {
  supportBot: {
    title: 'Virtual Assistant',
    subtitle: 'Online now',
    prompt: 'Hello! Need help? Talk to one of our agents.',
    startButton: 'Call agent',
    choicePrompt: 'How would you like to be served?',
    whatsappButton: 'WhatsApp',
    chatButton: 'Internal chat',
    cancel: 'Cancel',
    done: 'An agent will respond to you shortly!',
    restart: 'New conversation',
    whatsappMessage: 'Hello! I need help with a property.',
  },

  adminPropertyForm: {
    titleCreate: 'Create New Property',
    titleEdit: 'Edit Property',
    back: '← Back',
    fields: {
      title: 'Title *',
      titlePlaceholder: 'Ex: Condo House',
      city: 'City *',
      cityPlaceholder: 'Ex: New York',
      description: 'Description *',
      descriptionPlaceholder: 'Detailed property description...',
      price: 'Price (USD) *',
      area: 'Area (m²) *',
      bedrooms: 'Bedrooms *',
      bathrooms: 'Bathrooms *',
      status: 'Status *',
    },
    statusOptions: {
      available: 'Available',
      reserved: 'Reserved',
      sold: 'Sold',
    },
    actions: {
      cancel: 'Cancel',
      create: 'Create',
      update: 'Update',
      saving: 'Saving...',
    },
    success: {
      created: 'Property created successfully!',
      updated: 'Property updated successfully!',
    },
    errors: {
      load: 'Error loading property',
      save: 'Error saving property',
    },
  },

  adminProperties: {
    title: 'Property Management',
    subtitle: 'Manage all properties in the system',
    addButton: '+ Add Property',
    filters: {
      cityPlaceholder: 'Filter by city...',
      statusPlaceholder: 'Status',
      clear: 'Clear',
      statusOptions: {
        all: 'All',
        available: 'Available',
        sold: 'Sold',
        reserved: 'Reserved',
      },
    },
    loading: '⏳ Loading properties...',
    error: '❌ Error: {message}',
    retry: 'Try again',
    empty: {
      message: '🔍 No properties found',
      action: 'Add first property',
    },
    total: '{count} properties found',
    table: {
      title: 'Title',
      city: 'City',
      price: 'Price',
      status: 'Status',
      actions: 'Actions',
    },
    actions: {
      toggle: 'Actions',
      edit: 'Edit',
      delete: 'Delete',
      viewDetails: 'View details',
    },
    details: '{bedrooms} bedrooms • {bathrooms} bathrooms • {area}m²',
    confirmDelete: 'Are you sure you want to delete the property "{title}"?',
    deleteError: 'Error deleting property: {message}',
  },

  propertyDetail: {
    sectionTitle: 'Property Information',
    loading: 'Loading property details...',
    notFound: {
      title: 'Property not found',
      description: 'The property you are looking for was not found.',
      back: 'Back to list',
    },
    error: {
      title: 'Error loading property',
      description: 'Could not load details right now. Please try again.',
      back: 'Back to list',
    },
    info: {
      totalArea: 'Total Area',
      usableArea: 'Usable Area',
      bedrooms: 'Bedrooms',
      suites: 'Suites',
      bathrooms: 'Bathrooms',
      parkingSpaces: 'Parking',
      pool: 'Pool',
      garden: 'Garden',
      furnished: 'Furnished',
      yes: 'Yes',
      no: 'No',
    },
    contact: {
      title: 'Interested in this property?',
      description: 'Talk to one of our agents for more information.',
      talkToAgent: 'Talk to Agent',
      scheduleVisit: 'Schedule Visit',
      whatsapp: 'WhatsApp',
      favorite: 'Save',
      favorited: 'Saved',
      share: 'Share',
      sharing: 'Copying...',
      removeFavoriteTitle: 'Remove from favorites',
      addFavoriteTitle: 'Add to favorites',
      shareTitle: 'Copy property link',
    },
    description: 'Description',
    features: 'Features',
    additionalInfo: {
      title: 'Additional Information',
      none: 'No additional information.',
      yearBuilt: 'Year Built',
      floor: 'Floor',
      ground: 'Ground floor',
      condo: 'Condo Fee',
      iptu: 'Property Tax',
      perMonth: '/month',
      perYear: '/year',
    },
    nearbyPlaces: {
      title: 'Nearby Places',
      none: 'No nearby places data.',
    },
    chat: {
      title: 'Talk to Agent',
      about: 'You are starting a conversation about the property:',
      goToChat: 'Go to Chat',
      cancel: 'Cancel',
    },
    visit: {
      title: 'Schedule Visit',
      property: 'Property',
      name: 'Your name *',
      namePlaceholder: 'Enter your name',
      phone: 'Your phone *',
      phonePlaceholder: '+1 (555) 000-0000',
      date: 'Preferred date *',
      time: 'Preferred time',
      confirm: 'Confirm via WhatsApp',
      cancel: 'Cancel',
      missingFields: 'Please fill in all fields to schedule.',
      successMessage: 'Redirecting to WhatsApp to confirm the visit!',
    },
    toast: {
      favoriteAdded: 'Property added to favorites',
      favoriteRemoved: 'Property removed from favorites',
      alreadyFavorited: 'Property already in favorites',
      loginRequired: 'Please log in to save properties.',
      favoriteError: 'Error updating favorites. Please try again.',
      linkCopied: 'Link copied! Share with your clients.',
      linkCopiedShort: 'Link copied!',
      linkError: 'Could not copy the link.',
    },
    imageAlt: 'Property image - {title}',
    imageAltDefault: 'Property image',
  },

  propertyCard: {
    bedroom: 'bedroom',
    bedrooms: 'bedrooms',
    bathroom: 'bathroom',
    bathrooms: 'bathrooms',
    viewDetails: 'View Details',
    edit: 'Edit',
    scheduleVisit: 'Schedule Visit',
  },

  properties: {
  title: 'Property Catalog',
  subtitle: 'Find the perfect property for you',

  stats: {
    results: 'Results',
    available: 'Available',
    reserved: 'Reserved',
    featured: 'Featured',
  },

  filters: {
    title: 'Filters',
    show: 'Show filters',
    hide: 'Hide filters',
    statusAll: 'All statuses',
    bedroomsAll: 'Any',
    cityPlaceholder: 'Search by city...',
    searchPlaceholder: 'Search by title or location...',
    type: 'Property type',
    status: 'Status',
    bedrooms: 'Bedrooms',
    minPrice: 'Min price',
    maxPrice: 'Max price',
    location: 'Location',
    clear: 'Clear filters',
  },

  types: {
    apartamento: 'Apartment',
    casa: 'House',
    cobertura: 'Penthouse',
    studio: 'Studio',
    terreno: 'Land',
  },

  status: {
    available: 'Available',
    reserved: 'Reserved',
    sold: 'Sold',
    disponivel: 'Available',
    reservado: 'Reserved',
    vendido: 'Sold',
  },

  loading: {
    title: 'Loading properties...',
    subtitle: 'Fetching the best opportunities for you.',
  },

  error: {
    title: 'Error loading properties',
    retry: 'Try again',
  },

  bedrooms: {
    '1': '1',
    '2': '2',
    '3': '3',
    '4plus': '4+',
  },

  empty: {
    title: 'No properties found',
    subtitle: 'Try adjusting the filters or searching again.',
    action: 'Clear filters',
  },
},
  leadDetail: {
  backToLeads: '← Back to Leads',
  title: 'Lead Details',
  id: 'ID: {id}',

  summary: {
    title: 'Lead summary',
    createdAt: 'Created on {date}',
    name: 'Name',
    email: 'Email',
    phone: 'Phone',
    status: 'Status',
  },

  quickActions: {
    title: 'Quick Actions',
    subtitle: 'Manage lead status and actions',
    changeStatus: 'Change status',

    openConversation: 'Open conversation',
    sendMessage: 'Send message',
    markConverted: 'Mark as converted',
    archiveLead: 'Archive lead',
  },

  toast: {
    statusUpdated: 'Status updated successfully.',
    messageSent: 'Message sent successfully.',
    leadConverted: 'Lead marked as converted successfully.',
    leadArchived: 'Lead archived successfully.',
  },

  statusOptions: {
    pending: 'Pending',
    active: 'In progress',
    inactive: 'Inactive',
    converted: 'Converted',
    archived: 'Archived',
  },

  modals: {
    convert: {
      title: 'Mark as Converted',
      body: 'Confirm marking this lead as converted? The status will be changed to "closed".',
      cancel: 'Cancel',
      confirm: 'Confirm',
    },
    archive: {
      title: 'Archive Lead',
      body: 'Confirm archiving this lead? It will no longer appear in the active list.',
      cancel: 'Cancel',
      confirm: 'Archive',
    },
    chat: {
      title: 'Conversation history',
      close: 'Close',
    },
  },
},
  leads: {
  title: 'Leads',
  subtitle: 'Track the sales funnel.',

  resultsPill: '{count} result(s)',

  loading: 'Loading leads...',
  error: 'Error loading leads: {message}',
  foundCount: 'Found {count} lead(s)',

  filters: {
    searchLabel: 'Search',
    searchPlaceholder: 'Search by name or email...',
    statusLabel: 'Status',
    apply: 'Apply filters',
    clear: 'Clear',
  },

  statusOptions: {
    all: 'All',
    new: 'New',
    inService: 'In Progress',
    proposalSent: 'Proposal Sent',
    closed: 'Closed',
    lost: 'Lost',
  },

  table: {
    name: 'Name',
    email: 'Email',
    phone: 'Phone',
    status: 'Status',
    createdAt: 'Created at',
    empty: 'No leads found with the current filters.',
  },

  mobile: {
    phone: 'Phone',
    createdAt: 'Created at',
    id: 'ID',
  },

  status: {
    all: 'All',
    new: 'New',
    contacting: 'Contacting',
    pending: 'Pending',
    inService: 'In progress',
    converted: 'Converted',
    lost: 'Lost',
  },

  list: {
    viewDetail: 'View details →',
    createdAt: 'Created on {date}',
  },

  pagination: {
    prev: 'Previous',
    next: 'Next',
    page: 'Page {current} of {total}',
  },
},
  favorites: {
  title: 'Favorites',
  subtitle: 'Saved properties to revisit later.',

  resultsPill: '{count} favorite(s)',

  loading: 'Loading favorites...',
  retry: 'Try again',

  errors: {
    sessionExpired: 'Session expired. Please log in again.',
    serverOffline: 'Could not connect to server. Check if backend is running.',
    loadFailed: 'Error loading favorites.',
    removeFailed: 'Error removing favorite.',
  },

  empty: {
    title: 'No favorites yet',
    subtitle: 'Save properties to access them quickly later.',
    action: 'View property list',
  },

  actions: {
    remove: 'Remove',
    contactAgent: 'Talk to agent',
    viewDetails: 'View Details',
  },

  toast: {
    removed: 'Removed from favorites.',
    contactShortcut: 'Contact shortcut triggered.',
  },

  modal: {
    title: 'Contact',
    close: 'Close',
    startChat: 'Start chat',
    intro: 'You are about to start contact about:',
    footnote: '*No real-time at this stage. In the future this will open a chat with the agent.',
  },

  status: {
    active: 'Active',
    reserved: 'Reserved',
    sold: 'Sold',
    inactive: 'Inactive',
  },
},
  messages: {
  title: 'Messages',
  subtitle: 'Mock conversations.',
  viewChat: 'View chat',

  empty: {
    title: 'No conversation',
    subtitle: 'Select a conversation to view.',
  },

  chat: {
    back: 'Back',
    inputPlaceholder: 'Type your message…',
    send: 'Send',
    footnote: 'Sending is mocked and saved only in local state.',
  },

  status: {
    unread: 'Unread',
    active: 'Active',
    archived: 'Archived',
  },

  noMessages: 'No messages',
},
  sidebar: {
  logo: 'Real Estate',

  sections: {
    main: 'MAIN MENU',
    myProperties: 'MY PROPERTIES',
  },

  links: {
    dashboard: 'Dashboard',
    leads: 'Leads',
    favoritesList: 'Favorites List',
    messages: 'Messages',
    propertiesList: 'Properties',
    adminProperties: 'Manage Properties',
    myFavorites: 'My Favorites',
    customize: 'Customize',
  },

  actions: {
    expand: 'Expand sidebar',
    collapse: 'Collapse sidebar',
    closeMenu: 'Close menu',
    logout: 'Logout',
  },
},

  app: {
    brand: {
      title: 'Artificial Realty',
      tagline: 'Intelligence that values every property',
    },
  },

  header: {
    user: 'User',
    greeting: 'Good morning',
    stats: {
      active: 'Active listings: {count}',
      new: 'New: {count}',
      messages: 'Messages: {count}',
    },
    actions: {
      settings: 'Settings',
      themeToLight: 'Switch to light',
      themeToDark: 'Switch to dark',
      logout: 'Logout',
    },
  },

  language: {
    label: 'Language',
    ptBR: 'Portuguese (Brazil)',
    enUS: 'English',
    esES: 'Spanish',
  },

  login: {
    brand: 'Real Estate',
    title: 'Access your account',
    emailLabel: 'Email',
    emailPlaceholder: 'youremail@example.com',
    passwordLabel: 'Password',
    passwordPlaceholder: '••••••',
    showPassword: 'Show password',
    hidePassword: 'Hide password',
    submit: 'Sign in',
    submitting: 'Signing in...',
    errors: {
      emailRequired: 'Please enter your email.',
      emailInvalid: 'Please enter a valid email.',
      loginFailed: 'Error signing in, please try again.',
    },
  },

  rightSidebar: {
    title: 'My Properties',
    status: 'Active',
    location: 'City, State',
    price: '$ 0.00',
    contact: {
      location: 'Location: City, State',
      phone: 'Phone: (00) 00000-0000',
      email: 'Email: email@example.com',
      action: 'Customize',
    },
  },

  pages: {
    myFavorites: 'My Favorites',
    customize: 'Customize',
    notFound: '404 - Not found',
    simpleMock: 'Mock page (frontend).',
  },

  dashboard: {
    findProperty: 'Find Property',

    placeholders: {
      location: 'Location',
      minPrice: 'Min price',
      maxPrice: 'Max price',
      maxKm: 'Max km',
      type: 'Type',
      bedrooms: 'Bedrooms',
      bathrooms: 'Bathrooms',
      city: 'City',
      country: 'Country',
    },

    search: 'Search',
    toastSearchStarted: 'Search started (mock).',

    listings: {
      title: 'Available Properties',
      resultsCount: '{count} found',
      filterBy: 'Filter by',
    },

    card: {
      status: 'Active',
      exampleTitle: 'Example property {n}',
      locationRecent: 'City, State • recently',
      priceZero: '$ 0.00',
      details: '— beds • — baths • — m²',
      desc: 'Property description.',
      active: 'Active',
      bedrooms: 'bedrooms',
      bathrooms: 'bathrooms',
      favorited: 'added to favorites!',
      alreadyFavorited: 'Property is already in favorites.',
      loginToFavorite: 'Log in to favorite properties.',
      favoriteError: 'Error favoriting. Please try again.',
      favorite: 'Favorite',
      offer: 'Make Offer',
      actions: {
        favorite: 'Favorite',
        offer: 'Make Offer',
      },
    },

    modal: {
      title: 'Filters',
      cancel: 'Cancel',
      apply: 'Apply',
      text: 'Adjust your filters and click "Apply".',
      wip: 'Filters in development.',
      filters: {
        title: 'Filters',
        cancel: 'Cancel',
        apply: 'Apply',
        toastApplied: 'Filters applied (mock).',
        body: 'Adjust your filters and click "Apply".',
      },
    },

    searchForm: {
      title: 'Find Property',
      location: 'Location',
      priceMin: 'Min price',
      priceMax: 'Max price',
      maxKm: 'Max km',
      type: 'Type',
      bedrooms: 'Bedrooms',
      bathrooms: 'Bathrooms',
      city: 'City',
      country: 'Country',
      button: 'Search',
      started: 'Search started.',
      option1: 'Option 1',
      option2: 'Option 2',
      option3: 'Option 3',
    },
  },
}
