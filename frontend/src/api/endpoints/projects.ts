import { apiClient } from '../client';
import type { PaginatedResponse, Project } from '../types';

export const projectsApi = {
  list: (params = '') => apiClient.get<PaginatedResponse<Project>>(`/projects${params}`),
  get: (id: string) => apiClient.get<Project>(`/projects/${id}`),
  create: (payload: Partial<Project> & { tag_names: string[] }) => apiClient.post<Project>('/projects', payload),
  update: (id: string, payload: Partial<Project> & { tag_names?: string[] }) => apiClient.patch<Project>(`/projects/${id}`, payload),
  remove: (id: string) => apiClient.delete<{ message: string }>(`/projects/${id}`),
};
