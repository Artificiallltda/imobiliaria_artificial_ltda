import os
from pathlib import Path

import bcrypt
from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, EmailStr
from sqlalchemy.orm import Session

from src.auth import create_access_token, get_current_user, get_db
from src.database.models import Users
from src.routes.conversations import router as conversations_router
from src.routes.favoritos import router as favorites_router
from src.routes.leads.leads import router as leads_router
from src.routes.properties import router as properties_router
from src.routes.properties_crud import router as properties_crud_router
from src.routes.settings import router as settings_router

app = FastAPI(title="API Imobiliária", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Servir arquivos estáticos de uploads (pasta backend/uploads)
BASE_DIR = Path(__file__).resolve().parent  # backend/
UPLOADS_DIR = BASE_DIR / "uploads"
UPLOADS_DIR.mkdir(parents=True, exist_ok=True)

app.mount("/uploads", StaticFiles(directory=str(UPLOADS_DIR)), name="uploads")

# Incluir rotas
app.include_router(properties_router)
app.include_router(properties_crud_router)
app.include_router(conversations_router)
app.include_router(leads_router)
app.include_router(favorites_router)
app.include_router(settings_router)


class LoginPayload(BaseModel):
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    id: str
    full_name: str
    username: str
    email: EmailStr
    role: str


class LoginResponse(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse


@app.post("/auth/login", response_model=LoginResponse)
def login(payload: LoginPayload, db: Session = Depends(get_db)):
    user = db.query(Users).filter(Users.email == payload.email).first()
    if not user or not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Credenciais inválidas.",
        )
    if not bcrypt.checkpw(payload.password.encode("utf-8"), user.password.encode("utf-8")):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Credenciais inválidas.",
        )

    token = create_access_token(user)
    return LoginResponse(
        access_token=token,
        token_type="bearer",
        user=UserResponse(
            id=str(user.id),
            full_name=user.full_name,
            username=user.username,
            email=user.email,
            role=user.role,
        ),
    )


@app.get("/auth/me", response_model=UserResponse)
def me(current_user: Users = Depends(get_current_user)):
    return UserResponse(
        id=str(current_user.id),
        full_name=current_user.full_name,
        username=current_user.username,
        email=current_user.email,
        role=current_user.role,
    )


@app.get("/")
def read_root():
    return {"message": "API Imobiliária", "status": "ok"}


@app.get("/health")
def health_check():
    return {"status": "healthy"}