import type { ErrorRequestHandler } from 'express';
import { AppError } from '../utils/errors';
import { logger } from '../utils/logger';

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof AppError) {
    return res.status(err.status).json({ error: err.message });
  }
  logger.error('Unhandled error', err);
  res.status(500).json({ error: 'Internal server error' });
};
