"""create_price_alerts_table

Revision ID: 4fa78d914c8e
Revises: 20600d33ce1d
Create Date: 2026-02-26 08:40:08.847739

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '4fa78d914c8e'
down_revision: Union[str, None] = '20600d33ce1d'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Criar tabela de alertas de preço
    op.create_table(
        'price_alerts',
        sa.Column('id', sa.UUID(), nullable=False),
        sa.Column('user_id', sa.UUID(), nullable=False),
        sa.Column('property_id', sa.UUID(), nullable=False),
        sa.Column('old_price', sa.Numeric(precision=12, scale=2), nullable=False),
        sa.Column('new_price', sa.Numeric(precision=12, scale=2), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(['property_id'], ['properties.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['user_id'], ['Users.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    
    # Criar índices para performance
    op.create_index('ix_price_alerts_user_id', 'price_alerts', ['user_id'])
    op.create_index('ix_price_alerts_property_id', 'price_alerts', ['property_id'])


def downgrade() -> None:
    # Remover índices
    op.drop_index('ix_price_alerts_property_id', table_name='price_alerts')
    op.drop_index('ix_price_alerts_user_id', table_name='price_alerts')
    
    # Remover tabela
    op.drop_table('price_alerts')
