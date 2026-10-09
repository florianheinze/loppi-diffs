import { act, renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { Task } from '@demo/shared';
import { api } from '../api/client';
import { useTaskStore } from './useTaskStore';

vi.mock('../api/client', () => ({
  api: { list: vi.fn(), create: vi.fn(), update: vi.fn(), remove: vi.fn() },
}));

const task: Task = {
  id: '1',
  title: 'A',
  status: 'todo',
  priority: 'medium',
  tags: [],
  createdAt: '2025-01-01T00:00:00.000Z',
};

describe('useTaskStore', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.mocked(api.list).mockResolvedValue([task]);
  });

  it('loads tasks on mount', async () => {
    const { result } = renderHook(() => useTaskStore());
    expect(result.current.loading).toBe(true);
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.tasks).toEqual([task]);
  });

  it('exposes load errors', async () => {
    vi.mocked(api.list).mockRejectedValue(new Error('boom'));
    const { result } = renderHook(() => useTaskStore());
    await waitFor(() => expect(result.current.error).toBe('boom'));
  });

  it('toggles a task to done', async () => {
    vi.mocked(api.update).mockResolvedValue({ ...task, status: 'done' });
    const { result } = renderHook(() => useTaskStore());
    await waitFor(() => expect(result.current.loading).toBe(false));
    await act(() => result.current.toggleDone(task));
    expect(result.current.tasks[0].status).toBe('done');
    expect(api.update).toHaveBeenCalledWith('1', { status: 'done' });
  });

  it('filters visible tasks', async () => {
    vi.mocked(api.list).mockResolvedValue([task, { ...task, id: '2', priority: 'high' }]);
    const { result } = renderHook(() => useTaskStore());
    await waitFor(() => expect(result.current.loading).toBe(false));
    act(() => result.current.setFilters({ priority: 'high' }));
    expect(result.current.visibleTasks.map((t) => t.id)).toEqual(['2']);
    expect(result.current.tasks).toHaveLength(2);
  });

  it('removes a task', async () => {
    vi.mocked(api.remove).mockResolvedValue(undefined);
    const { result } = renderHook(() => useTaskStore());
    await waitFor(() => expect(result.current.loading).toBe(false));
    await act(() => result.current.removeTask('1'));
    expect(result.current.tasks).toEqual([]);
  });
});
