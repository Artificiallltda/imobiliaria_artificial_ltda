"""
Gerenciador de conexões WebSocket para notificações em tempo real
"""
from typing import Dict, List
from fastapi import WebSocket

class ConnectionManager:
    def __init__(self):
        # Armazena conexões ativas por user_id
        self.active_connections: Dict[str, List[WebSocket]] = {}

    async def connect(self, websocket: WebSocket, user_id: str):
        """Aceita conexão WebSocket e adiciona ao usuário"""
        await websocket.accept()
        
        if user_id not in self.active_connections:
            self.active_connections[user_id] = []
        
        self.active_connections[user_id].append(websocket)

    def disconnect(self, websocket: WebSocket, user_id: str):
        """Remove conexão WebSocket do usuário"""
        if user_id in self.active_connections:
            try:
                self.active_connections[user_id].remove(websocket)
                # Se não houver mais conexões para este usuário, remover do dicionário
                if not self.active_connections[user_id]:
                    del self.active_connections[user_id]
            except ValueError:
                # Conexão não encontrada na lista
                pass

    async def send_personal_message(self, message: str, user_id: str):
        """Envia mensagem para todas as conexões de um usuário específico"""
        if user_id in self.active_connections:
            disconnected_connections = []
            
            for connection in self.active_connections[user_id]:
                try:
                    await connection.send_text(message)
                except Exception:
                    # Conexão fechada ou com erro, marcar para remoção
                    disconnected_connections.append(connection)
            
            # Remover conexões desconectadas
            for connection in disconnected_connections:
                self.disconnect(connection, user_id)

    async def broadcast(self, message: str):
        """Envia mensagem para todos os usuários conectados"""
        disconnected_users = []
        
        for user_id, connections in self.active_connections.items():
            user_disconnected = []
            
            for connection in connections:
                try:
                    await connection.send_text(message)
                except Exception:
                    user_disconnected.append(connection)
            
            # Remover conexões desconectadas deste usuário
            for connection in user_disconnected:
                self.disconnect(connection, user_id)
            
            # Se usuário não tiver mais conexões, marcar para remoção
            if not self.active_connections.get(user_id):
                disconnected_users.append(user_id)
        
        # Remover usuários sem conexões
        for user_id in disconnected_users:
            if user_id in self.active_connections:
                del self.active_connections[user_id]

    def get_connected_users(self) -> List[str]:
        """Retorna lista de usuários conectados"""
        return list(self.active_connections.keys())

    def get_connection_count(self, user_id: str) -> int:
        """Retorna número de conexões ativas para um usuário"""
        return len(self.active_connections.get(user_id, []))

# Instância global do gerenciador
manager = ConnectionManager()
