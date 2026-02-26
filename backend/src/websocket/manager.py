"""
Gerenciador de conexões WebSocket para notificações e chat em tempo real
"""

from typing import Dict, List
from fastapi import WebSocket


class ConnectionManager:
    def __init__(self):
        # Conexões por usuário (notificações pessoais)
        self.user_connections: Dict[str, List[WebSocket]] = {}

        # Conexões por conversa (chat em tempo real)
        self.conversation_connections: Dict[str, List[WebSocket]] = {}

    # =========================
    # CONEXÃO
    # =========================

    async def connect_user(self, websocket: WebSocket, user_id: str):
        await websocket.accept()
        self.user_connections.setdefault(user_id, []).append(websocket)

    async def connect_conversation(self, websocket: WebSocket, conversation_id: str):
        await websocket.accept()
        self.conversation_connections.setdefault(conversation_id, []).append(websocket)

    # =========================
    # DESCONEXÃO
    # =========================

    def disconnect_user(self, websocket: WebSocket, user_id: str):
        if user_id in self.user_connections:
            try:
                self.user_connections[user_id].remove(websocket)
                if not self.user_connections[user_id]:
                    del self.user_connections[user_id]
            except ValueError:
                pass

    def disconnect_conversation(self, websocket: WebSocket, conversation_id: str):
        if conversation_id in self.conversation_connections:
            try:
                self.conversation_connections[conversation_id].remove(websocket)
                if not self.conversation_connections[conversation_id]:
                    del self.conversation_connections[conversation_id]
            except ValueError:
                pass

    # =========================
    # ENVIO DE MENSAGENS
    # =========================

    async def send_personal_message(self, data: dict, user_id: str):
        if user_id in self.user_connections:
            disconnected = []
            for connection in self.user_connections[user_id]:
                try:
                    await connection.send_json(data)
                except Exception:
                    disconnected.append(connection)

            for connection in disconnected:
                self.disconnect_user(connection, user_id)

    async def send_conversation_message(self, data: dict, conversation_id: str):
        if conversation_id in self.conversation_connections:
            disconnected = []
            for connection in self.conversation_connections[conversation_id]:
                try:
                    await connection.send_json(data)
                except Exception:
                    disconnected.append(connection)

            for connection in disconnected:
                self.disconnect_conversation(connection, conversation_id)

    async def broadcast(self, data: dict):
        for user_id in list(self.user_connections.keys()):
            await self.send_personal_message(data, user_id)

    # =========================
    # DEBUG / MONITORAMENTO
    # =========================

    def get_connected_users(self) -> List[str]:
        return list(self.user_connections.keys())

    def get_connected_conversations(self) -> List[str]:
        return list(self.conversation_connections.keys())


# Instância global
manager = ConnectionManager()