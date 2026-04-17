from sqlalchemy.orm import Session

from app.core.exceptions import not_found
from app.models.project import Project
from app.models.tag import Tag
from app.models.user import User
from app.schemas.project import ProjectCreate, ProjectUpdate
from app.services.tag_service import sync_tags
from app.utils.pagination import paginate_query



def _base_query(db: Session, user: User):
    return db.query(Project).filter(Project.user_id == user.id)



def list_projects(db: Session, user: User, page: int, page_size: int, search: str | None = None, status: str | None = None, tag: str | None = None, sort_by: str = 'updated_at', sort_order: str = 'desc'):
    query = _base_query(db, user)
    if search:
        query = query.filter(Project.name.ilike(f'%{search}%'))
    if status:
        query = query.filter(Project.status == status)
    if tag:
        query = query.join(Project.tags).filter(Tag.name.ilike(tag))
    sort_map = {
        'name': Project.name,
        'status': Project.status,
        'start_date': Project.start_date,
        'updated_at': Project.updated_at,
    }
    sort_column = sort_map.get(sort_by, Project.updated_at)
    query = query.order_by(sort_column.asc() if sort_order == 'asc' else sort_column.desc())
    return paginate_query(query, page, page_size)



def get_project(db: Session, user: User, item_id):
    item = _base_query(db, user).filter(Project.id == item_id).first()
    if not item:
        raise not_found('Project')
    return item



def create_project(db: Session, user: User, payload: ProjectCreate):
    item = Project(user_id=user.id, **payload.model_dump(exclude={'tag_names'}))
    item.tags = sync_tags(db, user, payload.tag_names)
    db.add(item)
    db.commit()
    db.refresh(item)
    return item



def update_project(db: Session, user: User, item_id, payload: ProjectUpdate):
    item = get_project(db, user, item_id)
    for field, value in payload.model_dump(exclude_unset=True, exclude={'tag_names'}).items():
        setattr(item, field, value)
    if payload.tag_names is not None:
        item.tags = sync_tags(db, user, payload.tag_names)
    db.add(item)
    db.commit()
    db.refresh(item)
    return item



def delete_project(db: Session, user: User, item_id):
    item = get_project(db, user, item_id)
    db.delete(item)
    db.commit()
