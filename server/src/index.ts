import { createApp } from './app';
import { config } from './config';
import { logger } from './utils/logger';

createApp().listen(config.port, () => {
  logger.info(`Server listening on http://localhost:${config.port}`);
});
