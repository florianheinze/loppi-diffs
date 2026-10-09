import { Router } from 'express';
import { createTaskController } from '../controllers/taskController';
import { validate } from '../middleware/validate';
import { createTaskSchema, updateTaskSchema } from '../schemas';
import { TaskService } from '../services/taskService';

export function createTasksRouter(service: TaskService) {
  const router = Router();
  const ctrl = createTaskController(service);

  router.get('/', ctrl.list);
  router.get('/:id', ctrl.get);
  router.post('/', validate(createTaskSchema), ctrl.create);
  router.patch('/:id', validate(updateTaskSchema), ctrl.update);
  router.delete('/:id', ctrl.remove);

  return router;
}
