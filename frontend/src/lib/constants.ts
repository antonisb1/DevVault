export const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000/api/v1';

export const JOB_STATUSES = ['saved', 'applied', 'interview', 'technical', 'offer', 'rejected'] as const;
export const WORK_MODES = ['remote', 'hybrid', 'onsite'] as const;
export const RESOURCE_TYPES = ['video', 'article', 'docs', 'course', 'repo'] as const;
export const RESOURCE_CATEGORIES = ['Azure', 'Terraform', 'React', 'TypeScript', 'Tailwind', 'Python', 'DevOps', 'Interview Prep', 'Other'] as const;
export const PROGRESS_STATUSES = ['not_started', 'in_progress', 'completed'] as const;
export const PROJECT_STATUSES = ['planning', 'active', 'paused', 'completed'] as const;
export const SUBSCRIPTION_CATEGORIES = ['cloud', 'domain', 'SaaS', 'hosting', 'tools', 'learning'] as const;
export const BILLING_CYCLES = ['monthly', 'yearly'] as const;
