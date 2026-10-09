import { describe, expect, it } from 'vitest';
import type { Task } from '@demo/shared';
import { sortTasks } from './sortTasks';

const t = (id: string, extra: Partial<Task> = {}): Task => ({
  id,
  title: id,
  status: 'todo',
  createdAt: '2025-01-01T00:00:00.000Z',
  ...extra,
});

describe('sortTasks', () => {
  it('puts in-progress before todo before done', () => {
    const sorted = sortTasks([t('a', { status: 'done' }), t('b'), t('c', { status: 'in_progress' })]);
    expect(sorted.map((x) => x.id)).toEqual(['c', 'b', 'a']);
  });

  it('sorts by due date within a status, dated first', () => {
    const sorted = sortTasks([
      t('a'),
      t('b', { dueDate: '2025-03-01T00:00:00.000Z' }),
      t('c', { dueDate: '2025-02-01T00:00:00.000Z' }),
    ]);
    expect(sorted.map((x) => x.id)).toEqual(['c', 'b', 'a']);
  });

  it('does not mutate the input', () => {
    const input = [t('a', { status: 'done' }), t('b')];
    sortTasks(input);
    expect(input[0].id).toBe('a');
  });
});
