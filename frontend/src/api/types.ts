export type PaginatedResponse<T> = {
  items: T[];
  page: number;
  page_size: number;
  total: number;
  total_pages: number;
};

export type User = {
  id: string;
  email: string;
  username: string;
  full_name?: string | null;
  bio?: string | null;
  avatar_url?: string | null;
  timezone?: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type AuthResponse = {
  access_token: string;
  token_type: string;
  user: User;
};

export type JobApplication = {
  id: string;
  company_name: string;
  role_title: string;
  location?: string | null;
  work_mode: string;
  source?: string | null;
  status: string;
  application_date?: string | null;
  follow_up_date?: string | null;
  salary_range?: string | null;
  job_url?: string | null;
  notes?: string | null;
  tag_names: string[];
  created_at: string;
  updated_at: string;
};

export type LearningResource = {
  id: string;
  title: string;
  resource_type: string;
  url: string;
  category: string;
  progress_status: string;
  difficulty?: string | null;
  notes?: string | null;
  favorite: boolean;
  tag_names: string[];
  created_at: string;
  updated_at: string;
};

export type Project = {
  id: string;
  name: string;
  description?: string | null;
  stack: string[];
  github_url?: string | null;
  live_url?: string | null;
  status: string;
  start_date?: string | null;
  end_date?: string | null;
  notes?: string | null;
  tag_names: string[];
  created_at: string;
  updated_at: string;
};

export type Subscription = {
  id: string;
  service_name: string;
  category: string;
  amount: string;
  currency: string;
  billing_cycle: string;
  renewal_date?: string | null;
  notes?: string | null;
  created_at: string;
  updated_at: string;
};

export type Note = {
  id: string;
  title: string;
  content: string;
  category?: string | null;
  pinned: boolean;
  tag_names: string[];
  created_at: string;
  updated_at: string;
};

export type SavedLink = {
  id: string;
  title: string;
  url: string;
  description?: string | null;
  category?: string | null;
  favorite: boolean;
  tag_names: string[];
  created_at: string;
  updated_at: string;
};

export type DashboardResponse = {
  summary: {
    active_job_applications: number;
    upcoming_follow_ups: number;
    learning_resources_count: number;
    active_projects: number;
    completed_projects: number;
    monthly_subscription_total: string;
    notes_count: number;
    saved_links_count: number;
  };
  upcoming_follow_ups: Array<{
    id: string;
    company_name: string;
    role_title: string;
    follow_up_date?: string | null;
    status: string;
  }>;
  recent_notes: Array<{ id: string; title: string; subtitle?: string | null; updated_at: string; type: string }>;
  recent_links: Array<{ id: string; title: string; subtitle?: string | null; updated_at: string; type: string }>;
  recent_activity: Array<{ id: string; title: string; subtitle?: string | null; updated_at: string; type: string }>;
  charts: {
    job_status: Array<{ name: string; value: number }>;
    project_status: Array<{ name: string; value: number }>;
    subscription_breakdown: Array<{ name: string; value: number }>;
    learning_progress: Array<{ name: string; value: number }>;
  };
};
