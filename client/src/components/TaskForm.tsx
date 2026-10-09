import { useState } from 'react';
import { PRIORITIES } from '@demo/shared';
import type { CreateTaskInput, Priority } from '@demo/shared';
import { validateTask } from '../utils/validateTask';
import { Button } from './Button';

export function TaskForm({ onSubmit }: { onSubmit: (input: CreateTaskInput) => Promise<void> }) {
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [dueDate, setDueDate] = useState('');
  const [error, setError] = useState<string>();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const input: CreateTaskInput = {
      title,
      priority,
      dueDate: dueDate ? new Date(dueDate).toISOString() : undefined,
    };
    const errors = validateTask(input);
    const firstError = errors.title ?? errors.dueDate;
    if (firstError) return setError(firstError);
    setError(undefined);
    await onSubmit(input);
    setTitle('');
    setDueDate('');
  }

  return (
    <form onSubmit={handleSubmit}>
      <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="New task" />
      <select value={priority} onChange={(e) => setPriority(e.target.value as Priority)} aria-label="Priority">
        {PRIORITIES.map((p) => (
          <option key={p} value={p}>
            {p}
          </option>
        ))}
      </select>
      <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
      <Button type="submit">Add</Button>
      {error && <p role="alert">{error}</p>}
    </form>
  );
}
