from sqlalchemy.orm import Session

from app.core.exceptions import not_found
from app.models.job_application import JobApplication
from app.models.tag import Tag
from app.models.user import User
from app.schemas.job_application import JobApplicationCreate, JobApplicationUpdate
from app.services.tag_service import sync_tags
from app.utils.pagination import paginate_query



def _base_query(db: Session, user: User):
    return db.query(JobApplication).filter(JobApplication.user_id == user.id)



def list_job_applications(db: Session, user: User, page: int, page_size: int, search: str | None = None, status: str | None = None, work_mode: str | None = None, tag: str | None = None, sort_by: str = 'updated_at', sort_order: str = 'desc'):
    query = _base_query(db, user)
    if search:
        query = query.filter((JobApplication.company_name.ilike(f'%{search}%')) | (JobApplication.role_title.ilike(f'%{search}%')))
    if status:
        query = query.filter(JobApplication.status == status)
    if work_mode:
        query = query.filter(JobApplication.work_mode == work_mode)
    if tag:
        query = query.join(JobApplication.tags).filter(Tag.name.ilike(tag))

    sort_map = {
        'company_name': JobApplication.company_name,
        'role_title': JobApplication.role_title,
        'status': JobApplication.status,
        'follow_up_date': JobApplication.follow_up_date,
        'application_date': JobApplication.application_date,
        'updated_at': JobApplication.updated_at,
        'created_at': JobApplication.created_at,
    }
    sort_column = sort_map.get(sort_by, JobApplication.updated_at)
    query = query.order_by(sort_column.asc() if sort_order == 'asc' else sort_column.desc())
    return paginate_query(query, page, page_size)



def get_job_application(db: Session, user: User, item_id):
    item = _base_query(db, user).filter(JobApplication.id == item_id).first()
    if not item:
        raise not_found('Job application')
    return item



def create_job_application(db: Session, user: User, payload: JobApplicationCreate):
    data = payload.model_dump(exclude={'tag_names'})
    item = JobApplication(user_id=user.id, **data)
    item.tags = sync_tags(db, user, payload.tag_names)
    db.add(item)
    db.commit()
    db.refresh(item)
    return item



def update_job_application(db: Session, user: User, item_id, payload: JobApplicationUpdate):
    item = get_job_application(db, user, item_id)
    data = payload.model_dump(exclude_unset=True, exclude={'tag_names'})
    for field, value in data.items():
        setattr(item, field, value)
    if payload.tag_names is not None:
        item.tags = sync_tags(db, user, payload.tag_names)
    db.add(item)
    db.commit()
    db.refresh(item)
    return item



def delete_job_application(db: Session, user: User, item_id):
    item = get_job_application(db, user, item_id)
    db.delete(item)
    db.commit()



def get_job_kanban(db: Session, user: User):
    items = _base_query(db, user).order_by(JobApplication.updated_at.desc()).all()
    columns: dict[str, list[JobApplication]] = {}
    for item in items:
        columns.setdefault(item.status.value, []).append(item)
    return columns
