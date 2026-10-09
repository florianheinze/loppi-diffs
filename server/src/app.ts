import express from 'express';
import { errorHandler } from './middleware/errorHandler';
import { requestLogger } from './middleware/requestLogger';
import { TaskRepository } from './repositories/taskRepository';
import { healthRouter } from './routes/health';
import { createTasksRouter } from './routes/tasks';
import { TaskService } from './services/taskService';

export function createApp(service = new TaskService(new TaskRepository())) {
  const app = express();
  app.use(express.json());
  app.use(requestLogger);

  app.use('/api/health', healthRouter);
  app.use('/api/tasks', createTasksRouter(service));

  app.use(errorHandler);
  return app;
}
