from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, Field

from app.schemas.common import ORMModel


class NoteBase(BaseModel):
    title: str = Field(min_length=1, max_length=255)
    content: str = Field(min_length=1)
    category: str | None = None
    pinned: bool = False
    tag_names: list[str] = Field(default_factory=list)


class NoteCreate(NoteBase):
    pass


class NoteUpdate(BaseModel):
    title: str | None = None
    content: str | None = None
    category: str | None = None
    pinned: bool | None = None
    tag_names: list[str] | None = None


class NoteRead(ORMModel):
    id: UUID
    title: str
    content: str
    category: str | None = None
    pinned: bool
    tag_names: list[str] = []
    created_at: datetime
    updated_at: datetime
