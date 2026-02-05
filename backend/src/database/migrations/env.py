import os
import sys
from logging.config import fileConfig
from urllib.parse import quote

from alembic import context
from dotenv import load_dotenv
from sqlalchemy import create_engine, pool

# Load .env from backend root
load_dotenv(encoding="utf-8")

# Add backend/ to sys.path so "src" can be imported
backend_root = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../.."))
sys.path.insert(0, backend_root)

from src.database.db import Base  # noqa: E402
from src.database import models  # noqa: F401, E402

config = context.config

if config.config_file_name is not None:
    fileConfig(config.config_file_name)

DB_HOST = os.getenv("DB_HOST", "localhost")
DB_PORT = os.getenv("DB_PORT", "5432")
DB_NAME = os.getenv("DB_NAME")
DB_USER = os.getenv("DB_USER")
DB_PASSWORD = os.getenv("DB_PASSWORD")
DB_CLIENT_ENCODING = os.getenv("DB_CLIENT_ENCODING", "UTF8")

if not all([DB_NAME, DB_USER, DB_PASSWORD]):
    raise RuntimeError(
        "Missing DB config. Set DB_NAME, DB_USER, and DB_PASSWORD in backend/.env"
    )

# Ensure libpq/psycopg2 uses the desired client encoding on Windows.
os.environ["PGCLIENTENCODING"] = DB_CLIENT_ENCODING
options = quote(f"-c client_encoding={DB_CLIENT_ENCODING}")

DATABASE_URL = (
    f"postgresql+psycopg2://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
    f"?options={options}"
)

target_metadata = Base.metadata


def run_migrations_offline() -> None:
    context.configure(
        url=DATABASE_URL,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )

    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    connectable = create_engine(DATABASE_URL, poolclass=pool.NullPool)

    with connectable.connect() as connection:
        context.configure(
            connection=connection,
            target_metadata=target_metadata,
        )

        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
