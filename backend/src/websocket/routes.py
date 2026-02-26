"""
Rotas WebSocket para notificações e chat em tempo real
"""
import json
from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends
from sqlalchemy.orm import Session

from src.database.db import get_db
from src.database.models import Users, Conversations
from .manager import manager

router = APIRouter()

# =========================================================
# 🔔 WEBSOCKET POR USUÁRIO (NOTIFICAÇÕES)
# =========================================================

@router.websocket("/ws/{user_id}")
async def websocket_user_endpoint(
    websocket: WebSocket,
    user_id: str,
    db: Session = Depends(get_db)
):
    user = db.query(Users).filter(Users.id == user_id).first()
    if not user:
        await websocket.close(code=4004)
        return

    await manager.connect_user(websocket, user_id)

    try:
        await websocket.send_json({
            "type": "connection",
            "message": "Conectado para notificações",
            "user_id": user_id
        })

        while True:
            await websocket.receive_text()

    except WebSocketDisconnect:
        pass
    finally:
        manager.disconnect_user(websocket, user_id)


# =========================================================
# 💬 WEBSOCKET POR CONVERSA (CHAT EM TEMPO REAL)
# =========================================================

@router.websocket("/ws/conversations/{conversation_id}")
async def websocket_conversation_endpoint(
    websocket: WebSocket,
    conversation_id: str,
    db: Session = Depends(get_db)
):
    conversation = db.query(Conversations).filter(
        Conversations.id == conversation_id
    ).first()

    if not conversation:
        await websocket.close(code=4004)
        return

    await manager.connect_conversation(websocket, conversation_id)

    try:
        await websocket.send_json({
            "type": "connection",
            "message": "Conectado na conversa",
            "conversation_id": conversation_id
        })

        while True:
            await websocket.receive_text()

    except WebSocketDisconnect:
        pass
    finally:
        manager.disconnect_conversation(websocket, conversation_id)


# =========================================================
# 📊 STATUS DEBUG
# =========================================================

@router.get("/ws/status")
async def websocket_status():
    return {
        "connected_users": manager.get_connected_users(),
        "connected_conversations": manager.get_connected_conversations()
    }