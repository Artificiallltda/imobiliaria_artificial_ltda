export default {
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
  subtitle: 'Track the sales funnel (mock data).',

  resultsPill: '{count} result(s)',

  filters: {
    searchLabel: 'Search',
    searchPlaceholder: 'Search by name or email...',
    statusLabel: 'Status',
    clear: 'Clear',
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
},
  favorites: {
  title: 'Favorites',
  subtitle: 'Saved properties to revisit later.',

  resultsPill: '{count} favorite(s)',

  empty: {
    title: 'No favorites yet',
    subtitle: 'Save properties to access them quickly later.',
    action: 'View property list',
  },

  actions: {
    remove: 'Remove',
    contactAgent: 'Talk to agent',
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
      actions: {
        favorite: 'Favorite',
        offer: 'Make Offer',
      },
    },

    modal: {
      filters: {
        title: 'Filters',
        cancel: 'Cancel',
        apply: 'Apply',
        toastApplied: 'Filters applied (mock).',
        body: 'Adjust your filters and click "Apply".',
      },
    },
  },
}
