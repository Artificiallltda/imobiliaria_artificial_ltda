"""fix_lead_enum_values

Revision ID: ff7bdbb28807
Revises: 9951317c9a22
Create Date: 2026-02-23 09:05:50.787170

"""
from alembic import op
import sqlalchemy as sa



# revision identifiers, used by Alembic.
revision = "ff7bdbb28807"
down_revision = "9951317c9a22"
branch_labels = None
depends_on = None


def upgrade() -> None:
    """
    Corrige registros com status inválido para um valor válido
    do enum atual de leads.

    Neste ponto da linha do tempo, o tipo lead_status ainda
    está usando os valores em inglês ('NEW', 'QUALIFYING',
    'QUALIFIED', 'LOST'). A migration posterior
    6827630706db_add_lead_mvp_fields é que converte para
    os valores em português.
    """
    op.execute(
        """
        UPDATE leads
        SET status = 'NEW'::lead_status
        WHERE status::text NOT IN ('NEW', 'QUALIFYING', 'QUALIFIED', 'LOST')
        """
    )


def downgrade() -> None:
    # Mantém lógica simétrica, mas usando o enum antigo
    op.execute(
        """
        UPDATE leads
        SET status = 'NEW'::lead_status
        WHERE status::text NOT IN ('NEW', 'QUALIFYING', 'QUALIFIED', 'LOST')
        """
    )
