import { useEffect, useRef, useState, useMemo } from 'react'
import { Button, Input } from '../components/ui/index.js'
import { useI18n } from '../i18n/index.jsx'
import {
  fetchConversations,
  fetchMessages,
  sendMessage,
  markAsRead,
  archiveConversation,
  createConversationSocket,
} from '../services/conversationsService.js'

const STATUS_ORDER = { unread: 0, active: 1, archived: 2 }

function getStatus(conv) {
  if (conv.is_archived) return 'archived'
  if (!conv.is_read || conv.unread_count > 0) return 'unread'
  return 'active'
}

export default function Messages() {
  const { t } = useI18n()

  const [conversations, setConversations] = useState([])
  const [messages, setMessages] = useState([])
  const [activeId, setActiveId] = useState(null)
  const [text, setText] = useState('')
  const [showArchived, setShowArchived] = useState(false)
  const [mobileShowList, setMobileShowList] = useState(true)
  const [loading, setLoading] = useState(true)

  const socketRef = useRef(null)
  const chatBodyRef = useRef(null)

  const active = useMemo(() => conversations.find((c) => c.id === activeId) || null, [conversations, activeId])

  // Carregar conversas ao montar
  useEffect(() => {
    fetchConversations()
      .then(setConversations)
      .finally(() => setLoading(false))
  }, [])

  // Scroll automático ao chegar nova mensagem
  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight
    }
  }, [messages])

  // WebSocket por conversa
  useEffect(() => {
    if (!activeId) return

    if (socketRef.current) {
      socketRef.current.close()
    }

    const socket = createConversationSocket(activeId)
    socketRef.current = socket

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        if (data.type === 'new_message') {
          const msg = data.message
          setMessages((prev) => {
            if (prev.find((m) => m.id === msg.id)) return prev
            return [...prev, msg]
          })
          setConversations((prev) =>
            prev.map((c) =>
              c.id === activeId
                ? { ...c, last_message: msg.content, last_message_at: msg.created_at }
                : c,
            ),
          )
        }
      } catch {}
    }

    return () => {
      socket.close()
    }
  }, [activeId])

  const handleOpenConversation = async (id) => {
    setActiveId(id)
    setMobileShowList(false)

    const msgs = await fetchMessages(id)
    setMessages(msgs)

    markAsRead(id)
    setConversations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, is_read: true, unread_count: 0 } : c)),
    )
  }

  const handleSend = async () => {
    const msg = text.trim()
    if (!msg || !activeId) return
    setText('')

    try {
      await sendMessage(activeId, msg, 'corretor')
    } catch {
      setText(msg)
    }
  }

  const handleArchive = async () => {
    if (!active) return
    await archiveConversation(active.id)
    setConversations((prev) =>
      prev.map((c) => (c.id === active.id ? { ...c, is_archived: true } : c)),
    )
    if (!showArchived) {
      setActiveId(null)
      setMobileShowList(true)
    }
  }

  const visibleConversations = useMemo(() => {
    return conversations.filter((c) =>
      showArchived ? c.is_archived : !c.is_archived,
    )
  }, [conversations, showArchived])

  const sortedConversations = useMemo(() => {
    return [...visibleConversations].sort((a, b) => {
      const sa = STATUS_ORDER[getStatus(a)] ?? 9
      const sb = STATUS_ORDER[getStatus(b)] ?? 9
      if (sa !== sb) return sa - sb
      return new Date(b.last_message_at || 0) - new Date(a.last_message_at || 0)
    })
  }, [visibleConversations])

  const statusLabel = (conv) => {
    const s = getStatus(conv)
    if (s === 'unread') return t('messages.status.unread')
    if (s === 'archived') return t('messages.status.archived')
    return t('messages.status.active')
  }

  return (
    <div className="messages-page">
      {/* LISTA */}
      <aside className={`messages-list ${mobileShowList ? 'messages-list--show' : ''}`}>
        <div className="messages-list-header">
          <div>
            <h2>{t('messages.title')}</h2>
            <p className="muted">{t('messages.subtitle')}</p>
          </div>
          <Button
            variant="outline"
            className="messages-mobile-close"
            type="button"
            onClick={() => setMobileShowList(false)}
          >
            {t('messages.viewChat')}
          </Button>
        </div>

        <div style={{ display: 'flex', gap: 8, padding: '0 12px 12px' }}>
          <Button variant={showArchived ? 'outline' : 'default'} type="button" onClick={() => setShowArchived(false)}>
            {t('messages.status.active')}
          </Button>
          <Button variant={showArchived ? 'default' : 'outline'} type="button" onClick={() => setShowArchived(true)}>
            {t('messages.status.archived')}
          </Button>
        </div>

        <div className="messages-list-body">
          {loading && <p style={{ padding: 12 }}>Carregando...</p>}
          {!loading && sortedConversations.length === 0 && (
            <p style={{ padding: 12, color: 'var(--muted)' }}>Nenhuma conversa.</p>
          )}
          {sortedConversations.map((c) => {
            const s = getStatus(c)
            return (
              <button
                key={c.id}
                type="button"
                className={[
                  'conv-item',
                  c.id === activeId ? 'conv-item--active' : '',
                  c.is_archived ? 'conv-item--archived' : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
                onClick={() => handleOpenConversation(c.id)}
              >
                <div className="conv-top">
                  <div className="conv-name">{c.lead_name || c.id}</div>
                  <span className={`conv-status status-${s}`}>{statusLabel(c)}</span>
                </div>
                <div className="conv-bottom">
                  <div className="conv-preview">{c.last_message || t('messages.noMessages')}</div>
                  {c.unread_count > 0 && <span className="conv-unread">{c.unread_count}</span>}
                </div>
              </button>
            )
          })}
        </div>
      </aside>

      {/* CHAT */}
      <section className={`messages-chat ${mobileShowList ? 'messages-chat--hide' : ''}`}>
        {!active ? (
          <div className="panel">
            <h2>{t('messages.empty.title')}</h2>
            <p className="muted">{t('messages.empty.subtitle')}</p>
          </div>
        ) : (
          <div className="chat-shell">
            <div className="chat-header">
              <div>
                <div className="chat-title">{active.lead_name || active.id}</div>
              </div>
              <div className="chat-header-actions" style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <span className={`chat-status status-${getStatus(active)}`}>{statusLabel(active)}</span>
                {!active.is_archived && (
                  <Button variant="outline" type="button" onClick={handleArchive}>
                    Arquivar
                  </Button>
                )}
                <Button
                  variant="outline"
                  className="messages-mobile-back"
                  type="button"
                  onClick={() => setMobileShowList(true)}
                >
                  {t('messages.chat.back')}
                </Button>
              </div>
            </div>

            <div className="chat-body" ref={chatBodyRef}>
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={[
                    'bubble-row',
                    m.sender_type === 'corretor' ? 'bubble-row--me' : 'bubble-row--them',
                  ].join(' ')}
                >
                  <div className="bubble">
                    <div className="bubble-text">{m.content}</div>
                    <div className="bubble-time">{formatTime(m.created_at)}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="chat-footer">
              <Input
                placeholder={t('messages.chat.inputPlaceholder')}
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSend()
                }}
              />
              <Button onClick={handleSend}>{t('messages.chat.send')}</Button>
            </div>
          </div>
        )}
      </section>
    </div>
  )
}

function formatTime(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}
