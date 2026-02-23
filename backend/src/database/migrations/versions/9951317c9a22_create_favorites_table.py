"""create_favorites_table

Revision ID: 9951317c9a22
Revises: merge_heads_01
Create Date: 2026-02-23 09:01:00.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = '9951317c9a22'
down_revision = 'merge_heads_01'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Criar tabela favorites
    op.create_table('favorites',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('user_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('property_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(['property_id'], ['properties.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['user_id'], ['Users.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('user_id', 'property_id', name='uq_user_property')
    )
    op.create_index(op.f('ix_favorites_property_id'), 'favorites', ['property_id'], unique=False)
    op.create_index(op.f('ix_favorites_user_id'), 'favorites', ['user_id'], unique=False)


def downgrade() -> None:
    op.drop_index(op.f('ix_favorites_user_id'), table_name='favorites')
    op.drop_index(op.f('ix_favorites_property_id'), table_name='favorites')
    op.drop_table('favorites')
