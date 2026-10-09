import { isBeforeToday, MAX_TAGS, TITLE_MAX_LENGTH } from '@demo/shared';
import type { CreateTaskInput } from '@demo/shared';

export type TaskErrors = Partial<Record<keyof CreateTaskInput, string>>;

export function validateTask(input: CreateTaskInput, now: Date = new Date()): TaskErrors {
  const errors: TaskErrors = {};
  const title = input.title.trim();

  if (title.length < 3) errors.title = 'Title must be at least 3 characters';
  else if (title.length > TITLE_MAX_LENGTH) errors.title = `Title must be at most ${TITLE_MAX_LENGTH} characters`;

  if (input.dueDate) {
    if (Number.isNaN(Date.parse(input.dueDate))) errors.dueDate = 'Invalid date';
    else if (isBeforeToday(input.dueDate, now)) errors.dueDate = 'Due date cannot be in the past';
  }

  if (input.tags && input.tags.length > MAX_TAGS) errors.tags = `At most ${MAX_TAGS} tags allowed`;

  return errors;
}
