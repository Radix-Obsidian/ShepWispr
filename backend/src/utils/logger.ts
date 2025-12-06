/**
 * Simple logger utility
 * Provides structured logging with timestamps
 */

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  data?: Record<string, unknown>;
}

function formatLog(entry: LogEntry): string {
  const base = `[${entry.timestamp}] [${entry.level.toUpperCase()}] ${entry.message}`;
  if (entry.data) {
    return `${base} ${JSON.stringify(entry.data)}`;
  }
  return base;
}

function createLogEntry(level: LogLevel, message: string, data?: Record<string, unknown>): LogEntry {
  return {
    timestamp: new Date().toISOString(),
    level,
    message,
    data,
  };
}

export const logger = {
  info(message: string, data?: Record<string, unknown>): void {
    const entry = createLogEntry('info', message, data);
    // eslint-disable-next-line no-console
    console.log(formatLog(entry));
  },

  warn(message: string, data?: Record<string, unknown>): void {
    const entry = createLogEntry('warn', message, data);
    console.warn(formatLog(entry));
  },

  error(message: string, data?: Record<string, unknown>): void {
    const entry = createLogEntry('error', message, data);
    console.error(formatLog(entry));
  },

  debug(message: string, data?: Record<string, unknown>): void {
    if (process.env.DEBUG === 'true') {
      const entry = createLogEntry('debug', message, data);
      // eslint-disable-next-line no-console
      console.log(formatLog(entry));
    }
  },
};
