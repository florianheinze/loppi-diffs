import { describe, expect, it } from 'vitest';
import { filterTasks } from './filterTasks';
import type { Task } from './types';

const t = (id: string, extra: Partial<Task> = {}): Task => ({
  id,
  title: `Task ${id}`,
  status: 'todo',
  priority: 'medium',
  tags: [],
  createdAt: '2025-01-01T00:00:00.000Z',
  ...extra,
});

const tasks = [
  t('a', { priority: 'high', tags: ['work'] }),
  t('b', { status: 'done', tags: ['home'] }),
  t('c', { description: 'Call the plumber', tags: ['home', 'urgent'] }),
];

describe('filterTasks', () => {
  it('returns everything without filters', () => {
    expect(filterTasks(tasks, {})).toHaveLength(3);
  });

  it('filters by status and priority', () => {
    expect(filterTasks(tasks, { status: 'done' }).map((x) => x.id)).toEqual(['b']);
    expect(filterTasks(tasks, { priority: 'high' }).map((x) => x.id)).toEqual(['a']);
  });

  it('filters by tag', () => {
    expect(filterTasks(tasks, { tag: 'home' }).map((x) => x.id)).toEqual(['b', 'c']);
  });

  it('searches title and description case-insensitively', () => {
    expect(filterTasks(tasks, { search: 'PLUMBER' }).map((x) => x.id)).toEqual(['c']);
    expect(filterTasks(tasks, { search: 'task a' }).map((x) => x.id)).toEqual(['a']);
  });

  it('combines filters', () => {
    expect(filterTasks(tasks, { tag: 'home', status: 'todo' }).map((x) => x.id)).toEqual(['c']);
  });
});
