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


@router.websocket("/ws/{user_id}")
async def websocket_user_endpoint(websocket: WebSocket, user_id: str, db: Session = Depends(get_db)):
    user = db.query(Users).filter(Users.id == user_id).first()
    if not user:
        await websocket.close(code=4004)
        return

    await manager.connect_user(websocket, user_id)
    await manager.broadcast_user_status(user_id, online=True)

    try:
        await websocket.send_json({
            "type": "connection",
            "message": "Conectado para notificações",
            "user_id": user_id,
        })

        while True:
            data = await websocket.receive_text()
            try:
                msg = json.loads(data)
                if msg.get("type") == "ping":
                    await websocket.send_json({"type": "pong", "timestamp": msg.get("timestamp")})
            except json.JSONDecodeError:
                pass

    except WebSocketDisconnect:
        pass
    finally:
        manager.disconnect_user(websocket, user_id)
        await manager.broadcast_user_status(user_id, online=False)


@router.websocket("/ws/conversations/{conversation_id}")
async def websocket_conversation_endpoint(websocket: WebSocket, conversation_id: str, db: Session = Depends(get_db)):
    conversation = db.query(Conversations).filter(Conversations.id == conversation_id).first()
    if not conversation:
        await websocket.close(code=4004)
        return

    await manager.connect_conversation(websocket, conversation_id)

    try:
        await websocket.send_json({
            "type": "connection",
            "message": "Conectado na conversa",
            "conversation_id": conversation_id,
        })

        while True:
            data = await websocket.receive_text()
            try:
                msg = json.loads(data)
                if msg.get("type") == "typing":
                    await manager.send_conversation_message(
                        {
                            "type": "user_typing",
                            "sender_type": msg.get("sender_type", "unknown"),
                        },
                        conversation_id,
                    )
            except json.JSONDecodeError:
                pass

    except WebSocketDisconnect:
        pass
    finally:
        manager.disconnect_conversation(websocket, conversation_id)


@router.get("/ws/status")
async def websocket_status():
    return {
        "connected_users": manager.get_connected_users(),
        "connected_conversations": manager.get_connected_conversations(),
        "online_users": list(manager.online_users),
    }
