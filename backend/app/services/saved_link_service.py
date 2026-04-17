from sqlalchemy.orm import Session

from app.core.exceptions import not_found
from app.models.saved_link import SavedLink
from app.models.tag import Tag
from app.models.user import User
from app.schemas.saved_link import SavedLinkCreate, SavedLinkUpdate
from app.services.tag_service import sync_tags
from app.utils.pagination import paginate_query



def _base_query(db: Session, user: User):
    return db.query(SavedLink).filter(SavedLink.user_id == user.id)



def list_saved_links(db: Session, user: User, page: int, page_size: int, search: str | None = None, category: str | None = None, tag: str | None = None, favorite: bool | None = None, sort_by: str = 'updated_at', sort_order: str = 'desc'):
    query = _base_query(db, user)
    if search:
        query = query.filter((SavedLink.title.ilike(f'%{search}%')) | (SavedLink.description.ilike(f'%{search}%')))
    if category:
        query = query.filter(SavedLink.category.ilike(category))
    if tag:
        query = query.join(SavedLink.tags).filter(Tag.name.ilike(tag))
    if favorite is not None:
        query = query.filter(SavedLink.favorite == favorite)
    sort_map = {
        'title': SavedLink.title,
        'updated_at': SavedLink.updated_at,
        'created_at': SavedLink.created_at,
    }
    sort_column = sort_map.get(sort_by, SavedLink.updated_at)
    query = query.order_by(sort_column.asc() if sort_order == 'asc' else sort_column.desc())
    return paginate_query(query, page, page_size)



def get_saved_link(db: Session, user: User, item_id):
    item = _base_query(db, user).filter(SavedLink.id == item_id).first()
    if not item:
        raise not_found('Saved link')
    return item



def create_saved_link(db: Session, user: User, payload: SavedLinkCreate):
    item = SavedLink(user_id=user.id, **payload.model_dump(exclude={'tag_names'}))
    item.tags = sync_tags(db, user, payload.tag_names)
    db.add(item)
    db.commit()
    db.refresh(item)
    return item



def update_saved_link(db: Session, user: User, item_id, payload: SavedLinkUpdate):
    item = get_saved_link(db, user, item_id)
    for field, value in payload.model_dump(exclude_unset=True, exclude={'tag_names'}).items():
        setattr(item, field, value)
    if payload.tag_names is not None:
        item.tags = sync_tags(db, user, payload.tag_names)
    db.add(item)
    db.commit()
    db.refresh(item)
    return item



def delete_saved_link(db: Session, user: User, item_id):
    item = get_saved_link(db, user, item_id)
    db.delete(item)
    db.commit()
