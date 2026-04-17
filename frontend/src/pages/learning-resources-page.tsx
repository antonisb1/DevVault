import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button, Table, message } from 'antd';
import { useState } from 'react';

import { learningResourcesApi } from '../api/endpoints/learningResources';
import type { LearningResource } from '../api/types';
import { TagBadges } from '../components/shared/tag-badges';
import { LoadingState } from '../components/ui/loading-state';
import { EmptyState } from '../components/ui/empty-state';
import { PageHeader } from '../components/ui/page-header';
import { SectionCard } from '../components/ui/section-card';
import { LearningResourceForm } from '../features/learning-resources/components/learning-resource-form';

export function LearningResourcesPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<LearningResource | null>(null);
  const [search, setSearch] = useState('');
  const queryClient = useQueryClient();

  const params = new URLSearchParams();
  if (search) params.set('search', search);
  const { data, isLoading } = useQuery({ queryKey: ['learning-resources', search], queryFn: () => learningResourcesApi.list(params.toString() ? `?${params.toString()}` : '') });

  const saveMutation = useMutation({
    mutationFn: async (payload: Record<string, unknown>) => editing ? learningResourcesApi.update(editing.id, payload) : learningResourcesApi.create(payload as never),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['learning-resources'] }); queryClient.invalidateQueries({ queryKey: ['dashboard'] }); message.success(editing ? 'Resource updated' : 'Resource added'); },
  });
  const deleteMutation = useMutation({ mutationFn: learningResourcesApi.remove, onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['learning-resources'] }); message.success('Resource deleted'); } });

  return (
    <div className="grid gap-6">
      <PageHeader title="Learning Resources" description="Keep your technical learning organized and searchable." action={<Button type="primary" onClick={() => { setEditing(null); setModalOpen(true); }}>Add resource</Button>} />
      <input className="w-full max-w-md rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3" placeholder="Search resources..." value={search} onChange={(event) => setSearch(event.target.value)} />
      {isLoading ? <LoadingState label="Loading resources..." /> : null}
      {!isLoading && !data?.items.length ? <EmptyState title="No resources yet" description="Save courses, docs, videos, and repos you actually plan to use." /> : null}
      {data?.items.length ? (
        <SectionCard>
          <Table rowKey="id" dataSource={data.items} pagination={false} columns={[
            { title: 'Title', dataIndex: 'title' },
            { title: 'Category', dataIndex: 'category' },
            { title: 'Progress', dataIndex: 'progress_status' },
            { title: 'Favorite', dataIndex: 'favorite', render: (value: boolean) => value ? '★' : '—' },
            { title: 'Tags', dataIndex: 'tag_names', render: (tags: string[]) => <TagBadges tags={tags} /> },
            { title: 'Actions', render: (_: unknown, record: LearningResource) => <div className="flex gap-2"><Button size="small" onClick={() => { setEditing(record); setModalOpen(true); }}>Edit</Button><Button size="small" danger onClick={() => deleteMutation.mutate(record.id)}>Delete</Button></div> },
          ]} />
        </SectionCard>
      ) : null}
      <LearningResourceForm open={modalOpen} initialValues={editing} onClose={() => setModalOpen(false)} onSubmit={(values) => saveMutation.mutateAsync(values)} saving={saveMutation.isPending} />
    </div>
  );
}
