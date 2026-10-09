import { Router } from 'express';
import { StatsService } from '../services/statsService';

export function createStatsRouter(stats: StatsService) {
  const router = Router();
  router.get('/', (_req, res) => {
    res.json(stats.compute());
  });
  return router;
}
