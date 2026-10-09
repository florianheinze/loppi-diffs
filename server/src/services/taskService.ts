import type { CreateTaskInput, Task, UpdateTaskInput } from '@demo/shared';
import { TaskRepository } from '../repositories/taskRepository';
import { NotFoundError } from '../utils/errors';
import { generateId } from '../utils/id';

export class TaskService {
  constructor(private readonly repo: TaskRepository) {}

  list(): Task[] {
    return this.repo.findAll();
  }

  get(id: string): Task {
    const task = this.repo.findById(id);
    if (!task) throw new NotFoundError('Task', id);
    return task;
  }

  create(input: CreateTaskInput): Task {
    const task: Task = {
      id: generateId(),
      title: input.title.trim(),
      description: input.description,
      dueDate: input.dueDate,
      status: 'todo',
      createdAt: new Date().toISOString(),
    };
    return this.repo.save(task);
  }

  update(id: string, patch: UpdateTaskInput): Task {
    const existing = this.get(id);
    return this.repo.save({ ...existing, ...patch, id: existing.id });
  }

  remove(id: string): void {
    if (!this.repo.delete(id)) throw new NotFoundError('Task', id);
  }
}
