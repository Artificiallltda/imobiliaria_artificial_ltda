from datetime import datetime
from pathlib import Path
from uuid import UUID, uuid4

from fastapi import APIRouter, Depends, HTTPException, Header, Request, UploadFile, File
from pydantic import BaseModel
from sqlalchemy import text
from sqlalchemy.orm import Session

from src.database.db import SessionLocal
from src.database.models import Leads, Conversations, Messages, LeadStatus
from src.websocket.manager import manager
from src.services.geo_service import get_geo
from src.services.ai_service import get_auto_response
from src.services.whatsapp_service import send_whatsapp

router = APIRouter(prefix="/api/widget", tags=["Widget"])

UPLOAD_DIR = Path(__file__).resolve().parent.parent.parent / "uploads" / "widget"
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)


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


def get_client_ip(request: Request) -> str:
    forwarded = request.headers.get("x-forwarded-for")
    if forwarded:
        return forwarded.split(",")[0].strip()
    return request.client.host if request.client else "unknown"


def get_bot_settings(db: Session) -> dict:
    row = db.execute(text("SELECT * FROM bot_settings WHERE id = 1")).fetchone()
    if not row:
        return {
            "enabled": True, "welcome_message": "Olá! Como posso te ajudar?",
            "away_message": "Estamos fora do horário. Responderei em breve!",
            "away_enabled": True, "business_start": 8, "business_end": 18,
        }
    return dict(row._mapping)


# ---------- Schemas ----------

class WidgetStartPayload(BaseModel):
    name: str
    email: str
    phone: str | None = None
    property_id: str | None = None
    property_title: str | None = None
    property_url: str | None = None
    utm_source: str | None = None
    utm_medium: str | None = None
    utm_campaign: str | None = None


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
    message_type: str
    file_url: str | None = None
    created_at: str


class PushSubscriptionPayload(BaseModel):
    user_id: str
    subscription: dict


# ---------- Helpers ----------

async def _emit_message(msg: Messages):
    await manager.send_conversation_message(
        {
            "type": "new_message",
            "message": {
                "id": str(msg.id),
                "conversation_id": str(msg.conversation_id),
                "sender_type": msg.sender_type,
                "content": msg.content,
                "status": msg.status,
                "message_type": msg.message_type,
                "file_url": msg.file_url,
                "created_at": msg.created_at.isoformat(),
            },
        },
        str(msg.conversation_id),
    )


def _msg_out(msg: Messages) -> WidgetMessageOut:
    return WidgetMessageOut(
        id=str(msg.id),
        conversation_id=str(msg.conversation_id),
        sender_type=msg.sender_type,
        content=msg.content,
        status=msg.status,
        message_type=msg.message_type,
        file_url=msg.file_url,
        created_at=msg.created_at.isoformat(),
    )


# ---------- Endpoints ----------

@router.post("/start", response_model=WidgetStartResponse)
async def widget_start(
    payload: WidgetStartPayload,
    request: Request,
    db: Session = Depends(get_db),
    _: str = Depends(validate_api_key),
):
    ip = get_client_ip(request)
    geo = await get_geo(ip)

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
            ip=ip,
            city=geo["city"],
            state=geo["state"],
            utm_source=payload.utm_source,
            utm_medium=payload.utm_medium,
            utm_campaign=payload.utm_campaign,
        )
        db.add(lead)
        db.flush()
    else:
        if payload.property_title:
            lead.property_title = payload.property_title
            lead.property_url = payload.property_url
        if not lead.city and geo["city"]:
            lead.city = geo["city"]
            lead.state = geo["state"]
        if payload.utm_source:
            lead.utm_source = payload.utm_source
            lead.utm_medium = payload.utm_medium
            lead.utm_campaign = payload.utm_campaign

    conversation = (
        db.query(Conversations)
        .filter(Conversations.lead_id == lead.id, Conversations.is_archived == False)
        .order_by(Conversations.created_at.desc())
        .first()
    )

    is_new = conversation is None

    if is_new:
        conversation = Conversations(
            lead_id=lead.id,
            is_archived=False,
            is_read=False,
            unread_count=1,
        )
        db.add(conversation)
        db.flush()

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
            message_type="text",
        )
        db.add(first_msg)

    db.commit()
    db.refresh(lead)
    db.refresh(conversation)

    if is_new:
        bot = get_bot_settings(db)
        if bot["enabled"]:
            await _send_bot_message(db, str(conversation.id), bot["welcome_message"])

    return WidgetStartResponse(
        conversation_id=str(conversation.id),
        lead_id=str(lead.id),
    )


async def _send_bot_message(db: Session, conversation_id: str, content: str):
    msg = Messages(
        conversation_id=conversation_id,
        sender_type="system",
        content=content,
        status="sent",
        message_type="text",
    )
    db.add(msg)
    db.commit()
    db.refresh(msg)
    await _emit_message(msg)


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
        message_type="text",
    )
    db.add(msg)
    conv.unread_count += 1
    conv.is_read = False
    conv.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(msg)

    await _emit_message(msg)

    # IA: resposta automática
    bot = get_bot_settings(db)
    auto_reply = get_auto_response(
        content=payload.content,
        bot_enabled=bot["enabled"],
        away_enabled=bot["away_enabled"],
        welcome_msg=bot["welcome_message"],
        away_msg=bot["away_message"],
        business_start=bot["business_start"],
        business_end=bot["business_end"],
    )
    if auto_reply:
        await _send_bot_message(db, conversation_id, auto_reply)

    # WhatsApp: notificar lead se tiver telefone
    lead = db.query(Leads).filter(Leads.id == conv.lead_id).first()
    if lead and lead.phone:
        await send_whatsapp(
            lead.phone,
            f"Nova mensagem recebida no chat do imóvel: {payload.content[:100]}",
        )

    return _msg_out(msg)


@router.post("/{conversation_id}/upload", response_model=WidgetMessageOut)
async def widget_upload(
    conversation_id: str,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    _: str = Depends(validate_api_key),
):
    conv = db.query(Conversations).filter(Conversations.id == conversation_id).first()
    if not conv:
        raise HTTPException(status_code=404, detail="Conversa não encontrada")

    ext = Path(file.filename).suffix if file.filename else ""
    filename = f"{uuid4()}{ext}"
    filepath = UPLOAD_DIR / filename

    content = await file.read()
    filepath.write_bytes(content)

    file_url = f"/uploads/widget/{filename}"

    msg = Messages(
        conversation_id=conversation_id,
        sender_type="cliente",
        content=file.filename or "arquivo",
        status="sent",
        message_type="file",
        file_url=file_url,
    )
    db.add(msg)
    conv.unread_count += 1
    conv.is_read = False
    conv.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(msg)

    await _emit_message(msg)
    return _msg_out(msg)


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
            "message_type": m.message_type,
            "file_url": m.file_url,
            "created_at": m.created_at.isoformat(),
        }
        for m in msgs
    ]


@router.post("/push/subscribe")
def push_subscribe(payload: PushSubscriptionPayload, db: Session = Depends(get_db)):
    db.execute(
        text("""
            INSERT INTO push_subscriptions (user_id, subscription)
            VALUES (:user_id, :sub::jsonb)
            ON CONFLICT DO NOTHING
        """),
        {"user_id": payload.user_id, "sub": str(payload.subscription).replace("'", '"')},
    )
    db.commit()
    return {"ok": True}
