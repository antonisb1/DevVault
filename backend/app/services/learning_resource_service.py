from sqlalchemy.orm import Session

from app.core.exceptions import not_found
from app.models.learning_resource import LearningResource
from app.models.tag import Tag
from app.models.user import User
from app.schemas.learning_resource import LearningResourceCreate, LearningResourceUpdate
from app.services.tag_service import sync_tags
from app.utils.pagination import paginate_query



def _base_query(db: Session, user: User):
    return db.query(LearningResource).filter(LearningResource.user_id == user.id)



def list_learning_resources(db: Session, user: User, page: int, page_size: int, search: str | None = None, category: str | None = None, resource_type: str | None = None, progress_status: str | None = None, favorite: bool | None = None, tag: str | None = None, sort_by: str = 'updated_at', sort_order: str = 'desc'):
    query = _base_query(db, user)
    if search:
        query = query.filter(LearningResource.title.ilike(f'%{search}%'))
    if category:
        query = query.filter(LearningResource.category == category)
    if resource_type:
        query = query.filter(LearningResource.resource_type == resource_type)
    if progress_status:
        query = query.filter(LearningResource.progress_status == progress_status)
    if favorite is not None:
        query = query.filter(LearningResource.favorite == favorite)
    if tag:
        query = query.join(LearningResource.tags).filter(Tag.name.ilike(tag))
    sort_map = {
        'title': LearningResource.title,
        'category': LearningResource.category,
        'progress_status': LearningResource.progress_status,
        'updated_at': LearningResource.updated_at,
        'created_at': LearningResource.created_at,
    }
    sort_column = sort_map.get(sort_by, LearningResource.updated_at)
    query = query.order_by(sort_column.asc() if sort_order == 'asc' else sort_column.desc())
    return paginate_query(query, page, page_size)



def get_learning_resource(db: Session, user: User, item_id):
    item = _base_query(db, user).filter(LearningResource.id == item_id).first()
    if not item:
        raise not_found('Learning resource')
    return item



def create_learning_resource(db: Session, user: User, payload: LearningResourceCreate):
    item = LearningResource(user_id=user.id, **payload.model_dump(exclude={'tag_names'}))
    item.tags = sync_tags(db, user, payload.tag_names)
    db.add(item)
    db.commit()
    db.refresh(item)
    return item



def update_learning_resource(db: Session, user: User, item_id, payload: LearningResourceUpdate):
    item = get_learning_resource(db, user, item_id)
    for field, value in payload.model_dump(exclude_unset=True, exclude={'tag_names'}).items():
        setattr(item, field, value)
    if payload.tag_names is not None:
        item.tags = sync_tags(db, user, payload.tag_names)
    db.add(item)
    db.commit()
    db.refresh(item)
    return item



def delete_learning_resource(db: Session, user: User, item_id):
    item = get_learning_resource(db, user, item_id)
    db.delete(item)
    db.commit()
