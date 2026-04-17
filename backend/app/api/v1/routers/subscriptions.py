from uuid import UUID

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.api.deps import get_current_user, get_db
from app.models.user import User
from app.schemas.subscription import SubscriptionCreate, SubscriptionRead, SubscriptionUpdate
from app.services.subscription_service import create_subscription, delete_subscription, get_subscription, get_subscription_summary, list_subscriptions, update_subscription

router = APIRouter(prefix='/subscriptions', tags=['subscriptions'])


@router.get('')
def list_items(
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1, le=100),
    search: str | None = None,
    category: str | None = None,
    billing_cycle: str | None = None,
    sort_by: str = 'renewal_date',
    sort_order: str = 'asc',
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    data = list_subscriptions(db, current_user, page, page_size, search, category, billing_cycle, sort_by, sort_order)
    data['items'] = [SubscriptionRead.model_validate(item) for item in data['items']]
    return data


@router.get('/summary')
def summary(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    result = get_subscription_summary(db, current_user)
    result['upcoming_renewals'] = [SubscriptionRead.model_validate(item) for item in result['upcoming_renewals']]
    return result


@router.post('', response_model=SubscriptionRead)
def create_item(payload: SubscriptionCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return create_subscription(db, current_user, payload)


@router.get('/{item_id}', response_model=SubscriptionRead)
def get_item(item_id: UUID, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return get_subscription(db, current_user, item_id)


@router.patch('/{item_id}', response_model=SubscriptionRead)
def update_item(item_id: UUID, payload: SubscriptionUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return update_subscription(db, current_user, item_id, payload)


@router.delete('/{item_id}')
def delete_item(item_id: UUID, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    delete_subscription(db, current_user, item_id)
    return {'message': 'Subscription deleted successfully'}
