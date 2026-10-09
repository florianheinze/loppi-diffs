import { z } from 'zod';
import { MAX_TAGS, PRIORITIES, STATUSES, TITLE_MAX_LENGTH } from '@demo/shared';

export const createTaskSchema = z.object({
  title: z.string().trim().min(1).max(TITLE_MAX_LENGTH),
  description: z.string().max(500).optional(),
  priority: z.enum(PRIORITIES).optional(),
  tags: z.array(z.string().trim().min(1)).max(MAX_TAGS).optional(),
  dueDate: z.string().datetime().optional(),
});

export const updateTaskSchema = createTaskSchema.partial().extend({
  status: z.enum(STATUSES).optional(),
});

export const listQuerySchema = z.object({
  status: z.enum(STATUSES).optional(),
  priority: z.enum(PRIORITIES).optional(),
  tag: z.string().optional(),
  search: z.string().optional(),
});
