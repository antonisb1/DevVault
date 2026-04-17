import { Button, Modal } from 'antd';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { JOB_STATUSES, WORK_MODES } from '../../../lib/constants';
import type { JobApplication } from '../../../api/types';

type FormValues = {
  company_name: string;
  role_title: string;
  location: string;
  work_mode: string;
  source: string;
  status: string;
  application_date: string;
  follow_up_date: string;
  salary_range: string;
  job_url: string;
  notes: string;
  tag_names: string;
};

const defaultValues: FormValues = {
  company_name: '',
  role_title: '',
  location: '',
  work_mode: 'remote',
  source: '',
  status: 'saved',
  application_date: '',
  follow_up_date: '',
  salary_range: '',
  job_url: '',
  notes: '',
  tag_names: '',
};

export function JobApplicationForm({ open, initialValues, onClose, onSubmit, saving }: { open: boolean; initialValues?: JobApplication | null; onClose: () => void; onSubmit: (values: Omit<FormValues, 'tag_names'> & { tag_names: string[] }) => Promise<unknown>; saving?: boolean; }) {
  const { register, handleSubmit, reset } = useForm<FormValues>({ defaultValues });

  useEffect(() => {
    if (!initialValues) {
      reset(defaultValues);
      return;
    }
    reset({
      company_name: initialValues.company_name,
      role_title: initialValues.role_title,
      location: initialValues.location ?? '',
      work_mode: initialValues.work_mode,
      source: initialValues.source ?? '',
      status: initialValues.status,
      application_date: initialValues.application_date ?? '',
      follow_up_date: initialValues.follow_up_date ?? '',
      salary_range: initialValues.salary_range ?? '',
      job_url: initialValues.job_url ?? '',
      notes: initialValues.notes ?? '',
      tag_names: initialValues.tag_names.join(', '),
    });
  }, [initialValues, reset]);

  return (
    <Modal open={open} onCancel={onClose} footer={null} title={initialValues ? 'Edit application' : 'New application'} destroyOnHidden>
      <form
        className="grid gap-4"
        onSubmit={handleSubmit(async (values) => {
          await onSubmit({
            ...values,
            tag_names: values.tag_names.split(',').map((item) => item.trim()).filter(Boolean),
          });
          onClose();
        })}
      >
        <div className="grid gap-4 md:grid-cols-2">
          <input className="rounded-2xl border border-[var(--border)] bg-transparent px-4 py-3" placeholder="Company" {...register('company_name', { required: true })} />
          <input className="rounded-2xl border border-[var(--border)] bg-transparent px-4 py-3" placeholder="Role title" {...register('role_title', { required: true })} />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <input className="rounded-2xl border border-[var(--border)] bg-transparent px-4 py-3" placeholder="Location" {...register('location')} />
          <select className="rounded-2xl border border-[var(--border)] bg-transparent px-4 py-3" {...register('work_mode')}>
            {WORK_MODES.map((item) => <option key={item}>{item}</option>)}
          </select>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <input className="rounded-2xl border border-[var(--border)] bg-transparent px-4 py-3" placeholder="Source" {...register('source')} />
          <select className="rounded-2xl border border-[var(--border)] bg-transparent px-4 py-3" {...register('status')}>
            {JOB_STATUSES.map((item) => <option key={item}>{item}</option>)}
          </select>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <input type="date" className="rounded-2xl border border-[var(--border)] bg-transparent px-4 py-3" {...register('application_date')} />
          <input type="date" className="rounded-2xl border border-[var(--border)] bg-transparent px-4 py-3" {...register('follow_up_date')} />
        </div>
        <input className="rounded-2xl border border-[var(--border)] bg-transparent px-4 py-3" placeholder="Salary range" {...register('salary_range')} />
        <input className="rounded-2xl border border-[var(--border)] bg-transparent px-4 py-3" placeholder="Job URL" {...register('job_url')} />
        <input className="rounded-2xl border border-[var(--border)] bg-transparent px-4 py-3" placeholder="Tags (comma separated)" {...register('tag_names')} />
        <textarea rows={4} className="rounded-2xl border border-[var(--border)] bg-transparent px-4 py-3" placeholder="Notes" {...register('notes')} />
        <div className="flex justify-end gap-3">
          <Button onClick={onClose}>Cancel</Button>
          <Button type="primary" htmlType="submit" loading={saving}>Save</Button>
        </div>
      </form>
    </Modal>
  );
}
