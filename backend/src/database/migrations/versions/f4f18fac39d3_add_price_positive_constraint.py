"""add_price_positive_constraint

Revision ID: f4f18fac39d3
Revises: 9e1b75971f4e
Create Date: 2026-02-13 13:44:51.108755

"""
from alembic import op
import sqlalchemy as sa



# revision identifiers, used by Alembic.
revision = 'f4f18fac39d3'
down_revision = '9e1b75971f4e'
branch_labels = None
depends_on = None


def upgrade() -> None:
    """Adicionar constraint para preço positivo"""
    
    # Adicionar constraint para garantir que o preço seja positivo
    op.execute("""
        ALTER TABLE properties 
        ADD CONSTRAINT chk_price_positive 
        CHECK (price > 0)
    """)


def downgrade() -> None:
    """Remover constraint de preço positivo"""
    
    op.execute("ALTER TABLE properties DROP CONSTRAINT IF EXISTS chk_price_positive")
