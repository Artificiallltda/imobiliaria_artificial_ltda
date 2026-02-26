"""add message status and conversation assigned_to

Revision ID: a1b2c3d4e5f6
Revises: 
Create Date: 2026-02-26

"""
from alembic import op
import sqlalchemy as sa

revision = 'a1b2c3d4e5f6'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    op.add_column('messages', sa.Column('status', sa.String(20), nullable=False, server_default='sent'))
    op.add_column('messages', sa.Column('delivered_at', sa.DateTime, nullable=True))
    op.add_column('messages', sa.Column('read_at', sa.DateTime, nullable=True))
    op.add_column('conversations', sa.Column('assigned_to', sa.dialects.postgresql.UUID(as_uuid=True), nullable=True))


def downgrade():
    op.drop_column('messages', 'status')
    op.drop_column('messages', 'delivered_at')
    op.drop_column('messages', 'read_at')
    op.drop_column('conversations', 'assigned_to')
