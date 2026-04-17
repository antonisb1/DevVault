from sqlalchemy import Column, ForeignKey, Table
from sqlalchemy.dialects.postgresql import UUID

from app.db.base import Base

job_application_tags = Table(
    'job_application_tags',
    Base.metadata,
    Column('job_application_id', UUID(as_uuid=True), ForeignKey('job_applications.id', ondelete='CASCADE'), primary_key=True),
    Column('tag_id', UUID(as_uuid=True), ForeignKey('tags.id', ondelete='CASCADE'), primary_key=True),
)

learning_resource_tags = Table(
    'learning_resource_tags',
    Base.metadata,
    Column('learning_resource_id', UUID(as_uuid=True), ForeignKey('learning_resources.id', ondelete='CASCADE'), primary_key=True),
    Column('tag_id', UUID(as_uuid=True), ForeignKey('tags.id', ondelete='CASCADE'), primary_key=True),
)

project_tags = Table(
    'project_tags',
    Base.metadata,
    Column('project_id', UUID(as_uuid=True), ForeignKey('projects.id', ondelete='CASCADE'), primary_key=True),
    Column('tag_id', UUID(as_uuid=True), ForeignKey('tags.id', ondelete='CASCADE'), primary_key=True),
)

note_tags = Table(
    'note_tags',
    Base.metadata,
    Column('note_id', UUID(as_uuid=True), ForeignKey('notes.id', ondelete='CASCADE'), primary_key=True),
    Column('tag_id', UUID(as_uuid=True), ForeignKey('tags.id', ondelete='CASCADE'), primary_key=True),
)

saved_link_tags = Table(
    'saved_link_tags',
    Base.metadata,
    Column('saved_link_id', UUID(as_uuid=True), ForeignKey('saved_links.id', ondelete='CASCADE'), primary_key=True),
    Column('tag_id', UUID(as_uuid=True), ForeignKey('tags.id', ondelete='CASCADE'), primary_key=True),
)
