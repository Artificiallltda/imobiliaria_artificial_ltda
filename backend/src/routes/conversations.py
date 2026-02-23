from datetime import datetime
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy import desc, func
from sqlalchemy.orm import Session

from src.database.db import SessionLocal
from src.database.models import Conversations, Messages

router = APIRouter(prefix="/conversations", tags=["Conversations"])

ALLOWED_SENDER_TYPES = {"corretor", "cliente", "sistema"}


# ---------- DB Dependency ----------
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ---------- Schemas ----------
class ConversationOut(BaseModel):
    id: UUID
    last_message: str | None = None
    last_message_at: datetime | None = None
    is_archived: bool
    is_read: bool
    unread_count: int


class MessageCreate(BaseModel):
    content: str
    sender_type: str


class MessageOut(BaseModel):
    id: UUID
    conversation_id: UUID
    sender_type: str
    content: str
    created_at: datetime

    class Config:
        from_attributes = True


# ---------- Endpoints ----------

@router.get("", response_model=list[ConversationOut])
def list_conversations(db: Session = Depends(get_db)):

    sub = (
        db.query(
            Messages.conversation_id.label("conversation_id"),
            func.max(Messages.created_at).label("last_message_at"),
        )
        .group_by(Messages.conversation_id)
        .subquery()
    )

    q = (
        db.query(
            Conversations,
            Messages.content,
            Messages.created_at,
        )
        .outerjoin(sub, sub.c.conversation_id == Conversations.id)
        .outerjoin(
            Messages,
            (Messages.conversation_id == Conversations.id)
            & (Messages.created_at == sub.c.last_message_at),
        )
        .order_by(desc(Conversations.updated_at))
    )

    return [
        ConversationOut(
            id=conv.id,
            last_message=last_content,
            last_message_at=last_at,
            is_archived=conv.is_archived,
            is_read=conv.is_read,
            unread_count=conv.unread_count,
        )
        for conv, last_content, last_at in q.all()
    ]


@router.get("/{conversation_id}/messages", response_model=list[MessageOut])
def list_messages(conversation_id: UUID, db: Session = Depends(get_db)):
    conv = db.query(Conversations).filter(Conversations.id == conversation_id).first()
    if not conv:
        raise HTTPException(status_code=404, detail="Conversation not found")

    msgs = (
        db.query(Messages)
        .filter(Messages.conversation_id == conversation_id)
        .order_by(Messages.created_at.asc())
        .all()
    )
    return msgs


@router.post("/{conversation_id}/messages", response_model=MessageOut)
def send_message(conversation_id: UUID, payload: MessageCreate, db: Session = Depends(get_db)):

    conv = db.query(Conversations).filter(Conversations.id == conversation_id).first()
    if not conv:
        raise HTTPException(status_code=404, detail="Conversation not found")

    if payload.sender_type not in ALLOWED_SENDER_TYPES:
        raise HTTPException(status_code=400, detail="Invalid sender_type")

    msg = Messages(
        conversation_id=conversation_id,
        sender_type=payload.sender_type,
        content=payload.content,
    )
    db.add(msg)

    # 🔥 LÓGICA DE CONTADOR
    if payload.sender_type == "cliente":
        conv.unread_count += 1
        conv.is_read = False

    conv.updated_at = datetime.utcnow()

    db.commit()
    db.refresh(msg)
    return msg


@router.patch("/{conversation_id}/read")
def mark_as_read(conversation_id: UUID, db: Session = Depends(get_db)):

    conv = db.query(Conversations).filter(Conversations.id == conversation_id).first()
    if not conv:
        raise HTTPException(status_code=404, detail="Conversation not found")

    conv.is_read = True
    conv.unread_count = 0

    db.commit()
    db.refresh(conv)
    return conv


@router.patch("/{conversation_id}/archive")
def archive_conversation(conversation_id: UUID, db: Session = Depends(get_db)):

    conv = db.query(Conversations).filter(Conversations.id == conversation_id).first()
    if not conv:
        raise HTTPException(status_code=404, detail="Conversation not found")

    conv.is_archived = True

    db.commit()
    db.refresh(conv)
    return conv


@router.patch("/{conversation_id}/unarchive")
def unarchive_conversation(conversation_id: UUID, db: Session = Depends(get_db)):

    conv = db.query(Conversations).filter(Conversations.id == conversation_id).first()
    if not conv:
        raise HTTPException(status_code=404, detail="Conversation not found")

    conv.is_archived = False

    db.commit()
    db.refresh(conv)
    return conv