"""merge heads

Revision ID: e901aa881482
Revises: 4fa78d914c8e, 7777049d7dd3
Create Date: 2026-02-26 15:41:00.368340

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'e901aa881482'
down_revision: Union[str, None] = ('4fa78d914c8e', '7777049d7dd3')
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    pass


def downgrade() -> None:
    pass
