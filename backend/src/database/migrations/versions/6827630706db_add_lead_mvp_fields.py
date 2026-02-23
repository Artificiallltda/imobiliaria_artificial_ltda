"""add_lead_mvp_fields

Revision ID: 6827630706db
Revises: merge_heads_01
Create Date: 2026-02-23 09:00:12.410111

"""
from alembic import op
import sqlalchemy as sa



# revision identifiers, used by Alembic.
revision = '6827630706db'
down_revision = 'add_leads_tables'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Adicionar campo is_archived
    op.add_column('leads', sa.Column('is_archived', sa.Boolean(), nullable=False, server_default='false'))
    
    # Adicionar campo converted_at
    op.add_column('leads', sa.Column('converted_at', sa.DateTime(), nullable=True))
    
    # Atualizar enum de status para novos valores do MVP
    # Primeiro, criar o novo tipo enum
    op.execute("ALTER TYPE lead_status RENAME TO lead_status_old")
    op.execute("CREATE TYPE lead_status AS ENUM ('novo', 'em_atendimento', 'proposta_enviada', 'fechado', 'perdido')")
    
    # Converter dados existentes (mapeamento antigo -> novo)
    op.execute("""
        ALTER TABLE leads 
        ALTER COLUMN status TYPE lead_status 
        USING CASE 
            WHEN status::text = 'NEW' THEN 'novo'::lead_status
            WHEN status::text = 'QUALIFYING' THEN 'em_atendimento'::lead_status
            WHEN status::text = 'QUALIFIED' THEN 'proposta_enviada'::lead_status
            WHEN status::text = 'LOST' THEN 'perdido'::lead_status
            ELSE 'novo'::lead_status
        END
    """)
    
    # Remover tipo antigo
    op.execute("DROP TYPE lead_status_old")


def downgrade() -> None:
    # Reverter enum para valores antigos
    op.execute("ALTER TYPE lead_status RENAME TO lead_status_new")
    op.execute("CREATE TYPE lead_status AS ENUM ('NEW', 'QUALIFYING', 'QUALIFIED', 'LOST')")
    
    # Converter dados de volta
    op.execute("""
        ALTER TABLE leads 
        ALTER COLUMN status TYPE lead_status 
        USING CASE 
            WHEN status::text = 'novo' THEN 'NEW'::lead_status
            WHEN status::text = 'em_atendimento' THEN 'QUALIFYING'::lead_status
            WHEN status::text = 'proposta_enviada' THEN 'QUALIFIED'::lead_status
            WHEN status::text = 'fechado' THEN 'QUALIFIED'::lead_status
            WHEN status::text = 'perdido' THEN 'LOST'::lead_status
            ELSE 'NEW'::lead_status
        END
    """)
    
    # Remover tipo novo
    op.execute("DROP TYPE lead_status_new")
    
    # Remover campos adicionados
    op.drop_column('leads', 'converted_at')
    op.drop_column('leads', 'is_archived')
