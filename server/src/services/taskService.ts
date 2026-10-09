import { filterTasks, isBeforeToday } from '@demo/shared';
import type { CreateTaskInput, Task, TaskFilters, UpdateTaskInput } from '@demo/shared';
import { TaskRepository } from '../repositories/taskRepository';
import { NotFoundError, ValidationError } from '../utils/errors';
import { generateId } from '../utils/ids';

function assertDueDateNotPast(dueDate?: string) {
  if (dueDate && isBeforeToday(dueDate)) throw new ValidationError('dueDate must not be in the past');
}

export class TaskService {
  constructor(private readonly repo: TaskRepository) {}

  list(filters: TaskFilters = {}): Task[] {
    return filterTasks(this.repo.findAll(), filters);
  }

  get(id: string): Task {
    const task = this.repo.findById(id);
    if (!task) throw new NotFoundError('Task', id);
    return task;
  }

  create(input: CreateTaskInput): Task {
    assertDueDateNotPast(input.dueDate);
    const task: Task = {
      id: generateId(),
      title: input.title.trim(),
      description: input.description,
      dueDate: input.dueDate,
      status: 'todo',
      priority: input.priority ?? 'medium',
      tags: [...new Set(input.tags ?? [])],
      createdAt: new Date().toISOString(),
    };
    return this.repo.save(task);
  }

  update(id: string, patch: UpdateTaskInput): Task {
    assertDueDateNotPast(patch.dueDate);
    const existing = this.get(id);
    return this.repo.save({ ...existing, ...patch, id: existing.id });
  }

  remove(id: string): void {
    if (!this.repo.delete(id)) throw new NotFoundError('Task', id);
  }
}
