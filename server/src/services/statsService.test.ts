import { beforeEach, describe, expect, it } from 'vitest';
import type { Task } from '@demo/shared';
import { TaskRepository } from '../repositories/taskRepository';
import { StatsService } from './statsService';

const make = (id: string, extra: Partial<Task> = {}): Task => ({
  id,
  title: id,
  status: 'todo',
  priority: 'medium',
  tags: [],
  createdAt: '2025-01-01T00:00:00.000Z',
  ...extra,
});

describe('StatsService', () => {
  let repo: TaskRepository;
  let stats: StatsService;
  const now = new Date('2025-06-15T00:00:00.000Z');

  beforeEach(() => {
    repo = new TaskRepository();
    stats = new StatsService(repo);
  });

  it('returns zeros for an empty repository', () => {
    expect(stats.compute(now)).toEqual({
      total: 0,
      byStatus: { todo: 0, doing: 0, done: 0 },
      byPriority: { low: 0, medium: 0, high: 0 },
      overdue: 0,
    });
  });

  it('counts by status and priority', () => {
    repo.save(make('a', { priority: 'high' }));
    repo.save(make('b', { status: 'done' }));
    repo.save(make('c', { status: 'doing', priority: 'low' }));
    const result = stats.compute(now);
    expect(result.byStatus).toEqual({ todo: 1, doing: 1, done: 1 });
    expect(result.byPriority).toEqual({ low: 1, medium: 1, high: 1 });
  });

  it('counts only unfinished tasks as overdue', () => {
    const past = '2025-06-01T00:00:00.000Z';
    repo.save(make('a', { dueDate: past }));
    repo.save(make('b', { dueDate: past, status: 'done' }));
    repo.save(make('c', { dueDate: '2025-07-01T00:00:00.000Z' }));
    expect(stats.compute(now).overdue).toBe(1);
  });
});
