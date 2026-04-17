from app.db.base import Base
from app.db.session import engine
from app.models import associations, job_application, learning_resource, note, project, refresh_token, saved_link, subscription, tag, user  # noqa


def init_db() -> None:
    Base.metadata.create_all(bind=engine)
