from datetime import datetime
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy import desc, func
from sqlalchemy.orm import Session

from src.database.db import SessionLocal
from src.database.models import Conversations, Messages, Leads
from src.websocket.manager import manager

router = APIRouter(prefix="/conversations", tags=["Conversations"])

ALLOWED_SENDER_TYPES = {"corretor", "cliente", "sistema"}


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ---------- Schemas ----------

class ConversationOut(BaseModel):
    id: UUID
    lead_name: str | None = None
    last_message: str | None = None
    last_message_at: datetime | None = None
    is_archived: bool
    is_read: bool
    unread_count: int
    assigned_to: UUID | None = None


class MessageCreate(BaseModel):
    content: str
    sender_type: str


class MessageOut(BaseModel):
    id: UUID
    conversation_id: UUID
    sender_type: str
    content: str
    status: str = "sent"
    delivered_at: datetime | None = None
    read_at: datetime | None = None
    created_at: datetime

    class Config:
        from_attributes = True


class AssignPayload(BaseModel):
    user_id: UUID | None = None


# ---------- Endpoints ----------

@router.get("", response_model=list[ConversationOut])
def list_conversations(assigned_to: str | None = None, db: Session = Depends(get_db)):
    sub = (
        db.query(
            Messages.conversation_id.label("conversation_id"),
            func.max(Messages.created_at).label("last_message_at"),
        )
        .group_by(Messages.conversation_id)
        .subquery()
    )

    q = (
        db.query(Conversations, Messages.content, Messages.created_at, Leads.name)
        .outerjoin(sub, sub.c.conversation_id == Conversations.id)
        .outerjoin(
            Messages,
            (Messages.conversation_id == Conversations.id)
            & (Messages.created_at == sub.c.last_message_at),
        )
        .outerjoin(Leads, Leads.id == Conversations.lead_id)
        .order_by(desc(Conversations.updated_at))
    )

    if assigned_to:
        q = q.filter(Conversations.assigned_to == assigned_to)

    return [
        ConversationOut(
            id=conv.id,
            lead_name=lead_name,
            last_message=last_content,
            last_message_at=last_at,
            is_archived=conv.is_archived,
            is_read=conv.is_read,
            unread_count=conv.unread_count,
            assigned_to=conv.assigned_to,
        )
        for conv, last_content, last_at, lead_name in q.all()
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
async def send_message(conversation_id: UUID, payload: MessageCreate, db: Session = Depends(get_db)):
    conv = db.query(Conversations).filter(Conversations.id == conversation_id).first()
    if not conv:
        raise HTTPException(status_code=404, detail="Conversation not found")

    if payload.sender_type not in ALLOWED_SENDER_TYPES:
        raise HTTPException(status_code=400, detail="Invalid sender_type")

    msg = Messages(
        conversation_id=conversation_id,
        sender_type=payload.sender_type,
        content=payload.content,
        status="sent",
    )
    db.add(msg)

    if payload.sender_type == "cliente":
        conv.unread_count += 1
        conv.is_read = False

    conv.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(msg)

    await manager.send_conversation_message(
        {
            "type": "new_message",
            "message": {
                "id": str(msg.id),
                "conversation_id": str(msg.conversation_id),
                "sender_type": msg.sender_type,
                "content": msg.content,
                "status": msg.status,
                "created_at": msg.created_at.isoformat(),
            },
        },
        str(conversation_id),
    )

    return msg


@router.patch("/{conversation_id}/read")
def mark_as_read(conversation_id: UUID, db: Session = Depends(get_db)):
    conv = db.query(Conversations).filter(Conversations.id == conversation_id).first()
    if not conv:
        raise HTTPException(status_code=404, detail="Conversation not found")

    conv.is_read = True
    conv.unread_count = 0
    db.commit()
    return {"ok": True}


@router.patch("/{conversation_id}/read-messages")
async def mark_messages_read(conversation_id: UUID, db: Session = Depends(get_db)):
    conv = db.query(Conversations).filter(Conversations.id == conversation_id).first()
    if not conv:
        raise HTTPException(status_code=404, detail="Conversation not found")

    now = datetime.utcnow()
    db.query(Messages).filter(
        Messages.conversation_id == conversation_id,
        Messages.sender_type == "cliente",
        Messages.status != "read",
    ).update({"status": "read", "read_at": now})

    conv.is_read = True
    conv.unread_count = 0
    db.commit()

    await manager.send_conversation_message(
        {"type": "messages_read", "conversation_id": str(conversation_id)},
        str(conversation_id),
    )

    return {"ok": True}


@router.patch("/{conversation_id}/archive")
def archive_conversation(conversation_id: UUID, db: Session = Depends(get_db)):
    conv = db.query(Conversations).filter(Conversations.id == conversation_id).first()
    if not conv:
        raise HTTPException(status_code=404, detail="Conversation not found")

    conv.is_archived = True
    db.commit()
    return {"ok": True}


@router.patch("/{conversation_id}/unarchive")
def unarchive_conversation(conversation_id: UUID, db: Session = Depends(get_db)):
    conv = db.query(Conversations).filter(Conversations.id == conversation_id).first()
    if not conv:
        raise HTTPException(status_code=404, detail="Conversation not found")

    conv.is_archived = False
    db.commit()
    return {"ok": True}


@router.patch("/{conversation_id}/assign")
def assign_conversation(conversation_id: UUID, payload: AssignPayload, db: Session = Depends(get_db)):
    conv = db.query(Conversations).filter(Conversations.id == conversation_id).first()
    if not conv:
        raise HTTPException(status_code=404, detail="Conversation not found")

    conv.assigned_to = payload.user_id
    db.commit()
    return {"ok": True}
