import { apiClient } from '../client';
import type { Note, PaginatedResponse } from '../types';

export const notesApi = {
  list: (params = '') => apiClient.get<PaginatedResponse<Note>>(`/notes${params}`),
  get: (id: string) => apiClient.get<Note>(`/notes/${id}`),
  create: (payload: Partial<Note> & { tag_names: string[] }) => apiClient.post<Note>('/notes', payload),
  update: (id: string, payload: Partial<Note> & { tag_names?: string[] }) => apiClient.patch<Note>(`/notes/${id}`, payload),
  remove: (id: string) => apiClient.delete<{ message: string }>(`/notes/${id}`),
  pin: (id: string) => apiClient.post<Note>(`/notes/${id}/pin`),
  unpin: (id: string) => apiClient.post<Note>(`/notes/${id}/unpin`),
};
