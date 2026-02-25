from logging.config import fileConfig
import os
import sys
from urllib.parse import quote_plus

from sqlalchemy import engine_from_config
from sqlalchemy import pool
from alembic import context

from dotenv import load_dotenv

# permitir imports do projeto (backend/)
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

# carregar backend/.env
env_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".env"))
load_dotenv(env_path)

config = context.config

if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# montar URL a partir das variáveis do .env
host = os.getenv("DB_HOST", "localhost")
port = os.getenv("DB_PORT", "5432")
name = os.getenv("DB_NAME")
user = os.getenv("DB_USER")
password_raw = os.getenv("DB_PASSWORD")  # agora vem como 172490@S

if not all([name, user, password_raw]):
    raise RuntimeError(
        f"Variáveis de banco incompletas no .env ({env_path}). "
        "Precisa de DB_NAME, DB_USER, DB_PASSWORD."
    )

# URL-encode seguro para senha (ex: @, : etc)
password = quote_plus(password_raw)

db_url = f"postgresql+psycopg2://{user}:{password}@{host}:{port}/{name}"

# NÃO usar set_main_option (ConfigParser reclama de %)
# Em vez disso, usamos diretamente na engine abaixo.

from src.database.db import Base
from src.models.property_image import PropertyImage

target_metadata = Base.metadata


def run_migrations_offline() -> None:
    context.configure(
        url=db_url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
        compare_type=True,
    )
    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    connectable = engine_from_config(
        config.get_section(config.config_ini_section, {}),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
        url=db_url,  # <-- passa a URL aqui, sem mexer no configparser
    )

    with connectable.connect() as connection:
        context.configure(
            connection=connection,
            target_metadata=target_metadata,
            compare_type=True,
        )
        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()