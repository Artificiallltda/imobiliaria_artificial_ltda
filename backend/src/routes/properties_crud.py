"""
Rotas para CRUD de imóveis (Admin/Gestor)
"""
import shutil
import uuid
from decimal import Decimal
from pathlib import Path
from typing import Optional, List, Union

from fastapi import APIRouter, Depends, HTTPException, status, File, Form, UploadFile
from pydantic import BaseModel
from sqlalchemy.orm import Session
from sqlalchemy import text

from src.database.db import SessionLocal
from src.database.models import Properties, PropertyStatus, Favorites, PriceAlerts
from src.websocket.manager import manager

# Router para endpoints de CRUD de imóveis
router = APIRouter(prefix="/properties", tags=["CRUD Imóveis"])


# Schemas para validação e serialização
class PropertyCreate(BaseModel):
    """Schema para criação de imóvel (JSON) - (vai ficar aqui, mas o POST agora usa FormData por causa das imagens)"""
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
    latitude: Optional[float] = None
    longitude: Optional[float] = None


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
def create_property(
    title: str = Form(...),
    description: str = Form(...),
    price: float = Form(...),
    city: str = Form(...),
    bedrooms: int = Form(...),
    bathrooms: int = Form(...),
    area: float = Form(...),
    status_value: str = Form("AVAILABLE"),
    images: Optional[List[UploadFile]] = File(None),  # múltiplas imagens
    db: Session = Depends(get_db),
):
    """
    Criar um novo imóvel (Admin/Gestor) + upload de imagens (multipart/form-data)

    - Campos do imóvel via Form(...)
    - Arquivos via images (múltiplos)
    """

    # Validações básicas
    if not title or not title.strip():
        raise HTTPException(status_code=400, detail="Título é obrigatório")

    if not description or not description.strip():
        raise HTTPException(status_code=400, detail="Descrição é obrigatória")

    if not city or not city.strip():
        raise HTTPException(status_code=400, detail="Cidade é obrigatória")

    if price <= 0:
        raise HTTPException(status_code=400, detail="O preço deve ser um valor positivo")

    if bedrooms <= 0:
        raise HTTPException(status_code=400, detail="O número de quartos deve ser positivo")

    if bathrooms <= 0:
        raise HTTPException(status_code=400, detail="O número de banheiros deve ser positivo")

    if area <= 0:
        raise HTTPException(status_code=400, detail="A área deve ser um valor positivo")

    # Validar status
    try:
        status_enum = PropertyStatus(status_value.upper())
    except ValueError:
        raise HTTPException(
            status_code=400,
            detail=f"Status inválido. Valores aceitos: {[s.value for s in PropertyStatus]}",
        )

    # Validar imagens (se vierem)
    if images:
        if len(images) > 10:
            raise HTTPException(status_code=400, detail="Limite de 10 imagens por imóvel")

        for f in images:
            if not (f.content_type or "").startswith("image/"):
                raise HTTPException(status_code=400, detail="Apenas imagens são permitidas")

    # Criar imóvel
    db_property = Properties(
        title=title,
        description=description,
        price=Decimal(str(price)),
        city=city,
        bedrooms=bedrooms,
        bathrooms=bathrooms,
        area=Decimal(str(area)),
        status=status_enum,
    )

    db.add(db_property)
    db.commit()
    db.refresh(db_property)

    # Salvar imagens no disco e registrar no banco (tabela property_images)
    if images:
        # backend/uploads/properties/<property_id>/
        backend_root = Path(__file__).resolve().parents[2]  # .../backend
        base_dir = backend_root / "uploads" / "properties"
        property_dir = base_dir / str(db_property.id)
        property_dir.mkdir(parents=True, exist_ok=True)

        for idx, file in enumerate(images):
            original = file.filename or "image"
            safe_name = original.replace("/", "_").replace("\\", "_")
            filename = f"{uuid.uuid4()}-{safe_name}"
            filepath = property_dir / filename

            with open(filepath, "wb") as buffer:
                shutil.copyfileobj(file.file, buffer)

            image_url = f"/uploads/properties/{db_property.id}/{filename}"

            # ✅ CORREÇÃO: usar text() + CAST(:property_id AS uuid)
            db.execute(
                text("""
                    INSERT INTO property_images (property_id, image_url, is_primary)
                    VALUES (CAST(:property_id AS uuid), :image_url, :is_primary)
                """),
                {
                    "property_id": str(db_property.id),
                    "image_url": image_url,
                    "is_primary": (idx == 0),
                },
            )

        db.commit()

    return PropertyResponse(
        id=str(db_property.id),
        title=db_property.title,
        description=db_property.description,
        price=float(db_property.price),
        city=db_property.city,
        bedrooms=db_property.bedrooms,
        bathrooms=db_property.bathrooms,
        area=float(db_property.area),
        status=db_property.status.value,
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
        raise HTTPException(status_code=400, detail="ID de imóvel inválido")

    property_obj = db.query(Properties).filter(Properties.id == property_uuid).first()

    if not property_obj:
        raise HTTPException(status_code=404, detail="Imóvel não encontrado")

    # LOG PARA DEBUG
    print(f"🏠 Backend - Imóvel retornado: lat={property_obj.latitude}, lng={property_obj.longitude}")

    return PropertyResponse(
        id=str(property_obj.id),
        title=property_obj.title,
        description=property_obj.description,
        price=float(property_obj.price),
        city=property_obj.city,
        bedrooms=property_obj.bedrooms,
        bathrooms=property_obj.bathrooms,
        area=float(property_obj.area),
        status=property_obj.status.value,
        latitude=float(property_obj.latitude) if property_obj.latitude else None,
        longitude=float(property_obj.longitude) if property_obj.longitude else None,
    )


@router.put("/{property_id}", response_model=PropertyResponse)
async def update_property(property_id: str, property_data: PropertyUpdate, db: Session = Depends(get_db)):
    """
    Atualizar um imóvel existente (Admin/Gestor)
    """
    try:
        property_uuid = uuid.UUID(property_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="ID de imóvel inválido")

    property_obj = db.query(Properties).filter(Properties.id == property_uuid).first()

    if not property_obj:
        raise HTTPException(status_code=404, detail="Imóvel não encontrado")

    if property_data.title is not None and (not property_data.title.strip()):
        raise HTTPException(status_code=400, detail="Título não pode ser vazio")

    if property_data.description is not None and (not property_data.description.strip()):
        raise HTTPException(status_code=400, detail="Descrição não pode ser vazia")

    if property_data.city is not None and (not property_data.city.strip()):
        raise HTTPException(status_code=400, detail="Cidade não pode ser vazia")

    if property_data.price is not None and property_data.price <= 0:
        raise HTTPException(status_code=400, detail="O preço deve ser um valor positivo")

    if property_data.bedrooms is not None and property_data.bedrooms <= 0:
        raise HTTPException(status_code=400, detail="O número de quartos deve ser positivo")

    if property_data.bathrooms is not None and property_data.bathrooms <= 0:
        raise HTTPException(status_code=400, detail="O número de banheiros deve ser positivo")

    if property_data.area is not None and property_data.area <= 0:
        raise HTTPException(status_code=400, detail="A área deve ser um valor positivo")

    if property_data.status is not None:
        try:
            status_enum = PropertyStatus(property_data.status.upper())
            property_obj.status = status_enum
        except ValueError:
            raise HTTPException(
                status_code=400,
                detail=f"Status inválido. Valores aceitos: {[s.value for s in PropertyStatus]}",
            )

    # Atualizar campos do imóvel
    if property_data.title is not None:
        property_obj.title = property_data.title
    if property_data.description is not None:
        property_obj.description = property_data.description
    if property_data.price is not None:
        old_price = property_obj.price
        new_price = Decimal(str(property_data.price))
        
        # Verificar se o preço mudou
        if old_price != new_price:
            # Buscar usuários que favoritaram este imóvel
            favorited_users = db.query(Favorites).filter(Favorites.property_id == property_uuid).all()
            
            # Criar alertas de preço para cada usuário e enviar notificações
            for favorite in favorited_users:
                # Criar alerta no banco
                alert = PriceAlerts(
                    user_id=favorite.user_id,
                    property_id=property_uuid,
                    old_price=old_price,
                    new_price=new_price
                )
                db.add(alert)
                
                # Enviar notificação WebSocket
                notification = {
                    "type": "price_update",
                    "data": {
                        "property_id": str(property_uuid),
                        "property_title": property_obj.title,
                        "old_price": float(old_price),
                        "new_price": float(new_price),
                        "price_change": float(new_price - old_price),
                        "price_change_percent": float(round(((new_price - old_price) / old_price) * 100, 2))
                    }
                }
                
                # Enviar para o usuário via WebSocket
                import json
                await manager.send_personal_message(json.dumps(notification), str(favorite.user_id))
        
        property_obj.price = new_price
    if property_data.city is not None:
        property_obj.city = property_data.city
    if property_data.bedrooms is not None:
        property_obj.bedrooms = property_data.bedrooms
    if property_data.bathrooms is not None:
        property_obj.bathrooms = property_data.bathrooms
    if property_data.area is not None:
        property_obj.area = Decimal(str(property_data.area))

    db.commit()
    db.refresh(property_obj)

    return PropertyResponse(
        id=str(property_obj.id),
        title=property_obj.title,
        description=property_obj.description,
        price=float(property_obj.price),
        city=property_obj.city,
        bedrooms=property_obj.bedrooms,
        bathrooms=property_obj.bathrooms,
        area=float(property_obj.area),
        status=property_obj.status.value,
    )


@router.post("/{property_id}/images", response_model=dict)
async def upload_property_images(
    property_id: str,
    images: List[UploadFile] = File(...),
    db: Session = Depends(get_db)
):
    """
    Upload de imagens para um imóvel existente
    """
    try:
        property_uuid = uuid.UUID(property_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="ID de imóvel inválido")

    property_obj = db.query(Properties).filter(Properties.id == property_uuid).first()

    if not property_obj:
        raise HTTPException(status_code=404, detail="Imóvel não encontrado")

    # Verificar se o diretório de uploads existe
    uploads_dir = Path("uploads")
    uploads_dir.mkdir(exist_ok=True)

    # Limpar imagens existentes deste imóvel (opcional, ou comentar para adicionar)
    from src.database.models import PropertyImages
    db.query(PropertyImages).filter(PropertyImages.property_id == property_uuid).delete()

    uploaded_images = []

    for image in images:
        # Validar se é uma imagem
        if not image.content_type.startswith("image/"):
            raise HTTPException(status_code=400, detail=f"Arquivo {image.filename} não é uma imagem válida")

        # Gerar nome único
        file_extension = Path(image.filename).suffix
        unique_filename = f"{uuid.uuid4()}{file_extension}"
        file_path = uploads_dir / unique_filename

        # Salvar arquivo
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(image.file, buffer)

        # Salvar no banco
        db_image = PropertyImages(
            property_id=property_uuid,
            image_url=f"http://127.0.0.1:8000/uploads/{unique_filename}"
        )
        db.add(db_image)
        uploaded_images.append(db_image.image_url)

    db.commit()

    return {
        "message": f"{len(uploaded_images)} imagens uploaded com sucesso",
        "images": uploaded_images
    }


@router.delete("/{property_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_property(property_id: str, db: Session = Depends(get_db)):
    """
    Remover um imóvel (Admin/Gestor)
    """
    try:
        property_uuid = uuid.UUID(property_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="ID de imóvel inválido")

    property_obj = db.query(Properties).filter(Properties.id == property_uuid).first()

    if not property_obj:
        raise HTTPException(status_code=404, detail="Imóvel não encontrado")

    db.delete(property_obj)
    db.commit()
    return None