/**
 * Serviço para comunicação com a API de leads
 * Centraliza todas as chamadas relacionadas a leads
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
 * Busca os detalhes de um lead por ID
 * @param {string} id - ID do lead
 * @returns {Promise<Object>} Dados do lead
 * @throws {Error} Se a requisição falhar
 */
export async function getLeadById(id) {
  try {
    const response = await fetch(`${API_BASE_URL}/leads/${id}`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      let errorMessage = `Erro ao buscar lead: ${response.status} ${response.statusText}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.detail || errorData.message || errorMessage;
      } catch (e) {
        // Não é necessário fazer nada aqui, já que o errorMessage padrão já está definido
      }
      
      if (response.status === 401) {
        errorMessage = 'Não autorizado. Por favor, faça login novamente.';
      } else if (response.status === 403) {
        errorMessage = 'Você não tem permissão para acessar este recurso.';
      } else if (response.status === 404) {
        errorMessage = `Lead com ID ${id} não encontrado.`;
      } else if (response.status >= 500) {
        errorMessage = 'Erro no servidor. Por favor, tente novamente mais tarde.';
      }
      
      const error = new Error(errorMessage);
      error.status = response.status;
      throw error;
    }

    return await response.json();
  } catch (error) {
    // Propaga o erro para ser tratado pelo componente
    throw error;
  }
}

/**
 * Busca a lista de todos os leads
 * @returns {Promise<Array>} Lista de leads
 * @throws {Error} Se a requisição falhar
 */
export async function getLeads() {
  try {
    const response = await fetch(`${API_BASE_URL}/leads`, {
      method: 'GET',
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error(`Erro ao buscar leads: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
}

/**
 * Atualiza o status de um lead
 * @param {string} leadId - ID do lead
 * @param {string} status - Novo status do lead (deve ser um valor válido de LeadStatus)
 * @returns {Promise<Object>} Dados atualizados do lead
 * @throws {Error} Se a requisição falhar
 */
export async function updateLeadStatus(leadId, status) {
  try {
    const response = await fetch(`${API_BASE_URL}/leads/${leadId}/status`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.detail || `Erro ao atualizar status do lead: ${response.statusText}`
      );
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
}
