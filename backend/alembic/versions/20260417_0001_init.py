"""initial schema

Revision ID: 20260417_0001
Revises: None
Create Date: 2026-04-17 10:00:00
"""

from alembic import op

from app.db.base import Base
from app.models import associations, job_application, learning_resource, note, project, refresh_token, saved_link, subscription, tag, user  # noqa

revision = '20260417_0001'
down_revision = None
branch_labels = None
depends_on = None



def upgrade() -> None:
    bind = op.get_bind()
    Base.metadata.create_all(bind=bind)



def downgrade() -> None:
    bind = op.get_bind()
    Base.metadata.drop_all(bind=bind)
