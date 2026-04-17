from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, Field

from app.models.enums import ProgressStatus, ResourceCategory, ResourceType
from app.schemas.common import ORMModel


class LearningResourceBase(BaseModel):
    title: str = Field(min_length=1, max_length=255)
    resource_type: ResourceType
    url: str
    category: ResourceCategory
    progress_status: ProgressStatus = ProgressStatus.not_started
    difficulty: str | None = None
    notes: str | None = None
    favorite: bool = False
    tag_names: list[str] = Field(default_factory=list)


class LearningResourceCreate(LearningResourceBase):
    pass


class LearningResourceUpdate(BaseModel):
    title: str | None = None
    resource_type: ResourceType | None = None
    url: str | None = None
    category: ResourceCategory | None = None
    progress_status: ProgressStatus | None = None
    difficulty: str | None = None
    notes: str | None = None
    favorite: bool | None = None
    tag_names: list[str] | None = None


class LearningResourceRead(ORMModel):
    id: UUID
    title: str
    resource_type: ResourceType
    url: str
    category: ResourceCategory
    progress_status: ProgressStatus
    difficulty: str | None = None
    notes: str | None = None
    favorite: bool
    tag_names: list[str] = []
    created_at: datetime
    updated_at: datetime
