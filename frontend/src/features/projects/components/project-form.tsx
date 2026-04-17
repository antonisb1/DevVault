import { Button, Modal } from 'antd';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { PROJECT_STATUSES } from '../../../lib/constants';
import type { Project } from '../../../api/types';

type FormValues = {
  name: string;
  description: string;
  stack: string;
  github_url: string;
  live_url: string;
  status: string;
  start_date: string;
  end_date: string;
  notes: string;
  tag_names: string;
};

const defaults: FormValues = { name: '', description: '', stack: '', github_url: '', live_url: '', status: 'planning', start_date: '', end_date: '', notes: '', tag_names: '' };

export function ProjectForm({ open, initialValues, onClose, onSubmit, saving }: { open: boolean; initialValues?: Project | null; onClose: () => void; onSubmit: (values: Omit<FormValues, 'stack' | 'tag_names'> & { stack: string[]; tag_names: string[] }) => Promise<unknown>; saving?: boolean; }) {
  const { register, handleSubmit, reset } = useForm<FormValues>({ defaultValues: defaults });
  useEffect(() => {
    reset(initialValues ? {
      name: initialValues.name,
      description: initialValues.description ?? '',
      stack: initialValues.stack.join(', '),
      github_url: initialValues.github_url ?? '',
      live_url: initialValues.live_url ?? '',
      status: initialValues.status,
      start_date: initialValues.start_date ?? '',
      end_date: initialValues.end_date ?? '',
      notes: initialValues.notes ?? '',
      tag_names: initialValues.tag_names.join(', '),
    } : defaults);
  }, [initialValues, reset]);

  return (
    <Modal open={open} onCancel={onClose} footer={null} title={initialValues ? 'Edit project' : 'New project'} destroyOnHidden>
      <form className="grid gap-4" onSubmit={handleSubmit(async (values) => {
        await onSubmit({
          ...values,
          stack: values.stack.split(',').map((item) => item.trim()).filter(Boolean),
          tag_names: values.tag_names.split(',').map((item) => item.trim()).filter(Boolean),
        });
        onClose();
      })}>
        <input className="rounded-2xl border border-[var(--border)] bg-transparent px-4 py-3" placeholder="Project name" {...register('name', { required: true })} />
        <textarea rows={3} className="rounded-2xl border border-[var(--border)] bg-transparent px-4 py-3" placeholder="Description" {...register('description')} />
        <input className="rounded-2xl border border-[var(--border)] bg-transparent px-4 py-3" placeholder="Stack (comma separated)" {...register('stack')} />
        <div className="grid gap-4 md:grid-cols-2">
          <input className="rounded-2xl border border-[var(--border)] bg-transparent px-4 py-3" placeholder="GitHub URL" {...register('github_url')} />
          <input className="rounded-2xl border border-[var(--border)] bg-transparent px-4 py-3" placeholder="Live URL" {...register('live_url')} />
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <select className="rounded-2xl border border-[var(--border)] bg-transparent px-4 py-3" {...register('status')}>{PROJECT_STATUSES.map((item) => <option key={item}>{item}</option>)}</select>
          <input type="date" className="rounded-2xl border border-[var(--border)] bg-transparent px-4 py-3" {...register('start_date')} />
          <input type="date" className="rounded-2xl border border-[var(--border)] bg-transparent px-4 py-3" {...register('end_date')} />
        </div>
        <input className="rounded-2xl border border-[var(--border)] bg-transparent px-4 py-3" placeholder="Tags (comma separated)" {...register('tag_names')} />
        <textarea rows={4} className="rounded-2xl border border-[var(--border)] bg-transparent px-4 py-3" placeholder="Notes" {...register('notes')} />
        <div className="flex justify-end gap-3"><Button onClick={onClose}>Cancel</Button><Button type="primary" htmlType="submit" loading={saving}>Save</Button></div>
      </form>
    </Modal>
  );
}
