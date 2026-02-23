"""
Rotas para leads
"""
from datetime import datetime
from typing import List, Optional
from uuid import UUID
from sqlalchemy import or_, func

from fastapi import APIRouter, Depends, HTTPException, status, Query
from pydantic import BaseModel
from sqlalchemy.orm import Session

from src.database.db import SessionLocal
from src.database.models import Leads, LeadMessages, Properties, LeadStatus

# Router para endpoints de leads
router = APIRouter(prefix="/leads", tags=["Leads"])


# Schemas para resposta
class PropertyBasicResponse(BaseModel):
    """Schema básico para imóvel vinculado ao lead"""
    id: str
    title: str

    class Config:
        from_attributes = True


class LeadMessageResponse(BaseModel):
    """Schema para mensagens do lead"""
    id: str
    sender: str
    message: str
    created_at: datetime

    class Config:
        from_attributes = True


class LeadResponse(BaseModel):
    """Schema para resposta de dados do lead"""
    id: str
    name: str
    email: str
    phone: Optional[str]
    status: str
    source: Optional[str]
    property: Optional[PropertyBasicResponse]
    messages: List[LeadMessageResponse]

    class Config:
        from_attributes = True


class LeadListResponse(BaseModel):
    """Schema para resposta da lista de leads"""
    id: str
    name: str
    email: str
    phone: Optional[str]
    status: str
    source: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True


class LeadListPaginatedResponse(BaseModel):
    """Schema para resposta paginada da lista de leads"""
    data: List[LeadListResponse]
    total: int
    page: int
    limit: int


class UpdateLeadRequest(BaseModel):
    """Schema para requisição de atualização de lead - MVP"""
    status: Optional[str] = None
    is_archived: Optional[bool] = None
    convert: Optional[bool] = None


def get_db():
    """Dependency para obter sessão do banco de dados"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/", response_model=LeadListPaginatedResponse)
def list_leads(
    status: Optional[str] = Query(None, description="Filtrar por status do lead"),
    search: Optional[str] = Query(None, description="Buscar por nome, email ou telefone"),
    property_id: Optional[str] = Query(None, description="Filtrar por ID do imóvel"),
    page: int = Query(1, ge=1, description="Página atual (mínimo 1)"),
    limit: int = Query(10, ge=1, le=100, description="Itens por página (1-100)"),
    db: Session = Depends(get_db)
):
    """Listar leads com filtros e paginação"""
    query = db.query(Leads)

    # Filtro por status
    if status:
        try:
            lead_status = LeadStatus(status)
            query = query.filter(Leads.status == lead_status)
        except ValueError:
            raise HTTPException(status_code=400, detail="Status inválido")

    # Filtro por imóvel
    if property_id:
        try:
            property_uuid = UUID(property_id)
            query = query.filter(Leads.property_id == property_uuid)
        except ValueError:
            raise HTTPException(status_code=400, detail="ID do imóvel inválido")

    # Busca por nome, email ou telefone
    if search:
        search_term = f"%{search}%"
        query = query.filter(
            or_(
                Leads.name.ilike(search_term),
                Leads.email.ilike(search_term),
                Leads.phone.ilike(search_term)
            )
        )

    # Contar total de registros (antes da paginação)
    total = query.count()

    # Ordenação e paginação
    leads = (
        query
        .order_by(Leads.created_at.desc())
        .offset((page - 1) * limit)
        .limit(limit)
        .all()
    )

    return LeadListPaginatedResponse(
        data=[
            LeadListResponse(
                id=str(lead.id),
                name=lead.name,
                email=lead.email,
                phone=lead.phone,
                status=lead.status.value,
                source=lead.source,
                created_at=lead.created_at
            ) for lead in leads
        ],
        total=total,
        page=page,
        limit=limit
    )


@router.get("/{lead_id}", response_model=LeadResponse)
def get_lead(lead_id: str, db: Session = Depends(get_db)):
    """Obter detalhes de um lead por ID"""
    try:
        lead_uuid = UUID(lead_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="ID do lead inválido")

    # Buscar lead
    lead = db.query(Leads).filter(Leads.id == lead_uuid).first()
    if not lead:
        raise HTTPException(status_code=404, detail="Lead não encontrado")

    # Buscar imóvel vinculado se existir
    property_data = None
    if lead.property_id:
        prop = db.query(Properties).filter(Properties.id == lead.property_id).first()
        if prop:
            property_data = PropertyBasicResponse(id=str(prop.id), title=prop.title)

    # Buscar mensagens (por enquanto vazia, mas preparado)
    messages = db.query(LeadMessages).filter(LeadMessages.lead_id == lead_uuid).order_by(LeadMessages.created_at).all()

    return LeadResponse(
        id=str(lead.id),
        name=lead.name,
        email=lead.email,
        phone=lead.phone,
        status=lead.status.value,
        source=lead.source,
        property=property_data,
        messages=[LeadMessageResponse(
            id=str(msg.id),
            sender=msg.sender,
            message=msg.message,
            created_at=msg.created_at
        ) for msg in messages]
    )


@router.patch("/{lead_id}", response_model=LeadResponse)
def update_lead(lead_id: str, request: UpdateLeadRequest, db: Session = Depends(get_db)):
    """Atualizar lead - MVP completo (status, arquivar, converter)"""
    try:
        lead_uuid = UUID(lead_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="ID do lead inválido")

    # Buscar lead
    lead = db.query(Leads).filter(Leads.id == lead_uuid).first()
    if not lead:
        raise HTTPException(status_code=404, detail="Lead não encontrado")

    # Validar e atualizar status se fornecido
    if request.status is not None:
        try:
            new_status = LeadStatus(request.status)
        except ValueError:
            raise HTTPException(
                status_code=400, 
                detail=f"Status inválido. Status permitidos: {[s.value for s in LeadStatus]}"
            )
        lead.status = new_status

    # Arquivar/desarquivar se fornecido
    if request.is_archived is not None:
        lead.is_archived = request.is_archived

    # Converter lead se solicitado
    if request.convert is True:
        lead.status = LeadStatus.fechado
        lead.converted_at = datetime.utcnow()

    # Atualizar timestamp
    lead.updated_at = datetime.utcnow()

    db.commit()
    db.refresh(lead)

    # Buscar dados relacionados para resposta
    property_data = None
    if lead.property_id:
        prop = db.query(Properties).filter(Properties.id == lead.property_id).first()
        if prop:
            property_data = PropertyBasicResponse(id=str(prop.id), title=prop.title)

    messages = db.query(LeadMessages).filter(LeadMessages.lead_id == lead_uuid).order_by(LeadMessages.created_at).all()

    return LeadResponse(
        id=str(lead.id),
        name=lead.name,
        email=lead.email,
        phone=lead.phone,
        status=lead.status.value,
        source=lead.source,
        property=property_data,
        messages=[LeadMessageResponse(
            id=str(msg.id),
            sender=msg.sender,
            message=msg.message,
            created_at=msg.created_at
        ) for msg in messages]
    )
