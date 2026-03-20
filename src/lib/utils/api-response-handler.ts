/**
 * API 响应处理工具
 * 统一处理 API 响应，包括 token 过期等错误处理
 */

import { clearAuth } from './auth-storage';
import { logger } from '../logger';

/**
 * API 响应基础结构
 */
export interface ApiResponse<T = any> {
  code: number;
  msg: string;
  success: boolean;
  timestamp?: number;
  data?: T;
}

/**
 * 检查响应中的 code，如果是 401 则清除认证信息
 * @param response API 响应对象
 * @returns 如果是 401 返回 true，否则返回 false
 */
export function handleUnauthorized(response: ApiResponse): boolean {
  if (response.code === 401) {
    logger.warn('Token expired (401), clearing auth data', { code: response.code, msg: response.msg });
    clearAuth();
    // 触发页面刷新或跳转到登录页（如果需要）
    // 这里只清除认证信息，由调用方决定是否需要刷新页面
    return true;
  }
  return false;
}

/**
 * 处理 API 响应，检查 code 和 success
 * @param response API 响应对象
 * @param defaultErrorMessage 默认错误消息
 * @throws 如果响应不成功或 code=401，抛出错误
 */
export function handleApiResponse<T>(
  response: ApiResponse<T>,
  defaultErrorMessage: string = '请求失败'
): T {
  // 检查是否是 401（token 过期）
  if (handleUnauthorized(response)) {
    throw new Error(response.msg || '登录已过期，请重新登录');
  }

  // 检查响应是否成功
  if (!response.success) {
    throw new Error(response.msg || defaultErrorMessage);
  }

  // 检查是否有数据
  if (response.data === undefined) {
    throw new Error('响应数据为空');
  }

  return response.data;
}

/**
 * 处理 HTTP 响应，包括状态码和响应体
 * @param response Fetch Response 对象
 * @param defaultErrorMessage 默认错误消息
 * @returns 解析后的响应数据
 * @throws 如果请求失败，抛出错误
 */
export async function handleHttpResponse<T>(
  response: Response,
  defaultErrorMessage: string = '请求失败'
): Promise<ApiResponse<T>> {
  // 先解析响应体
  let data: ApiResponse<T>;
  try {
    data = await response.json();
  } catch (error) {
    // 如果无法解析 JSON，可能是网络错误或其他问题
    throw new Error(`无法解析响应: ${response.status} ${response.statusText}`);
  }

  // 检查 HTTP 状态码
  if (!response.ok) {
    // 如果是 401，先处理 token 过期
    if (response.status === 401 || data.code === 401) {
      handleUnauthorized(data);
      throw new Error(data.msg || '登录已过期，请重新登录');
    }
    throw new Error(data.msg || `HTTP error! status: ${response.status}`);
  }

  return data;
}
