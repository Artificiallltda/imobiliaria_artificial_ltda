"""merge heads

Revision ID: 74f33b16fec7
Revises: 7777049d7dd2, e901aa881482
Create Date: 2026-02-27 08:53:07.726941

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '74f33b16fec7'
down_revision: Union[str, None] = ('7777049d7dd2', 'e901aa881482')
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    pass


def downgrade() -> None:
    pass
