/**
 * 错误处理工具
 * 统一处理应用中的错误
 */

import { logger } from "../logger";
import { ERROR_MESSAGES } from "../constants";

/**
 * 错误类型
 */
export enum ErrorType {
  NETWORK = "NETWORK",
  TIMEOUT = "TIMEOUT",
  UNAUTHORIZED = "UNAUTHORIZED",
  FORBIDDEN = "FORBIDDEN",
  NOT_FOUND = "NOT_FOUND",
  SERVER = "SERVER",
  VALIDATION = "VALIDATION",
  UNKNOWN = "UNKNOWN",
}

/**
 * 应用错误类
 */
export class AppError extends Error {
  constructor(
    public type: ErrorType,
    message: string,
    public originalError?: Error,
    public context?: Record<string, unknown>
  ) {
    super(message);
    this.name = "AppError";
    
    // 保持堆栈跟踪
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AppError);
    }
  }
}

/**
 * 从错误对象中提取错误类型
 */
export function getErrorType(error: unknown): ErrorType {
  if (error instanceof AppError) {
    return error.type;
  }

  if (error instanceof Error) {
    const message = error.message.toLowerCase();
    
    if (message.includes("network") || message.includes("fetch")) {
      return ErrorType.NETWORK;
    }
    if (message.includes("timeout")) {
      return ErrorType.TIMEOUT;
    }
    if (message.includes("401") || message.includes("unauthorized")) {
      return ErrorType.UNAUTHORIZED;
    }
    if (message.includes("403") || message.includes("forbidden")) {
      return ErrorType.FORBIDDEN;
    }
    if (message.includes("404") || message.includes("not found")) {
      return ErrorType.NOT_FOUND;
    }
    if (message.includes("500") || message.includes("server")) {
      return ErrorType.SERVER;
    }
  }

  return ErrorType.UNKNOWN;
}

/**
 * 获取用户友好的错误消息
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof AppError) {
    return error.message;
  }

  const type = getErrorType(error);
  
  switch (type) {
    case ErrorType.NETWORK:
      return ERROR_MESSAGES.NETWORK_ERROR;
    case ErrorType.TIMEOUT:
      return ERROR_MESSAGES.TIMEOUT_ERROR;
    case ErrorType.UNAUTHORIZED:
      return ERROR_MESSAGES.UNAUTHORIZED;
    case ErrorType.FORBIDDEN:
      return ERROR_MESSAGES.FORBIDDEN;
    case ErrorType.NOT_FOUND:
      return ERROR_MESSAGES.NOT_FOUND;
    case ErrorType.SERVER:
      return ERROR_MESSAGES.SERVER_ERROR;
    default:
      return ERROR_MESSAGES.UNKNOWN_ERROR;
  }
}

/**
 * 处理错误并记录
 */
export function handleError(error: unknown, context?: Record<string, unknown>): AppError {
  const appError =
    error instanceof AppError
      ? error
      : new AppError(
          getErrorType(error),
          getErrorMessage(error),
          error instanceof Error ? error : undefined,
          context
        );

  logger.error("Error handled", appError, context);

  return appError;
}

