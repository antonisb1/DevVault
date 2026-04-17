import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';

import { jobApplicationsApi } from '../api/endpoints/jobApplications';
import { TagBadges } from '../components/shared/tag-badges';
import { LoadingState } from '../components/ui/loading-state';
import { PageHeader } from '../components/ui/page-header';
import { SectionCard } from '../components/ui/section-card';
import { formatDate } from '../lib/format';

export function JobApplicationDetailPage() {
  const { id = '' } = useParams();
  const { data, isLoading } = useQuery({ queryKey: ['job-application', id], queryFn: () => jobApplicationsApi.get(id), enabled: Boolean(id) });
  if (isLoading || !data) return <LoadingState label="Loading application..." />;

  return (
    <div className="grid gap-6">
      <PageHeader title={`${data.role_title} @ ${data.company_name}`} description="A detailed view of one application record." />
      <SectionCard title="Overview">
        <div className="grid gap-4 md:grid-cols-2">
          <div><p className="text-sm text-[var(--text-muted)]">Status</p><p className="font-semibold">{data.status}</p></div>
          <div><p className="text-sm text-[var(--text-muted)]">Work mode</p><p className="font-semibold">{data.work_mode}</p></div>
          <div><p className="text-sm text-[var(--text-muted)]">Application date</p><p className="font-semibold">{formatDate(data.application_date)}</p></div>
          <div><p className="text-sm text-[var(--text-muted)]">Follow-up date</p><p className="font-semibold">{formatDate(data.follow_up_date)}</p></div>
          <div><p className="text-sm text-[var(--text-muted)]">Location</p><p className="font-semibold">{data.location || '—'}</p></div>
          <div><p className="text-sm text-[var(--text-muted)]">Salary range</p><p className="font-semibold">{data.salary_range || '—'}</p></div>
        </div>
      </SectionCard>
      <SectionCard title="Tags"><TagBadges tags={data.tag_names} /></SectionCard>
      <SectionCard title="Notes"><div className="whitespace-pre-wrap text-sm leading-7">{data.notes || 'No notes yet.'}</div></SectionCard>
    </div>
  );
}
