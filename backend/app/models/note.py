from typing import TYPE_CHECKING

from sqlalchemy import Boolean, ForeignKey, String, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base
from app.models.associations import note_tags
from app.models.mixins import TimestampMixin, UUIDPrimaryKeyMixin

if TYPE_CHECKING:
    from app.models.tag import Tag
    from app.models.user import User


class Note(UUIDPrimaryKeyMixin, TimestampMixin, Base):
    __tablename__ = 'notes'

    user_id: Mapped[UUID] = mapped_column(UUID(as_uuid=True), ForeignKey('users.id', ondelete='CASCADE'), nullable=False, index=True)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    content: Mapped[str] = mapped_column(Text, nullable=False)
    category: Mapped[str | None] = mapped_column(String(120), nullable=True)
    pinned: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)

    user: Mapped['User'] = relationship(back_populates='notes')
    tags: Mapped[list['Tag']] = relationship(secondary=note_tags, back_populates='notes')

    @property
    def tag_names(self) -> list[str]:
        return [tag.name for tag in self.tags]
