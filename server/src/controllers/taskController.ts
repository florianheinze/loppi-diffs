import type { RequestHandler } from 'express';
import { TaskService } from '../services/taskService';

export function createTaskController(service: TaskService) {
  const list: RequestHandler = (_req, res) => {
    res.json(service.list());
  };

  const get: RequestHandler = (req, res) => {
    res.json(service.get(req.params.id));
  };

  const create: RequestHandler = (req, res) => {
    res.status(201).json(service.create(req.body));
  };

  const update: RequestHandler = (req, res) => {
    res.json(service.update(req.params.id, req.body));
  };

  const remove: RequestHandler = (req, res) => {
    service.remove(req.params.id);
    res.status(204).end();
  };

  return { list, get, create, update, remove };
}
