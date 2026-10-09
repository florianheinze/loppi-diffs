import { beforeEach, describe, expect, it } from 'vitest';
import { TaskRepository } from '../repositories/taskRepository';
import { NotFoundError, ValidationError } from '../utils/errors';
import { TaskService } from './taskService';

describe('TaskService', () => {
  let service: TaskService;

  beforeEach(() => {
    service = new TaskService(new TaskRepository());
  });

  it('creates a task in todo status with a trimmed title', () => {
    const task = service.create({ title: '  Write docs  ' });
    expect(task.title).toBe('Write docs');
    expect(task.status).toBe('todo');
    expect(task.id).toBeTruthy();
  });

  it('defaults to medium priority and no tags', () => {
    const task = service.create({ title: 'A' });
    expect(task.priority).toBe('medium');
    expect(task.tags).toEqual([]);
  });

  it('deduplicates tags', () => {
    const task = service.create({ title: 'A', tags: ['x', 'x', 'y'] });
    expect(task.tags).toEqual(['x', 'y']);
  });

  it('rejects due dates in the past', () => {
    expect(() => service.create({ title: 'A', dueDate: '2000-01-01T00:00:00.000Z' })).toThrow(ValidationError);
  });

  it('gets a task by id', () => {
    const created = service.create({ title: 'A' });
    expect(service.get(created.id)).toEqual(created);
  });

  it('throws NotFoundError for unknown ids', () => {
    expect(() => service.get('missing')).toThrow(NotFoundError);
  });

  it('filters the list', () => {
    service.create({ title: 'Urgent', priority: 'high' });
    service.create({ title: 'Later', priority: 'low' });
    expect(service.list({ priority: 'high' }).map((t) => t.title)).toEqual(['Urgent']);
  });

  it('updates fields but keeps the id', () => {
    const created = service.create({ title: 'A' });
    const updated = service.update(created.id, { status: 'done', title: 'B' });
    expect(updated).toMatchObject({ id: created.id, status: 'done', title: 'B' });
  });

  it('removes a task', () => {
    const created = service.create({ title: 'A' });
    service.remove(created.id);
    expect(service.list()).toHaveLength(0);
  });

  it('throws when removing a missing task', () => {
    expect(() => service.remove('missing')).toThrow(NotFoundError);
  });
});
