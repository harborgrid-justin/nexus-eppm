
import { ConfigService } from './ConfigService';

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogContext {
  component?: string;
  action?: string;
  userId?: string;
  projectId?: string;
  route?: string;
  [key: string]: any;
}

class LoggerService {
  private static instance: LoggerService;
  private globalContext: LogContext = {};
  private queue: any[] = [];

  private constructor() {
      // Optimization: Flush queue on unload using Beacon API
      if (typeof window !== 'undefined') {
          window.addEventListener('unload', () => {
              if (this.queue.length > 0) {
                  const blob = new Blob([JSON.stringify(this.queue)], { type: 'application/json' });
                  navigator.sendBeacon('/api/log-flush', blob);
              }
          });
      }
  }

  static getInstance(): LoggerService {
    if (!LoggerService.instance) {
      LoggerService.instance = new LoggerService();
    }
    return LoggerService.instance;
  }

  public setGlobalContext(context: LogContext) {
    this.globalContext = { ...this.globalContext, ...context };
  }

  private log(level: LogLevel, message: string, context?: LogContext) {
    // Optimization: Defer non-critical logs using requestIdleCallback
    const task = () => {
        const timestamp = new Date().toISOString();
        const mergedContext = { ...this.globalContext, ...context };
        
        const payload = {
          timestamp,
          level,
          message,
          environment: ConfigService.env,
          version: ConfigService.appVersion,
          ...mergedContext
        };

        // Enqueue for batch sending (Beacon)
        this.queue.push(payload);
        if (this.queue.length > 50) this.queue.shift(); // Keep buffer small for demo

        if (ConfigService.isProduction && level === 'debug') return;

        const style = {
          info: 'color: #0ea5e9',
          warn: 'color: #eab308',
          error: 'color: #ef4444; font-weight: bold',
          debug: 'color: #94a3b8'
        };

        console.groupCollapsed(`%c[${level.toUpperCase()}] ${message}`, style[level]);
        console.log('Payload:', payload);
        console.groupEnd();
    };

    if ('requestIdleCallback' in window && level !== 'error') {
        window.requestIdleCallback(task);
    } else {
        task();
    }
  }

  public info(message: string, context?: LogContext) { this.log('info', message, context); }
  public warn(message: string, context?: LogContext) { this.log('warn', message, context); }
  public error(message: string, context?: LogContext) { this.log('error', message, context); }
  public debug(message: string, context?: LogContext) { this.log('debug', message, context); }
}

export const Logger = LoggerService.getInstance();
