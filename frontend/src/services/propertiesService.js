/**
 * Serviço para comunicação com a API de imóveis
 * Centraliza todas as chamadas relacionadas a properties
 */

const API_BASE_URL = 'http://127.0.0.1:8000';

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
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.detail || 
        `Erro ${response.status}: ${response.statusText}`
      );
    }
    
    const data = await response.json();
    
    return data;
    
  } catch (error) {
    // Propaga erro para tratamento no componente
    throw new Error(
      error.message || 
      'Não foi possível carregar os imóveis. Tente novamente mais tarde.'
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
