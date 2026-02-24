"""merge heads: merge_heads_02 + user_settings branch

Revision ID: merge_heads_03
Revises: merge_heads_02, d936f17abc18
Create Date: 2026-02-24 00:00:00.000000

"""
from alembic import op


# revision identifiers, used by Alembic.
revision = "merge_heads_03"
down_revision = ("merge_heads_02", "d936f17abc18")
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Merge revision: no-op (apenas unifica o histórico do Alembic)
    pass


def downgrade() -> None:
    pass
