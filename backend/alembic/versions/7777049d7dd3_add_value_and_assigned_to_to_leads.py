"""add_value_and_assigned_to_to_leads

Revision ID: 7777049d7dd3
Revises: 20600d33ce1d
Create Date: 2026-02-26 14:58:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '7777049d7dd3'
down_revision: Union[str, None] = '20600d33ce1d'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Adicionar coluna value (valor do imóvel/negócio)
    op.add_column('leads', sa.Column('value', sa.Numeric(precision=15, scale=2), nullable=True))
    
    # Adicionar coluna assigned_to (id do corretor responsável)
    op.add_column('leads', sa.Column('assigned_to', sa.UUID(as_uuid=True), nullable=True))
    
    # Criar índice para performance
    op.create_index('ix_leads_value', 'leads', ['value'])
    op.create_index('ix_leads_assigned_to', 'leads', ['assigned_to'])
    
    # Criar foreign key para users
    op.create_foreign_key('fk_leads_assigned_to_users', 'leads', 'Users', ['assigned_to'], ['id'])


def downgrade() -> None:
    # Remover foreign key
    op.drop_constraint('fk_leads_assigned_to_users', 'leads', type_='foreignkey')
    
    # Remover índices
    op.drop_index('ix_leads_assigned_to', table_name='leads')
    op.drop_index('ix_leads_value', table_name='leads')
    
    # Remover colunas
    op.drop_column('leads', 'assigned_to')
    op.drop_column('leads', 'value')
