from datetime import date
from typing import TYPE_CHECKING

from sqlalchemy import Date, Enum, ForeignKey, Numeric, String, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base
from app.models.enums import BillingCycle, SubscriptionCategory
from app.models.mixins import TimestampMixin, UUIDPrimaryKeyMixin

if TYPE_CHECKING:
    from app.models.user import User


class Subscription(UUIDPrimaryKeyMixin, TimestampMixin, Base):
    __tablename__ = 'subscriptions'

    user_id: Mapped[UUID] = mapped_column(UUID(as_uuid=True), ForeignKey('users.id', ondelete='CASCADE'), nullable=False, index=True)
    service_name: Mapped[str] = mapped_column(String(255), nullable=False)
    category: Mapped[SubscriptionCategory] = mapped_column(Enum(SubscriptionCategory, name='subscription_category_enum'), nullable=False)
    amount: Mapped[float] = mapped_column(Numeric(10, 2), nullable=False)
    currency: Mapped[str] = mapped_column(String(10), nullable=False, default='EUR')
    billing_cycle: Mapped[BillingCycle] = mapped_column(Enum(BillingCycle, name='billing_cycle_enum'), nullable=False)
    renewal_date: Mapped[date | None] = mapped_column(Date, nullable=True)
    notes: Mapped[str | None] = mapped_column(Text, nullable=True)

    user: Mapped['User'] = relationship(back_populates='subscriptions')
