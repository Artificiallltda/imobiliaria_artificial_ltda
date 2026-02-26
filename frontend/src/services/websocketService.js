/**
 * Serviço para gerenciar conexões WebSocket
 * Centraliza toda a lógica de comunicação em tempo real
 */

const WS_BASE_URL = 'ws://127.0.0.1:8000';

class WebSocketService {
  constructor() {
    this.ws = null;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectInterval = 5000; // 5 segundos
    this.heartbeatInterval = null;
    this.isConnected = false;
    this.userId = null;
    this.listeners = new Map(); // Event listeners
  }

  /**
   * Conectar ao WebSocket
   * @param {string} userId - ID do usuário
   */
  connect(userId) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      console.log('WebSocket já conectado');
      return;
    }

    this.userId = userId;
    const wsUrl = `${WS_BASE_URL}/ws/${userId}`;
    
    try {
      this.ws = new WebSocket(wsUrl);
      
      this.ws.onopen = () => {
        console.log('WebSocket conectado');
        this.isConnected = true;
        this.reconnectAttempts = 0;
        this.startHeartbeat();
        this.emit('connected', { userId });
      };

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          this.handleMessage(data);
        } catch (error) {
          console.error('Erro ao parsear mensagem WebSocket:', error);
        }
      };

      this.ws.onclose = (event) => {
        console.log('WebSocket desconectado:', event.code, event.reason);
        this.isConnected = false;
        this.stopHeartbeat();
        this.emit('disconnected', { code: event.code, reason: event.reason });
        
        // Só tentar reconectar se não for um fechamento normal
        if (event.code !== 1000 && event.code !== 1001) {
          if (this.reconnectAttempts < this.maxReconnectAttempts) {
            this.scheduleReconnect();
          }
        }
      };

      this.ws.onerror = (error) => {
        // Verificar se é um erro real ou apenas uma desconexão normal
        const isRealError = error.type !== 'close' && 
                           error.code !== 1000 && 
                           error.code !== 1001 &&
                           error.type !== 'error';
        
        if (isRealError) {
          console.error('Erro WebSocket:', error);
          this.emit('error', error);
        }
      };

    } catch (error) {
      // Verificar se é um erro real ou apenas falha de conexão normal
      const isRealError = error.code !== 'ECONNREF' && 
                         error.code !== 'ECONNRESET' &&
                         !error.message.includes('Failed to connect');
      
      if (isRealError) {
        console.error('Erro ao criar conexão WebSocket:', error);
        this.emit('error', error);
      } else {
        // Falha de conexão normal - tentará reconectar automaticamente
        console.log('WebSocket não disponível, tentando reconectar...');
      }
    }
  }

  /**
   * Desconectar do WebSocket
   */
  disconnect() {
    this.stopHeartbeat();
    
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    
    this.isConnected = false;
    this.userId = null;
    this.reconnectAttempts = 0;
  }

  /**
   * Enviar mensagem para o servidor
   * @param {Object} message - Mensagem a ser enviada
   */
  send(message) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    } else {
      console.warn('WebSocket não está conectado');
    }
  }

  /**
   * Adicionar listener de eventos
   * @param {string} event - Nome do evento
   * @param {Function} callback - Função callback
   */
  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
  }

  /**
   * Remover listener de eventos
   * @param {string} event - Nome do evento
   * @param {Function} callback - Função callback
   */
  off(event, callback) {
    if (this.listeners.has(event)) {
      const callbacks = this.listeners.get(event);
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  /**
   * Emitir evento para listeners
   * @param {string} event - Nome do evento
   * @param {Object} data - Dados do evento
   */
  emit(event, data) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error('Erro no listener do evento:', event, error);
        }
      });
    }
  }

  /**
   * Lidar com mensagens recebidas
   * @param {Object} data - Dados da mensagem
   */
  handleMessage(data) {
    const { type, ...rest } = data;
    
    switch (type) {
      case 'connection':
        console.log('Mensagem de conexão recebida:', rest);
        break;
      case 'price_update':
        console.log('Atualização de preço recebida:', rest);
        this.emit('price_update', rest);
        break;
      case 'pong':
        // Resposta ao heartbeat
        break;
      default:
        console.log('Mensagem desconhecida:', data);
    }
    
    // Emitir evento genérico para qualquer tipo de mensagem
    this.emit('message', data);
  }

  /**
   * Agendar reconexão
   */
  scheduleReconnect() {
    this.reconnectAttempts++;
    
    // Só mostrar mensagem de reconexão se não for a primeira tentativa
    if (this.reconnectAttempts > 1) {
      console.log(`Tentando reconectar em ${this.reconnectInterval / 1000} segundos... (Tentativa ${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
    }
    
    setTimeout(() => {
      if (this.userId) {
        this.connect(this.userId);
      }
    }, this.reconnectInterval);
  }

  /**
   * Iniciar heartbeat para manter conexão ativa
   */
  startHeartbeat() {
    this.heartbeatInterval = setInterval(() => {
      this.send({
        type: 'ping',
        timestamp: Date.now()
      });
    }, 30000); // 30 segundos
  }

  /**
   * Parar heartbeat
   */
  stopHeartbeat() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  /**
   * Verificar se está conectado
   */
  isReady() {
    return this.ws && this.ws.readyState === WebSocket.OPEN;
  }
}

// Instância global do serviço
const websocketService = new WebSocketService();

export default websocketService;
