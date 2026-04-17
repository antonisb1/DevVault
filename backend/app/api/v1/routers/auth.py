from fastapi import APIRouter, Depends, Request, Response
from sqlalchemy.orm import Session

from app.api.deps import get_current_user, get_db
from app.core.config import settings
from app.core.exceptions import unauthorized
from app.models.user import User
from app.schemas.auth import LoginRequest, RegisterRequest, TokenResponse
from app.schemas.user import UserRead
from app.services.auth_service import authenticate_user, issue_token_pair, register_user, revoke_refresh_token, rotate_refresh_token

router = APIRouter(prefix='/auth', tags=['auth'])

COOKIE_NAME = 'refresh_token'



def _set_refresh_cookie(response: Response, refresh_token: str) -> None:
    response.set_cookie(
        key=COOKIE_NAME,
        value=refresh_token,
        httponly=True,
        secure=settings.COOKIE_SECURE,
        samesite='lax',
        max_age=settings.REFRESH_TOKEN_EXPIRE_DAYS * 24 * 60 * 60,
        path='/',
    )


@router.post('/register', response_model=TokenResponse)
def register(payload: RegisterRequest, response: Response, db: Session = Depends(get_db)):
    user = register_user(db, payload)
    access_token, refresh_token = issue_token_pair(db, user)
    _set_refresh_cookie(response, refresh_token)
    return TokenResponse(access_token=access_token, user=UserRead.model_validate(user))


@router.post('/login', response_model=TokenResponse)
def login(payload: LoginRequest, response: Response, db: Session = Depends(get_db)):
    user = authenticate_user(db, payload.email, payload.password)
    access_token, refresh_token = issue_token_pair(db, user)
    _set_refresh_cookie(response, refresh_token)
    return TokenResponse(access_token=access_token, user=UserRead.model_validate(user))


@router.post('/refresh', response_model=TokenResponse)
def refresh(request: Request, response: Response, db: Session = Depends(get_db)):
    raw_token = request.cookies.get(COOKIE_NAME)
    if not raw_token:
        raise unauthorized('Missing refresh token')
    user, access_token, new_refresh_token = rotate_refresh_token(db, raw_token)
    _set_refresh_cookie(response, new_refresh_token)
    return TokenResponse(access_token=access_token, user=UserRead.model_validate(user))


@router.post('/logout')
def logout(request: Request, response: Response, db: Session = Depends(get_db)):
    revoke_refresh_token(db, request.cookies.get(COOKIE_NAME))
    response.delete_cookie(COOKIE_NAME, path='/')
    return {'message': 'Logged out successfully'}


@router.get('/me', response_model=UserRead)
def me(current_user: User = Depends(get_current_user)):
    return current_user
