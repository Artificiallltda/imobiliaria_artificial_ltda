"""
Rotas WebSocket para notificações em tempo real
"""
import json
from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends
from sqlalchemy.orm import Session

from src.database.db import get_db
from src.database.models import Users
from .manager import manager

router = APIRouter()

@router.websocket("/ws/{user_id}")
async def websocket_endpoint(websocket: WebSocket, user_id: str, db: Session = Depends(get_db)):
    """
    Endpoint WebSocket para conexão de notificações em tempo real
    """
    # Verificar se o usuário existe
    user = db.query(Users).filter(Users.id == user_id).first()
    if not user:
        await websocket.close(code=4004, reason="User not found")
        return
    
    try:
        await manager.connect(websocket, user_id)
        
        # Enviar mensagem de boas-vindas
        welcome_message = json.dumps({
            "type": "connection",
            "message": "Conectado com sucesso!",
            "user_id": user_id
        })
        await websocket.send_text(welcome_message)
        
        # Manter conexão aberta e escutar mensagens
        while True:
            try:
                # Esperar mensagem do cliente (ping/pong, etc.)
                data = await websocket.receive_text()
                
                # Processar mensagem (se necessário)
                try:
                    message_data = json.loads(data)
                    message_type = message_data.get("type")
                    
                    if message_type == "ping":
                        # Responder ping com pong
                        pong_message = json.dumps({
                            "type": "pong",
                            "timestamp": message_data.get("timestamp")
                        })
                        await websocket.send_text(pong_message)
                    
                except json.JSONDecodeError:
                    # Mensagem não é JSON, ignorar
                    pass
                    
            except WebSocketDisconnect:
                break
                
    except WebSocketDisconnect:
        pass
    finally:
        manager.disconnect(websocket, user_id)

@router.get("/ws/status")
async def websocket_status():
    """
    Endpoint para verificar status das conexões WebSocket
    """
    connected_users = manager.get_connected_users()
    total_connections = sum(manager.get_connection_count(user_id) for user_id in connected_users)
    
    return {
        "connected_users": len(connected_users),
        "total_connections": total_connections,
        "users": connected_users
    }
