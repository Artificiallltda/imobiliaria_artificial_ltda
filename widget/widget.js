(function () {
  const API = 'http://127.0.0.1:8000/api'
  const WS = 'ws://127.0.0.1:8000'
  const API_KEY = 'widget_key_2024'

  const config = window.CRM_WIDGET_CONFIG || {}

  let conversationId = null
  let socket = null
  let isOpen = false

  // ─── Injetar CSS ───────────────────────────────────────────────────────────
  const style = document.createElement('style')
  style.textContent = `
    #crm-widget-btn {
      position: fixed;
      bottom: 24px;
      right: 24px;
      width: 56px;
      height: 56px;
      border-radius: 50%;
      background: #2563eb;
      color: #fff;
      border: none;
      cursor: pointer;
      font-size: 24px;
      box-shadow: 0 4px 16px rgba(0,0,0,0.2);
      z-index: 99998;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: transform .2s;
    }
    #crm-widget-btn:hover { transform: scale(1.1); }

    #crm-widget-box {
      position: fixed;
      bottom: 90px;
      right: 24px;
      width: 340px;
      height: 480px;
      background: #fff;
      border-radius: 16px;
      box-shadow: 0 8px 32px rgba(0,0,0,0.18);
      display: flex;
      flex-direction: column;
      z-index: 99999;
      overflow: hidden;
      font-family: system-ui, sans-serif;
      display: none;
    }
    #crm-widget-box.open { display: flex; }

    .wgt-header {
      background: #2563eb;
      color: #fff;
      padding: 16px;
      font-weight: 600;
      font-size: 15px;
    }
    .wgt-header span { font-size: 12px; font-weight: 400; opacity: .8; display: block; margin-top: 2px; }

    .wgt-form {
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 10px;
      flex: 1;
      overflow-y: auto;
    }
    .wgt-form input {
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 10px 12px;
      font-size: 14px;
      outline: none;
    }
    .wgt-form input:focus { border-color: #2563eb; }
    .wgt-form button {
      background: #2563eb;
      color: #fff;
      border: none;
      border-radius: 8px;
      padding: 11px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
    }
    .wgt-form button:hover { background: #1d4ed8; }

    .wgt-messages {
      flex: 1;
      overflow-y: auto;
      padding: 12px;
      display: flex;
      flex-direction: column;
      gap: 8px;
      display: none;
    }
    .wgt-messages.active { display: flex; }

    .wgt-bubble {
      max-width: 78%;
      padding: 9px 13px;
      border-radius: 14px;
      font-size: 13px;
      line-height: 1.4;
      word-break: break-word;
    }
    .wgt-bubble.cliente {
      background: #eff6ff;
      color: #1e3a5f;
      align-self: flex-end;
      border-bottom-right-radius: 4px;
    }
    .wgt-bubble.corretor {
      background: #f1f5f9;
      color: #334155;
      align-self: flex-start;
      border-bottom-left-radius: 4px;
    }
    .wgt-bubble .wgt-time { font-size: 10px; opacity: .5; margin-top: 4px; text-align: right; }

    .wgt-footer {
      padding: 10px;
      border-top: 1px solid #f1f5f9;
      display: none;
      gap: 8px;
    }
    .wgt-footer.active { display: flex; }
    .wgt-footer input {
      flex: 1;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 9px 12px;
      font-size: 13px;
      outline: none;
    }
    .wgt-footer input:focus { border-color: #2563eb; }
    .wgt-footer button {
      background: #2563eb;
      color: #fff;
      border: none;
      border-radius: 8px;
      padding: 9px 14px;
      cursor: pointer;
      font-size: 13px;
    }
    .wgt-typing {
      font-size: 12px;
      color: #94a3b8;
      padding: 0 12px 6px;
      display: none;
    }
  `
  document.head.appendChild(style)

  // ─── Estrutura HTML ────────────────────────────────────────────────────────
  const btn = document.createElement('button')
  btn.id = 'crm-widget-btn'
  btn.innerHTML = '💬'
  document.body.appendChild(btn)

  const box = document.createElement('div')
  box.id = 'crm-widget-box'
  box.innerHTML = `
    <div class="wgt-header">
      Fale conosco
      <span>${config.propertyTitle ? '📍 ' + config.propertyTitle : 'Atendimento online'}</span>
    </div>
    <div class="wgt-form" id="wgt-form">
      <input id="wgt-name" placeholder="Seu nome" />
      <input id="wgt-email" type="email" placeholder="Seu e-mail" />
      <input id="wgt-phone" type="tel" placeholder="Telefone (opcional)" />
      <button id="wgt-start-btn">Iniciar conversa</button>
    </div>
    <div class="wgt-messages" id="wgt-messages"></div>
    <div class="wgt-typing" id="wgt-typing">Atendente está digitando...</div>
    <div class="wgt-footer" id="wgt-footer">
      <input id="wgt-msg-input" placeholder="Digite sua mensagem..." />
      <button id="wgt-send-btn">➤</button>
    </div>
  `
  document.body.appendChild(box)

  // ─── Toggle ────────────────────────────────────────────────────────────────
  btn.addEventListener('click', () => {
    isOpen = !isOpen
    box.classList.toggle('open', isOpen)
    btn.innerHTML = isOpen ? '✕' : '💬'
  })

  // ─── Iniciar conversa ──────────────────────────────────────────────────────
  document.getElementById('wgt-start-btn').addEventListener('click', async () => {
    const name = document.getElementById('wgt-name').value.trim()
    const email = document.getElementById('wgt-email').value.trim()
    const phone = document.getElementById('wgt-phone').value.trim()

    if (!name || !email) {
      alert('Por favor preencha nome e e-mail.')
      return
    }

    const startBtn = document.getElementById('wgt-start-btn')
    startBtn.textContent = 'Conectando...'
    startBtn.disabled = true

    try {
      const res = await fetch(`${API}/widget/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-api-key': API_KEY },
        body: JSON.stringify({
          name, email, phone: phone || null,
          property_id: config.propertyId ? String(config.propertyId) : null,
          property_title: config.propertyTitle || null,
          property_url: config.propertyUrl || window.location.href,
        }),
      })

      if (!res.ok) throw new Error('Erro ao iniciar conversa')
      const data = await res.json()
      conversationId = data.conversation_id

      // Carregar histórico
      await loadMessages()

      // Esconder form, mostrar chat
      document.getElementById('wgt-form').style.display = 'none'
      document.getElementById('wgt-messages').classList.add('active')
      document.getElementById('wgt-footer').classList.add('active')

      // Conectar WebSocket
      connectSocket()

    } catch (e) {
      alert('Erro ao conectar. Tente novamente.')
      startBtn.textContent = 'Iniciar conversa'
      startBtn.disabled = false
    }
  })

  // ─── Enviar mensagem ───────────────────────────────────────────────────────
  async function sendMessage() {
    const input = document.getElementById('wgt-msg-input')
    const content = input.value.trim()
    if (!content || !conversationId) return
    input.value = ''

    try {
      await fetch(`${API}/widget/${conversationId}/message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-api-key': API_KEY },
        body: JSON.stringify({ content }),
      })
    } catch {}
  }

  document.getElementById('wgt-send-btn').addEventListener('click', sendMessage)
  document.getElementById('wgt-msg-input').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') sendMessage()
  })

  // ─── Carregar histórico ────────────────────────────────────────────────────
  async function loadMessages() {
    const res = await fetch(`${API}/widget/${conversationId}/messages`, {
      headers: { 'x-api-key': API_KEY },
    })
    const msgs = await res.json()
    const container = document.getElementById('wgt-messages')
    container.innerHTML = ''
    msgs.forEach(appendMessage)
    scrollToBottom()
  }

  // ─── Adicionar bolha ───────────────────────────────────────────────────────
  function appendMessage(msg) {
    const container = document.getElementById('wgt-messages')
    const div = document.createElement('div')
    div.className = `wgt-bubble ${msg.sender_type}`
    const time = msg.created_at ? new Date(msg.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : ''
    div.innerHTML = `${msg.content}<div class="wgt-time">${time}</div>`
    container.appendChild(div)
    scrollToBottom()
  }

  function scrollToBottom() {
    const c = document.getElementById('wgt-messages')
    c.scrollTop = c.scrollHeight
  }

  // ─── WebSocket ─────────────────────────────────────────────────────────────
  let typingTimer = null

  function connectSocket() {
    socket = new WebSocket(`${WS}/ws/conversations/${conversationId}`)

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)

        if (data.type === 'new_message' && data.message.sender_type !== 'cliente') {
          appendMessage(data.message)
        }

        if (data.type === 'user_typing' && data.sender_type === 'corretor') {
          const el = document.getElementById('wgt-typing')
          el.style.display = 'block'
          clearTimeout(typingTimer)
          typingTimer = setTimeout(() => { el.style.display = 'none' }, 2500)
        }
      } catch {}
    }

    socket.onclose = () => {
      setTimeout(connectSocket, 3000)
    }
  }

  // ─── Typing do cliente ─────────────────────────────────────────────────────
  document.getElementById('wgt-msg-input').addEventListener('input', () => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({ type: 'typing', sender_type: 'cliente' }))
    }
  })
})()
