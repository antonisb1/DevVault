from fastapi import Depends, Request
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session

from app.core.exceptions import unauthorized
from app.core.security import decode_token, TokenError
from app.db.session import SessionLocal
from app.models.user import User


oauth2_scheme = OAuth2PasswordBearer(tokenUrl='/api/v1/auth/login')



def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()



def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)) -> User:
    try:
        payload = decode_token(token)
    except TokenError as exc:
        raise unauthorized('Invalid access token') from exc

    if payload.get('type') != 'access':
        raise unauthorized('Invalid access token')

    user = db.query(User).filter(User.id == payload.get('sub')).first()
    if not user:
        raise unauthorized('User not found')
    return user
