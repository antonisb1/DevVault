from typing import TYPE_CHECKING

from sqlalchemy import ForeignKey, String, UniqueConstraint
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base
from app.models.associations import job_application_tags, learning_resource_tags, note_tags, project_tags, saved_link_tags
from app.models.mixins import TimestampMixin, UUIDPrimaryKeyMixin

if TYPE_CHECKING:
    from app.models.job_application import JobApplication
    from app.models.learning_resource import LearningResource
    from app.models.note import Note
    from app.models.project import Project
    from app.models.saved_link import SavedLink
    from app.models.user import User


class Tag(UUIDPrimaryKeyMixin, TimestampMixin, Base):
    __tablename__ = 'tags'
    __table_args__ = (UniqueConstraint('user_id', 'name', name='uq_tags_user_name'),)

    user_id: Mapped[UUID] = mapped_column(UUID(as_uuid=True), ForeignKey('users.id', ondelete='CASCADE'), nullable=False, index=True)
    name: Mapped[str] = mapped_column(String(60), nullable=False)

    user: Mapped['User'] = relationship(back_populates='tags')
    job_applications: Mapped[list['JobApplication']] = relationship(secondary=job_application_tags, back_populates='tags')
    learning_resources: Mapped[list['LearningResource']] = relationship(secondary=learning_resource_tags, back_populates='tags')
    projects: Mapped[list['Project']] = relationship(secondary=project_tags, back_populates='tags')
    notes: Mapped[list['Note']] = relationship(secondary=note_tags, back_populates='tags')
    saved_links: Mapped[list['SavedLink']] = relationship(secondary=saved_link_tags, back_populates='tags')
