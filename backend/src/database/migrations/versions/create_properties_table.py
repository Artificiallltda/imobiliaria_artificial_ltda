"""create_properties_table

Revision ID: 001_create_properties_table
Revises: 
Create Date: 2026-02-12 16:30:00.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = '001_create_properties_table'
down_revision = "0001_create_users"
branch_labels = None
depends_on = None


def upgrade():
    """Criação da tabela properties com todos os campos necessários"""

    # Enum para status dos imóveis (idempotente)
    # - Criamos o TYPE somente se não existir
    # - Na coluna, usamos create_type=False para evitar que o SQLAlchemy tente criar de novo
    op.execute(
        """
        DO $$
        BEGIN
          IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'property_status') THEN
            CREATE TYPE property_status AS ENUM ('AVAILABLE', 'SOLD', 'RESERVED');
          END IF;
        END$$;
        """
    )
    property_status = postgresql.ENUM(
        'AVAILABLE', 'SOLD', 'RESERVED',
        name='property_status',
        create_type=False,
    )
    
    # Criar tabela properties
    op.create_table('properties',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('title', sa.String(length=255), nullable=False),
        sa.Column('description', sa.String(), nullable=False),
        sa.Column('price', sa.Numeric(precision=12, scale=2), nullable=False),
        sa.Column('city', sa.String(length=100), nullable=False),
        sa.Column('bedrooms', sa.Integer(), nullable=False),
        sa.Column('bathrooms', sa.Integer(), nullable=False),
        sa.Column('area', sa.Numeric(precision=8, scale=2), nullable=False),
        sa.Column('status', property_status, nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=False, default=sa.text('now()')),
        sa.Column('updated_at', sa.DateTime(), nullable=False, default=sa.text('now()'), onupdate=sa.text('now()')),
        sa.PrimaryKeyConstraint('id')
    )
    
    # Criar índices para performance nas consultas
    op.create_index('idx_properties_city', 'properties', ['city'])
    op.create_index('idx_properties_status', 'properties', ['status'])
    op.create_index('idx_properties_price', 'properties', ['price'])


def downgrade():
    """Remoção da tabela properties e do tipo enum"""
    op.drop_table('properties')
    op.execute("DROP TYPE IF EXISTS property_status")
