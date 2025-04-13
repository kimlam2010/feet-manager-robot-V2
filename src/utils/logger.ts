import { env } from '../config/env';

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  data?: any;
}

class Logger {
  private static instance: Logger;
  private logBuffer: LogEntry[] = [];
  private readonly MAX_BUFFER_SIZE = 1000;

  private constructor() {}

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  private shouldLog(level: LogLevel): boolean {
    const levels: LogLevel[] = ['debug', 'info', 'warn', 'error'];
    const configLevel = env.LOG_LEVEL as LogLevel;
    return levels.indexOf(level) >= levels.indexOf(configLevel);
  }

  private formatMessage(entry: LogEntry): string {
    return `[${entry.timestamp}] ${entry.level.toUpperCase()}: ${entry.message}${
      entry.data ? '\n' + JSON.stringify(entry.data, null, 2) : ''
    }`;
  }

  private addToBuffer(entry: LogEntry) {
    this.logBuffer.push(entry);
    if (this.logBuffer.length > this.MAX_BUFFER_SIZE) {
      this.logBuffer.shift();
    }
  }

  private createLogEntry(level: LogLevel, message: string, data?: any): LogEntry {
    return {
      timestamp: new Date().toISOString(),
      level,
      message,
      data,
    };
  }

  debug(message: string, data?: any) {
    if (this.shouldLog('debug')) {
      const entry = this.createLogEntry('debug', message, data);
      this.addToBuffer(entry);
      console.debug(this.formatMessage(entry));
    }
  }

  info(message: string, data?: any) {
    if (this.shouldLog('info')) {
      const entry = this.createLogEntry('info', message, data);
      this.addToBuffer(entry);
      console.info(this.formatMessage(entry));
    }
  }

  warn(message: string, data?: any) {
    if (this.shouldLog('warn')) {
      const entry = this.createLogEntry('warn', message, data);
      this.addToBuffer(entry);
      console.warn(this.formatMessage(entry));
    }
  }

  error(message: string, error?: Error | any) {
    if (this.shouldLog('error')) {
      const entry = this.createLogEntry('error', message, {
        error: error instanceof Error ? {
          message: error.message,
          stack: error.stack,
          name: error.name,
        } : error,
      });
      this.addToBuffer(entry);
      console.error(this.formatMessage(entry));

      if (env.ENABLE_ERROR_REPORTING) {
        // TODO: Send to error reporting service (e.g., Sentry)
      }
    }
  }

  getLogBuffer(): LogEntry[] {
    return [...this.logBuffer];
  }

  clearBuffer() {
    this.logBuffer = [];
  }
}

export const logger = Logger.getInstance();
