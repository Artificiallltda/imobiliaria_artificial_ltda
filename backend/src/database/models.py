import uuid
from datetime import datetime
from enum import Enum

from sqlalchemy import (
    Boolean,
    Column,
    DateTime,
    String,
    Integer,
    Numeric,
    Enum as SQLEnum,
    Text,
    ForeignKey,
    UniqueConstraint,
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from .db import Base


# =========================
# ENUMS
# =========================

class PropertyStatus(str, Enum):
    AVAILABLE = "AVAILABLE"
    SOLD = "SOLD"
    RESERVED = "RESERVED"


class LeadStatus(str, Enum):
    """Enum para status dos leads - MVP"""
    novo = "novo"
    em_atendimento = "em_atendimento"
    proposta_enviada = "proposta_enviada"
    fechado = "fechado"
    perdido = "perdido"


# =========================
# PROPERTIES
# =========================

class Properties(Base):
    __tablename__ = "properties"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title = Column(String(255), nullable=False)
    description = Column(String, nullable=False)
    price = Column(Numeric(12, 2), nullable=False)
    city = Column(String(100), nullable=False)
    bedrooms = Column(Integer, nullable=False)
    bathrooms = Column(Integer, nullable=False)
    area = Column(Numeric(8, 2), nullable=False)

    parking_spaces = Column(Integer, nullable=False, default=0)
    has_pool = Column(Boolean, nullable=False, default=False)
    has_garden = Column(Boolean, nullable=False, default=False)
    furnished = Column(Boolean, nullable=False, default=False)

    status = Column(
        SQLEnum(PropertyStatus, name="property_status"),
        nullable=False,
        default=PropertyStatus.AVAILABLE
    )

    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)
    updated_at = Column(DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow)

    images = relationship(
        "PropertyImages",
        back_populates="property",
        cascade="all, delete-orphan"
    )


class PropertyImages(Base):
    __tablename__ = "property_images"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    property_id = Column(
        UUID(as_uuid=True),
        ForeignKey("properties.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )
    image_url = Column(Text, nullable=False)
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)

    property = relationship("Properties", back_populates="images")


# =========================
# LEADS
# =========================

class Leads(Base):
    __tablename__ = "leads"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(255), nullable=False)
    email = Column(String(255), nullable=False)
    phone = Column(String(20), nullable=True)

    status = Column(
        SQLEnum(LeadStatus, name="lead_status"),
        nullable=False,
        default=LeadStatus.novo
    )

    source = Column(String(100), nullable=True)
    property_id = Column(UUID(as_uuid=True), ForeignKey("properties.id"), nullable=True)
    property_title = Column(String(255), nullable=True)
    property_url = Column(Text, nullable=True)
    ip = Column(String(100), nullable=True)
    city = Column(String(100), nullable=True)
    state = Column(String(100), nullable=True)
    utm_source = Column(String(100), nullable=True)
    utm_medium = Column(String(100), nullable=True)
    utm_campaign = Column(String(100), nullable=True)
    is_archived = Column(Boolean, nullable=False, default=False)
    
    # Controle de tempo
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)
    updated_at = Column(DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow)
    converted_at = Column(DateTime, nullable=True)
    qualified_at = Column(DateTime, nullable=True)
    lost_at = Column(DateTime, nullable=True)


class LeadMessages(Base):
    __tablename__ = "lead_messages"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    lead_id = Column(UUID(as_uuid=True), ForeignKey("leads.id"), nullable=False)
    sender = Column(String(50), nullable=False)
    message = Column(String, nullable=False)
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)


# =========================
# USERS
# =========================

class Users(Base):
    __tablename__ = "Users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    full_name = Column(String(255), nullable=False)
    username = Column(String(150), nullable=False, unique=True)
    email = Column(String(255), nullable=False, unique=True)
    password = Column(String(255), nullable=False)
    role = Column(String(50), nullable=False, default="user")
    perfil_photo = Column(Boolean, nullable=False, default=False)
    is_active = Column(Boolean, nullable=False, default=True)
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)
    updated_at = Column(DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow)


# =========================
# CONVERSATIONS (VERSÃO FINAL CORRETA)
# =========================

class Conversations(Base):
    __tablename__ = "conversations"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    lead_id = Column(UUID(as_uuid=True), nullable=True)
    assigned_to = Column(UUID(as_uuid=True), ForeignKey("Users.id", ondelete="SET NULL"), nullable=True)

    is_archived = Column(Boolean, nullable=False, default=False)
    is_read = Column(Boolean, nullable=False, default=False)
    unread_count = Column(Integer, nullable=False, default=0)

    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)
    updated_at = Column(DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow)

    messages = relationship(
        "Messages",
        back_populates="conversation",
        cascade="all, delete-orphan"
    )


class Messages(Base):
    __tablename__ = "messages"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)

    conversation_id = Column(
        UUID(as_uuid=True),
        ForeignKey("conversations.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )

    sender_type = Column(String(20), nullable=False)
    content = Column(Text, nullable=False)
    status = Column(String(20), nullable=False, default='sent')
    message_type = Column(String(20), nullable=False, default='text')
    file_url = Column(Text, nullable=True)
    delivered_at = Column(DateTime, nullable=True)
    read_at = Column(DateTime, nullable=True)

    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)

    conversation = relationship("Conversations", back_populates="messages")


class Favorites(Base):
    """Modelo para favoritos do usuário"""
    __tablename__ = "favorites"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("Users.id", ondelete="CASCADE"), nullable=False)
    property_id = Column(UUID(as_uuid=True), ForeignKey("properties.id", ondelete="CASCADE"), nullable=False)
    lead_id = Column(UUID(as_uuid=True), ForeignKey("leads.id", ondelete="CASCADE"), nullable=True)
    is_public = Column(Boolean, nullable=False, default=False)
    public_token = Column(String(100), nullable=True, unique=True)
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)

    __table_args__ = (
        # Constraint única: um usuário não pode favoritar o mesmo imóvel duas vezes para o mesmo lead
        UniqueConstraint('user_id', 'property_id', 'lead_id', name='uq_user_property_lead_favorite'),
    )


class PriceAlerts(Base):
    """Modelo para alertas de mudança de preço"""
    __tablename__ = "price_alerts"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("Users.id", ondelete="CASCADE"), nullable=False)
    property_id = Column(UUID(as_uuid=True), ForeignKey("properties.id", ondelete="CASCADE"), nullable=False)
    old_price = Column(Numeric(12, 2), nullable=False)
    new_price = Column(Numeric(12, 2), nullable=False)
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)


class UserSettings(Base):
    """Modelo para configurações do usuário"""
    __tablename__ = "user_settings"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("Users.id", ondelete="CASCADE"), nullable=False, unique=True)
    theme = Column(String(20), nullable=False, default='light')
    language = Column(String(10), nullable=False, default='pt-BR')
    notifications_enabled = Column(Boolean, nullable=False, default=True)
    company_name = Column(String(150), nullable=True)
    company_phone = Column(String(50), nullable=True)
    company_email = Column(String(150), nullable=True)
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)
    updated_at = Column(DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow)

    __table_args__ = (
        # Constraint única: um usuário só pode ter um registro de configurações
        UniqueConstraint('user_id', name='uq_user_settings'),
    )
