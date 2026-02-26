import { useEffect, useRef, useState } from 'react';
import { useToast } from '../components/ui/index.js';
import websocketService from '../services/websocketService.js';

/**
 * Hook para gerenciar conexão WebSocket
 * @param {string} userId - ID do usuário para conectar
 * @returns {Object} - Estado e funções do WebSocket
 */
export function useWebSocket(userId) {
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState(null);
  const { toast } = useToast();
  const reconnectTimeoutRef = useRef(null);

  useEffect(() => {
    if (!userId) return;

    // Conectar ao WebSocket
    websocketService.connect(userId);

    // Configurar listeners
    const handleConnected = () => {
      setIsConnected(true);
      console.log('WebSocket conectado com sucesso');
    };

    const handleDisconnected = ({ code, reason }) => {
      setIsConnected(false);
      console.log('WebSocket desconectado:', code, reason);
    };

    const handleError = (error) => {
      // Verificar se é um erro real ou apenas uma desconexão normal
      const isRealError = error.type !== 'close' && 
                         error.code !== 1000 && 
                         error.code !== 1001 &&
                         error.type !== 'error';
      
      if (isRealError) {
        console.error('Erro WebSocket:', error);
        toast({
          type: 'error',
          message: 'Erro na conexão de notificações em tempo real',
          duration: 5000
        });
      }
    };

    const handlePriceUpdate = (message) => {
      const data = message.data || message; // Lidar com diferentes estruturas
      const { property_title, old_price, new_price, price_change_percent } = data;
      
      // Verificar se todos os dados necessários existem
      if (!property_title || old_price === undefined || new_price === undefined || price_change_percent === undefined) {
        console.error('Dados incompletos na notificação de preço:', data);
        return;
      }
      
      // Determinar tipo de mudança de preço
      const changeType = price_change_percent > 0 ? 'aumento' : 'redução';
      const emoji = price_change_percent > 0 ? '📈' : '📉';
      
      toast({
        type: price_change_percent > 0 ? 'warning' : 'success',
        message: `${emoji} ${property_title}`,
        duration: 5000,
        action: {
          label: 'Ver imóvel',
          onClick: () => {
            // Navegar para a página do imóvel
            window.location.href = `/imoveis/${data.property_id}`;
          }
        }
      });

      // Mostrar detalhes em um segundo toast
      setTimeout(() => {
        toast({
          type: 'info',
          message: `Preço ${changeType} de R$ ${old_price.toLocaleString('pt-BR')} para R$ ${new_price.toLocaleString('pt-BR')} (${Math.abs(price_change_percent)}%)`
        });
      }, 1000);
    };

    const handleMessage = (message) => {
      setLastMessage(message);
    };

    // Registrar listeners
    websocketService.on('connected', handleConnected);
    websocketService.on('disconnected', handleDisconnected);
    websocketService.on('error', handleError);
    websocketService.on('price_update', handlePriceUpdate);
    websocketService.on('message', handleMessage);

    // Cleanup
    return () => {
      websocketService.off('connected', handleConnected);
      websocketService.off('disconnected', handleDisconnected);
      websocketService.off('error', handleError);
      websocketService.off('price_update', handlePriceUpdate);
      websocketService.off('message', handleMessage);
      
      // Limpar timeout de reconexão
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, [userId, toast]);

  // Desconectar quando o componente for desmontado
  useEffect(() => {
    return () => {
      if (userId) {
        websocketService.disconnect();
      }
    };
  }, [userId]);

  return {
    isConnected,
    lastMessage,
    send: websocketService.send.bind(websocketService),
    isReady: websocketService.isReady.bind(websocketService)
  };
}
