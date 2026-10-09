import { render, screen, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { Task } from '@demo/shared';
import { TaskBoard } from './TaskBoard';

const t = (id: string, status: Task['status']): Task => ({
  id,
  title: `Task ${id}`,
  status,
  createdAt: '2025-01-01T00:00:00.000Z',
});

describe('TaskBoard', () => {
  it('groups tasks into status columns with counts', () => {
    render(
      <TaskBoard
        tasks={[t('1', 'todo'), t('2', 'todo'), t('3', 'done')]}
        onToggle={vi.fn()}
        onDelete={vi.fn()}
      />,
    );
    expect(screen.getByRole('heading', { name: 'To do (2)' })).toBeTruthy();
    expect(screen.getByRole('heading', { name: 'In progress (0)' })).toBeTruthy();
    const done = screen.getByRole('region', { name: 'Done' });
    expect(within(done).getByText('Task 3')).toBeTruthy();
  });

  it('shows an empty message for empty columns', () => {
    render(<TaskBoard tasks={[]} onToggle={vi.fn()} onDelete={vi.fn()} />);
    expect(screen.getAllByText('No tasks yet.')).toHaveLength(3);
  });
});
