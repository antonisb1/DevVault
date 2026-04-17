from datetime import date
from typing import TYPE_CHECKING

from sqlalchemy import Date, Enum, ForeignKey, String, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base
from app.models.associations import job_application_tags
from app.models.enums import JobApplicationStatus, WorkMode
from app.models.mixins import TimestampMixin, UUIDPrimaryKeyMixin

if TYPE_CHECKING:
    from app.models.tag import Tag
    from app.models.user import User


class JobApplication(UUIDPrimaryKeyMixin, TimestampMixin, Base):
    __tablename__ = 'job_applications'

    user_id: Mapped[UUID] = mapped_column(UUID(as_uuid=True), ForeignKey('users.id', ondelete='CASCADE'), nullable=False, index=True)
    company_name: Mapped[str] = mapped_column(String(255), nullable=False, index=True)
    role_title: Mapped[str] = mapped_column(String(255), nullable=False)
    location: Mapped[str | None] = mapped_column(String(255), nullable=True)
    work_mode: Mapped[WorkMode] = mapped_column(Enum(WorkMode, name='work_mode_enum'), nullable=False, default=WorkMode.remote)
    source: Mapped[str | None] = mapped_column(String(255), nullable=True)
    status: Mapped[JobApplicationStatus] = mapped_column(Enum(JobApplicationStatus, name='job_status_enum'), nullable=False, default=JobApplicationStatus.saved)
    application_date: Mapped[date | None] = mapped_column(Date, nullable=True)
    follow_up_date: Mapped[date | None] = mapped_column(Date, nullable=True, index=True)
    salary_range: Mapped[str | None] = mapped_column(String(120), nullable=True)
    job_url: Mapped[str | None] = mapped_column(Text, nullable=True)
    notes: Mapped[str | None] = mapped_column(Text, nullable=True)

    user: Mapped['User'] = relationship(back_populates='job_applications')
    tags: Mapped[list['Tag']] = relationship(secondary=job_application_tags, back_populates='job_applications')

    @property
    def tag_names(self) -> list[str]:
        return [tag.name for tag in self.tags]
