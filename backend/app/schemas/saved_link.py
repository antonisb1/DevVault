from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, Field

from app.schemas.common import ORMModel


class SavedLinkBase(BaseModel):
    title: str = Field(min_length=1, max_length=255)
    url: str
    description: str | None = None
    category: str | None = None
    favorite: bool = False
    tag_names: list[str] = Field(default_factory=list)


class SavedLinkCreate(SavedLinkBase):
    pass


class SavedLinkUpdate(BaseModel):
    title: str | None = None
    url: str | None = None
    description: str | None = None
    category: str | None = None
    favorite: bool | None = None
    tag_names: list[str] | None = None


class SavedLinkRead(ORMModel):
    id: UUID
    title: str
    url: str
    description: str | None = None
    category: str | None = None
    favorite: bool
    tag_names: list[str] = []
    created_at: datetime
    updated_at: datetime
