from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.deps import get_current_user, get_db
from app.models.user import User
from app.schemas.user import UserProfileUpdate, UserRead
from app.services.user_service import update_profile

router = APIRouter(prefix='/users', tags=['users'])


@router.get('/profile', response_model=UserRead)
def get_profile(current_user: User = Depends(get_current_user)):
    return current_user


@router.patch('/profile', response_model=UserRead)
def patch_profile(payload: UserProfileUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return update_profile(db, current_user, payload)
