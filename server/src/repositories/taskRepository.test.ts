import { beforeEach, describe, expect, it } from 'vitest';
import type { Task } from '@demo/shared';
import { TaskRepository } from './taskRepository';

const makeTask = (id: string): Task => ({
  id,
  title: `Task ${id}`,
  status: 'todo',
  createdAt: '2025-01-01T00:00:00.000Z',
});

describe('TaskRepository', () => {
  let repo: TaskRepository;

  beforeEach(() => {
    repo = new TaskRepository();
  });

  it('saves and finds a task', () => {
    repo.save(makeTask('a'));
    expect(repo.findById('a')?.title).toBe('Task a');
  });

  it('returns undefined for unknown ids', () => {
    expect(repo.findById('nope')).toBeUndefined();
  });

  it('lists all tasks', () => {
    repo.save(makeTask('a'));
    repo.save(makeTask('b'));
    expect(repo.findAll()).toHaveLength(2);
  });

  it('deletes tasks and reports whether anything was removed', () => {
    repo.save(makeTask('a'));
    expect(repo.delete('a')).toBe(true);
    expect(repo.delete('a')).toBe(false);
  });

  it('clears everything', () => {
    repo.save(makeTask('a'));
    repo.clear();
    expect(repo.findAll()).toEqual([]);
  });
});
