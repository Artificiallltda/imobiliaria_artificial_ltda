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


class PropertyStatus(str, Enum):
    """Enum para status dos imóveis"""
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


class Properties(Base):
    """Modelo para dados dos imóveis"""
    __tablename__ = "properties"

    # Campos principais
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title = Column(String(255), nullable=False)
    description = Column(String, nullable=False)
    price = Column(Numeric(12, 2), nullable=False)
    city = Column(String(100), nullable=False)
    bedrooms = Column(Integer, nullable=False)
    bathrooms = Column(Integer, nullable=False)
    area = Column(Numeric(8, 2), nullable=False)  # área em m²

    # Características (MVP)
    parking_spaces = Column(Integer, nullable=False, default=0)
    has_pool = Column(Boolean, nullable=False, default=False)
    has_garden = Column(Boolean, nullable=False, default=False)
    furnished = Column(Boolean, nullable=False, default=False)

    # Status do imóvel
    status = Column(
        SQLEnum(PropertyStatus, name="property_status"),
        nullable=False,
        default=PropertyStatus.AVAILABLE
    )

    # Controle de tempo
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)
    updated_at = Column(DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relacionamentos
    images = relationship(
        "PropertyImages",
        back_populates="property",
        cascade="all, delete-orphan"
    )


class PropertyImages(Base):
    """Imagens do imóvel (um imóvel pode ter várias imagens)"""
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


class Leads(Base):
    """Modelo para dados dos leads"""
    __tablename__ = "leads"

    # Campos principais
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
    is_archived = Column(Boolean, nullable=False, default=False)
    
    # Controle de tempo
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)
    updated_at = Column(DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow)
    converted_at = Column(DateTime, nullable=True)
    qualified_at = Column(DateTime, nullable=True)
    lost_at = Column(DateTime, nullable=True)


class LeadMessages(Base):
    """Modelo para mensagens dos leads"""
    __tablename__ = "lead_messages"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    lead_id = Column(UUID(as_uuid=True), ForeignKey("leads.id"), nullable=False)
    sender = Column(String(50), nullable=False)  # USER, AGENT
    message = Column(String, nullable=False)
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)


class Users(Base):
    """Modelo para dados dos usuários"""
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
#   MENSAGENS (MVP)
# =========================

class Conversations(Base):
    """Conversas (MVP sem WebSocket)"""
    __tablename__ = "conversations"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)

    # opcional no MVP
    lead_id = Column(UUID(as_uuid=True), nullable=True)

    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)
    updated_at = Column(DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow)

    messages = relationship(
        "Messages",
        back_populates="conversation",
        cascade="all, delete-orphan"
    )


class Messages(Base):
    """Mensagens dentro de uma conversa"""
    __tablename__ = "messages"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)

    conversation_id = Column(
        UUID(as_uuid=True),
        ForeignKey("conversations.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )

    sender_type = Column(String(20), nullable=False)  # validar no backend: corretor | cliente | sistema
    content = Column(Text, nullable=False)

    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)

    conversation = relationship("Conversations", back_populates="messages")


class Favorites(Base):
    """Modelo para favoritos do usuário"""
    __tablename__ = "favorites"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("Users.id", ondelete="CASCADE"), nullable=False)
    property_id = Column(UUID(as_uuid=True), ForeignKey("properties.id", ondelete="CASCADE"), nullable=False)
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)

    __table_args__ = (
        # Constraint única: um usuário não pode favoritar o mesmo imóvel duas vezes
        UniqueConstraint('user_id', 'property_id', name='uq_user_property_favorite'),
    )
