"""add_constraints_to_properties

Revision ID: 9e1b75971f4e
Revises: 001_create_properties_table
Create Date: 2026-02-13 13:42:53.498079

"""
from alembic import op
import sqlalchemy as sa



# revision identifiers, used by Alembic.
revision = '9e1b75971f4e'
down_revision = '001_create_properties_table'
branch_labels = None
depends_on = None


def upgrade() -> None:
    """Adicionar constraints básicas à tabela properties"""
    
    # Adicionar constraint para garantir que o título não seja nulo/vazio
    op.execute("""
        ALTER TABLE properties 
        ADD CONSTRAINT chk_title_not_empty 
        CHECK (length(trim(title)) > 0)
    """)
    
    # Adicionar constraint para garantir que a cidade não seja nula/vazia
    op.execute("""
        ALTER TABLE properties 
        ADD CONSTRAINT chk_city_not_empty 
        CHECK (length(trim(city)) > 0)
    """)
    
    # Adicionar constraint para garantir que a descrição não seja nula/vazia
    op.execute("""
        ALTER TABLE properties 
        ADD CONSTRAINT chk_description_not_empty 
        CHECK (length(trim(description)) > 0)
    """)
    
    # Adicionar constraints para valores positivos
    op.execute("""
        ALTER TABLE properties 
        ADD CONSTRAINT chk_bedrooms_positive 
        CHECK (bedrooms > 0)
    """)
    
    op.execute("""
        ALTER TABLE properties 
        ADD CONSTRAINT chk_bathrooms_positive 
        CHECK (bathrooms > 0)
    """)
    
    op.execute("""
        ALTER TABLE properties 
        ADD CONSTRAINT chk_area_positive 
        CHECK (area > 0)
    """)


def downgrade() -> None:
    """Remover constraints da tabela properties"""
    
    # Remover constraints na ordem inversa
    op.execute("ALTER TABLE properties DROP CONSTRAINT IF EXISTS chk_area_positive")
    op.execute("ALTER TABLE properties DROP CONSTRAINT IF EXISTS chk_bathrooms_positive")
    op.execute("ALTER TABLE properties DROP CONSTRAINT IF EXISTS chk_bedrooms_positive")
    op.execute("ALTER TABLE properties DROP CONSTRAINT IF EXISTS chk_description_not_empty")
    op.execute("ALTER TABLE properties DROP CONSTRAINT IF EXISTS chk_city_not_empty")
    op.execute("ALTER TABLE properties DROP CONSTRAINT IF EXISTS chk_title_not_empty")
