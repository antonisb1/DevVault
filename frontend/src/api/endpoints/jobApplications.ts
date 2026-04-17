import { apiClient } from '../client';
import type { JobApplication, PaginatedResponse } from '../types';

export const jobApplicationsApi = {
  list: (params = '') => apiClient.get<PaginatedResponse<JobApplication>>(`/job-applications${params}`),
  get: (id: string) => apiClient.get<JobApplication>(`/job-applications/${id}`),
  create: (payload: Partial<JobApplication> & { tag_names: string[] }) => apiClient.post<JobApplication>('/job-applications', payload),
  update: (id: string, payload: Partial<JobApplication> & { tag_names?: string[] }) => apiClient.patch<JobApplication>(`/job-applications/${id}`, payload),
  remove: (id: string) => apiClient.delete<{ message: string }>(`/job-applications/${id}`),
  kanban: () => apiClient.get<Record<string, JobApplication[]>>('/job-applications/kanban'),
};
