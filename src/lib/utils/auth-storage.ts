/**
 * 认证相关的存储工具
 * 管理 token 和用户信息的存储
 */

import { storage } from './storage';
import { STORAGE_KEYS } from '../constants';
import type { UserInfo } from '../api/auth';
import { setCookie, getCookie, removeCookie } from './cookies';

/**
 * 保存认证 token（使用 cookies 存储，支持同域名和子域名）
 */
export function saveToken(token: string): boolean {
  try {
    setCookie(STORAGE_KEYS.AUTH_TOKEN, token, 30); // 30 天过期
    // 同时保存到 localStorage 作为备用（向后兼容）
    storage.set(STORAGE_KEYS.AUTH_TOKEN, token);
    return true;
  } catch (error) {
    console.error('Failed to save token to cookie:', error);
    return false;
  }
}

/**
 * 获取认证 token（优先从 cookies 读取，如果没有则从 localStorage 读取）
 */
export function getToken(): string | null {
  // 优先从 cookies 读取
  const cookieToken = getCookie(STORAGE_KEYS.AUTH_TOKEN);
  if (cookieToken) {
    return cookieToken;
  }
  // 如果没有，从 localStorage 读取（向后兼容）
  return storage.get<string>(STORAGE_KEYS.AUTH_TOKEN);
}

/**
 * 删除认证 token（同时删除 cookies 和 localStorage）
 */
export function removeToken(): boolean {
  try {
    removeCookie(STORAGE_KEYS.AUTH_TOKEN);
    storage.remove(STORAGE_KEYS.AUTH_TOKEN);
    return true;
  } catch (error) {
    console.error('Failed to remove token from cookie:', error);
    return false;
  }
}

/**
 * 保存用户信息
 */
export function saveUserInfo(userInfo: UserInfo): boolean {
  return storage.set(STORAGE_KEYS.USER_INFO, userInfo);
}

/**
 * 获取用户信息
 */
export function getUserInfo(): UserInfo | null {
  return storage.get<UserInfo>(STORAGE_KEYS.USER_INFO);
}

/**
 * 删除用户信息
 */
export function removeUserInfo(): boolean {
  return storage.remove(STORAGE_KEYS.USER_INFO);
}

/**
 * 保存 OAuth code
 */
export function saveOAuthCode(code: string): boolean {
  return storage.set(STORAGE_KEYS.OAUTH_CODE, code);
}

/**
 * 获取 OAuth code
 */
export function getOAuthCode(): string | null {
  return storage.get<string>(STORAGE_KEYS.OAUTH_CODE);
}

/**
 * 删除 OAuth code
 */
export function removeOAuthCode(): boolean {
  return storage.remove(STORAGE_KEYS.OAUTH_CODE);
}

/**
 * 清除所有认证相关数据
 */
export function clearAuth(): void {
  removeToken();
  removeUserInfo();
  removeOAuthCode();
}

/**
 * 检查是否已登录
 */
export function isAuthenticated(): boolean {
  return getToken() !== null;
}
