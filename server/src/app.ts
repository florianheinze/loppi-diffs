import express from 'express';
import { errorHandler } from './middleware/errorHandler';
import { rateLimit } from './middleware/rateLimit';
import { requestLogger } from './middleware/requestLogger';
import { TaskRepository } from './repositories/taskRepository';
import { healthRouter } from './routes/health';
import { createStatsRouter } from './routes/stats';
import { createTasksRouter } from './routes/tasks';
import { StatsService } from './services/statsService';
import { TaskService } from './services/taskService';

export function createApp(repo = new TaskRepository()) {
  const app = express();
  app.use(express.json());
  app.use(requestLogger);
  app.use('/api', rateLimit({ windowMs: 60_000, max: 100 }));

  app.use('/api/health', healthRouter);
  app.use('/api/tasks', createTasksRouter(new TaskService(repo)));
  app.use('/api/stats', createStatsRouter(new StatsService(repo)));

  app.use(errorHandler);
  return app;
}
