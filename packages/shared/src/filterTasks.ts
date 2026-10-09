import type { Task, TaskFilters } from './types';

export function filterTasks(tasks: Task[], filters: TaskFilters): Task[] {
  const search = filters.search?.trim().toLowerCase();

  return tasks.filter(
    (t) =>
      (!filters.status || t.status === filters.status) &&
      (!filters.priority || t.priority === filters.priority) &&
      (!filters.tag || t.tags.includes(filters.tag)) &&
      (!search || t.title.toLowerCase().includes(search) || t.description?.toLowerCase().includes(search)),
  );
}
