"""
Rotas para gerenciamento de imóveis
"""
from decimal import Decimal
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from pydantic import BaseModel
from sqlalchemy.orm import Session

from src.database.db import SessionLocal
from src.database.models import Properties, PropertyStatus

# Router para endpoints de imóveis
router = APIRouter(prefix="/properties", tags=["Imóveis"])


# Schemas (Pydantic Models) para validação e serialização
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


class PropertiesListResponse(BaseModel):
    """Schema para resposta da lista de imóveis"""
    data: List[PropertyResponse]
    total: int


def get_db():
    """Dependency para obter sessão do banco de dados"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/", response_model=PropertiesListResponse)
def get_properties(
    city: Optional[str] = Query(None, description="Filtrar por cidade"),
    min_price: Optional[float] = Query(None, alias="minPrice", description="Preço mínimo"),
    max_price: Optional[float] = Query(None, alias="maxPrice", description="Preço máximo"),
    bedrooms: Optional[int] = Query(None, description="Número de quartos"),
    status: Optional[str] = Query(None, description="Status do imóvel (AVAILABLE, SOLD, RESERVED)"),
    db: Session = Depends(get_db)
):
    """
    Lista imóveis com filtros opcionais
    
    - **city**: Filtra por cidade (ex: São Paulo)
    - **minPrice**: Preço mínimo
    - **maxPrice**: Preço máximo  
    - **bedrooms**: Número exato de quartos
    - **status**: Status do imóvel
    """
    
    # Construir query base
    query = db.query(Properties)
    
    # Aplicar filtros se fornecidos
    if city:
        query = query.filter(Properties.city.ilike(f"%{city}%"))
    
    if min_price is not None:
        query = query.filter(Properties.price >= Decimal(str(min_price)))
    
    if max_price is not None:
        query = query.filter(Properties.price <= Decimal(str(max_price)))
    
    if bedrooms is not None:
        query = query.filter(Properties.bedrooms == bedrooms)
    
    if status:
        # Validar se o status é válido
        try:
            status_enum = PropertyStatus(status.upper())
            query = query.filter(Properties.status == status_enum)
        except ValueError:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Status inválido. Valores aceitos: {[s.value for s in PropertyStatus]}"
            )
    
    # Ordenar por data de criação (mais recentes primeiro)
    query = query.order_by(Properties.created_at.desc())
    
    # Executar query
    properties = query.all()
    total = len(properties)
    
    # Converter para response models
    properties_data = [
        PropertyResponse(
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
        for property in properties
    ]
    
    return PropertiesListResponse(data=properties_data, total=total)
