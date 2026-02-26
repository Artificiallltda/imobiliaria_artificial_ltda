"""add_lead_id_to_favorites_and_unique_constraint

Revision ID: 9010efbb9737
Revises: f0cffb1f8ec4
Create Date: 2026-02-26 08:25:37.604129

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '9010efbb9737'
down_revision: Union[str, None] = 'f0cffb1f8ec4'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Adicionar coluna lead_id
    op.add_column('favorites', sa.Column('lead_id', sa.UUID(), nullable=True))
    
    # Criar constraint única para evitar duplicação
    op.create_index(
        'uq_favorites_user_property_lead',
        'favorites',
        ['user_id', 'property_id', 'lead_id'],
        unique=True
    )


def downgrade() -> None:
    # Remover constraint única
    op.drop_index('uq_favorites_user_property_lead', table_name='favorites')
    
    # Remover coluna lead_id
    op.drop_column('favorites', 'lead_id')
