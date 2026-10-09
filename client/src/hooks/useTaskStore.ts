import { useCallback, useEffect, useMemo, useState } from 'react';
import { filterTasks } from '@demo/shared';
import type { CreateTaskInput, Task, TaskFilters } from '@demo/shared';
import { api } from '../api/client';

export function useTaskStore() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filters, setFilters] = useState<TaskFilters>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .list()
      .then(setTasks)
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const visibleTasks = useMemo(() => filterTasks(tasks, filters), [tasks, filters]);

  const addTask = useCallback(async (input: CreateTaskInput) => {
    const created = await api.create(input);
    setTasks((prev) => [...prev, created]);
  }, []);

  const toggleDone = useCallback(async (task: Task) => {
    const updated = await api.update(task.id, { status: task.status === 'done' ? 'todo' : 'done' });
    setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
  }, []);

  const removeTask = useCallback(async (id: string) => {
    await api.remove(id);
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return { tasks, visibleTasks, filters, setFilters, loading, error, addTask, toggleDone, removeTask };
}
