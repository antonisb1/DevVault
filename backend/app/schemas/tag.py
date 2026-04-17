from datetime import datetime
from uuid import UUID

from pydantic import BaseModel

from app.schemas.common import ORMModel


class TagRead(ORMModel):
    id: UUID
    name: str
    created_at: datetime
