import { TITLE_MAX_LENGTH } from '@demo/shared';
import type { CreateTaskInput } from '@demo/shared';

export type TaskErrors = Partial<Record<keyof CreateTaskInput, string>>;

export function validateTask(input: CreateTaskInput): TaskErrors {
  const errors: TaskErrors = {};
  const title = input.title.trim();

  if (!title) errors.title = 'Title is required';
  else if (title.length > TITLE_MAX_LENGTH) errors.title = `Title must be at most ${TITLE_MAX_LENGTH} characters`;

  if (input.dueDate && Number.isNaN(Date.parse(input.dueDate))) errors.dueDate = 'Invalid date';

  return errors;
}
