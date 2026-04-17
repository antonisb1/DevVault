from enum import Enum


class WorkMode(str, Enum):
    remote = 'remote'
    hybrid = 'hybrid'
    onsite = 'onsite'


class JobApplicationStatus(str, Enum):
    saved = 'saved'
    applied = 'applied'
    interview = 'interview'
    technical = 'technical'
    offer = 'offer'
    rejected = 'rejected'


class ResourceType(str, Enum):
    video = 'video'
    article = 'article'
    docs = 'docs'
    course = 'course'
    repo = 'repo'


class ResourceCategory(str, Enum):
    azure = 'Azure'
    terraform = 'Terraform'
    react = 'React'
    typescript = 'TypeScript'
    tailwind = 'Tailwind'
    python = 'Python'
    devops = 'DevOps'
    interview_prep = 'Interview Prep'
    other = 'Other'


class ProgressStatus(str, Enum):
    not_started = 'not_started'
    in_progress = 'in_progress'
    completed = 'completed'


class ProjectStatus(str, Enum):
    planning = 'planning'
    active = 'active'
    paused = 'paused'
    completed = 'completed'


class SubscriptionCategory(str, Enum):
    cloud = 'cloud'
    domain = 'domain'
    saas = 'SaaS'
    hosting = 'hosting'
    tools = 'tools'
    learning = 'learning'


class BillingCycle(str, Enum):
    monthly = 'monthly'
    yearly = 'yearly'
