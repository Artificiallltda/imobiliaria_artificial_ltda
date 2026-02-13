"""
Rotas para CRUD de imóveis (Admin/Gestor)
"""
import uuid
from decimal import Decimal
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.orm import Session

from src.database.db import SessionLocal
from src.database.models import Properties, PropertyStatus

# Router para endpoints de CRUD de imóveis
router = APIRouter(prefix="/properties", tags=["CRUD Imóveis"])


# Schemas para validação e serialização
class PropertyCreate(BaseModel):
    """Schema para criação de imóvel"""
    title: str
    description: str
    price: float
    city: str
    bedrooms: int
    bathrooms: int
    area: float
    status: str = "AVAILABLE"
    
    class Config:
        json_schema_extra = {
            "example": {
                "title": "Casa em Condomínio",
                "description": "Casa moderna com piscina",
                "price": 950000,
                "city": "Campinas",
                "bedrooms": 4,
                "bathrooms": 3,
                "area": 250,
                "status": "AVAILABLE"
            }
        }


class PropertyUpdate(BaseModel):
    """Schema para atualização de imóvel"""
    title: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None
    city: Optional[str] = None
    bedrooms: Optional[int] = None
    bathrooms: Optional[int] = None
    area: Optional[float] = None
    status: Optional[str] = None


class PropertyResponse(BaseModel):
    """Schema para resposta de dados do imóvel"""
    id: str
    title: str
    description: str
    price: float
    city: str
    bedrooms: int
    bathrooms: int
    area: float
    status: str
    
    class Config:
        from_attributes = True


