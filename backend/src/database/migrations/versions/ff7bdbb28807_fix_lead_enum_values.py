"""fix_lead_enum_values

Revision ID: ff7bdbb28807
Revises: 9951317c9a22
Create Date: 2026-02-23 09:05:50.787170

"""
from alembic import op
import sqlalchemy as sa



# revision identifiers, used by Alembic.
revision = 'ff7bdbb28807'
down_revision = '9951317c9a22'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Verificar se há dados inválidos e corrigir
    # Se houver algum registro com status inválido, definir como 'novo'
    op.execute("""
        UPDATE leads 
        SET status = 'novo'::lead_status
        WHERE status::text NOT IN ('novo', 'em_atendimento', 'proposta_enviada', 'fechado', 'perdido')
    """)


def downgrade() -> None:
    # Reverter para valores antigos se necessário
    op.execute("""
        UPDATE leads 
        SET status = 'NEW'::lead_status
        WHERE status::text NOT IN ('NEW', 'QUALIFYING', 'QUALIFIED', 'LOST')
    """)
