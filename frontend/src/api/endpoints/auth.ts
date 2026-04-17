import { apiClient } from '../client';
import type { AuthResponse, User } from '../types';

export const authApi = {
  register: (payload: { email: string; username: string; password: string; full_name?: string }) => apiClient.post<AuthResponse>('/auth/register', payload),
  login: (payload: { email: string; password: string }) => apiClient.post<AuthResponse>('/auth/login', payload),
  logout: () => apiClient.post<{ message: string }>('/auth/logout'),
  me: () => apiClient.get<User>('/auth/me'),
};
