import { apiClient } from '../client';
import type { PaginatedResponse, Subscription } from '../types';

export type SubscriptionSummary = {
  monthly_total: string;
  yearly_estimate: string;
  upcoming_renewals: Subscription[];
  category_breakdown: Array<{ name: string; value: number }>;
};

export const subscriptionsApi = {
  list: (params = '') => apiClient.get<PaginatedResponse<Subscription>>(`/subscriptions${params}`),
  summary: () => apiClient.get<SubscriptionSummary>('/subscriptions/summary'),
  get: (id: string) => apiClient.get<Subscription>(`/subscriptions/${id}`),
  create: (payload: Partial<Subscription>) => apiClient.post<Subscription>('/subscriptions', payload),
  update: (id: string, payload: Partial<Subscription>) => apiClient.patch<Subscription>(`/subscriptions/${id}`, payload),
  remove: (id: string) => apiClient.delete<{ message: string }>(`/subscriptions/${id}`),
};
