from datetime import datetime
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Header
from pydantic import BaseModel
from sqlalchemy import text
from sqlalchemy.orm import Session

from src.database.db import SessionLocal
from src.database.models import Leads, Conversations, Messages, LeadStatus
from src.websocket.manager import manager

router = APIRouter(prefix="/api/widget", tags=["Widget"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def validate_api_key(x_api_key: str = Header(...), db: Session = Depends(get_db)):
    result = db.execute(
        text("SELECT id FROM api_keys WHERE key = :key AND is_active = TRUE"),
        {"key": x_api_key},
    ).fetchone()
    if not result:
        raise HTTPException(status_code=401, detail="API key inválida")
    return x_api_key


# ---------- Schemas ----------

class WidgetStartPayload(BaseModel):
    name: str
    email: str
    phone: str | None = None
    property_id: str | None = None
    property_title: str | None = None
    property_url: str | None = None


class WidgetStartResponse(BaseModel):
    conversation_id: str
    lead_id: str


class WidgetMessagePayload(BaseModel):
    content: str


class WidgetMessageOut(BaseModel):
    id: str
    conversation_id: str
    sender_type: str
    content: str
    status: str
    created_at: str


# ---------- Endpoints ----------

@router.post("/start", response_model=WidgetStartResponse)
async def widget_start(
    payload: WidgetStartPayload,
    db: Session = Depends(get_db),
    _: str = Depends(validate_api_key),
):
    # Verificar se lead já existe
    lead = db.query(Leads).filter(Leads.email == payload.email).first()

    if not lead:
        lead = Leads(
            name=payload.name,
            email=payload.email,
            phone=payload.phone,
            status=LeadStatus.novo,
            source="website_widget",
            property_title=payload.property_title,
            property_url=payload.property_url,
        )
        db.add(lead)
        db.flush()
    else:
        if payload.property_title:
            lead.property_title = payload.property_title
            lead.property_url = payload.property_url

    # Verificar se já existe conversa ativa para esse lead
    conversation = (
        db.query(Conversations)
        .filter(
            Conversations.lead_id == lead.id,
            Conversations.is_archived == False,
        )
        .order_by(Conversations.created_at.desc())
        .first()
    )

    if not conversation:
        conversation = Conversations(
            lead_id=lead.id,
            is_archived=False,
            is_read=False,
            unread_count=1,
        )
        db.add(conversation)
        db.flush()

        # Mensagem automática de contexto
        context = f"Olá! Meu nome é {payload.name}"
        if payload.property_title:
            context += f" e tenho interesse no imóvel: {payload.property_title}"
        if payload.property_url:
            context += f" ({payload.property_url})"

        first_msg = Messages(
            conversation_id=conversation.id,
            sender_type="cliente",
            content=context,
            status="sent",
        )
        db.add(first_msg)

    db.commit()
    db.refresh(lead)
    db.refresh(conversation)

    await manager.send_conversation_message(
        {
            "type": "new_conversation",
            "lead_name": lead.name,
            "conversation_id": str(conversation.id),
        },
        str(conversation.id),
    )

    return WidgetStartResponse(
        conversation_id=str(conversation.id),
        lead_id=str(lead.id),
    )


@router.post("/{conversation_id}/message", response_model=WidgetMessageOut)
async def widget_send_message(
    conversation_id: str,
    payload: WidgetMessagePayload,
    db: Session = Depends(get_db),
    _: str = Depends(validate_api_key),
):
    conv = db.query(Conversations).filter(Conversations.id == conversation_id).first()
    if not conv:
        raise HTTPException(status_code=404, detail="Conversa não encontrada")

    msg = Messages(
        conversation_id=conversation_id,
        sender_type="cliente",
        content=payload.content,
        status="sent",
    )
    db.add(msg)
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

    return WidgetMessageOut(
        id=str(msg.id),
        conversation_id=str(msg.conversation_id),
        sender_type=msg.sender_type,
        content=msg.content,
        status=msg.status,
        created_at=msg.created_at.isoformat(),
    )


@router.get("/{conversation_id}/messages")
def widget_get_messages(
    conversation_id: str,
    db: Session = Depends(get_db),
    _: str = Depends(validate_api_key),
):
    msgs = (
        db.query(Messages)
        .filter(Messages.conversation_id == conversation_id)
        .order_by(Messages.created_at.asc())
        .all()
    )
    return [
        {
            "id": str(m.id),
            "sender_type": m.sender_type,
            "content": m.content,
            "status": m.status,
            "created_at": m.created_at.isoformat(),
        }
        for m in msgs
    ]
