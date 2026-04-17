from sqlalchemy.orm import Session

from app.models.user import User
from app.schemas.user import UserProfileUpdate



def get_user_by_email(db: Session, email: str) -> User | None:
    return db.query(User).filter(User.email == email.lower()).first()



def get_user_by_username(db: Session, username: str) -> User | None:
    return db.query(User).filter(User.username == username).first()



def update_profile(db: Session, user: User, payload: UserProfileUpdate) -> User:
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(user, field, value)
    db.add(user)
    db.commit()
    db.refresh(user)
    return user
