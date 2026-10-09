import type { RequestHandler } from 'express';
import { listQuerySchema } from '../schemas';
import { TaskService } from '../services/taskService';
import { ValidationError } from '../utils/errors';
import { isValidId } from '../utils/ids';

export function createTaskController(service: TaskService) {
  const list: RequestHandler = (req, res) => {
    const filters = listQuerySchema.safeParse(req.query);
    if (!filters.success) throw new ValidationError('Invalid filter parameters');
    res.json(service.list(filters.data));
  };

  const get: RequestHandler = (req, res) => {
    res.json(service.get(requireId(req.params.id)));
  };

  const create: RequestHandler = (req, res) => {
    res.status(201).json(service.create(req.body));
  };

  const update: RequestHandler = (req, res) => {
    res.json(service.update(requireId(req.params.id), req.body));
  };

  const remove: RequestHandler = (req, res) => {
    service.remove(requireId(req.params.id));
    res.status(204).end();
  };

  return { list, get, create, update, remove };
}

function requireId(id: string): string {
  if (!isValidId(id)) throw new ValidationError('Invalid task id');
  return id;
}
