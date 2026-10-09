export type Status = 'todo' | 'doing' | 'done';
export type Priority = 'low' | 'medium' | 'high';

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: Status;
  priority: Priority;
  tags: string[];
  dueDate?: string;
  createdAt: string;
}

export interface CreateTaskInput {
  title: string;
  description?: string;
  priority?: Priority;
  tags?: string[];
  dueDate?: string;
}

export interface UpdateTaskInput extends Partial<CreateTaskInput> {
  status?: Status;
}

export interface TaskFilters {
  status?: Status;
  priority?: Priority;
  tag?: string;
  search?: string;
}
