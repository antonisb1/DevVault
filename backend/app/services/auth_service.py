from __future__ import annotations

import hashlib
from datetime import datetime, timezone

from sqlalchemy.orm import Session

from app.core.exceptions import conflict, unauthorized
from app.core.security import create_access_token, create_refresh_token, decode_token, get_password_hash, verify_password
from app.models.refresh_token import RefreshToken
from app.models.user import User
from app.schemas.auth import RegisterRequest
from app.services.user_service import get_user_by_email, get_user_by_username



def _hash_token(token: str) -> str:
    return hashlib.sha256(token.encode('utf-8')).hexdigest()



def register_user(db: Session, payload: RegisterRequest) -> User:
    if get_user_by_email(db, payload.email):
        raise conflict('Email is already registered')
    if get_user_by_username(db, payload.username):
        raise conflict('Username is already taken')

    user = User(
        email=payload.email.lower(),
        username=payload.username.strip(),
        hashed_password=get_password_hash(payload.password),
        full_name=payload.full_name,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user



def authenticate_user(db: Session, email: str, password: str) -> User:
    user = get_user_by_email(db, email)
    if not user or not verify_password(password, user.hashed_password):
        raise unauthorized('Invalid email or password')
    return user



def issue_token_pair(db: Session, user: User) -> tuple[str, str]:
    access_token = create_access_token(str(user.id))
    refresh_token, expires_at = create_refresh_token(str(user.id))
    db_token = RefreshToken(user_id=user.id, token_hash=_hash_token(refresh_token), expires_at=expires_at)
    db.add(db_token)
    db.commit()
    return access_token, refresh_token



def revoke_refresh_token(db: Session, raw_token: str | None) -> None:
    if not raw_token:
        return
    token_hash = _hash_token(raw_token)
    db_token = db.query(RefreshToken).filter(RefreshToken.token_hash == token_hash).first()
    if db_token and db_token.revoked_at is None:
        db_token.revoked_at = datetime.now(timezone.utc)
        db.add(db_token)
        db.commit()



def rotate_refresh_token(db: Session, raw_token: str) -> tuple[User, str, str]:
    payload = decode_token(raw_token)
    if payload.get('type') != 'refresh':
        raise unauthorized('Invalid refresh token')

    token_hash = _hash_token(raw_token)
    db_token = db.query(RefreshToken).filter(RefreshToken.token_hash == token_hash).first()
    if not db_token or db_token.revoked_at is not None or db_token.expires_at < datetime.now(timezone.utc):
        raise unauthorized('Refresh token expired or revoked')

    user = db.query(User).filter(User.id == payload.get('sub')).first()
    if not user:
        raise unauthorized('User no longer exists')

    db_token.revoked_at = datetime.now(timezone.utc)
    db.add(db_token)
    db.commit()

    access_token, new_refresh_token = issue_token_pair(db, user)
    return user, access_token, new_refresh_token
