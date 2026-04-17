from typing import TYPE_CHECKING

from sqlalchemy import Boolean, Enum, ForeignKey, String, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base
from app.models.associations import learning_resource_tags
from app.models.enums import ProgressStatus, ResourceCategory, ResourceType
from app.models.mixins import TimestampMixin, UUIDPrimaryKeyMixin

if TYPE_CHECKING:
    from app.models.tag import Tag
    from app.models.user import User


class LearningResource(UUIDPrimaryKeyMixin, TimestampMixin, Base):
    __tablename__ = 'learning_resources'

    user_id: Mapped[UUID] = mapped_column(UUID(as_uuid=True), ForeignKey('users.id', ondelete='CASCADE'), nullable=False, index=True)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    resource_type: Mapped[ResourceType] = mapped_column(Enum(ResourceType, name='resource_type_enum'), nullable=False)
    url: Mapped[str] = mapped_column(Text, nullable=False)
    category: Mapped[ResourceCategory] = mapped_column(Enum(ResourceCategory, name='resource_category_enum'), nullable=False)
    progress_status: Mapped[ProgressStatus] = mapped_column(Enum(ProgressStatus, name='resource_progress_enum'), nullable=False, default=ProgressStatus.not_started)
    difficulty: Mapped[str | None] = mapped_column(String(80), nullable=True)
    notes: Mapped[str | None] = mapped_column(Text, nullable=True)
    favorite: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)

    user: Mapped['User'] = relationship(back_populates='learning_resources')
    tags: Mapped[list['Tag']] = relationship(secondary=learning_resource_tags, back_populates='learning_resources')

    @property
    def tag_names(self) -> list[str]:
        return [tag.name for tag in self.tags]
