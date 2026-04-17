import { apiClient } from '../client';
import type { LearningResource, PaginatedResponse } from '../types';

export const learningResourcesApi = {
  list: (params = '') => apiClient.get<PaginatedResponse<LearningResource>>(`/learning-resources${params}`),
  get: (id: string) => apiClient.get<LearningResource>(`/learning-resources/${id}`),
  create: (payload: Partial<LearningResource> & { tag_names: string[] }) => apiClient.post<LearningResource>('/learning-resources', payload),
  update: (id: string, payload: Partial<LearningResource> & { tag_names?: string[] }) => apiClient.patch<LearningResource>(`/learning-resources/${id}`, payload),
  remove: (id: string) => apiClient.delete<{ message: string }>(`/learning-resources/${id}`),
};
