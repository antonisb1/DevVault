import { apiClient } from '../client';
import type { DashboardResponse } from '../types';

export const dashboardApi = {
  summary: () => apiClient.get<DashboardResponse>('/dashboard/summary'),
};
