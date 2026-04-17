from uuid import UUID

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.api.deps import get_current_user, get_db
from app.models.user import User
from app.schemas.saved_link import SavedLinkCreate, SavedLinkRead, SavedLinkUpdate
from app.services.saved_link_service import create_saved_link, delete_saved_link, get_saved_link, list_saved_links, update_saved_link

router = APIRouter(prefix='/saved-links', tags=['saved-links'])


@router.get('')
def list_items(
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1, le=100),
    search: str | None = None,
    category: str | None = None,
    tag: str | None = None,
    favorite: bool | None = None,
    sort_by: str = 'updated_at',
    sort_order: str = 'desc',
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    data = list_saved_links(db, current_user, page, page_size, search, category, tag, favorite, sort_by, sort_order)
    data['items'] = [SavedLinkRead.model_validate(item) for item in data['items']]
    return data


@router.post('', response_model=SavedLinkRead)
def create_item(payload: SavedLinkCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return create_saved_link(db, current_user, payload)


@router.post('/quick-add', response_model=SavedLinkRead)
def quick_add(payload: SavedLinkCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return create_saved_link(db, current_user, payload)


@router.get('/{item_id}', response_model=SavedLinkRead)
def get_item(item_id: UUID, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return get_saved_link(db, current_user, item_id)


@router.patch('/{item_id}', response_model=SavedLinkRead)
def update_item(item_id: UUID, payload: SavedLinkUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return update_saved_link(db, current_user, item_id, payload)


@router.delete('/{item_id}')
def delete_item(item_id: UUID, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    delete_saved_link(db, current_user, item_id)
    return {'message': 'Saved link deleted successfully'}
