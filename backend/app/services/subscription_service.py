from datetime import date, timedelta
from decimal import Decimal

from sqlalchemy import func
from sqlalchemy.orm import Session

from app.core.exceptions import not_found
from app.models.subscription import Subscription
from app.models.user import User
from app.schemas.subscription import SubscriptionCreate, SubscriptionUpdate
from app.utils.pagination import paginate_query



def _base_query(db: Session, user: User):
    return db.query(Subscription).filter(Subscription.user_id == user.id)



def list_subscriptions(db: Session, user: User, page: int, page_size: int, search: str | None = None, category: str | None = None, billing_cycle: str | None = None, sort_by: str = 'renewal_date', sort_order: str = 'asc'):
    query = _base_query(db, user)
    if search:
        query = query.filter(Subscription.service_name.ilike(f'%{search}%'))
    if category:
        query = query.filter(Subscription.category == category)
    if billing_cycle:
        query = query.filter(Subscription.billing_cycle == billing_cycle)
    sort_map = {
        'service_name': Subscription.service_name,
        'amount': Subscription.amount,
        'renewal_date': Subscription.renewal_date,
        'updated_at': Subscription.updated_at,
    }
    sort_column = sort_map.get(sort_by, Subscription.renewal_date)
    query = query.order_by(sort_column.asc() if sort_order == 'asc' else sort_column.desc())
    return paginate_query(query, page, page_size)



def get_subscription(db: Session, user: User, item_id):
    item = _base_query(db, user).filter(Subscription.id == item_id).first()
    if not item:
        raise not_found('Subscription')
    return item



def create_subscription(db: Session, user: User, payload: SubscriptionCreate):
    item = Subscription(user_id=user.id, **payload.model_dump())
    db.add(item)
    db.commit()
    db.refresh(item)
    return item



def update_subscription(db: Session, user: User, item_id, payload: SubscriptionUpdate):
    item = get_subscription(db, user, item_id)
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(item, field, value)
    db.add(item)
    db.commit()
    db.refresh(item)
    return item



def delete_subscription(db: Session, user: User, item_id):
    item = get_subscription(db, user, item_id)
    db.delete(item)
    db.commit()



def get_subscription_summary(db: Session, user: User):
    items = _base_query(db, user).all()
    monthly_total = Decimal('0.00')
    yearly_estimate = Decimal('0.00')
    for item in items:
        amount = Decimal(item.amount)
        if item.billing_cycle.value == 'monthly':
            monthly_total += amount
            yearly_estimate += amount * Decimal('12')
        else:
            monthly_total += amount / Decimal('12')
            yearly_estimate += amount
    upcoming = _base_query(db, user).filter(Subscription.renewal_date.isnot(None), Subscription.renewal_date <= date.today() + timedelta(days=30)).order_by(Subscription.renewal_date.asc()).limit(5).all()
    breakdown = [
        {'name': category, 'value': float(total)}
        for category, total in db.query(Subscription.category, func.sum(Subscription.amount)).filter(Subscription.user_id == user.id).group_by(Subscription.category).all()
    ]
    return {
        'monthly_total': monthly_total.quantize(Decimal('0.01')),
        'yearly_estimate': yearly_estimate.quantize(Decimal('0.01')),
        'upcoming_renewals': upcoming,
        'category_breakdown': breakdown,
    }
