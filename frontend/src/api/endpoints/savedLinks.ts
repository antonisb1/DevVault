import { apiClient } from '../client';
import type { PaginatedResponse, SavedLink } from '../types';

export const savedLinksApi = {
  list: (params = '') => apiClient.get<PaginatedResponse<SavedLink>>(`/saved-links${params}`),
  get: (id: string) => apiClient.get<SavedLink>(`/saved-links/${id}`),
  create: (payload: Partial<SavedLink> & { tag_names: string[] }) => apiClient.post<SavedLink>('/saved-links', payload),
  update: (id: string, payload: Partial<SavedLink> & { tag_names?: string[] }) => apiClient.patch<SavedLink>(`/saved-links/${id}`, payload),
  remove: (id: string) => apiClient.delete<{ message: string }>(`/saved-links/${id}`),
  quickAdd: (payload: Partial<SavedLink> & { tag_names: string[] }) => apiClient.post<SavedLink>('/saved-links/quick-add', payload),
};
