import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button, Segmented, Table, message } from 'antd';
import type { TableColumnsType } from 'antd';
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

import { jobApplicationsApi } from '../api/endpoints/jobApplications';
import type { JobApplication } from '../api/types';
import { TagBadges } from '../components/shared/tag-badges';
import { EmptyState } from '../components/ui/empty-state';
import { LoadingState } from '../components/ui/loading-state';
import { PageHeader } from '../components/ui/page-header';
import { SectionCard } from '../components/ui/section-card';
import { JobApplicationForm } from '../features/job-applications/components/job-application-form';
import { formatDate } from '../lib/format';

export function JobApplicationsPage() {
  const [search, setSearch] = useState('');
  const [view, setView] = useState<'table' | 'kanban'>('table');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<JobApplication | null>(null);
  const queryClient = useQueryClient();

  const params = new URLSearchParams();
  if (search) params.set('search', search);

  const { data, isLoading } = useQuery({ queryKey: ['job-applications', search], queryFn: () => jobApplicationsApi.list(params.toString() ? `?${params.toString()}` : '') });
  const { data: kanbanData } = useQuery<Record<string, JobApplication[]>>({ queryKey: ['job-applications-kanban'], queryFn: jobApplicationsApi.kanban, enabled: view === 'kanban' });

  const saveMutation = useMutation({
    mutationFn: async (payload: Record<string, unknown>) => editing ? jobApplicationsApi.update(editing.id, payload) : jobApplicationsApi.create(payload as never),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['job-applications'] });
      queryClient.invalidateQueries({ queryKey: ['job-applications-kanban'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      message.success(editing ? 'Application updated' : 'Application created');
    },
    onError: (error) => message.error(error instanceof Error ? error.message : 'Could not save application'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => jobApplicationsApi.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['job-applications'] });
      queryClient.invalidateQueries({ queryKey: ['job-applications-kanban'] });
      message.success('Application deleted');
    },
  });

  const columns: TableColumnsType<JobApplication> = useMemo(() => [
    { title: 'Company', dataIndex: 'company_name', key: 'company_name', render: (_value, record) => <Link className="font-medium text-[var(--brand)]" to={`/job-applications/${record.id}`}>{record.company_name}</Link> },
    { title: 'Role', dataIndex: 'role_title', key: 'role_title' },
    { title: 'Status', dataIndex: 'status', key: 'status' },
    { title: 'Follow-up', dataIndex: 'follow_up_date', key: 'follow_up_date', render: (value) => formatDate(value) },
    { title: 'Tags', dataIndex: 'tag_names', key: 'tag_names', render: (value) => <TagBadges tags={value} /> },
    { title: 'Actions', key: 'actions', render: (_value, record) => <div className="flex gap-2"><Button size="small" onClick={() => { setEditing(record); setModalOpen(true); }}>Edit</Button><Button danger size="small" onClick={() => deleteMutation.mutate(record.id)}>Delete</Button></div> },
  ], [deleteMutation]);

  return (
    <div className="grid gap-6">
      <PageHeader
        title="Job Applications"
        description="Track your pipeline with list and kanban views."
        action={<Button type="primary" onClick={() => { setEditing(null); setModalOpen(true); }}>Add application</Button>}
      />
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <input className="w-full max-w-md rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3" placeholder="Search company or role..." value={search} onChange={(event) => setSearch(event.target.value)} />
        <Segmented value={view} onChange={(value) => setView(value as 'table' | 'kanban')} options={[{ label: 'Table', value: 'table' }, { label: 'Kanban', value: 'kanban' }]} />
      </div>
      {isLoading && view === 'table' ? <LoadingState label="Loading applications..." /> : null}
      {!isLoading && data?.items.length === 0 && view === 'table' ? <EmptyState title="No applications yet" description="Start tracking your outreach, follow-ups, and interview stages here." /> : null}
      {view === 'table' && data?.items.length ? (
        <SectionCard>
          <Table rowKey="id" dataSource={data.items} columns={columns} pagination={false} />
        </SectionCard>
      ) : null}
      {view === 'kanban' ? (
        <div className="grid gap-4 xl:grid-cols-3">
          {Object.entries(kanbanData || {}).map(([status, items]) => (
            <SectionCard key={status} title={status} className="min-h-64">
              <div className="space-y-3">
                {items.map((item) => (
                  <div key={item.id} className="rounded-2xl border border-[var(--border)] p-4">
                    <Link to={`/job-applications/${item.id}`} className="font-semibold text-[var(--brand)]">{item.role_title}</Link>
                    <p className="mt-1 text-sm text-[var(--text-muted)]">{item.company_name}</p>
                    <p className="mt-2 text-xs text-[var(--text-muted)]">Follow-up: {formatDate(item.follow_up_date)}</p>
                  </div>
                ))}
              </div>
            </SectionCard>
          ))}
        </div>
      ) : null}
      <JobApplicationForm open={modalOpen} initialValues={editing} onClose={() => setModalOpen(false)} onSubmit={async (values) => saveMutation.mutateAsync(values)} saving={saveMutation.isPending} />
    </div>
  );
}
