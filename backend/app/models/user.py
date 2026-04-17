from typing import TYPE_CHECKING

from sqlalchemy import Boolean, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base
from app.models.mixins import TimestampMixin, UUIDPrimaryKeyMixin

if TYPE_CHECKING:
    from app.models.job_application import JobApplication
    from app.models.learning_resource import LearningResource
    from app.models.note import Note
    from app.models.project import Project
    from app.models.refresh_token import RefreshToken
    from app.models.saved_link import SavedLink
    from app.models.subscription import Subscription
    from app.models.tag import Tag


class User(UUIDPrimaryKeyMixin, TimestampMixin, Base):
    __tablename__ = 'users'

    email: Mapped[str] = mapped_column(String(255), unique=True, nullable=False, index=True)
    username: Mapped[str] = mapped_column(String(100), unique=True, nullable=False, index=True)
    hashed_password: Mapped[str] = mapped_column(String(255), nullable=False)
    full_name: Mapped[str | None] = mapped_column(String(255), nullable=True)
    bio: Mapped[str | None] = mapped_column(Text, nullable=True)
    avatar_url: Mapped[str | None] = mapped_column(Text, nullable=True)
    timezone: Mapped[str | None] = mapped_column(String(100), nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)

    refresh_tokens: Mapped[list['RefreshToken']] = relationship(back_populates='user', cascade='all, delete-orphan')
    tags: Mapped[list['Tag']] = relationship(back_populates='user', cascade='all, delete-orphan')
    job_applications: Mapped[list['JobApplication']] = relationship(back_populates='user', cascade='all, delete-orphan')
    learning_resources: Mapped[list['LearningResource']] = relationship(back_populates='user', cascade='all, delete-orphan')
    projects: Mapped[list['Project']] = relationship(back_populates='user', cascade='all, delete-orphan')
    subscriptions: Mapped[list['Subscription']] = relationship(back_populates='user', cascade='all, delete-orphan')
    notes: Mapped[list['Note']] = relationship(back_populates='user', cascade='all, delete-orphan')
    saved_links: Mapped[list['SavedLink']] = relationship(back_populates='user', cascade='all, delete-orphan')
