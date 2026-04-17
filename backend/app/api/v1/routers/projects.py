from uuid import UUID

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.api.deps import get_current_user, get_db
from app.models.user import User
from app.schemas.project import ProjectCreate, ProjectRead, ProjectUpdate
from app.services.project_service import create_project, delete_project, get_project, list_projects, update_project

router = APIRouter(prefix='/projects', tags=['projects'])


@router.get('')
def list_items(
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1, le=100),
    search: str | None = None,
    status: str | None = None,
    tag: str | None = None,
    sort_by: str = 'updated_at',
    sort_order: str = 'desc',
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    data = list_projects(db, current_user, page, page_size, search, status, tag, sort_by, sort_order)
    data['items'] = [ProjectRead.model_validate(item) for item in data['items']]
    return data


@router.post('', response_model=ProjectRead)
def create_item(payload: ProjectCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return create_project(db, current_user, payload)


@router.get('/{item_id}', response_model=ProjectRead)
def get_item(item_id: UUID, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return get_project(db, current_user, item_id)


@router.patch('/{item_id}', response_model=ProjectRead)
def update_item(item_id: UUID, payload: ProjectUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return update_project(db, current_user, item_id, payload)


@router.delete('/{item_id}')
def delete_item(item_id: UUID, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    delete_project(db, current_user, item_id)
    return {'message': 'Project deleted successfully'}
