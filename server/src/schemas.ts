import { z } from 'zod';
import { STATUSES, TITLE_MAX_LENGTH } from '@demo/shared';

export const createTaskSchema = z.object({
  title: z.string().trim().min(1).max(TITLE_MAX_LENGTH),
  description: z.string().optional(),
  dueDate: z.string().datetime().optional(),
});

export const updateTaskSchema = createTaskSchema.partial().extend({
  status: z.enum(STATUSES).optional(),
});
