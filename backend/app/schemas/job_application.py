from datetime import date, datetime
from uuid import UUID

from pydantic import BaseModel, Field

from app.models.enums import JobApplicationStatus, WorkMode
from app.schemas.common import ORMModel


class JobApplicationBase(BaseModel):
    company_name: str = Field(min_length=1, max_length=255)
    role_title: str = Field(min_length=1, max_length=255)
    location: str | None = None
    work_mode: WorkMode = WorkMode.remote
    source: str | None = None
    status: JobApplicationStatus = JobApplicationStatus.saved
    application_date: date | None = None
    follow_up_date: date | None = None
    salary_range: str | None = None
    job_url: str | None = None
    notes: str | None = None
    tag_names: list[str] = Field(default_factory=list)


class JobApplicationCreate(JobApplicationBase):
    pass


class JobApplicationUpdate(BaseModel):
    company_name: str | None = None
    role_title: str | None = None
    location: str | None = None
    work_mode: WorkMode | None = None
    source: str | None = None
    status: JobApplicationStatus | None = None
    application_date: date | None = None
    follow_up_date: date | None = None
    salary_range: str | None = None
    job_url: str | None = None
    notes: str | None = None
    tag_names: list[str] | None = None


class JobApplicationRead(ORMModel):
    id: UUID
    company_name: str
    role_title: str
    location: str | None = None
    work_mode: WorkMode
    source: str | None = None
    status: JobApplicationStatus
    application_date: date | None = None
    follow_up_date: date | None = None
    salary_range: str | None = None
    job_url: str | None = None
    notes: str | None = None
    tag_names: list[str] = []
    created_at: datetime
    updated_at: datetime
