/**
 * Centralized Logging Utility
 * Provides structured logging with context and proper log levels
 */

export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
}

export interface LogContext {
  userId?: string;
  requestId?: string;
  module?: string;
  operation?: string;
  [key: string]: any;
}

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: LogContext | undefined;
  meta?: any;
  error?: {
    message: string;
    stack?: string | undefined;
    name: string;
    code?: string | undefined;
  } | undefined;
}

class Logger {
  private context: LogContext = {};
  private minLevel: LogLevel = LogLevel.INFO;

  constructor() {
    // Set minimum log level based on environment
    if (process.env.NODE_ENV === 'development') {
      this.minLevel = LogLevel.DEBUG;
    } else if (process.env.LOG_LEVEL) {
      this.minLevel = process.env.LOG_LEVEL as LogLevel;
    }
  }

  /**
   * Set persistent context for all subsequent logs
   */
  setContext(context: LogContext): void {
    this.context = { ...this.context, ...context };
  }

  /**
   * Clear all context
   */
  clearContext(): void {
    this.context = {};
  }

  /**
   * Create a child logger with additional context
   */
  child(context: LogContext): Logger {
    const childLogger = new Logger();
    childLogger.context = { ...this.context, ...context };
    childLogger.minLevel = this.minLevel;
    return childLogger;
  }

  private shouldLog(level: LogLevel): boolean {
    const levels = [LogLevel.DEBUG, LogLevel.INFO, LogLevel.WARN, LogLevel.ERROR];
    const currentLevelIndex = levels.indexOf(level);
    const minLevelIndex = levels.indexOf(this.minLevel);
    return currentLevelIndex >= minLevelIndex;
  }

  private formatLogEntry(entry: LogEntry): string {
    if (process.env.NODE_ENV === 'production') {
      // JSON format for production (easier to parse by log aggregators)
      return JSON.stringify(entry);
    } else {
      // Human-readable format for development
      const { timestamp, level, message, context, meta, error } = entry;
      let output = `[${timestamp}] ${level.toUpperCase()}: ${message}`;
      
      if (context && Object.keys(context).length > 0) {
        output += `\n  Context: ${JSON.stringify(context, null, 2)}`;
      }
      
      if (meta) {
        output += `\n  Meta: ${JSON.stringify(meta, null, 2)}`;
      }
      
      if (error) {
        output += `\n  Error: ${error.name}: ${error.message}`;
        if (error.stack) {
          output += `\n${error.stack}`;
        }
      }
      
      return output;
    }
  }

  private log(level: LogLevel, message: string, meta?: any): void {
    if (!this.shouldLog(level)) {
      return;
    }

    const timestamp = new Date().toISOString();
    const logEntry: LogEntry = {
      timestamp,
      level,
      message,
      ...(Object.keys(this.context).length > 0 && { context: this.context }),
      ...(meta && { meta }),
    };

    const formattedLog = this.formatLogEntry(logEntry);

    // Output to appropriate stream
    if (level === LogLevel.ERROR) {
      console.error(formattedLog);
    } else if (level === LogLevel.WARN) {
      console.warn(formattedLog);
    } else {
      console.log(formattedLog);
    }

    // In production, could also send to external logging service
    // e.g., Azure Application Insights, Datadog, etc.
    if (process.env.NODE_ENV === 'production') {
      this.sendToExternalService(logEntry);
    }
  }

  private sendToExternalService(_entry: LogEntry): void {
    // TODO: Implement integration with logging service
    // Examples:
    // - Azure Application Insights
    // - AWS CloudWatch
    // - Datadog
    // - Sentry (for errors)
  }

  /**
   * Log debug message (development only)
   */
  debug(message: string, meta?: any): void {
    this.log(LogLevel.DEBUG, message, meta);
  }

  /**
   * Log informational message
   */
  info(message: string, meta?: any): void {
    this.log(LogLevel.INFO, message, meta);
  }

  /**
   * Log warning message
   */
  warn(message: string, meta?: any): void {
    this.log(LogLevel.WARN, message, meta);
  }

  /**
   * Log error message with optional error object
   */
  error(message: string, error?: Error | unknown, meta?: any): void {
    const timestamp = new Date().toISOString();
    const logEntry: LogEntry = {
      timestamp,
      level: LogLevel.ERROR,
      message,
      ...(Object.keys(this.context).length > 0 && { context: this.context }),
      ...(meta && { meta }),
    };

    if (error instanceof Error) {
      logEntry.error = {
        message: error.message,
        ...(error.stack && { stack: error.stack }),
        name: error.name,
        ...((error as any).code && { code: (error as any).code }),
      };
    } else if (error) {
      logEntry.error = {
        message: String(error),
        name: 'UnknownError',
      };
    }

    const formattedLog = this.formatLogEntry(logEntry);
    console.error(formattedLog);

    if (process.env.NODE_ENV === 'production') {
      this.sendToExternalService(logEntry);
    }
  }

  /**
   * Time a function execution
   */
  async time<T>(
    label: string,
    fn: () => Promise<T> | T,
    meta?: any
  ): Promise<T> {
    const startTime = Date.now();
    this.debug(`Starting: ${label}`, meta);

    try {
      const result = await fn();
      const duration = Date.now() - startTime;
      this.info(`Completed: ${label}`, { ...meta, duration: `${duration}ms` });
      return result;
    } catch (error) {
      const duration = Date.now() - startTime;
      this.error(`Failed: ${label}`, error, { ...meta, duration: `${duration}ms` });
      throw error;
    }
  }
}

// Export singleton instance
export const logger = new Logger();

// Export factory for creating child loggers
export function createLogger(context: LogContext): Logger {
  return logger.child(context);
}
