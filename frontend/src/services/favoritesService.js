/**
 * Serviço para comunicação com a API de favoritos
 * Centraliza todas as chamadas relacionadas a favorites
 */

const API_BASE_URL = 'http://127.0.0.1:8000';

/**
 * Obtém o token de autenticação do localStorage
 * @returns {string|null} Token JWT ou null
 */
function getAuthToken() {
  const token = localStorage.getItem('ia_token');
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
 * Helper para criar um erro com status HTTP preservado
 */
function createHttpError(message, statusCode) {
  const err = new Error(message);
  err.status = statusCode;
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
 * Busca lista de favoritos do usuário autenticado
 * @returns {Promise<Array>} Promise com array de favoritos
 */
export async function getFavorites() {
  try {
    const response = await fetch(`${API_BASE_URL}/favorites/`, {
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
      'Não foi possível carregar os favoritos. Tente novamente mais tarde.',
      0
    );
  }
}

/**
 * Adiciona um imóvel aos favoritos
 * @param {string} propertyId - UUID do imóvel
 * @param {string} leadId - UUID do lead (opcional)
 * @returns {Promise<Object>} Promise com { message, id }
 */
export async function addFavorite(propertyId, leadId = null) {
  try {
    const body = { property_id: propertyId };
    if (leadId) {
      body.lead_id = leadId;
    }

    const response = await fetch(`${API_BASE_URL}/favorites/`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(body)
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
      'Não foi possível adicionar aos favoritos. Tente novamente mais tarde.',
      0
    );
  }
}

/**
 * Remove um imóvel dos favoritos
 * @param {string} propertyId - UUID do imóvel
 * @returns {Promise<Object>} Promise com { message }
 */
export async function removeFavorite(propertyId) {
  try {
    const response = await fetch(`${API_BASE_URL}/favorites/${propertyId}`, {
      method: 'DELETE',
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
      'Não foi possível remover dos favoritos. Tente novamente mais tarde.',
      0
    );
  }
}

/**
 * Verifica se um imóvel está nos favoritos do usuário
 * @param {string} propertyId - UUID do imóvel
 * @returns {Promise<boolean>} Promise com true se está favoritado
 */
export async function checkFavorite(propertyId) {
  try {
    const response = await fetch(`${API_BASE_URL}/favorites/check/${propertyId}`, {
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      const message = await readErrorMessage(response);
      throw createHttpError(message, response.status);
    }

    const data = await response.json();
    return data.is_favorited;

  } catch (error) {
    if (error?.status) throw error;

    throw createHttpError(
      error?.message ||
      'Não foi possível verificar favorito. Tente novamente mais tarde.',
      0
    );
  }
}

/**
 * Busca favoritos de um lead específico
 * @param {string} leadId - UUID do lead
 * @returns {Promise<Array>} Promise com array de favoritos do lead
 */
export async function getLeadFavorites(leadId) {
  try {
    const response = await fetch(`${API_BASE_URL}/favorites/leads/${leadId}`, {
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
      'Não foi possível carregar os favoritos do lead. Tente novamente mais tarde.',
      0
    );
  }
}

/**
 * Gera link público para compartilhamento de favorito
 * @param {string} favoriteId - UUID do favorito
 * @returns {Promise<Object>} Promise com { message, public_token, public_url }
 */
export async function generatePublicLink(favoriteId) {
  try {
    const response = await fetch(`${API_BASE_URL}/favorites/${favoriteId}/generate-link`, {
      method: 'POST',
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
      'Não foi possível gerar link público. Tente novamente mais tarde.',
      0
    );
  }
}

/**
 * Busca favoritos públicos através do token (sem autenticação)
 * @param {string} token - Token público
 * @returns {Promise<Array>} Promise com array de imóveis públicos
 */
export async function getPublicFavorites(token) {
  try {
    const response = await fetch(`${API_BASE_URL}/favorites/public/${token}`);

    if (!response.ok) {
      const message = await readErrorMessage(response);
      throw createHttpError(message, response.status);
    }

    return await response.json();

  } catch (error) {
    if (error?.status) throw error;

    throw createHttpError(
      error?.message ||
      'Não foi possível carregar os favoritos públicos. Tente novamente mais tarde.',
      0
    );
  }
}
