import { API_URL } from '../lib/constants';
import { authStore } from '../stores/auth-store';

class ApiError extends Error {
  status: number;
  details?: unknown;

  constructor(message: string, status: number, details?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.details = details;
  }
}

let refreshPromise: Promise<void> | null = null;

async function refreshSession() {
  const response = await fetch(`${API_URL}/auth/refresh`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
  });

  if (!response.ok) {
    authStore.clear();
    throw new ApiError('Session expired', response.status);
  }

  const data = await response.json();
  authStore.setSession({ accessToken: data.access_token, user: data.user });
}

async function request<T>(path: string, init: RequestInit = {}, retry = true): Promise<T> {
  const token = authStore.getState().accessToken;
  const headers = new Headers(init.headers || {});
  if (!headers.has('Content-Type') && init.body) {
    headers.set('Content-Type', 'application/json');
  }
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers,
    credentials: 'include',
  });

  if (response.status === 401 && retry) {
    refreshPromise = refreshPromise ?? refreshSession().finally(() => {
      refreshPromise = null;
    });
    await refreshPromise;
    return request<T>(path, init, false);
  }

  if (!response.ok) {
    let payload: unknown;
    try {
      payload = await response.json();
    } catch {
      payload = undefined;
    }
    const message = (payload as { error?: { message?: string } })?.error?.message ?? 'Something went wrong';
    throw new ApiError(message, response.status, payload);
  }

  if (response.status === 204) {
    return undefined as T;
  }
  return response.json() as Promise<T>;
}

export const apiClient = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body?: unknown) => request<T>(path, { method: 'POST', body: body ? JSON.stringify(body) : undefined }),
  patch: <T>(path: string, body?: unknown) => request<T>(path, { method: 'PATCH', body: body ? JSON.stringify(body) : undefined }),
  delete: <T>(path: string) => request<T>(path, { method: 'DELETE' }),
};

export { ApiError, refreshSession };
