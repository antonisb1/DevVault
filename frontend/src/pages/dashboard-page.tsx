import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';

import { dashboardApi } from '../api/endpoints/dashboard';
import { BarChartCard } from '../components/charts/bar-chart-card';
import { PieChartCard } from '../components/charts/pie-chart-card';
import { LoadingState } from '../components/ui/loading-state';
import { PageHeader } from '../components/ui/page-header';
import { SectionCard } from '../components/ui/section-card';
import { StatCard } from '../components/ui/stat-card';
import { formatCurrency, formatDate, relativeTime } from '../lib/format';

export function DashboardPage() {
  const { data, isLoading } = useQuery({ queryKey: ['dashboard'], queryFn: dashboardApi.summary });

  if (isLoading || !data) return <LoadingState label="Loading dashboard..." />;

  return (
    <div className="grid gap-6">
      <PageHeader title="Dashboard" description="A clean overview of your job search, learning, projects, and recurring costs." />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Active job applications" value={data.summary.active_job_applications} />
        <StatCard label="Upcoming follow-ups" value={data.summary.upcoming_follow_ups} />
        <StatCard label="Monthly subscription total" value={formatCurrency(data.summary.monthly_subscription_total)} />
        <StatCard label="Active projects" value={data.summary.active_projects} hint={`${data.summary.completed_projects} completed`} />
      </div>
      <div className="grid gap-6 xl:grid-cols-2">
        <PieChartCard title="Job pipeline" data={data.charts.job_status} />
        <BarChartCard title="Learning progress" data={data.charts.learning_progress} />
      </div>
      <div className="grid gap-6 xl:grid-cols-3">
        <SectionCard title="Upcoming follow-ups" subtitle="Stay ahead of recruiter touchpoints.">
          <div className="space-y-3">
            {data.upcoming_follow_ups.map((item) => (
              <Link key={item.id} to={`/job-applications/${item.id}`} className="block rounded-2xl border border-[var(--border)] p-4 hover:bg-[var(--surface-muted)]">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h4 className="font-semibold">{item.role_title}</h4>
                    <p className="text-sm text-[var(--text-muted)]">{item.company_name}</p>
                  </div>
                  <span className="text-xs text-[var(--text-muted)]">{formatDate(item.follow_up_date)}</span>
                </div>
              </Link>
            ))}
          </div>
        </SectionCard>
        <SectionCard title="Recent notes" subtitle="Pick up your thinking quickly.">
          <div className="space-y-3">
            {data.recent_notes.map((item) => (
              <div key={item.id} className="rounded-2xl border border-[var(--border)] p-4">
                <h4 className="font-semibold">{item.title}</h4>
                <p className="mt-1 text-sm text-[var(--text-muted)]">{item.subtitle || 'General'}</p>
                <p className="mt-2 text-xs text-[var(--text-muted)]">Updated {relativeTime(item.updated_at)}</p>
              </div>
            ))}
          </div>
        </SectionCard>
        <SectionCard title="Recent activity" subtitle="See what changed most recently.">
          <div className="space-y-3">
            {data.recent_activity.map((item) => (
              <div key={`${item.type}-${item.id}`} className="rounded-2xl border border-[var(--border)] p-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h4 className="font-semibold">{item.title}</h4>
                    <p className="text-sm text-[var(--text-muted)]">{item.subtitle || item.type}</p>
                  </div>
                  <span className="text-xs text-[var(--text-muted)]">{relativeTime(item.updated_at)}</span>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
