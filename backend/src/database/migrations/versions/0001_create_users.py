"""create users table and seed data

Revision ID: 0001_create_users
Revises: 
Create Date: 2026-02-04 00:00:00.000000

"""
import datetime as dt
import uuid

import bcrypt
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql


# revision identifiers, used by Alembic.
revision = "0001_create_users"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "Users",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True, nullable=False),
        sa.Column("full_name", sa.String(length=255), nullable=False),
        sa.Column("username", sa.String(length=150), nullable=False, unique=True),
        sa.Column("email", sa.String(length=255), nullable=False, unique=True),
        sa.Column("password", sa.String(length=255), nullable=False),
        sa.Column("role", sa.String(length=50), nullable=False),
        sa.Column("perfil_photo", sa.Boolean(), nullable=False),
        sa.Column("is_active", sa.Boolean(), nullable=False),
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.Column("updated_at", sa.DateTime(), nullable=False),
    )

    users_table = sa.table(
        "Users",
        sa.column("id", postgresql.UUID(as_uuid=True)),
        sa.column("full_name", sa.String(length=255)),
        sa.column("username", sa.String(length=150)),
        sa.column("email", sa.String(length=255)),
        sa.column("password", sa.String(length=255)),
        sa.column("role", sa.String(length=50)),
        sa.column("perfil_photo", sa.Boolean()),
        sa.column("is_active", sa.Boolean()),
        sa.column("created_at", sa.DateTime()),
        sa.column("updated_at", sa.DateTime()),
    )

    admin_password = bcrypt.hashpw(b"Admin123!", bcrypt.gensalt()).decode("utf-8")

    op.bulk_insert(
        users_table,
        [
            {
                "id": uuid.UUID("bdb5fc0d-0329-405f-9679-fe6fcc9d8813"),
                "full_name": "Admin",
                "username": "admin",
                "email": "admin@admin.com",
                "password": admin_password,
                "role": "admin",
                "perfil_photo": True,
                "is_active": True,
                "created_at": dt.datetime.utcnow(),
                "updated_at": dt.datetime.utcnow(),
            },
        ],
    )


def downgrade() -> None:
    op.drop_table("Users")