def get_db():
    """Dependency para obter sessão do banco de dados"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/", response_model=PropertyResponse, status_code=status.HTTP_201_CREATED)
def create_property(property_data: PropertyCreate, db: Session = Depends(get_db)):
    """
    Criar um novo imóvel (Admin/Gestor)
    
    - **title**: Título do imóvel (obrigatório)
    - **description**: Descrição detalhada (obrigatório)
    - **price**: Preço do imóvel (deve ser positivo)
    - **city**: Cidade onde se localiza (obrigatório)
    - **bedrooms**: Número de quartos (obrigatório)
    - **bathrooms**: Número de banheiros (obrigatório)
    - **area**: Área em m² (obrigatório)
    - **status**: Status do imóvel (AVAILABLE, SOLD, RESERVED)
    """
    
    # Validações básicas
    # Validar campos obrigatórios
    if not property_data.title or not property_data.title.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Título é obrigatório"
        )
    
    if not property_data.description or not property_data.description.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Descrição é obrigatória"
        )
    
    if not property_data.city or not property_data.city.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cidade é obrigatória"
        )
    
    # Validar valores positivos
    if property_data.price <= 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="O preço deve ser um valor positivo"
        )
    
    if property_data.bedrooms <= 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="O número de quartos deve ser positivo"
        )
    
    if property_data.bathrooms <= 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="O número de banheiros deve ser positivo"
        )
    
    if property_data.area <= 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A área deve ser um valor positivo"
        )
    
    # Validar status
    try:
        status_enum = PropertyStatus(property_data.status.upper())
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Status inválido. Valores aceitos: {[s.value for s in PropertyStatus]}"
        )
    
    # Criar imóvel
    db_property = Properties(
        title=property_data.title,
        description=property_data.description,
        price=Decimal(str(property_data.price)),
        city=property_data.city,
        bedrooms=property_data.bedrooms,
        bathrooms=property_data.bathrooms,
        area=Decimal(str(property_data.area)),
        status=status_enum
    )
    
    db.add(db_property)
    db.commit()
    db.refresh(db_property)
    
    return PropertyResponse(
        id=str(db_property.id),
        title=db_property.title,
        description=db_property.description,
        price=float(db_property.price),
        city=db_property.city,
        bedrooms=db_property.bedrooms,
        bathrooms=db_property.bathrooms,
        area=float(db_property.area),
        status=db_property.status.value
    )


@router.get("/{property_id}", response_model=PropertyResponse)
def get_property(property_id: str, db: Session = Depends(get_db)):
    """
    Obter um imóvel específico por ID
    
    - **property_id**: UUID do imóvel
    """
    try:
        property_uuid = uuid.UUID(property_id)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="ID de imóvel inválido"
        )
    
    property = db.query(Properties).filter(Properties.id == property_uuid).first()
    
    if not property:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Imóvel não encontrado"
        )
    
    return PropertyResponse(
        id=str(property.id),
        title=property.title,
        description=property.description,
        price=float(property.price),
        city=property.city,
        bedrooms=property.bedrooms,
        bathrooms=property.bathrooms,
        area=float(property.area),
        status=property.status.value
    )


@router.put("/{property_id}", response_model=PropertyResponse)
def update_property(property_id: str, property_data: PropertyUpdate, db: Session = Depends(get_db)):
    """
    Atualizar um imóvel existente (Admin/Gestor)
    
    - **property_id**: UUID do imóvel
    - Campos opcionais para atualização
    """
    
    # Validar ID
    try:
        property_uuid = uuid.UUID(property_id)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="ID de imóvel inválido"
        )
    
    # Buscar imóvel
    property = db.query(Properties).filter(Properties.id == property_uuid).first()
    
    if not property:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Imóvel não encontrado"
        )
    
    # Validações se os campos forem fornecidos
    if property_data.title is not None:
        if not property_data.title or not property_data.title.strip():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Título não pode ser vazio"
            )
    
    if property_data.description is not None:
        if not property_data.description or not property_data.description.strip():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Descrição não pode ser vazia"
            )
    
    if property_data.city is not None:
        if not property_data.city or not property_data.city.strip():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Cidade não pode ser vazia"
            )
    
    if property_data.price is not None and property_data.price <= 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="O preço deve ser um valor positivo"
        )
    
    if property_data.bedrooms is not None and property_data.bedrooms <= 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="O número de quartos deve ser positivo"
        )
    
    if property_data.bathrooms is not None and property_data.bathrooms <= 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="O número de banheiros deve ser positivo"
        )
    
    if property_data.area is not None and property_data.area <= 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A área deve ser um valor positivo"
        )
    
    # Validar status se fornecido
    if property_data.status is not None:
        try:
            status_enum = PropertyStatus(property_data.status.upper())
            property.status = status_enum
        except ValueError:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Status inválido. Valores aceitos: {[s.value for s in PropertyStatus]}"
            )
    
    # Atualizar campos fornecidos
    if property_data.title is not None:
        property.title = property_data.title
    
    if property_data.description is not None:
        property.description = property_data.description
    
    if property_data.price is not None:
        property.price = Decimal(str(property_data.price))
    
    if property_data.city is not None:
        property.city = property_data.city
    
    if property_data.bedrooms is not None:
        property.bedrooms = property_data.bedrooms
    
    if property_data.bathrooms is not None:
        property.bathrooms = property_data.bathrooms
    
    if property_data.area is not None:
        property.area = Decimal(str(property_data.area))
    
    db.commit()
    db.refresh(property)
    
    return PropertyResponse(
        id=str(property.id),
        title=property.title,
        description=property.description,
        price=float(property.price),
        city=property.city,
        bedrooms=property.bedrooms,
        bathrooms=property.bathrooms,
        area=float(property.area),
        status=property.status.value
    )


@router.delete("/{property_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_property(property_id: str, db: Session = Depends(get_db)):
    """
    Remover um imóvel (Admin/Gestor)
    
    - **property_id**: UUID do imóvel
    """
    
    # Validar ID
    try:
        property_uuid = uuid.UUID(property_id)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="ID de imóvel inválido"
        )
    
    # Buscar imóvel
    property = db.query(Properties).filter(Properties.id == property_uuid).first()
    
    if not property:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Imóvel não encontrado"
        )
    
    db.delete(property)
    db.commit()
    
    return None
