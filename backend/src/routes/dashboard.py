from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from src.auth import get_db
from src.controllers.dashboardController import get_dashboard_overview

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


@router.get("/overview")
def dashboard_overview(db: Session = Depends(get_db)):
    return get_dashboard_overview(db)