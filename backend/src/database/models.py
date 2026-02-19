import uuid
from datetime import datetime
from enum import Enum

from sqlalchemy import Boolean, Column, DateTime, String, Integer, Numeric, Enum as SQLEnum, ForeignKey
from sqlalchemy.dialects.postgresql import UUID

from .db import Base


class PropertyStatus(str, Enum):
    """Enum para status dos imóveis"""
    AVAILABLE = "AVAILABLE"
    SOLD = "SOLD"
    RESERVED = "RESERVED"


class LeadStatus(str, Enum):
    """Enum para status dos leads"""
    NEW = "NEW"
    QUALIFYING = "QUALIFYING"
    QUALIFIED = "QUALIFIED"
    LOST = "LOST"


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
    
    # Status do imóvel
    status = Column(
        SQLEnum(PropertyStatus, name="property_status"), 
        nullable=False, 
        default=PropertyStatus.AVAILABLE
    )
    
    # Controle de tempo
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)
    updated_at = Column(DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow)


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
        default=LeadStatus.NEW
    )
    source = Column(String(100), nullable=True)
    property_id = Column(UUID(as_uuid=True), ForeignKey("properties.id"), nullable=True)
    
    # Controle de tempo
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)
    updated_at = Column(DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow)
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
