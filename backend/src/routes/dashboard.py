from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from src.auth import get_db
from src.controllers.dashboardController import get_dashboard_overview

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


@router.get("/overview")
def dashboard_overview(
    period: str = Query(default="30d", description="Período: 7d, 30d ou 12m"),
    db: Session = Depends(get_db)
):
    return get_dashboard_overview(db, period)