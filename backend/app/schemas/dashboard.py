from datetime import date, datetime
from decimal import Decimal

from pydantic import BaseModel

from app.models.enums import JobApplicationStatus, ProjectStatus


class DashboardSummary(BaseModel):
    active_job_applications: int
    upcoming_follow_ups: int
    learning_resources_count: int
    active_projects: int
    completed_projects: int
    monthly_subscription_total: Decimal
    notes_count: int
    saved_links_count: int


class DashboardRecentItem(BaseModel):
    id: str
    title: str
    subtitle: str | None = None
    updated_at: datetime
    type: str


class DashboardFollowUpItem(BaseModel):
    id: str
    company_name: str
    role_title: str
    follow_up_date: date | None = None
    status: JobApplicationStatus


class DashboardCharts(BaseModel):
    job_status: list[dict]
    project_status: list[dict]
    subscription_breakdown: list[dict]
    learning_progress: list[dict]


class DashboardResponse(BaseModel):
    summary: DashboardSummary
    upcoming_follow_ups: list[DashboardFollowUpItem]
    recent_notes: list[DashboardRecentItem]
    recent_links: list[DashboardRecentItem]
    recent_activity: list[DashboardRecentItem]
    charts: DashboardCharts
