from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, EmailStr
from sqlalchemy.orm import Session
from uuid import UUID
from typing import Optional

from src.database.models import UserSettings, Users
from src.auth import get_current_user, get_db

router = APIRouter(prefix="/settings", tags=["settings"])


# Schemas
class SettingsResponse(BaseModel):
    id: str
    user_id: str
    theme: str
    language: str
    notifications_enabled: bool
    company_name: Optional[str] = None
    company_phone: Optional[str] = None
    company_email: Optional[EmailStr] = None
    created_at: str
    updated_at: str

    class Config:
        from_attributes = True

    @classmethod
    def from_orm(cls, settings):
        return cls(
            id=str(settings.id),
            user_id=str(settings.user_id),
            theme=settings.theme,
            language=settings.language,
            notifications_enabled=settings.notifications_enabled,
            company_name=settings.company_name,
            company_phone=settings.company_phone,
            company_email=settings.company_email,
            created_at=settings.created_at.isoformat() if settings.created_at else None,
            updated_at=settings.updated_at.isoformat() if settings.updated_at else None,
        )


class SettingsUpdate(BaseModel):
    theme: Optional[str] = None
    language: Optional[str] = None
    notifications_enabled: Optional[bool] = None
    company_name: Optional[str] = None
    company_phone: Optional[str] = None
    company_email: Optional[EmailStr] = None


@router.get("/", response_model=SettingsResponse)
async def get_settings(
    current_user: Users = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Buscar configurações do usuário autenticado"""
    
    # Buscar configurações do usuário
    settings = db.query(UserSettings).filter(UserSettings.user_id == current_user.id).first()
    
    # Se não existir, criar com valores padrão
    if not settings:
        settings = UserSettings(
            user_id=current_user.id,
            theme='light',
            language='pt-BR',
            notifications_enabled=True
        )
        db.add(settings)
        db.commit()
        db.refresh(settings)
    
    return SettingsResponse.from_orm(settings)


@router.put("/", response_model=SettingsResponse)
async def update_settings(
    settings_update: SettingsUpdate,
    current_user: Users = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Atualizar configurações do usuário"""
    
    # Buscar configurações existentes
    settings = db.query(UserSettings).filter(UserSettings.user_id == current_user.id).first()
    
    if not settings:
        # Criar se não existir
        settings = UserSettings(user_id=current_user.id)
        db.add(settings)
    
    # Atualizar apenas campos enviados
    update_data = settings_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(settings, field, value)
    
    # Atualizar timestamp
    from datetime import datetime
    settings.updated_at = datetime.utcnow()
    
    db.commit()
    db.refresh(settings)
    
    return SettingsResponse.from_orm(settings)
