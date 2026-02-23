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
    NEW = "NEW"
    QUALIFYING = "QUALIFYING"
    QUALIFIED = "QUALIFIED"
    LOST = "LOST"


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
        default=LeadStatus.NEW
    )

    source = Column(String(100), nullable=True)
    property_id = Column(UUID(as_uuid=True), ForeignKey("properties.id"), nullable=True)

    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)
    updated_at = Column(DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow)
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

    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)

    conversation = relationship("Conversations", back_populates="messages")