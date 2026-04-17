import { apiClient } from '../client';
import type { User } from '../types';

export const profileApi = {
  get: () => apiClient.get<User>('/users/profile'),
  update: (payload: Partial<User>) => apiClient.patch<User>('/users/profile', payload),
};
