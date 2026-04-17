import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';

import { projectsApi } from '../api/endpoints/projects';
import { TagBadges } from '../components/shared/tag-badges';
import { LoadingState } from '../components/ui/loading-state';
import { PageHeader } from '../components/ui/page-header';
import { SectionCard } from '../components/ui/section-card';
import { formatDate } from '../lib/format';

export function ProjectDetailPage() {
  const { id = '' } = useParams();
  const { data, isLoading } = useQuery({ queryKey: ['project', id], queryFn: () => projectsApi.get(id), enabled: Boolean(id) });
  if (isLoading || !data) return <LoadingState label="Loading project..." />;

  return (
    <div className="grid gap-6">
      <PageHeader title={data.name} description={data.description || 'Project detail view'} />
      <SectionCard title="Status overview">
        <div className="grid gap-4 md:grid-cols-3">
          <div><p className="text-sm text-[var(--text-muted)]">Status</p><p className="font-semibold">{data.status}</p></div>
          <div><p className="text-sm text-[var(--text-muted)]">Start date</p><p className="font-semibold">{formatDate(data.start_date)}</p></div>
          <div><p className="text-sm text-[var(--text-muted)]">End date</p><p className="font-semibold">{formatDate(data.end_date)}</p></div>
        </div>
      </SectionCard>
      <SectionCard title="Stack"><div className="flex flex-wrap gap-2">{data.stack.map((item) => <span key={item} className="rounded-full border border-[var(--border)] px-3 py-1 text-xs">{item}</span>)}</div></SectionCard>
      <SectionCard title="Tags"><TagBadges tags={data.tag_names} /></SectionCard>
      <SectionCard title="Notes"><div className="whitespace-pre-wrap text-sm leading-7">{data.notes || 'No notes yet.'}</div></SectionCard>
    </div>
  );
}
