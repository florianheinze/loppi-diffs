import { useCallback, useEffect, useState } from 'react';
import type { CreateTaskInput, Task } from '@demo/shared';
import { api } from '../api/client';

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .list()
      .then(setTasks)
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

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

  return { tasks, loading, error, addTask, toggleDone, removeTask };
}
