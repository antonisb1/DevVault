from datetime import date, datetime
from decimal import Decimal
from uuid import UUID

from pydantic import BaseModel, Field

from app.models.enums import BillingCycle, SubscriptionCategory
from app.schemas.common import ORMModel


class SubscriptionBase(BaseModel):
    service_name: str = Field(min_length=1, max_length=255)
    category: SubscriptionCategory
    amount: Decimal
    currency: str = 'EUR'
    billing_cycle: BillingCycle
    renewal_date: date | None = None
    notes: str | None = None


class SubscriptionCreate(SubscriptionBase):
    pass


class SubscriptionUpdate(BaseModel):
    service_name: str | None = None
    category: SubscriptionCategory | None = None
    amount: Decimal | None = None
    currency: str | None = None
    billing_cycle: BillingCycle | None = None
    renewal_date: date | None = None
    notes: str | None = None


class SubscriptionRead(ORMModel):
    id: UUID
    service_name: str
    category: SubscriptionCategory
    amount: Decimal
    currency: str
    billing_cycle: BillingCycle
    renewal_date: date | None = None
    notes: str | None = None
    created_at: datetime
    updated_at: datetime
