import { Button, Modal } from 'antd';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { PROGRESS_STATUSES, RESOURCE_CATEGORIES, RESOURCE_TYPES } from '../../../lib/constants';
import type { LearningResource } from '../../../api/types';

type FormValues = {
  title: string;
  resource_type: string;
  url: string;
  category: string;
  progress_status: string;
  difficulty: string;
  notes: string;
  favorite: boolean;
  tag_names: string;
};

const defaults: FormValues = { title: '', resource_type: 'article', url: '', category: 'Azure', progress_status: 'not_started', difficulty: '', notes: '', favorite: false, tag_names: '' };

export function LearningResourceForm({ open, initialValues, onClose, onSubmit, saving }: { open: boolean; initialValues?: LearningResource | null; onClose: () => void; onSubmit: (values: Omit<FormValues, 'tag_names'> & { tag_names: string[] }) => Promise<unknown>; saving?: boolean; }) {
  const { register, handleSubmit, reset } = useForm<FormValues>({ defaultValues: defaults });
  useEffect(() => {
    reset(initialValues ? {
      title: initialValues.title,
      resource_type: initialValues.resource_type,
      url: initialValues.url,
      category: initialValues.category,
      progress_status: initialValues.progress_status,
      difficulty: initialValues.difficulty ?? '',
      notes: initialValues.notes ?? '',
      favorite: initialValues.favorite,
      tag_names: initialValues.tag_names.join(', '),
    } : defaults);
  }, [initialValues, reset]);

  return (
    <Modal open={open} onCancel={onClose} footer={null} title={initialValues ? 'Edit resource' : 'Add resource'} destroyOnHidden>
      <form className="grid gap-4" onSubmit={handleSubmit(async (values) => {
        await onSubmit({ ...values, tag_names: values.tag_names.split(',').map((tag) => tag.trim()).filter(Boolean) });
        onClose();
      })}>
        <input className="rounded-2xl border border-[var(--border)] bg-transparent px-4 py-3" placeholder="Title" {...register('title', { required: true })} />
        <div className="grid gap-4 md:grid-cols-2">
          <select className="rounded-2xl border border-[var(--border)] bg-transparent px-4 py-3" {...register('resource_type')}>{RESOURCE_TYPES.map((item) => <option key={item}>{item}</option>)}</select>
          <select className="rounded-2xl border border-[var(--border)] bg-transparent px-4 py-3" {...register('category')}>{RESOURCE_CATEGORIES.map((item) => <option key={item}>{item}</option>)}</select>
        </div>
        <input className="rounded-2xl border border-[var(--border)] bg-transparent px-4 py-3" placeholder="URL" {...register('url', { required: true })} />
        <div className="grid gap-4 md:grid-cols-2">
          <select className="rounded-2xl border border-[var(--border)] bg-transparent px-4 py-3" {...register('progress_status')}>{PROGRESS_STATUSES.map((item) => <option key={item}>{item}</option>)}</select>
          <input className="rounded-2xl border border-[var(--border)] bg-transparent px-4 py-3" placeholder="Difficulty" {...register('difficulty')} />
        </div>
        <label className="flex items-center gap-3 text-sm">
          <input type="checkbox" {...register('favorite')} /> Favorite
        </label>
        <input className="rounded-2xl border border-[var(--border)] bg-transparent px-4 py-3" placeholder="Tags (comma separated)" {...register('tag_names')} />
        <textarea rows={4} className="rounded-2xl border border-[var(--border)] bg-transparent px-4 py-3" placeholder="Notes" {...register('notes')} />
        <div className="flex justify-end gap-3"><Button onClick={onClose}>Cancel</Button><Button type="primary" htmlType="submit" loading={saving}>Save</Button></div>
      </form>
    </Modal>
  );
}
