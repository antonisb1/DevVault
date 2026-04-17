from sqlalchemy.orm import Session

from app.core.exceptions import not_found
from app.models.note import Note
from app.models.tag import Tag
from app.models.user import User
from app.schemas.note import NoteCreate, NoteUpdate
from app.services.tag_service import sync_tags
from app.utils.pagination import paginate_query



def _base_query(db: Session, user: User):
    return db.query(Note).filter(Note.user_id == user.id)



def list_notes(db: Session, user: User, page: int, page_size: int, search: str | None = None, category: str | None = None, tag: str | None = None, pinned: bool | None = None, sort_by: str = 'updated_at', sort_order: str = 'desc'):
    query = _base_query(db, user)
    if search:
        query = query.filter((Note.title.ilike(f'%{search}%')) | (Note.content.ilike(f'%{search}%')))
    if category:
        query = query.filter(Note.category.ilike(category))
    if tag:
        query = query.join(Note.tags).filter(Tag.name.ilike(tag))
    if pinned is not None:
        query = query.filter(Note.pinned == pinned)
    sort_map = {
        'title': Note.title,
        'updated_at': Note.updated_at,
        'created_at': Note.created_at,
    }
    sort_column = sort_map.get(sort_by, Note.updated_at)
    query = query.order_by(Note.pinned.desc(), sort_column.asc() if sort_order == 'asc' else sort_column.desc())
    return paginate_query(query, page, page_size)



def get_note(db: Session, user: User, item_id):
    item = _base_query(db, user).filter(Note.id == item_id).first()
    if not item:
        raise not_found('Note')
    return item



def create_note(db: Session, user: User, payload: NoteCreate):
    item = Note(user_id=user.id, **payload.model_dump(exclude={'tag_names'}))
    item.tags = sync_tags(db, user, payload.tag_names)
    db.add(item)
    db.commit()
    db.refresh(item)
    return item



def update_note(db: Session, user: User, item_id, payload: NoteUpdate):
    item = get_note(db, user, item_id)
    for field, value in payload.model_dump(exclude_unset=True, exclude={'tag_names'}).items():
        setattr(item, field, value)
    if payload.tag_names is not None:
        item.tags = sync_tags(db, user, payload.tag_names)
    db.add(item)
    db.commit()
    db.refresh(item)
    return item



def delete_note(db: Session, user: User, item_id):
    item = get_note(db, user, item_id)
    db.delete(item)
    db.commit()
