import { PRIORITIES, STATUSES } from '@demo/shared';
import type { Priority, Status } from '@demo/shared';
import { TaskRepository } from '../repositories/taskRepository';

export interface TaskStats {
  total: number;
  byStatus: Record<Status, number>;
  byPriority: Record<Priority, number>;
  overdue: number;
}

const zeroed = <K extends string>(keys: readonly K[]) =>
  Object.fromEntries(keys.map((k) => [k, 0])) as Record<K, number>;

export class StatsService {
  constructor(private readonly repo: TaskRepository) {}

  compute(now: Date = new Date()): TaskStats {
    const tasks = this.repo.findAll();
    const stats: TaskStats = {
      total: tasks.length,
      byStatus: zeroed(STATUSES),
      byPriority: zeroed(PRIORITIES),
      overdue: 0,
    };

    for (const task of tasks) {
      stats.byStatus[task.status]++;
      stats.byPriority[task.priority]++;
      if (task.status !== 'done' && task.dueDate && Date.parse(task.dueDate) < now.getTime()) {
        stats.overdue++;
      }
    }
    return stats;
  }
}
