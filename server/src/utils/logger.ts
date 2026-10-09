import { config } from '../config';

type Level = 'debug' | 'info' | 'warn' | 'error';
const order: Level[] = ['debug', 'info', 'warn', 'error'];

function log(level: Level, message: string, meta?: unknown) {
  if (order.indexOf(level) < order.indexOf(config.logLevel as Level)) return;
  const line = `[${new Date().toISOString()}] ${level.toUpperCase()} ${message}`;
  if (meta !== undefined) console.log(line, meta);
  else console.log(line);
}

export const logger = {
  debug: (m: string, meta?: unknown) => log('debug', m, meta),
  info: (m: string, meta?: unknown) => log('info', m, meta),
  warn: (m: string, meta?: unknown) => log('warn', m, meta),
  error: (m: string, meta?: unknown) => log('error', m, meta),
};
