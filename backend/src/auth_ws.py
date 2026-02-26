"""
Autenticação para conexões WebSocket
"""
from typing import Optional
from fastapi import HTTPException, status, WebSocket
from sqlalchemy.orm import Session

from src.database.db import get_db
from src.database.models import Users

def get_current_user_ws(websocket: WebSocket, db: Session) -> Optional[Users]:
    """
    Validação simples para WebSocket (pode ser expandida com token JWT)
    """
    # Por enquanto, aceita qualquer user_id válido
    # Em produção, implementar validação de token JWT via query params
    return None

def validate_websocket_token(token: str, db: Session) -> Optional[Users]:
    """
    Valida token JWT para conexão WebSocket
    TODO: Implementar validação JWT real
    """
    try:
        # Implementar validação JWT aqui
        # Por enquanto, retorna None (sem validação)
        return None
    except Exception:
        return None
