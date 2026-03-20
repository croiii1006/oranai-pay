/**
 * 统一的日志工具
 * 提供不同环境下的日志记录和错误上报功能
 */

type LogLevel = "debug" | "info" | "warn" | "error";

interface LogContext {
  [key: string]: unknown;
}

class Logger {
  private isDevelopment = import.meta.env.DEV;
  private isProduction = import.meta.env.PROD;

  /**
   * 格式化日志消息
   */
  private formatMessage(level: LogLevel, message: string, context?: LogContext): string {
    const timestamp = new Date().toISOString();
    const contextStr = context ? ` ${JSON.stringify(context)}` : "";
    return `[${timestamp}] [${level.toUpperCase()}] ${message}${contextStr}`;
  }

  /**
   * 发送错误到监控服务（可根据实际需求集成 Sentry、LogRocket 等）
   */
  private reportError(error: Error | string, context?: LogContext) {
    if (!this.isProduction) {
      return;
    }

    // TODO: 集成错误监控服务
    // 例如: Sentry.captureException(error, { extra: context });
    // 例如: LogRocket.captureException(error, { extra: context });
  }

  /**
   * Debug 级别日志
   */
  debug(message: string, context?: LogContext) {
    if (this.isDevelopment) {
      console.debug(this.formatMessage("debug", message, context));
    }
  }

  /**
   * Info 级别日志
   */
  info(message: string, context?: LogContext) {
    if (this.isDevelopment) {
      console.info(this.formatMessage("info", message, context));
    }
  }

  /**
   * Warn 级别日志
   */
  warn(message: string, context?: LogContext) {
    const formatted = this.formatMessage("warn", message, context);
    console.warn(formatted);
    
    // 生产环境也记录警告
    if (this.isProduction) {
      // TODO: 可选择性上报警告
    }
  }

  /**
   * Error 级别日志
   */
  error(message: string, error?: Error | LogContext, context?: LogContext) {
    const errorObj = error instanceof Error ? error : undefined;
    const logContext = error instanceof Error ? context : (error || context);
    
    const formatted = this.formatMessage("error", message, logContext);
    console.error(formatted, errorObj || "");

    // 生产环境上报错误
    if (errorObj) {
      this.reportError(errorObj, logContext);
    } else if (this.isProduction) {
      this.reportError(new Error(message), logContext);
    }
  }

  /**
   * 记录性能指标
   */
  performance(metric: string, value: number, unit: string = "ms") {
    if (this.isDevelopment) {
      console.info(`[PERFORMANCE] ${metric}: ${value}${unit}`);
    }
    
    // 生产环境可发送到性能监控服务
    if (this.isProduction) {
      // TODO: 发送到性能监控服务
      // 例如: analytics.track('performance', { metric, value, unit });
    }
  }

  /**
   * 记录用户行为（可选）
   */
  track(event: string, properties?: LogContext) {
    if (this.isDevelopment) {
      console.debug(`[TRACK] ${event}`, properties);
    }
    
    // 生产环境发送到分析服务
    if (this.isProduction) {
      // TODO: 发送到分析服务
      // 例如: analytics.track(event, properties);
    }
  }
}

export const logger = new Logger();

