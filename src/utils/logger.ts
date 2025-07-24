
type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogContext {
  component?: string;
  action?: string;
  userId?: string;
  timestamp?: number;
  [key: string]: any;
}

class Logger {
  private isDevelopment = import.meta.env.MODE === 'development';
  private minLevel: LogLevel = this.isDevelopment ? 'debug' : 'warn';

  private shouldLog(level: LogLevel): boolean {
    const levels: Record<LogLevel, number> = {
      debug: 0,
      info: 1,
      warn: 2,
      error: 3
    };
    
    return levels[level] >= levels[this.minLevel];
  }

  private formatMessage(level: LogLevel, message: string, context?: LogContext): string {
    const timestamp = new Date().toISOString();
    const contextStr = context ? ` | Context: ${JSON.stringify(context)}` : '';
    return `[${timestamp}] [${level.toUpperCase()}] ${message}${contextStr}`;
  }

  debug(message: string, context?: LogContext) {
    if (this.shouldLog('debug')) {
      console.debug(this.formatMessage('debug', message, context));
    }
  }

  info(message: string, context?: LogContext) {
    if (this.shouldLog('info')) {
      console.info(this.formatMessage('info', message, context));
    }
  }

  warn(message: string, context?: LogContext) {
    if (this.shouldLog('warn')) {
      console.warn(this.formatMessage('warn', message, context));
    }
  }

  error(message: string, error?: Error, context?: LogContext) {
    if (this.shouldLog('error')) {
      console.error(this.formatMessage('error', message, context));
      if (error) {
        console.error('Error details:', error);
      }
    }
  }

  // Performance logging
  performance(name: string, duration: number, context?: LogContext) {
    if (this.isDevelopment && duration > 100) {
      this.warn(`Performance: ${name} took ${duration.toFixed(2)}ms`, context);
    }
  }

  // User action logging
  userAction(action: string, context?: LogContext) {
    this.info(`User Action: ${action}`, context);
  }
}

export const logger = new Logger();
