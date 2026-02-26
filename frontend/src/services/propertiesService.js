/**
 * Serviço para comunicação com a API de imóveis
 * Centraliza todas as chamadas relacionadas a properties
 */

const API_BASE_URL = 'http://127.0.0.1:8000';

/**
 * Obtém o token de autenticação do localStorage
 * @returns {string|null} Token JWT ou null
 */
function getAuthToken() {
  const token = localStorage.getItem('authToken');
  return token ? `Bearer ${token}` : null;
}

/**
 * Configurações padrão para requisições autenticadas
 * @param {Object} options - Opções adicionais
 * @returns {Object} Headers configurados
 */
function getAuthHeaders(options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  };

  const token = getAuthToken();
  if (token) {
    headers.Authorization = token;
  }

  return headers;
}

/**
 * Constrói a URL com parâmetros de query
 * @param {string} baseUrl - URL base
 * @param {Object} params - Parâmetros para adicionar à query string
 * @returns {string} URL completa com parâmetros
 */
function buildUrlWithParams(baseUrl, params = {}) {
  const url = new URL(baseUrl);

  // Adiciona apenas parâmetros com valor não nulo/não vazio
  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== '') {
      url.searchParams.append(key, value);
    }
  });

  return url.toString();
}

/**
 * Helper para criar um erro com status HTTP preservado
 */
function createHttpError(message, statusCode) {
  const err = new Error(message);
  err.status = statusCode; // <- importante para o frontend tratar 404 etc.
  return err;
}

/**
 * Helper para extrair mensagem de erro do backend
 */
async function readErrorMessage(response) {
  const data = await response.json().catch(() => ({}));
  return data?.detail || `Erro ${response.status}: ${response.statusText}`;
}

/**
 * Busca lista de imóveis com filtros opcionais
 * @param {Object} filters - Filtros aplicáveis
 * @param {string} filters.city - Filtrar por cidade
 * @param {number} filters.minPrice - Preço mínimo
 * @param {number} filters.maxPrice - Preço máximo
 * @param {number} filters.bedrooms - Número de quartos
 * @param {string} filters.status - Status do imóvel (AVAILABLE, SOLD, RESERVED)
 * @returns {Promise<Object>} Promise com { data: Property[], total: number }
 */
export async function getProperties(filters = {}) {
  try {
    // Constrói URL com filtros
    const url = buildUrlWithParams(`${API_BASE_URL}/properties/`, filters);

    const response = await fetch(url);

    // Verifica se a resposta foi bem sucedida
    if (!response.ok) {
      const message = await readErrorMessage(response);
      throw createHttpError(message, response.status);
    }

    return await response.json();

  } catch (error) {
    // Se já tiver status, mantém. Senão, cria genérico.
    if (error?.status) throw error;

    throw createHttpError(
      error?.message ||
      'Não foi possível carregar os imóveis. Tente novamente mais tarde.',
      0
    );
  }
}

/**
 * Busca um imóvel específico por ID
 * @param {string} id - UUID do imóvel
 * @returns {Promise<Object>} Promise com os dados do imóvel
 */
export async function getPropertyById(id) {
  try {
    const response = await fetch(`${API_BASE_URL}/properties/${id}`, {
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      const message = await readErrorMessage(response);
      throw createHttpError(message, response.status);
    }

    return await response.json();

  } catch (error) {
    if (error?.status) throw error;

    throw createHttpError(
      error?.message ||
      'Não foi possível carregar o imóvel. Tente novamente mais tarde.',
      0
    );
  }
}

/**
 * Cria um novo imóvel
 * @param {Object|FormData} propertyData - Dados do imóvel
 * @param {boolean} isFormData - Se os dados são FormData
 * @returns {Promise<Object>} Promise com o imóvel criado
 */
export async function createProperty(propertyData, isFormData = false) {
  try {
    const headers = getAuthHeaders();
    
    // Se for FormData, remover Content-Type para deixar o navegador definir
    if (isFormData) {
      delete headers['Content-Type'];
    }

    const response = await fetch(`${API_BASE_URL}/properties/`, {
      method: 'POST',
      headers: headers,
      body: isFormData ? propertyData : JSON.stringify(propertyData)
    });

    if (!response.ok) {
      const message = await readErrorMessage(response);
      throw createHttpError(message, response.status);
    }

    return await response.json();

  } catch (error) {
    if (error?.status) throw error;

    throw createHttpError(
      error?.message ||
      'Não foi possível criar o imóvel. Tente novamente mais tarde.',
      0
    );
  }
}

/**
 * Atualiza um imóvel existente
 * @param {string} id - UUID do imóvel
 * @param {Object|FormData} propertyData - Dados para atualizar
 * @param {boolean} isFormData - Se os dados são FormData
 * @returns {Promise<Object>} Promise com o imóvel atualizado
 */
export async function updateProperty(id, propertyData, isFormData = false) {
  try {
    const headers = getAuthHeaders();
    
    // Se for FormData, remover Content-Type para deixar o navegador definir
    if (isFormData) {
      delete headers['Content-Type'];
    }

    const response = await fetch(`${API_BASE_URL}/properties/${id}`, {
      method: 'PUT',
      headers: headers,
      body: isFormData ? propertyData : JSON.stringify(propertyData)
    });

    if (!response.ok) {
      const message = await readErrorMessage(response);
      throw createHttpError(message, response.status);
    }

    return await response.json();

  } catch (error) {
    if (error?.status) throw error;

    throw createHttpError(
      error?.message ||
      'Não foi possível atualizar o imóvel. Tente novamente mais tarde.',
      0
    );
  }
}

/**
 * Remove um imóvel
 * @param {string} id - UUID do imóvel
 * @returns {Promise<void>}
 */
export async function deleteProperty(id) {
  try {
    const response = await fetch(`${API_BASE_URL}/properties/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      const message = await readErrorMessage(response);
      throw createHttpError(message, response.status);
    }

    // DELETE retorna 204 No Content
    return;

  } catch (error) {
    if (error?.status) throw error;

    throw createHttpError(
      error?.message ||
      'Não foi possível remover o imóvel. Tente novamente mais tarde.',
      0
    );
  }
}

/**
 * Formata o preço para exibição em reais
 * @param {number} price - Preço numérico
 * @returns {string} Preço formatado (R$ 1.234.567,89)
 */
export function formatPrice(price) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(price);
}

/**
 * Traduz o status do imóvel para português
 * @param {string} status - Status em inglês
 * @returns {string} Status em português
 */
export function translateStatus(status) {
  const statusMap = {
    'AVAILABLE': 'Disponível',
    'SOLD': 'Vendido',
    'RESERVED': 'Reservado'
  };

  return statusMap[status] || status;
}

/**
 * Validação de filtros antes de enviar para API
 * @param {Object} filters - Filtros a validar
 * @returns {Object} Filtros validados e limpos
 */
export function validateFilters(filters) {
  const validated = {};

  // Valida e limpa cada filtro
  if (filters.city?.trim()) {
    validated.city = filters.city.trim();
  }

  if (filters.minPrice && !isNaN(filters.minPrice)) {
    validated.minPrice = parseFloat(filters.minPrice);
  }

  if (filters.maxPrice && !isNaN(filters.maxPrice)) {
    validated.maxPrice = parseFloat(filters.maxPrice);
  }

  if (filters.bedrooms && !isNaN(filters.bedrooms)) {
    validated.bedrooms = parseInt(filters.bedrooms);
  }

  if (filters.status?.trim()) {
    validated.status = filters.status.trim().toUpperCase();
  }

  return validated;
}
