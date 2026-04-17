from sqlalchemy.orm import Session

from app.models.tag import Tag
from app.models.user import User



def normalize_tag_names(tag_names: list[str]) -> list[str]:
    normalized = []
    seen = set()
    for name in tag_names:
        cleaned = ' '.join(name.strip().split())
        if cleaned and cleaned.lower() not in seen:
            normalized.append(cleaned)
            seen.add(cleaned.lower())
    return normalized



def sync_tags(db: Session, user: User, tag_names: list[str]) -> list[Tag]:
    normalized = normalize_tag_names(tag_names)
    if not normalized:
        return []

    existing = db.query(Tag).filter(Tag.user_id == user.id, Tag.name.in_(normalized)).all()
    by_name = {tag.name.lower(): tag for tag in existing}
    tags: list[Tag] = []

    for name in normalized:
        tag = by_name.get(name.lower())
        if not tag:
            tag = Tag(user_id=user.id, name=name)
            db.add(tag)
            db.flush()
        tags.append(tag)

    return tags
