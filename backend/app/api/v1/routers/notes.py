from uuid import UUID

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.api.deps import get_current_user, get_db
from app.models.user import User
from app.schemas.note import NoteCreate, NoteRead, NoteUpdate
from app.services.note_service import create_note, delete_note, get_note, list_notes, update_note

router = APIRouter(prefix='/notes', tags=['notes'])


@router.get('')
def list_items(
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1, le=100),
    search: str | None = None,
    category: str | None = None,
    tag: str | None = None,
    pinned: bool | None = None,
    sort_by: str = 'updated_at',
    sort_order: str = 'desc',
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    data = list_notes(db, current_user, page, page_size, search, category, tag, pinned, sort_by, sort_order)
    data['items'] = [NoteRead.model_validate(item) for item in data['items']]
    return data


@router.post('', response_model=NoteRead)
def create_item(payload: NoteCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return create_note(db, current_user, payload)


@router.get('/{item_id}', response_model=NoteRead)
def get_item(item_id: UUID, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return get_note(db, current_user, item_id)


@router.patch('/{item_id}', response_model=NoteRead)
def update_item(item_id: UUID, payload: NoteUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return update_note(db, current_user, item_id, payload)


@router.delete('/{item_id}')
def delete_item(item_id: UUID, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    delete_note(db, current_user, item_id)
    return {'message': 'Note deleted successfully'}


@router.post('/{item_id}/pin', response_model=NoteRead)
def pin_item(item_id: UUID, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return update_note(db, current_user, item_id, NoteUpdate(pinned=True))


@router.post('/{item_id}/unpin', response_model=NoteRead)
def unpin_item(item_id: UUID, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return update_note(db, current_user, item_id, NoteUpdate(pinned=False))
