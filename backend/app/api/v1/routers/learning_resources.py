from uuid import UUID

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.api.deps import get_current_user, get_db
from app.models.user import User
from app.schemas.learning_resource import LearningResourceCreate, LearningResourceRead, LearningResourceUpdate
from app.services.learning_resource_service import create_learning_resource, delete_learning_resource, get_learning_resource, list_learning_resources, update_learning_resource

router = APIRouter(prefix='/learning-resources', tags=['learning-resources'])


@router.get('')
def list_items(
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1, le=100),
    search: str | None = None,
    category: str | None = None,
    resource_type: str | None = None,
    progress_status: str | None = None,
    favorite: bool | None = None,
    tag: str | None = None,
    sort_by: str = 'updated_at',
    sort_order: str = 'desc',
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    data = list_learning_resources(db, current_user, page, page_size, search, category, resource_type, progress_status, favorite, tag, sort_by, sort_order)
    data['items'] = [LearningResourceRead.model_validate(item) for item in data['items']]
    return data


@router.post('', response_model=LearningResourceRead)
def create_item(payload: LearningResourceCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return create_learning_resource(db, current_user, payload)


@router.get('/{item_id}', response_model=LearningResourceRead)
def get_item(item_id: UUID, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return get_learning_resource(db, current_user, item_id)


@router.patch('/{item_id}', response_model=LearningResourceRead)
def update_item(item_id: UUID, payload: LearningResourceUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return update_learning_resource(db, current_user, item_id, payload)


@router.delete('/{item_id}')
def delete_item(item_id: UUID, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    delete_learning_resource(db, current_user, item_id)
    return {'message': 'Learning resource deleted successfully'}
