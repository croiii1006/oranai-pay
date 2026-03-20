/**
 * API 请求工具
 * 统一处理 API 请求配置，包括 Authorization 头和 Accept-Language 头
 */

import { getToken } from './auth-storage';
import { STORAGE_KEYS } from '../constants';

/**
 * 获取当前语言并映射到 Accept-Language 格式
 * 每次调用都从 localStorage 实时读取最新值，确保跟随 app_language 字段变化
 * @returns Accept-Language 值：'zh-CN' 或 'en-US'
 */
function getAcceptLanguage(): string {
  // 直接从 localStorage 读取，确保获取最新值
  let currentLanguage: string | null = null;
  
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const stored = localStorage.getItem(STORAGE_KEYS.LANGUAGE);
      if (stored) {
        // 尝试解析 JSON（如果是 JSON 格式）
        try {
          currentLanguage = JSON.parse(stored);
        } catch {
          // 如果不是 JSON，直接使用原始字符串
          currentLanguage = stored;
        }
      }
    }
  } catch (error) {
    // 如果读取失败，使用默认值
    console.warn('Failed to read language from localStorage', error);
  }
  
  // 映射到 Accept-Language 格式
  // 枚举值：zh -> zh-CN, en -> en-US
  if (currentLanguage === 'zh') {
    return 'zh-CN';
  }
  // 默认使用 en-US
  return 'en-US';
}

/**
 * 创建带认证头的请求配置
 * @param options 请求配置选项
 * @returns Fetch RequestInit 配置
 */
export function createAuthHeaders(options: {
  method?: string;
  body?: string | FormData;
  contentType?: string;
  needAuth?: boolean;
} = {}): RequestInit {
  const { method = 'GET', body, contentType = 'application/json', needAuth = true } = options;

  const headers: Record<string, string> = {};

  // 设置 Content-Type
  if (contentType && !(body instanceof FormData)) {
    headers['Content-Type'] = contentType;
  }

  // 添加 Accept-Language 头（国际化支持）
  // 每次请求都实时读取最新的语言设置，确保跟随 app_language 字段变化
  headers['Accept-Language'] = getAcceptLanguage();

  // 添加 Authorization 头
  if (needAuth) {
    const token = getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  const config: RequestInit = {
    method,
    headers,
  };

  if (body) {
    config.body = body;
  }

  return config;
}
