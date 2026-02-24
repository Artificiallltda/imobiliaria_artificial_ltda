// src/pages/Messages.jsx
import { useMemo, useState } from 'react'
import { messagesMock } from '../mocks/messagesMock.jsx'
import { Button, Input } from '../components/ui/index.js'
import { useI18n } from '../i18n/index.jsx'

// IMPORTANTe:
// - O mock mantém status em PT: "Não lida" | "Ativa" | "Arquivada"
// - A UI traduz esses rótulos via t(), sem mudar o valor do mock
const STATUS_ORDER = { 'Não lida': 0, Ativa: 1, Arquivada: 2 }

export default function Messages() {
  const { t } = useI18n()

  // mock
  const me = messagesMock.me
  const [conversations, setConversations] = useState(messagesMock.conversations)

  const [activeId, setActiveId] = useState(conversations[0]?.id || null)
  const [mobileShowList, setMobileShowList] = useState(true)
  const [text, setText] = useState('')

  // ✅ Aba: Ativas / Arquivadas
  const [showArchived, setShowArchived] = useState(false)

  const active = useMemo(() => conversations.find((c) => c.id === activeId) || null, [conversations, activeId])

  // ✅ Filtra conversas visíveis conforme aba
  const visibleConversations = useMemo(() => {
    return conversations.filter((c) => (showArchived ? c.status === 'Arquivada' : c.status !== 'Arquivada'))
  }, [conversations, showArchived])

  // ✅ Ordena somente as visíveis
  const sortedConversations = useMemo(() => {
    return [...visibleConversations].sort((a, b) => {
      const sa = STATUS_ORDER[a.status] ?? 9
      const sb = STATUS_ORDER[b.status] ?? 9
      if (sa !== sb) return sa - sb
      return new Date(b.updatedAt) - new Date(a.updatedAt)
    })
  }, [visibleConversations])

  const handleOpenConversation = (id) => {
    setActiveId(id)

    // marca como lida (mock)
    setConversations((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, status: c.status === 'Não lida' ? 'Ativa' : c.status, unreadCount: 0 } : c,
      ),
    )

    // mobile: ao abrir conversa, vai pro chat
    setMobileShowList(false)
  }

  const handleSend = () => {
    const msg = text.trim()
    if (!msg || !active) return

    const newMessage = {
      id: `m-${Date.now()}`,
      from: 'agent',
      text: msg,
      at: new Date().toISOString(),
    }

    setConversations((prev) =>
      prev.map((c) =>
        c.id === active.id
          ? {
              ...c,
              updatedAt: newMessage.at,
              messages: [...c.messages, newMessage],
            }
          : c,
      ),
    )

    setText('')
  }

  // ✅ Arquivar (mock)
  const handleArchive = () => {
    if (!active) return

    setConversations((prev) =>
      prev.map((c) =>
        c.id === active.id
          ? {
              ...c,
              status: 'Arquivada',
              unreadCount: 0,
              updatedAt: new Date().toISOString(),
            }
          : c,
      ),
    )

    // Se estiver na aba Ativas, some da lista e limpa o chat
    if (!showArchived) {
      setActiveId(null)
      setMobileShowList(true)
    }
  }

  const statusLabel = (statusPt) => {
    if (statusPt === 'Não lida') return t('messages.status.unread')
    if (statusPt === 'Ativa') return t('messages.status.active')
    if (statusPt === 'Arquivada') return t('messages.status.archived')
    return statusPt
  }

  return (
    <div className="messages-page">
      {/* COLUNA ESQUERDA: LISTA */}
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

        {/* ✅ Toggle Ativas / Arquivadas */}
        <div style={{ display: 'flex', gap: 8, padding: '0 12px 12px' }}>
          <Button variant={showArchived ? 'outline' : 'default'} type="button" onClick={() => setShowArchived(false)}>
            {t('messages.status.active')}
          </Button>

          <Button variant={showArchived ? 'default' : 'outline'} type="button" onClick={() => setShowArchived(true)}>
            {t('messages.status.archived')}
          </Button>
        </div>

        <div className="messages-list-body">
          {sortedConversations.map((c) => (
            <button
              key={c.id}
              type="button"
              className={[
                'conv-item',
                c.id === activeId ? 'conv-item--active' : '',
                c.status === 'Arquivada' ? 'conv-item--archived' : '',
              ]
                .filter(Boolean)
                .join(' ')}
              onClick={() => handleOpenConversation(c.id)}
            >
              <div className="conv-top">
                <div className="conv-name">{c.leadName}</div>

                {/* Classe continua baseada no valor PT (para não quebrar o CSS) */}
                <span className={`conv-status status-${slug(c.status)}`}>{statusLabel(c.status)}</span>
              </div>

              <div className="conv-sub">{c.property}</div>

              <div className="conv-bottom">
                <div className="conv-preview">{lastText(c.messages, t)}</div>

                {c.unreadCount > 0 && <span className="conv-unread">{c.unreadCount}</span>}
              </div>
            </button>
          ))}
        </div>
      </aside>

      {/* COLUNA DIREITA: CHAT */}
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
                <div className="chat-title">{active.leadName}</div>
                <div className="chat-subtitle">{active.property}</div>
              </div>

              <div className="chat-header-actions" style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <span className={`chat-status status-${slug(active.status)}`}>{statusLabel(active.status)}</span>

                {/* ✅ Botão Arquivar (só se não estiver arquivada) */}
                {active.status !== 'Arquivada' && (
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

            <div className="chat-body">
              {active.messages
                .slice()
                .sort((a, b) => new Date(a.at) - new Date(b.at))
                .map((m) => (
                  <div
                    key={m.id}
                    className={['bubble-row', m.from === 'agent' ? 'bubble-row--me' : 'bubble-row--them'].join(' ')}
                  >
                    <div className="bubble">
                      <div className="bubble-text">{m.text}</div>
                      <div className="bubble-time">{formatTime(m.at)}</div>
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

function lastText(messages = [], t) {
  const last = messages[messages.length - 1]
  return last?.text || t('messages.noMessages')
}

function slug(s) {
  return String(s || '')
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]/g, '')
}

function formatTime(iso) {
  const d = new Date(iso)
  const hh = String(d.getHours()).padStart(2, '0')
  const mm = String(d.getMinutes()).padStart(2, '0')
  return `${hh}:${mm}`
}