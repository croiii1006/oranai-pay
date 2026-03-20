/**
 * API 客户端封装
 * 统一管理所有 API 请求的基础配置和通用逻辑
 */

import { config } from '@/lib/config';
import { logger } from '@/lib/logger';
import { createAuthHeaders } from '@/lib/utils/api-request';
import { handleHttpResponse, ApiResponse } from '@/lib/utils/api-response-handler';

/**
 * API 请求配置选项
 */
export interface ApiRequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  body?: any;
  headers?: Record<string, string>;
  needAuth?: boolean;
  contentType?: string;
  baseUrl?: string;
}

/**
 * API 客户端类
 */
export class ApiClient {
  private baseUrl: string;

  constructor(baseUrl?: string) {
    this.baseUrl = baseUrl || '';
  }

  /**
   * 发送 API 请求
   * @param endpoint API 端点
   * @param options 请求选项
   * @returns API 响应数据
   */
  async request<T = any>(
    endpoint: string,
    options: ApiRequestOptions = {}
  ): Promise<ApiResponse<T>> {
    const {
      method = 'GET',
      body,
      headers = {},
      needAuth = true,
      contentType = 'application/json',
      baseUrl,
    } = options;

    const url = `${baseUrl || this.baseUrl}${endpoint}`;

    try {
      logger.info(`API Request: ${method} ${url}`, { options });

      // 创建请求配置
      const requestConfig = createAuthHeaders({
        method,
        body: body ? (typeof body === 'string' ? body : JSON.stringify(body)) : undefined,
        contentType,
        needAuth,
      });

      // 合并自定义 headers
      if (Object.keys(headers).length > 0) {
        requestConfig.headers = {
          ...(requestConfig.headers as Record<string, string>),
          ...headers,
        };
      }

      // 发送请求
      const response = await fetch(url, requestConfig);

      // 处理响应
      const data = await handleHttpResponse<T>(response);

      logger.info(`API Response: ${method} ${url}`, { code: data.code, success: data.success });

      return data;
    } catch (error) {
      logger.error(`API Error: ${method} ${url}`, error as Error);
      throw error;
    }
  }

  /**
   * GET 请求
   */
  async get<T = any>(endpoint: string, options: Omit<ApiRequestOptions, 'method'> = {}): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  /**
   * POST 请求
   */
  async post<T = any>(
    endpoint: string,
    body?: any,
    options: Omit<ApiRequestOptions, 'method' | 'body'> = {}
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: 'POST', body });
  }

  /**
   * PUT 请求
   */
  async put<T = any>(
    endpoint: string,
    body?: any,
    options: Omit<ApiRequestOptions, 'method' | 'body'> = {}
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: 'PUT', body });
  }

  /**
   * DELETE 请求
   */
  async delete<T = any>(endpoint: string, options: Omit<ApiRequestOptions, 'method'> = {}): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }

  /**
   * PATCH 请求
   */
  async patch<T = any>(
    endpoint: string,
    body?: any,
    options: Omit<ApiRequestOptions, 'method' | 'body'> = {}
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: 'PATCH', body });
  }
}

/**
 * 创建 API 客户端实例
 */
export function createApiClient(baseUrl?: string): ApiClient {
  return new ApiClient(baseUrl);
}

/**
 * 默认的 AUTH API 客户端
 */
export const authApiClient = createApiClient(config.api.authBaseUrl);

/**
 * 默认的 LIBRARY API 客户端
 */
export const libraryApiClient = createApiClient(config.api.libraryBaseUrl);

/**
 * 默认的 MODELS API 客户端
 */
export const modelsApiClient = createApiClient(config.api.modelsBaseUrl);
