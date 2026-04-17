from datetime import date, timedelta
from decimal import Decimal

from sqlalchemy import func
from sqlalchemy.orm import Session

from app.models.job_application import JobApplication
from app.models.learning_resource import LearningResource
from app.models.note import Note
from app.models.project import Project
from app.models.saved_link import SavedLink
from app.models.subscription import Subscription
from app.models.user import User



def get_dashboard_data(db: Session, user: User) -> dict:
    today = date.today()
    follow_up_cutoff = today + timedelta(days=14)

    active_job_applications = db.query(JobApplication).filter(JobApplication.user_id == user.id, JobApplication.status.in_(['applied', 'interview', 'technical', 'offer'])).count()
    upcoming_follow_ups = db.query(JobApplication).filter(JobApplication.user_id == user.id, JobApplication.follow_up_date.isnot(None), JobApplication.follow_up_date >= today, JobApplication.follow_up_date <= follow_up_cutoff).count()
    learning_resources_count = db.query(LearningResource).filter(LearningResource.user_id == user.id).count()
    active_projects = db.query(Project).filter(Project.user_id == user.id, Project.status.in_(['planning', 'active', 'paused'])).count()
    completed_projects = db.query(Project).filter(Project.user_id == user.id, Project.status == 'completed').count()
    monthly_subscription_total = Decimal('0.00')
    for subscription in db.query(Subscription).filter(Subscription.user_id == user.id).all():
        amount = Decimal(subscription.amount)
        monthly_subscription_total += amount if subscription.billing_cycle.value == 'monthly' else amount / Decimal('12')
    notes_count = db.query(Note).filter(Note.user_id == user.id).count()
    saved_links_count = db.query(SavedLink).filter(SavedLink.user_id == user.id).count()

    follow_ups = db.query(JobApplication).filter(JobApplication.user_id == user.id, JobApplication.follow_up_date.isnot(None)).order_by(JobApplication.follow_up_date.asc()).limit(5).all()
    recent_notes = db.query(Note).filter(Note.user_id == user.id).order_by(Note.updated_at.desc()).limit(4).all()
    recent_links = db.query(SavedLink).filter(SavedLink.user_id == user.id).order_by(SavedLink.updated_at.desc()).limit(4).all()

    activity_items = []
    for item in db.query(JobApplication).filter(JobApplication.user_id == user.id).order_by(JobApplication.updated_at.desc()).limit(4).all():
        activity_items.append({'id': str(item.id), 'title': item.role_title, 'subtitle': item.company_name, 'updated_at': item.updated_at, 'type': 'job_application'})
    for item in db.query(Project).filter(Project.user_id == user.id).order_by(Project.updated_at.desc()).limit(4).all():
        activity_items.append({'id': str(item.id), 'title': item.name, 'subtitle': ', '.join(item.stack[:3]), 'updated_at': item.updated_at, 'type': 'project'})
    for item in db.query(Note).filter(Note.user_id == user.id).order_by(Note.updated_at.desc()).limit(4).all():
        activity_items.append({'id': str(item.id), 'title': item.title, 'subtitle': item.category, 'updated_at': item.updated_at, 'type': 'note'})
    activity_items.sort(key=lambda item: item['updated_at'], reverse=True)
    activity_items = activity_items[:8]

    job_status = [
        {'name': status, 'value': count}
        for status, count in db.query(JobApplication.status, func.count(JobApplication.id)).filter(JobApplication.user_id == user.id).group_by(JobApplication.status).all()
    ]
    project_status = [
        {'name': status, 'value': count}
        for status, count in db.query(Project.status, func.count(Project.id)).filter(Project.user_id == user.id).group_by(Project.status).all()
    ]
    subscription_breakdown = [
        {'name': category, 'value': float(total)}
        for category, total in db.query(Subscription.category, func.sum(Subscription.amount)).filter(Subscription.user_id == user.id).group_by(Subscription.category).all()
    ]
    learning_progress = [
        {'name': status, 'value': count}
        for status, count in db.query(LearningResource.progress_status, func.count(LearningResource.id)).filter(LearningResource.user_id == user.id).group_by(LearningResource.progress_status).all()
    ]

    return {
        'summary': {
            'active_job_applications': active_job_applications,
            'upcoming_follow_ups': upcoming_follow_ups,
            'learning_resources_count': learning_resources_count,
            'active_projects': active_projects,
            'completed_projects': completed_projects,
            'monthly_subscription_total': monthly_subscription_total.quantize(Decimal('0.01')),
            'notes_count': notes_count,
            'saved_links_count': saved_links_count,
        },
        'upcoming_follow_ups': [
            {
                'id': str(item.id),
                'company_name': item.company_name,
                'role_title': item.role_title,
                'follow_up_date': item.follow_up_date,
                'status': item.status,
            }
            for item in follow_ups
        ],
        'recent_notes': [
            {'id': str(item.id), 'title': item.title, 'subtitle': item.category, 'updated_at': item.updated_at, 'type': 'note'}
            for item in recent_notes
        ],
        'recent_links': [
            {'id': str(item.id), 'title': item.title, 'subtitle': item.category, 'updated_at': item.updated_at, 'type': 'saved_link'}
            for item in recent_links
        ],
        'recent_activity': activity_items,
        'charts': {
            'job_status': job_status,
            'project_status': project_status,
            'subscription_breakdown': subscription_breakdown,
            'learning_progress': learning_progress,
        },
    }
