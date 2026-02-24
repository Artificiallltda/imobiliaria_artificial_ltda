"""merge heads: leads + favorites + conversations flags

Revision ID: merge_heads_02
Revises: de445d67cfa4, 8061c7926681, ff7bdbb28807
Create Date: 2026-02-24 00:00:00.000000

"""
from alembic import op


# revision identifiers, used by Alembic.
revision = "merge_heads_02"
down_revision = ("de445d67cfa4", "8061c7926681", "ff7bdbb28807")
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Merge revision: no-op (apenas unifica o histórico do Alembic)
    pass


def downgrade() -> None:
    # Não há downgrade automático seguro para separar novamente os heads
    pass

