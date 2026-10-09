import { describe, expect, it } from 'vitest';
import type { Task } from '@demo/shared';
import { sortTasks } from './sortTasks';

const t = (id: string, extra: Partial<Task> = {}): Task => ({
  id,
  title: id,
  status: 'todo',
  priority: 'medium',
  tags: [],
  createdAt: '2025-01-01T00:00:00.000Z',
  ...extra,
});

describe('sortTasks', () => {
  it('puts doing before todo before done', () => {
    const sorted = sortTasks([t('a', { status: 'done' }), t('b'), t('c', { status: 'doing' })]);
    expect(sorted.map((x) => x.id)).toEqual(['c', 'b', 'a']);
  });

  it('sorts higher priority first within a status', () => {
    const sorted = sortTasks([t('a', { priority: 'low' }), t('b', { priority: 'high' }), t('c')]);
    expect(sorted.map((x) => x.id)).toEqual(['b', 'c', 'a']);
  });

  it('sorts by due date within the same priority, dated first', () => {
    const sorted = sortTasks([
      t('a'),
      t('b', { dueDate: '2025-03-01T00:00:00.000Z' }),
      t('c', { dueDate: '2025-02-01T00:00:00.000Z' }),
    ]);
    expect(sorted.map((x) => x.id)).toEqual(['c', 'b', 'a']);
  });

  it('keeps creation order for otherwise equal tasks', () => {
    const sorted = sortTasks([
      t('late', { createdAt: '2025-02-01T00:00:00.000Z' }),
      t('early', { createdAt: '2025-01-01T00:00:00.000Z' }),
    ]);
    expect(sorted.map((x) => x.id)).toEqual(['early', 'late']);
  });

  it('does not mutate the input', () => {
    const input = [t('a', { status: 'done' }), t('b')];
    sortTasks(input);
    expect(input[0].id).toBe('a');
  });
});
