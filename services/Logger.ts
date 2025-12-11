
import { ConfigService } from './ConfigService';

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogContext {
  component?: string;
  action?: string;
  userId?: string;
  projectId?: string;
  [key: string]: any;
}

class LoggerService {
  private static instance: LoggerService;
  private defaultContext: LogContext = {};

  private constructor() {}

  static getInstance(): LoggerService {
    if (!LoggerService.instance) {
      LoggerService.instance = new LoggerService();
    }
    return LoggerService.instance;
  }

  public setContext(context: LogContext) {
    this.defaultContext = { ...this.defaultContext, ...context };
  }

  private log(level: LogLevel, message: string, context?: LogContext) {
    const timestamp = new Date().toISOString();
    const mergedContext = { ...this.defaultContext, ...context };
    
    const payload = {
      timestamp,
      level,
      message,
      environment: ConfigService.env,
      version: ConfigService.appVersion,
      ...mergedContext
    };

    // In production, this would dispatch to Datadog/Sentry/Splunk
    if (ConfigService.isProduction && level === 'debug') return;

    const style = {
      info: 'color: #0ea5e9', // Blue
      warn: 'color: #eab308', // Yellow
      error: 'color: #ef4444; font-weight: bold', // Red
      debug: 'color: #94a3b8' // Slate
    };

    console.groupCollapsed(`%c[${level.toUpperCase()}] ${message}`, style[level]);
    console.log('Payload:', payload);
    console.groupEnd();
  }

  public info(message: string, context?: LogContext) { this.log('info', message, context); }
  public warn(message: string, context?: LogContext) { this.log('warn', message, context); }
  public error(message: string, context?: LogContext) { this.log('error', message, context); }
  public debug(message: string, context?: LogContext) { this.log('debug', message, context); }
}

export const Logger = LoggerService.getInstance();
