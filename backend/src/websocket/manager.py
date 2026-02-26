"""
Gerenciador de conexões WebSocket para notificações e chat em tempo real
"""
from typing import Dict, List, Set
from fastapi import WebSocket


class ConnectionManager:
    def __init__(self):
        self.user_connections: Dict[str, List[WebSocket]] = {}
        self.conversation_connections: Dict[str, List[WebSocket]] = {}
        self.online_users: Set[str] = set()

    async def connect_user(self, websocket: WebSocket, user_id: str):
        await websocket.accept()
        self.user_connections.setdefault(user_id, []).append(websocket)
        self.online_users.add(user_id)

    def disconnect_user(self, websocket: WebSocket, user_id: str):
        if user_id in self.user_connections:
            try:
                self.user_connections[user_id].remove(websocket)
                if not self.user_connections[user_id]:
                    del self.user_connections[user_id]
                    self.online_users.discard(user_id)
            except ValueError:
                pass

    async def connect(self, websocket: WebSocket, user_id: str):
        await self.connect_user(websocket, user_id)

    def disconnect(self, websocket: WebSocket, user_id: str):
        self.disconnect_user(websocket, user_id)

    async def connect_conversation(self, websocket: WebSocket, conversation_id: str):
        await websocket.accept()
        self.conversation_connections.setdefault(conversation_id, []).append(websocket)

    def disconnect_conversation(self, websocket: WebSocket, conversation_id: str):
        if conversation_id in self.conversation_connections:
            try:
                self.conversation_connections[conversation_id].remove(websocket)
                if not self.conversation_connections[conversation_id]:
                    del self.conversation_connections[conversation_id]
            except ValueError:
                pass

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

    async def broadcast_user_status(self, user_id: str, online: bool):
        await self.broadcast({"type": "user_status", "user_id": user_id, "online": online})

    def get_connected_users(self) -> List[str]:
        return list(self.user_connections.keys())

    def get_connected_conversations(self) -> List[str]:
        return list(self.conversation_connections.keys())

    def get_connection_count(self, user_id: str) -> int:
        return len(self.user_connections.get(user_id, []))

    def is_online(self, user_id: str) -> bool:
        return user_id in self.online_users


manager = ConnectionManager()
