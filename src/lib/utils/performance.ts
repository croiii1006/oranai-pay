/**
 * 性能监控工具
 * 用于测量和记录性能指标
 */

import React from "react";
import { logger } from "../logger";

/**
 * 性能测量器
 */
export class PerformanceMonitor {
  private static marks: Map<string, number> = new Map();

  /**
   * 开始性能测量
   */
  static start(label: string): void {
    if (typeof performance !== "undefined" && performance.mark) {
      performance.mark(`${label}-start`);
      this.marks.set(label, performance.now());
    }
  }

  /**
   * 结束性能测量并记录
   */
  static end(label: string): number {
    const startTime = this.marks.get(label);
    if (!startTime) {
      logger.warn(`Performance mark "${label}" not found`);
      return 0;
    }

    const duration = performance.now() - startTime;
    
    if (typeof performance !== "undefined" && performance.mark) {
      performance.mark(`${label}-end`);
      performance.measure(label, `${label}-start`, `${label}-end`);
    }

    logger.performance(label, duration);
    this.marks.delete(label);
    
    return duration;
  }

  /**
   * 测量异步函数执行时间
   */
  static async measureAsync<T>(
    label: string,
    fn: () => Promise<T>
  ): Promise<T> {
    this.start(label);
    try {
      const result = await fn();
      return result;
    } finally {
      this.end(label);
    }
  }

  /**
   * 测量同步函数执行时间
   */
  static measureSync<T>(label: string, fn: () => T): T {
    this.start(label);
    try {
      return fn();
    } finally {
      this.end(label);
    }
  }
}

/**
 * 懒加载组件包装器
 * 用于代码分割和性能优化
 */
export function lazyLoad<T extends React.ComponentType<any>>(
  importFn: () => Promise<{ default: T }>
): React.LazyExoticComponent<T> {
  return React.lazy(() => {
    PerformanceMonitor.start("lazy-load");
    return importFn().finally(() => {
      PerformanceMonitor.end("lazy-load");
    });
  });
}

