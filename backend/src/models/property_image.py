from sqlalchemy import Column, Integer, Text, Boolean, DateTime, func
from sqlalchemy.dialects.postgresql import UUID

from src.database.db import Base


class PropertyImage(Base):
    __tablename__ = "property_images"

    id = Column(Integer, primary_key=True, index=True)
    property_id = Column(UUID(as_uuid=True), nullable=False, index=True)  # ✅ sem ForeignKey por enquanto
    image_url = Column(Text, nullable=False)
    is_primary = Column(Boolean, nullable=False, server_default="false")
    created_at = Column(DateTime, nullable=False, server_default=func.now())