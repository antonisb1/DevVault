import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button, message } from 'antd';
import { useState } from 'react';
import { Link } from 'react-router-dom';

import { projectsApi } from '../api/endpoints/projects';
import type { Project } from '../api/types';
import { TagBadges } from '../components/shared/tag-badges';
import { EmptyState } from '../components/ui/empty-state';
import { LoadingState } from '../components/ui/loading-state';
import { PageHeader } from '../components/ui/page-header';
import { SectionCard } from '../components/ui/section-card';
import { ProjectForm } from '../features/projects/components/project-form';
import { formatDate } from '../lib/format';

export function ProjectsPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Project | null>(null);
  const [search, setSearch] = useState('');
  const queryClient = useQueryClient();

  const params = new URLSearchParams();
  if (search) params.set('search', search);
  const { data, isLoading } = useQuery({ queryKey: ['projects', search], queryFn: () => projectsApi.list(params.toString() ? `?${params.toString()}` : '') });

  const saveMutation = useMutation({ mutationFn: async (payload: Record<string, unknown>) => editing ? projectsApi.update(editing.id, payload) : projectsApi.create(payload as never), onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['projects'] }); queryClient.invalidateQueries({ queryKey: ['dashboard'] }); message.success(editing ? 'Project updated' : 'Project created'); } });
  const deleteMutation = useMutation({ mutationFn: projectsApi.remove, onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['projects'] }); message.success('Project deleted'); } });

  return (
    <div className="grid gap-6">
      <PageHeader title="Projects" description="Manage your portfolio and personal build roadmap." action={<Button type="primary" onClick={() => { setEditing(null); setModalOpen(true); }}>New project</Button>} />
      <input className="w-full max-w-md rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3" placeholder="Search projects..." value={search} onChange={(event) => setSearch(event.target.value)} />
      {isLoading ? <LoadingState label="Loading projects..." /> : null}
      {!isLoading && !data?.items.length ? <EmptyState title="No projects yet" description="Track portfolio work, ideas, and execution status in one place." /> : null}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {data?.items.map((project) => (
          <SectionCard key={project.id} title={project.name} subtitle={project.status} action={<div className="flex gap-2"><Button size="small" onClick={() => { setEditing(project); setModalOpen(true); }}>Edit</Button><Button size="small" danger onClick={() => deleteMutation.mutate(project.id)}>Delete</Button></div>}>
            <p className="text-sm text-[var(--text-muted)]">{project.description || 'No description yet.'}</p>
            <div className="mt-4"><TagBadges tags={project.tag_names} /></div>
            <div className="mt-4 flex flex-wrap gap-2">{project.stack.map((item) => <span key={item} className="rounded-full border border-[var(--border)] px-3 py-1 text-xs">{item}</span>)}</div>
            <p className="mt-4 text-xs text-[var(--text-muted)]">Started {formatDate(project.start_date)}</p>
            <Link to={`/projects/${project.id}`} className="mt-4 inline-block text-sm font-medium text-[var(--brand)]">Open details →</Link>
          </SectionCard>
        ))}
      </div>
      <ProjectForm open={modalOpen} initialValues={editing} onClose={() => setModalOpen(false)} onSubmit={(values) => saveMutation.mutateAsync(values)} saving={saveMutation.isPending} />
    </div>
  );
}
