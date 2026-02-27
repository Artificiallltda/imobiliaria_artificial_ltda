from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import text

from src.auth import get_db

router = APIRouter(prefix="/users", tags=["Users"])


@router.get("/")
def get_users(db: Session = Depends(get_db)):
    """Busca lista de usuários ativos para select de corretores"""
    rows = db.execute(
        text("""
            SELECT id, full_name, email, role
            FROM "Users"
            WHERE is_active = true
            ORDER BY full_name
        """)
    ).all()
    
    return [
        {
            "id": str(row[0]),
            "name": str(row[1]),
            "email": str(row[2]),
            "role": str(row[3])
        }
        for row in rows
    ]
