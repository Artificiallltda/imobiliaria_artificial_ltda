"""merge heads: leads + conversations

Revision ID: merge_heads_01
Revises: 19122244c53d, add_leads_tables
Create Date: 2026-02-20 00:00:00.000000

"""
from alembic import op

# revision identifiers, used by Alembic.
revision = 'merge_heads_01'
down_revision = ('19122244c53d', 'add_leads_tables')
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Merge revision: no-op (only unifies Alembic history)
    pass


def downgrade() -> None:
    pass
