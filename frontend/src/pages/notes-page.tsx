import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button, message } from 'antd';
import ReactMarkdown from 'react-markdown';
import { useState } from 'react';

import { notesApi } from '../api/endpoints/notes';
import type { Note } from '../api/types';
import { TagBadges } from '../components/shared/tag-badges';
import { EmptyState } from '../components/ui/empty-state';
import { LoadingState } from '../components/ui/loading-state';
import { PageHeader } from '../components/ui/page-header';
import { SectionCard } from '../components/ui/section-card';
import { NoteForm } from '../features/notes/components/note-form';
import { relativeTime } from '../lib/format';

export function NotesPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Note | null>(null);
  const [search, setSearch] = useState('');
  const queryClient = useQueryClient();
  const params = new URLSearchParams();
  if (search) params.set('search', search);

  const { data, isLoading } = useQuery({ queryKey: ['notes', search], queryFn: () => notesApi.list(params.toString() ? `?${params.toString()}` : '') });
  const saveMutation = useMutation({ mutationFn: async (payload: Record<string, unknown>) => editing ? notesApi.update(editing.id, payload) : notesApi.create(payload as never), onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['notes'] }); queryClient.invalidateQueries({ queryKey: ['dashboard'] }); message.success(editing ? 'Note updated' : 'Note created'); } });
  const deleteMutation = useMutation({ mutationFn: notesApi.remove, onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['notes'] }); message.success('Note deleted'); } });

  return (
    <div className="grid gap-6">
      <PageHeader title="Notes" description="Capture technical notes, interview prep, and product thinking with markdown support." action={<Button type="primary" onClick={() => { setEditing(null); setModalOpen(true); }}>New note</Button>} />
      <input className="w-full max-w-md rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3" placeholder="Search notes..." value={search} onChange={(event) => setSearch(event.target.value)} />
      {isLoading ? <LoadingState label="Loading notes..." /> : null}
      {!isLoading && !data?.items.length ? <EmptyState title="No notes yet" description="Write markdown notes for interviews, architecture ideas, or project plans." /> : null}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {data?.items.map((note) => (
          <SectionCard key={note.id} title={note.title} subtitle={`${note.category || 'General'} • ${relativeTime(note.updated_at)}`} action={<div className="flex gap-2"><Button size="small" onClick={() => { setEditing(note); setModalOpen(true); }}>Edit</Button><Button size="small" danger onClick={() => deleteMutation.mutate(note.id)}>Delete</Button></div>}>
            <div className="prose prose-sm max-w-none dark:prose-invert"><ReactMarkdown>{note.content.slice(0, 300)}</ReactMarkdown></div>
            <div className="mt-4"><TagBadges tags={note.tag_names} /></div>
          </SectionCard>
        ))}
      </div>
      <NoteForm open={modalOpen} initialValues={editing} onClose={() => setModalOpen(false)} onSubmit={(values) => saveMutation.mutateAsync(values)} saving={saveMutation.isPending} />
    </div>
  );
}
