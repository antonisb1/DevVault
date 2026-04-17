import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button, Table, message } from 'antd';
import { useState } from 'react';

import { subscriptionsApi } from '../api/endpoints/subscriptions';
import type { Subscription } from '../api/types';
import { PieChartCard } from '../components/charts/pie-chart-card';
import { EmptyState } from '../components/ui/empty-state';
import { LoadingState } from '../components/ui/loading-state';
import { PageHeader } from '../components/ui/page-header';
import { SectionCard } from '../components/ui/section-card';
import { StatCard } from '../components/ui/stat-card';
import { SubscriptionForm } from '../features/subscriptions/components/subscription-form';
import { formatCurrency, formatDate } from '../lib/format';

export function SubscriptionsPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Subscription | null>(null);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({ queryKey: ['subscriptions'], queryFn: () => subscriptionsApi.list() });
  const { data: summary } = useQuery({ queryKey: ['subscriptions-summary'], queryFn: subscriptionsApi.summary });

  const saveMutation = useMutation({ mutationFn: async (payload: Record<string, unknown>) => editing ? subscriptionsApi.update(editing.id, payload) : subscriptionsApi.create(payload), onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['subscriptions'] }); queryClient.invalidateQueries({ queryKey: ['subscriptions-summary'] }); queryClient.invalidateQueries({ queryKey: ['dashboard'] }); message.success(editing ? 'Subscription updated' : 'Subscription added'); } });
  const deleteMutation = useMutation({ mutationFn: subscriptionsApi.remove, onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['subscriptions'] }); queryClient.invalidateQueries({ queryKey: ['subscriptions-summary'] }); message.success('Subscription deleted'); } });

  return (
    <div className="grid gap-6">
      <PageHeader title="Subscriptions & Costs" description="Understand what your tools and cloud services cost you every month." action={<Button type="primary" onClick={() => { setEditing(null); setModalOpen(true); }}>Add subscription</Button>} />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Monthly total" value={formatCurrency(summary?.monthly_total || 0)} />
        <StatCard label="Yearly estimate" value={formatCurrency(summary?.yearly_estimate || 0)} />
        <StatCard label="Upcoming renewals" value={summary?.upcoming_renewals.length || 0} />
        <StatCard label="Tracked services" value={data?.total || 0} />
      </div>
      <div className="grid gap-6 xl:grid-cols-[1.3fr,0.7fr]">
        {isLoading ? <LoadingState label="Loading subscriptions..." /> : (
          <SectionCard>
            {!data?.items.length ? <EmptyState title="No subscriptions yet" description="Start with cloud, domains, SaaS, and learning tools you pay for." /> : (
              <Table rowKey="id" dataSource={data.items} pagination={false} columns={[
                { title: 'Service', dataIndex: 'service_name' },
                { title: 'Category', dataIndex: 'category' },
                { title: 'Amount', dataIndex: 'amount', render: (value: string, record: Subscription) => formatCurrency(value, record.currency) },
                { title: 'Renewal', dataIndex: 'renewal_date', render: (value: string) => formatDate(value) },
                { title: 'Actions', render: (_: unknown, record: Subscription) => <div className="flex gap-2"><Button size="small" onClick={() => { setEditing(record); setModalOpen(true); }}>Edit</Button><Button size="small" danger onClick={() => deleteMutation.mutate(record.id)}>Delete</Button></div> },
              ]} />
            )}
          </SectionCard>
        )}
        <PieChartCard title="Category breakdown" data={summary?.category_breakdown || []} />
      </div>
      <SubscriptionForm open={modalOpen} initialValues={editing} onClose={() => setModalOpen(false)} onSubmit={(values) => saveMutation.mutateAsync(values)} saving={saveMutation.isPending} />
    </div>
  );
}
