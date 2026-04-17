from uuid import UUID

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.deps import get_current_user, get_db
from app.core.exceptions import not_found
from app.models.tag import Tag
from app.models.user import User
from app.schemas.tag import TagRead

router = APIRouter(prefix='/tags', tags=['tags'])


@router.get('', response_model=list[TagRead])
def list_tags(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return db.query(Tag).filter(Tag.user_id == current_user.id).order_by(Tag.name.asc()).all()


@router.post('', response_model=TagRead)
def create_tag(payload: dict, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    tag = Tag(user_id=current_user.id, name=payload['name'].strip())
    db.add(tag)
    db.commit()
    db.refresh(tag)
    return tag


@router.patch('/{tag_id}', response_model=TagRead)
def update_tag(tag_id: UUID, payload: dict, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    tag = db.query(Tag).filter(Tag.id == tag_id, Tag.user_id == current_user.id).first()
    if not tag:
        raise not_found('Tag')
    tag.name = payload['name'].strip()
    db.add(tag)
    db.commit()
    db.refresh(tag)
    return tag


@router.delete('/{tag_id}')
def delete_tag(tag_id: UUID, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    tag = db.query(Tag).filter(Tag.id == tag_id, Tag.user_id == current_user.id).first()
    if not tag:
        raise not_found('Tag')
    db.delete(tag)
    db.commit()
    return {'message': 'Tag deleted successfully'}
