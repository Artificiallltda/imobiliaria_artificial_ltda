"""create property_images

Revision ID: f0cffb1f8ec4
Revises: 
Create Date: 2026-02-25

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = "f0cffb1f8ec4"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "property_images",
        sa.Column("id", sa.Integer(), primary_key=True, nullable=False),
        sa.Column("property_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("image_url", sa.Text(), nullable=False),
        sa.Column("is_primary", sa.Boolean(), server_default=sa.text("false"), nullable=False),
        sa.Column("created_at", sa.DateTime(), server_default=sa.text("NOW()"), nullable=False),
    )
    op.create_index("idx_property_images_property_id", "property_images", ["property_id"])
    op.create_index("idx_property_images_is_primary", "property_images", ["is_primary"])


def downgrade() -> None:
    op.drop_index("idx_property_images_is_primary", table_name="property_images")
    op.drop_index("idx_property_images_property_id", table_name="property_images")
    op.drop_table("property_images")