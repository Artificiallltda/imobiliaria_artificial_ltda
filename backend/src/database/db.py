import os
from urllib.parse import quote_plus

from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

# Carrega .env (rodando a partir de backend/)
load_dotenv(encoding="utf-8")

DB_HOST = os.getenv("DB_HOST", "localhost")
DB_PORT = os.getenv("DB_PORT", "5432")
DB_NAME = os.getenv("DB_NAME")
DB_USER = os.getenv("DB_USER")
DB_PASSWORD = os.getenv("DB_PASSWORD")
DB_CLIENT_ENCODING = os.getenv("DB_CLIENT_ENCODING", "UTF8")

if not all([DB_NAME, DB_USER, DB_PASSWORD]):
    raise RuntimeError("Missing DB config. Set DB_NAME, DB_USER, and DB_PASSWORD in backend/.env")

# ✅ IMPORTANTÍSSIMO: URL-encode user/senha (senha tem @, %, etc)
DB_USER_ENC = quote_plus(DB_USER)
DB_PASSWORD_ENC = quote_plus(DB_PASSWORD)

# ✅ Força encoding no client do Postgres
os.environ["PGCLIENTENCODING"] = DB_CLIENT_ENCODING
options = quote_plus(f"-c client_encoding={DB_CLIENT_ENCODING}")

DATABASE_URL = (
    f"postgresql+psycopg2://{DB_USER_ENC}:{DB_PASSWORD_ENC}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
    f"?options={options}"
)

engine = create_engine(DATABASE_URL, pool_pre_ping=True)
SessionLocal = sessionmaker(bind=engine, autocommit=False, autoflush=False)

Base = declarative_base()


def get_db():
    """Dependency para obter sessão do banco de dados"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()