from fastapi import APIRouter, Depends, Query, Response
from sqlalchemy.orm import Session
from typing import Optional

from src.auth import get_db
from src.controllers.dashboardController import get_dashboard_overview
from src.services.pdf_service import generate_dashboard_report

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


@router.get("/overview")
def dashboard_overview(
    period: str = Query(default="30d", description="Período: 7d, 30d ou 12m"),
    user_id: str = Query(default=None, description="ID do usuário para dashboard individual"),
    db: Session = Depends(get_db)
):
    return get_dashboard_overview(db, period, user_id)


@router.get("/report")
def dashboard_report(
    period: str = Query(default="30d", description="Período: 7d, 30d ou 12m"),
    user_id: str = Query(default=None, description="ID do usuário para dashboard individual"),
    db: Session = Depends(get_db)
):
    # Buscar dados do dashboard
    data = get_dashboard_overview(db, period, user_id)
    
    # Buscar nome do usuário se for dashboard individual
    user_name = None
    if user_id:
        from sqlalchemy import text
        result = db.execute(
            text("SELECT full_name FROM \"Users\" WHERE id = :user_id"),
            {"user_id": user_id}
        ).first()
        if result:
            user_name = result[0]
    
    # Gerar PDF
    pdf_buffer = generate_dashboard_report(data, period, user_name)
    
    # Retornar como download
    headers = {
        "Content-Disposition": "attachment; filename=relatorio_dashboard.pdf",
        "Content-Type": "application/pdf"
    }
    
    return Response(
        content=pdf_buffer.getvalue(),
        headers=headers,
        media_type="application/pdf"
    )