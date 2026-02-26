const API_BASE_URL = 'http://127.0.0.1:8000';

const AUTH_TOKEN_KEY = 'ia_token';

// Função para obter o token de autenticação do localStorage
const getAuthToken = () => {
  try {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    return token ? `Bearer ${token}` : null;
  } catch {
    return null;
  }
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

// Métodos da API
export const api = {
  get: (url, options = {}) => apiRequest(url, { method: 'GET', ...options }),
  post: (url, data, options = {}) => apiRequest(url, { 
    method: 'POST', 
    body: JSON.stringify(data), 
    ...options 
  }),
  put: (url, data, options = {}) => apiRequest(url, { 
    method: 'PUT', 
    body: JSON.stringify(data), 
    ...options 
  }),
  patch: (url, data, options = {}) => apiRequest(url, { 
    method: 'PATCH', 
    body: JSON.stringify(data), 
    ...options 
  }),
  delete: (url, options = {}) => apiRequest(url, { method: 'DELETE', ...options }),
};

export default api;
