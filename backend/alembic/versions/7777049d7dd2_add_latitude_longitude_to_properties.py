"""add_latitude_longitude_to_properties

Revision ID: 7777049d7dd2
Revises: 4fa78d914c8e
Create Date: 2026-02-26 12:54:35.805542

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '7777049d7dd2'
down_revision: Union[str, None] = '4fa78d914c8e'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Adicionar colunas latitude e longitude à tabela properties
    op.add_column('properties', sa.Column('latitude', sa.Numeric(precision=10, scale=8), nullable=True))
    op.add_column('properties', sa.Column('longitude', sa.Numeric(precision=11, scale=8), nullable=True))
    
    # Criar índices para melhor performance em consultas geográficas
    op.create_index('ix_properties_latitude', 'properties', ['latitude'])
    op.create_index('ix_properties_longitude', 'properties', ['longitude'])


def downgrade() -> None:
    # Remover índices
    op.drop_index('ix_properties_longitude', table_name='properties')
    op.drop_index('ix_properties_latitude', table_name='properties')
    
    # Remover colunas
    op.drop_column('properties', 'longitude')
    op.drop_column('properties', 'latitude')
