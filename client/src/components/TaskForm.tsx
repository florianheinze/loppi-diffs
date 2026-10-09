import { useState } from 'react';
import type { CreateTaskInput } from '@demo/shared';
import { validateTask } from '../utils/validateTask';
import { Button } from './Button';

export function TaskForm({ onSubmit }: { onSubmit: (input: CreateTaskInput) => Promise<void> }) {
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [error, setError] = useState<string>();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const input: CreateTaskInput = {
      title,
      dueDate: dueDate ? new Date(dueDate).toISOString() : undefined,
    };
    const errors = validateTask(input);
    if (errors.title || errors.dueDate) return setError(errors.title ?? errors.dueDate);
    setError(undefined);
    await onSubmit(input);
    setTitle('');
    setDueDate('');
  }

  return (
    <form onSubmit={handleSubmit}>
      <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="New task" />
      <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
      <Button type="submit">Add</Button>
      {error && <p role="alert">{error}</p>}
    </form>
  );
}
