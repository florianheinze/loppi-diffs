import { API_BASE } from '@demo/shared';
import type { CreateTaskInput, Task, UpdateTaskInput } from '@demo/shared';

type Fetch = typeof fetch;

export function createApiClient(fetchFn: Fetch = (...args) => fetch(...args)) {
  async function request<T>(path: string, init?: RequestInit): Promise<T> {
    const res = await fetchFn(`${API_BASE}${path}`, {
      headers: { 'Content-Type': 'application/json' },
      ...init,
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.error ?? `Request failed with ${res.status}`);
    }
    return res.status === 204 ? (undefined as T) : res.json();
  }

  return {
    list: () => request<Task[]>('/tasks'),
    create: (input: CreateTaskInput) =>
      request<Task>('/tasks', { method: 'POST', body: JSON.stringify(input) }),
    update: (id: string, patch: UpdateTaskInput) =>
      request<Task>(`/tasks/${id}`, { method: 'PATCH', body: JSON.stringify(patch) }),
    remove: (id: string) => request<void>(`/tasks/${id}`, { method: 'DELETE' }),
  };
}

export const api = createApiClient();
