const API_BASE_URL = 'http://127.0.0.1:8000'
const WS_BASE_URL = 'ws://127.0.0.1:8000'

function getHeaders() {
  const token = localStorage.getItem('ia_token')
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
}

export async function fetchConversations() {
  const res = await fetch(`${API_BASE_URL}/conversations`, { headers: getHeaders() })
  if (!res.ok) throw new Error('Erro ao buscar conversas')
  return res.json()
}

export async function fetchMessages(conversationId) {
  const res = await fetch(`${API_BASE_URL}/conversations/${conversationId}/messages`, {
    headers: getHeaders(),
  })
  if (!res.ok) throw new Error('Erro ao buscar mensagens')
  return res.json()
}

export async function sendMessage(conversationId, content, senderType = 'corretor') {
  const res = await fetch(`${API_BASE_URL}/conversations/${conversationId}/messages`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ content, sender_type: senderType }),
  })
  if (!res.ok) throw new Error('Erro ao enviar mensagem')
  return res.json()
}

export async function markAsRead(conversationId) {
  await fetch(`${API_BASE_URL}/conversations/${conversationId}/read`, {
    method: 'PATCH',
    headers: getHeaders(),
  })
}

export async function archiveConversation(conversationId) {
  await fetch(`${API_BASE_URL}/conversations/${conversationId}/archive`, {
    method: 'PATCH',
    headers: getHeaders(),
  })
}

export function createConversationSocket(conversationId) {
  return new WebSocket(`${WS_BASE_URL}/ws/conversations/${conversationId}`)
}
