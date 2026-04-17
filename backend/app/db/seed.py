from datetime import date, timedelta

from app.db.init_db import init_db
from app.db.session import SessionLocal
from app.models.enums import BillingCycle, JobApplicationStatus, ProgressStatus, ProjectStatus, ResourceCategory, ResourceType, SubscriptionCategory, WorkMode
from app.schemas.auth import RegisterRequest
from app.schemas.job_application import JobApplicationCreate
from app.schemas.learning_resource import LearningResourceCreate
from app.schemas.note import NoteCreate
from app.schemas.project import ProjectCreate
from app.schemas.saved_link import SavedLinkCreate
from app.schemas.subscription import SubscriptionCreate
from app.services.auth_service import register_user
from app.services.job_application_service import create_job_application
from app.services.learning_resource_service import create_learning_resource
from app.services.note_service import create_note
from app.services.project_service import create_project
from app.services.saved_link_service import create_saved_link
from app.services.subscription_service import create_subscription
from app.services.user_service import get_user_by_email


def seed() -> None:
    init_db()
    db = SessionLocal()
    try:
        user = get_user_by_email(db, 'demo@devvault.app')
        if not user:
            user = register_user(
                db,
                RegisterRequest(
                    email='demo@devvault.app',
                    username='devvaultdemo',
                    password='Password123!',
                    full_name='Dev Vault Demo',
                ),
            )

        if user.job_applications:
            return

        create_job_application(db, user, JobApplicationCreate(
            company_name='Contoso Cloud',
            role_title='Junior Cloud Engineer',
            location='Athens, Greece',
            work_mode=WorkMode.hybrid,
            source='LinkedIn',
            status=JobApplicationStatus.interview,
            application_date=date.today() - timedelta(days=5),
            follow_up_date=date.today() + timedelta(days=3),
            salary_range='€20k - €28k',
            job_url='https://example.com/jobs/contoso-cloud',
            notes='Need to review Azure networking and IAM.',
            tag_names=['azure', 'priority', 'follow-up'],
        ))
        create_job_application(db, user, JobApplicationCreate(
            company_name='Northwind Tech',
            role_title='Cloud Support Engineer',
            location='Remote',
            work_mode=WorkMode.remote,
            source='Company website',
            status=JobApplicationStatus.applied,
            application_date=date.today() - timedelta(days=2),
            follow_up_date=date.today() + timedelta(days=7),
            salary_range='€22k - €30k',
            notes='Strong match because of Terraform + Azure exposure.',
            tag_names=['terraform', 'remote'],
        ))

        create_learning_resource(db, user, LearningResourceCreate(
            title='Azure Well-Architected Framework',
            resource_type=ResourceType.docs,
            url='https://learn.microsoft.com/',
            category=ResourceCategory.azure,
            progress_status=ProgressStatus.in_progress,
            difficulty='Intermediate',
            notes='Focus on cost optimization and reliability pillars.',
            favorite=True,
            tag_names=['azure', 'architecture'],
        ))
        create_learning_resource(db, user, LearningResourceCreate(
            title='Terraform on Azure Bootcamp',
            resource_type=ResourceType.course,
            url='https://example.com/terraform-azure',
            category=ResourceCategory.terraform,
            progress_status=ProgressStatus.not_started,
            difficulty='Intermediate',
            tag_names=['terraform', 'iac'],
        ))

        create_project(db, user, ProjectCreate(
            name='DevVault',
            description='Personal developer OS for career growth and cost visibility.',
            stack=['React', 'Vite', 'TypeScript', 'Tailwind', 'FastAPI', 'PostgreSQL', 'Docker'],
            github_url='https://github.com/example/devvault',
            live_url='https://devvault.example.com',
            status=ProjectStatus.active,
            start_date=date.today() - timedelta(days=14),
            notes='Finish auth hardening and dashboard polish this week.',
            tag_names=['portfolio', 'saas', 'full-stack'],
        ))
        create_project(db, user, ProjectCreate(
            name='Azure Cost Pulse',
            description='Small tool for tracking personal cloud spend across sandboxes.',
            stack=['Python', 'FastAPI', 'Azure'],
            status=ProjectStatus.planning,
            start_date=date.today() + timedelta(days=7),
            tag_names=['azure', 'finance'],
        ))

        create_subscription(db, user, SubscriptionCreate(
            service_name='Azure Pay-As-You-Go',
            category=SubscriptionCategory.cloud,
            amount='18.50',
            currency='EUR',
            billing_cycle=BillingCycle.monthly,
            renewal_date=date.today() + timedelta(days=12),
            notes='Main sandbox for infra practice.',
        ))
        create_subscription(db, user, SubscriptionCreate(
            service_name='Namecheap Domain',
            category=SubscriptionCategory.domain,
            amount='14.00',
            currency='EUR',
            billing_cycle=BillingCycle.yearly,
            renewal_date=date.today() + timedelta(days=45),
            notes='Portfolio domain.',
        ))

        create_note(db, user, NoteCreate(
            title='Azure interview prep notes',
            content='## Review\n- VNets and peering\n- NSGs vs Azure Firewall\n- Managed identities\n',
            category='Interview Prep',
            pinned=True,
            tag_names=['azure', 'interview'],
        ))
        create_note(db, user, NoteCreate(
            title='Project monetization ideas',
            content='Offer DevVault as a freemium personal dashboard for junior engineers.',
            category='Product',
            tag_names=['product', 'ideas'],
        ))

        create_saved_link(db, user, SavedLinkCreate(
            title='Azure Architecture Center',
            url='https://learn.microsoft.com/azure/architecture/',
            description='Reference architectures and best practices.',
            category='Azure',
            favorite=True,
            tag_names=['azure', 'reference'],
        ))
        create_saved_link(db, user, SavedLinkCreate(
            title='Roadmap.sh DevOps',
            url='https://roadmap.sh/devops',
            description='Structured DevOps learning roadmap.',
            category='Learning',
            tag_names=['devops', 'career'],
        ))
    finally:
        db.close()


if __name__ == '__main__':
    seed()
