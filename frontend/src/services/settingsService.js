const API_BASE_URL = 'http://127.0.0.1:8000';
const AUTH_TOKEN_KEY = 'ia_token';

// Função para obter o token do localStorage
const getAuthToken = () => {
  const token = localStorage.getItem(AUTH_TOKEN_KEY);
  return token ? `Bearer ${token}` : null;
};

// Função para fazer requisições à API
const apiRequest = async (url, options = {}) => {
  const token = getAuthToken();
  
  const response = await fetch(`${API_BASE_URL}${url}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: token }),
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
};

// Buscar configurações do usuário
export const getSettings = async () => {
  try {
    const data = await apiRequest('/settings/');
    return data;
  } catch (error) {
    console.error('Erro ao buscar configurações:', error);
    throw error;
  }
};

// Atualizar configurações do usuário
export const updateSettings = async (settings) => {
  try {
    const data = await apiRequest('/settings/', {
      method: 'PUT',
      body: JSON.stringify(settings),
    });
    return data;
  } catch (error) {
    console.error('Erro ao atualizar configurações:', error);
    throw error;
  }
};
