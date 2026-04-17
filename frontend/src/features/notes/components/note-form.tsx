import { Button, Modal, Tabs } from 'antd';
import { useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import ReactMarkdown from 'react-markdown';

import type { Note } from '../../../api/types';

type FormValues = {
  title: string;
  content: string;
  category: string;
  pinned: boolean;
  tag_names: string;
};

const defaults: FormValues = { title: '', content: '', category: '', pinned: false, tag_names: '' };

export function NoteForm({ open, initialValues, onClose, onSubmit, saving }: { open: boolean; initialValues?: Note | null; onClose: () => void; onSubmit: (values: Omit<FormValues, 'tag_names'> & { tag_names: string[] }) => Promise<unknown>; saving?: boolean; }) {
  const { register, handleSubmit, reset, control } = useForm<FormValues>({ defaultValues: defaults });
  const content = useWatch({ control, name: 'content' });
  useEffect(() => {
    reset(initialValues ? { title: initialValues.title, content: initialValues.content, category: initialValues.category ?? '', pinned: initialValues.pinned, tag_names: initialValues.tag_names.join(', ') } : defaults);
  }, [initialValues, reset]);

  return (
    <Modal open={open} onCancel={onClose} footer={null} title={initialValues ? 'Edit note' : 'New note'} width={820} destroyOnHidden>
      <form className="grid gap-4" onSubmit={handleSubmit(async (values) => { await onSubmit({ ...values, tag_names: values.tag_names.split(',').map((item) => item.trim()).filter(Boolean) }); onClose(); })}>
        <input className="rounded-2xl border border-[var(--border)] bg-transparent px-4 py-3" placeholder="Title" {...register('title', { required: true })} />
        <div className="grid gap-4 md:grid-cols-3">
          <input className="rounded-2xl border border-[var(--border)] bg-transparent px-4 py-3 md:col-span-2" placeholder="Category" {...register('category')} />
          <label className="flex items-center gap-3 rounded-2xl border border-[var(--border)] px-4 py-3 text-sm"><input type="checkbox" {...register('pinned')} /> Pinned</label>
        </div>
        <input className="rounded-2xl border border-[var(--border)] bg-transparent px-4 py-3" placeholder="Tags (comma separated)" {...register('tag_names')} />
        <Tabs items={[
          { key: 'write', label: 'Write', children: <textarea rows={12} className="w-full rounded-2xl border border-[var(--border)] bg-transparent px-4 py-3" placeholder="Write markdown..." {...register('content', { required: true })} /> },
          { key: 'preview', label: 'Preview', children: <div className="prose max-w-none rounded-2xl border border-[var(--border)] p-4 dark:prose-invert"><ReactMarkdown>{content || 'Nothing to preview yet.'}</ReactMarkdown></div> },
        ]} />
        <div className="flex justify-end gap-3"><Button onClick={onClose}>Cancel</Button><Button type="primary" htmlType="submit" loading={saving}>Save</Button></div>
      </form>
    </Modal>
  );
}
