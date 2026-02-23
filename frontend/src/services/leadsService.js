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
 * Mapeia status do frontend para valores do backend
 */
function mapStatusToBackend(status) {
  const statusMap = {
    'Novo': 'novo',
    'Em Atendimento': 'em_atendimento',
    'Proposta Enviada': 'proposta_enviada',
    'Fechado': 'fechado',
    'Perdido': 'perdido'
  }
  return statusMap[status] || status
}

/**
 * Busca a lista de leads com filtros
 * @param {Object} filters - Filtros opcionais
 * @param {string} filters.status - Filtrar por status
 * @param {string} filters.search - Buscar por nome, email ou telefone
 * @param {string} filters.property_id - Filtrar por ID do imóvel
 * @param {number} filters.page - Página atual (padrão: 1)
 * @param {number} filters.limit - Itens por página (padrão: 10)
 * @returns {Promise<Object>} Lista paginada de leads
 * @throws {Error} Se a requisição falhar
 */
export async function getLeads(filters = {}) {
  try {
    console.log('Filtros recebidos:', filters)
    
    const params = new URLSearchParams();

    // Adicionar filtros aos parâmetros da URL
    if (filters.status) {
      const mappedStatus = mapStatusToBackend(filters.status)
      console.log('Status filtro:', filters.status, '→ mapeado para:', mappedStatus)
      params.append('status', mappedStatus);
    }
    if (filters.search) params.append('search', filters.search);
    if (filters.property_id) params.append('property_id', filters.property_id);
    if (filters.page) params.append('page', filters.page);
    if (filters.limit) params.append('limit', filters.limit);

    const url = `${API_BASE_URL}/leads${params.toString() ? `?${params.toString()}` : ''}${params.toString() ? '&' : '?'}_t=${Date.now()}`;
    console.log('URL final:', url)

    const response = await fetch(url, {
      method: 'GET',
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      let errorMessage = `Erro ao buscar leads: ${response.status} ${response.statusText}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.detail || errorData.message || errorMessage;
      } catch (e) {
        // Mantém a mensagem padrão se não conseguir parsear
      }

      if (response.status === 401) {
        errorMessage = 'Não autorizado. Por favor, faça login novamente.';
      } else if (response.status === 403) {
        errorMessage = 'Você não tem permissão para acessar este recurso.';
      } else if (response.status >= 500) {
        errorMessage = 'Erro no servidor. Por favor, tente novamente mais tarde.';
      }

      throw new Error(errorMessage);
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
}

/**
 * Atualiza um lead (status, arquivar, converter) - MVP
 * @param {string} leadId - ID do lead
 * @param {Object} updates - Campos a serem atualizados
 * @param {string} updates.status - Novo status do lead
 * @param {boolean} updates.is_archived - Arquivar/desarquivar lead
 * @param {boolean} updates.convert - Converter lead (status=fechado + converted_at)
 * @returns {Promise<Object>} Dados atualizados do lead
 * @throws {Error} Se a requisição falhar
 */
export async function updateLead(leadId, updates) {
  try {
    const response = await fetch(`${API_BASE_URL}/leads/${leadId}`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify(updates)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.detail || `Erro ao atualizar lead: ${response.statusText}`
      );
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
}

/**
 * Atualiza o status de um lead (legado - mantido para compatibilidade)
 * @param {string} leadId - ID do lead
 * @param {string} status - Novo status do lead
 * @returns {Promise<Object>} Dados atualizados do lead
 * @throws {Error} Se a requisição falhar
 */
export async function updateLeadStatus(leadId, status) {
  return updateLead(leadId, { status });
}
