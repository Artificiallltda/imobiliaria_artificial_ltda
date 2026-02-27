"""add_goals_table

Revision ID: 3b4584e77df8
Revises: 74f33b16fec7
Create Date: 2026-02-27 08:54:08.547997

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '3b4584e77df8'
down_revision: Union[str, None] = '74f33b16fec7'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Criar tabela goals
    op.create_table('goals',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.UUID(), nullable=True),
        sa.Column('month', sa.Date(), nullable=False),
        sa.Column('target_value', sa.Numeric(precision=15, scale=2), nullable=True),
        sa.Column('target_deals', sa.Integer(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=True, server_default=sa.text('NOW()')),
        sa.ForeignKeyConstraint(['user_id'], ['Users.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    # Criar índice para performance
    op.create_index('ix_goals_user_month', 'goals', ['user_id', 'month'], unique=True)


def downgrade() -> None:
    op.drop_index('ix_goals_user_month', table_name='goals')
    op.drop_table('goals')
