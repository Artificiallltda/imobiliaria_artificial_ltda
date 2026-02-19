"""add_leads_and_messages_tables

Revision ID: add_leads_tables
Revises: 9e1b75971f4e
Create Date: 2026-02-19 11:15:00.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = 'add_leads_tables'
down_revision = '9e1b75971f4e'
branch_labels = None
depends_on = None


def upgrade() -> None:
    """Criação das tabelas leads e lead_messages"""

    # Enum para status dos leads (idempotente)
    op.execute(
        """
        DO $$
        BEGIN
          IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'lead_status') THEN
            CREATE TYPE lead_status AS ENUM ('NEW', 'QUALIFYING', 'QUALIFIED', 'LOST');
          END IF;
        END$$;
        """
    )
    lead_status = postgresql.ENUM(
        'NEW', 'QUALIFYING', 'QUALIFIED', 'LOST',
        name='lead_status',
        create_type=False,
    )

    # Criar tabela leads
    op.create_table('leads',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('name', sa.String(length=255), nullable=False),
        sa.Column('email', sa.String(length=255), nullable=False),
        sa.Column('phone', sa.String(length=20), nullable=True),
        sa.Column('status', lead_status, nullable=False),
        sa.Column('source', sa.String(length=100), nullable=True),
        sa.Column('property_id', postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), nullable=False),
        sa.Column('qualified_at', sa.DateTime(), nullable=True),
        sa.Column('lost_at', sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(['property_id'], ['properties.id'], ),
        sa.PrimaryKeyConstraint('id')
    )

    # Criar tabela lead_messages
    op.create_table('lead_messages',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('lead_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('sender', sa.String(length=50), nullable=False),
        sa.Column('message', sa.String(), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(['lead_id'], ['leads.id'], ),
        sa.PrimaryKeyConstraint('id')
    )


def downgrade() -> None:
    """Remover tabelas leads e lead_messages"""

    op.drop_table('lead_messages')
    op.drop_table('leads')
    op.execute("DROP TYPE IF EXISTS lead_status")
