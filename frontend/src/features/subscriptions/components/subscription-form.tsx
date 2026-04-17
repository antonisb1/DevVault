import { Button, Modal } from 'antd';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { BILLING_CYCLES, SUBSCRIPTION_CATEGORIES } from '../../../lib/constants';
import type { Subscription } from '../../../api/types';

type FormValues = {
  service_name: string;
  category: string;
  amount: string;
  currency: string;
  billing_cycle: string;
  renewal_date: string;
  notes: string;
};

const defaults: FormValues = { service_name: '', category: 'cloud', amount: '', currency: 'EUR', billing_cycle: 'monthly', renewal_date: '', notes: '' };

export function SubscriptionForm({ open, initialValues, onClose, onSubmit, saving }: { open: boolean; initialValues?: Subscription | null; onClose: () => void; onSubmit: (values: FormValues) => Promise<unknown>; saving?: boolean; }) {
  const { register, handleSubmit, reset } = useForm<FormValues>({ defaultValues: defaults });
  useEffect(() => {
    reset(initialValues ? {
      service_name: initialValues.service_name,
      category: initialValues.category,
      amount: String(initialValues.amount),
      currency: initialValues.currency,
      billing_cycle: initialValues.billing_cycle,
      renewal_date: initialValues.renewal_date ?? '',
      notes: initialValues.notes ?? '',
    } : defaults);
  }, [initialValues, reset]);

  return (
    <Modal open={open} onCancel={onClose} footer={null} title={initialValues ? 'Edit subscription' : 'Add subscription'} destroyOnHidden>
      <form className="grid gap-4" onSubmit={handleSubmit(async (values) => { await onSubmit(values); onClose(); })}>
        <input className="rounded-2xl border border-[var(--border)] bg-transparent px-4 py-3" placeholder="Service name" {...register('service_name', { required: true })} />
        <div className="grid gap-4 md:grid-cols-2">
          <select className="rounded-2xl border border-[var(--border)] bg-transparent px-4 py-3" {...register('category')}>{SUBSCRIPTION_CATEGORIES.map((item) => <option key={item}>{item}</option>)}</select>
          <select className="rounded-2xl border border-[var(--border)] bg-transparent px-4 py-3" {...register('billing_cycle')}>{BILLING_CYCLES.map((item) => <option key={item}>{item}</option>)}</select>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <input type="number" step="0.01" className="rounded-2xl border border-[var(--border)] bg-transparent px-4 py-3" placeholder="Amount" {...register('amount', { required: true })} />
          <input className="rounded-2xl border border-[var(--border)] bg-transparent px-4 py-3" placeholder="Currency" {...register('currency')} />
        </div>
        <input type="date" className="rounded-2xl border border-[var(--border)] bg-transparent px-4 py-3" {...register('renewal_date')} />
        <textarea rows={4} className="rounded-2xl border border-[var(--border)] bg-transparent px-4 py-3" placeholder="Notes" {...register('notes')} />
        <div className="flex justify-end gap-3"><Button onClick={onClose}>Cancel</Button><Button type="primary" htmlType="submit" loading={saving}>Save</Button></div>
      </form>
    </Modal>
  );
}
