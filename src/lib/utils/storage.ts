/**
 * 本地存储工具
 * 提供类型安全的本地存储操作
 */

import { STORAGE_KEYS } from "../constants";
import { logger } from "../logger";

/**
 * 检查 localStorage 是否可用
 */
function isStorageAvailable(): boolean {
  try {
    const test = "__storage_test__";
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
}

/**
 * 安全的存储操作类
 */
class StorageManager {
  /**
   * 获取存储项
   */
  get<T>(key: string, defaultValue?: T): T | null {
    if (!isStorageAvailable()) {
      logger.warn("localStorage is not available");
      return defaultValue ?? null;
    }

    try {
      const item = localStorage.getItem(key);
      if (item === null) {
        return defaultValue ?? null;
      }
      
      // 尝试解析 JSON，如果失败则返回原始字符串（兼容直接存储的字符串）
      try {
        return JSON.parse(item) as T;
      } catch (parseError) {
        // 如果不是有效的 JSON，可能是直接存储的字符串，直接返回
        return item as T;
      }
    } catch (error) {
      logger.error(`Failed to get storage item: ${key}`, error as Error);
      return defaultValue ?? null;
    }
  }

  /**
   * 设置存储项
   */
  set<T>(key: string, value: T): boolean {
    if (!isStorageAvailable()) {
      logger.warn("localStorage is not available");
      return false;
    }

    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      logger.error(`Failed to set storage item: ${key}`, error as Error);
      return false;
    }
  }

  /**
   * 删除存储项
   */
  remove(key: string): boolean {
    if (!isStorageAvailable()) {
      return false;
    }

    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      logger.error(`Failed to remove storage item: ${key}`, error as Error);
      return false;
    }
  }

  /**
   * 清空所有存储项
   */
  clear(): boolean {
    if (!isStorageAvailable()) {
      return false;
    }

    try {
      localStorage.clear();
      return true;
    } catch (error) {
      logger.error("Failed to clear storage", error as Error);
      return false;
    }
  }

  /**
   * 检查存储项是否存在
   */
  has(key: string): boolean {
    if (!isStorageAvailable()) {
      return false;
    }
    return localStorage.getItem(key) !== null;
  }
}

export const storage = new StorageManager();

/**
 * 便捷方法：获取语言设置
 */
export const getLanguage = (): string | null => {
  return storage.get<string>(STORAGE_KEYS.LANGUAGE);
};

/**
 * 便捷方法：设置语言
 */
export const setLanguage = (language: string): boolean => {
  return storage.set(STORAGE_KEYS.LANGUAGE, language);
};

/**
 * 便捷方法：获取主题设置
 */
export const getTheme = (): string | null => {
  return storage.get<string>(STORAGE_KEYS.THEME);
};

/**
 * 便捷方法：设置主题
 */
export const setTheme = (theme: string): boolean => {
  return storage.set(STORAGE_KEYS.THEME, theme);
};

