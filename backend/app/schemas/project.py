from datetime import date, datetime
from uuid import UUID

from pydantic import BaseModel, Field

from app.models.enums import ProjectStatus
from app.schemas.common import ORMModel


class ProjectBase(BaseModel):
    name: str = Field(min_length=1, max_length=255)
    description: str | None = None
    stack: list[str] = Field(default_factory=list)
    github_url: str | None = None
    live_url: str | None = None
    status: ProjectStatus = ProjectStatus.planning
    start_date: date | None = None
    end_date: date | None = None
    notes: str | None = None
    tag_names: list[str] = Field(default_factory=list)


class ProjectCreate(ProjectBase):
    pass


class ProjectUpdate(BaseModel):
    name: str | None = None
    description: str | None = None
    stack: list[str] | None = None
    github_url: str | None = None
    live_url: str | None = None
    status: ProjectStatus | None = None
    start_date: date | None = None
    end_date: date | None = None
    notes: str | None = None
    tag_names: list[str] | None = None


class ProjectRead(ORMModel):
    id: UUID
    name: str
    description: str | None = None
    stack: list[str] = []
    github_url: str | None = None
    live_url: str | None = None
    status: ProjectStatus
    start_date: date | None = None
    end_date: date | None = None
    notes: str | None = None
    tag_names: list[str] = []
    created_at: datetime
    updated_at: datetime
