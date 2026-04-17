from uuid import UUID

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.api.deps import get_current_user, get_db
from app.models.user import User
from app.schemas.job_application import JobApplicationCreate, JobApplicationRead, JobApplicationUpdate
from app.services.job_application_service import create_job_application, delete_job_application, get_job_application, get_job_kanban, list_job_applications, update_job_application

router = APIRouter(prefix='/job-applications', tags=['job-applications'])


@router.get('')
def list_items(
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1, le=100),
    search: str | None = None,
    status: str | None = None,
    work_mode: str | None = None,
    tag: str | None = None,
    sort_by: str = 'updated_at',
    sort_order: str = 'desc',
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    data = list_job_applications(db, current_user, page, page_size, search, status, work_mode, tag, sort_by, sort_order)
    data['items'] = [JobApplicationRead.model_validate(item) for item in data['items']]
    return data


@router.get('/kanban')
def kanban(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return {key: [JobApplicationRead.model_validate(item) for item in value] for key, value in get_job_kanban(db, current_user).items()}


@router.post('', response_model=JobApplicationRead)
def create_item(payload: JobApplicationCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return create_job_application(db, current_user, payload)


@router.get('/{item_id}', response_model=JobApplicationRead)
def get_item(item_id: UUID, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return get_job_application(db, current_user, item_id)


@router.patch('/{item_id}', response_model=JobApplicationRead)
def update_item(item_id: UUID, payload: JobApplicationUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return update_job_application(db, current_user, item_id, payload)


@router.delete('/{item_id}')
def delete_item(item_id: UUID, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    delete_job_application(db, current_user, item_id)
    return {'message': 'Job application deleted successfully'}
