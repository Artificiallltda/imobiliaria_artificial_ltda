"""
Rotas para favoritos do usuário
"""
from datetime import datetime
from typing import List
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError

from src.database.db import SessionLocal
from src.database.models import Favorites, Properties, Users
from src.auth import get_current_user, get_db

# Router para endpoints de favoritos
router = APIRouter(prefix="/favorites", tags=["Favorites"])


# Schemas para requisição e resposta
class AddFavoriteRequest(BaseModel):
    """Schema para requisição de adicionar favorito"""
    property_id: str


class PropertyImageResponse(BaseModel):
    """Schema para imagem do imóvel"""
    id: str
    image_url: str

    class Config:
        from_attributes = True


class FavoritePropertyResponse(BaseModel):
    """Schema para dados do imóvel no favorito"""
    id: str
    title: str
    description: str
    price: float
    city: str
    bedrooms: int
    bathrooms: int
    area: float
    parking_spaces: int
    has_pool: bool
    has_garden: bool
    furnished: bool
    status: str
    images: List[PropertyImageResponse]

    class Config:
        from_attributes = True


class FavoriteResponse(BaseModel):
    """Schema para resposta de favorito"""
    id: str
    property_id: str
    created_at: datetime
    property: FavoritePropertyResponse

    class Config:
        from_attributes = True




@router.get("/", response_model=List[FavoriteResponse])
def list_favorites(
    current_user: Users = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Listar favoritos do usuário autenticado com dados dos imóveis"""
    favorites = (
        db.query(Favorites)
        .filter(Favorites.user_id == current_user.id)
        .all()
    )

    result = []
    for fav in favorites:
        # Buscar dados do imóvel
        property_obj = db.query(Properties).filter(Properties.id == fav.property_id).first()
        if property_obj:
            result.append(FavoriteResponse(
                id=str(fav.id),
                property_id=str(fav.property_id),
                created_at=fav.created_at,
                property=FavoritePropertyResponse(
                    id=str(property_obj.id),
                    title=property_obj.title,
                    description=property_obj.description,
                    price=float(property_obj.price),
                    city=property_obj.city,
                    bedrooms=property_obj.bedrooms,
                    bathrooms=property_obj.bathrooms,
                    area=float(property_obj.area),
                    parking_spaces=property_obj.parking_spaces,
                    has_pool=property_obj.has_pool,
                    has_garden=property_obj.has_garden,
                    furnished=property_obj.furnished,
                    status=property_obj.status.value,
                    images=[
                        PropertyImageResponse(
                            id=str(img.id),
                            image_url=img.image_url
                        ) for img in property_obj.images
                    ]
                )
            ))

    return result


@router.post("/", response_model=dict, status_code=status.HTTP_201_CREATED)
def add_favorite(
    request: AddFavoriteRequest,
    current_user: Users = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Adicionar imóvel aos favoritos do usuário"""
    # Validar UUID do imóvel
    try:
        property_uuid = UUID(request.property_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="ID do imóvel inválido")

    # Verificar se o imóvel existe
    property_obj = db.query(Properties).filter(Properties.id == property_uuid).first()
    if not property_obj:
        raise HTTPException(status_code=404, detail="Imóvel não encontrado")

    # Criar favorito
    favorite = Favorites(
        user_id=current_user.id,
        property_id=property_uuid
    )

    db.add(favorite)

    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        # Constraint UNIQUE violada - favorito já existe
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Imóvel já está nos favoritos"
        )

    return {"message": "Imóvel adicionado aos favoritos", "id": str(favorite.id)}


@router.delete("/{property_id}", response_model=dict)
def remove_favorite(
    property_id: str,
    current_user: Users = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Remover imóvel dos favoritos do usuário"""
    # Validar UUID do imóvel
    try:
        property_uuid = UUID(property_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="ID do imóvel inválido")

    # Buscar favorito
    favorite = (
        db.query(Favorites)
        .filter(
            Favorites.user_id == current_user.id,
            Favorites.property_id == property_uuid
        )
        .first()
    )

    if not favorite:
        raise HTTPException(status_code=404, detail="Favorito não encontrado")

    # Remover
    db.delete(favorite)
    db.commit()

    return {"message": "Imóvel removido dos favoritos"}


@router.get("/check/{property_id}", response_model=dict)
def check_favorite(
    property_id: str,
    current_user: Users = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Verificar se um imóvel está nos favoritos do usuário"""
    # Validar UUID do imóvel
    try:
        property_uuid = UUID(property_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="ID do imóvel inválido")

    # Verificar se existe
    favorite = (
        db.query(Favorites)
        .filter(
            Favorites.user_id == current_user.id,
            Favorites.property_id == property_uuid
        )
        .first()
    )

    return {"is_favorited": favorite is not None}
