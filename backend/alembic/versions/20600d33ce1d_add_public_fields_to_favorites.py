"""add_public_fields_to_favorites

Revision ID: 20600d33ce1d
Revises: 9010efbb9737
Create Date: 2026-02-26 08:30:16.799150

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '20600d33ce1d'
down_revision: Union[str, None] = '9010efbb9737'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Adicionar campos para favoritos públicos
    op.add_column('favorites', sa.Column('is_public', sa.Boolean(), nullable=False, server_default='false'))
    op.add_column('favorites', sa.Column('public_token', sa.String(length=100), nullable=True))
    
    # Criar índice para public_token para busca rápida
    op.create_index('ix_favorites_public_token', 'favorites', ['public_token'], unique=True)


def downgrade() -> None:
    # Remover índice
    op.drop_index('ix_favorites_public_token', table_name='favorites')
    
    # Remover colunas
    op.drop_column('favorites', 'public_token')
    op.drop_column('favorites', 'is_public')
