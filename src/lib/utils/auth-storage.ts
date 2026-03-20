/**
 * 璁よ瘉鐩稿叧鐨勫瓨鍌ㄥ伐鍏?
 * 绠＄悊 token 鍜岀敤鎴蜂俊鎭殑瀛樺偍
 */

import { storage } from './storage';
import { STORAGE_KEYS } from '../constants';
import type { UserInfo } from '../api/auth';
import { setCookie, getCookie, removeCookie } from './cookies';

const AUTH_BYPASS_ENABLED = import.meta.env.VITE_AUTH_BYPASS === 'true';
const AUTH_BYPASS_TOKEN = 'dev-auth-bypass-token';
const AUTH_BYPASS_USER: UserInfo = {
  id: 1,
  username: 'dev_user',
  nickname: 'Dev User',
  gender: 0,
  email: 'dev@oran.ai',
  phone: '',
  avatar: '',
  description: 'Local dev auth bypass',
  pwdResetTime: '',
  pwdExpired: false,
  registrationDate: '',
  deptId: 0,
  deptName: 'Dev',
  permissions: [],
  roles: [],
  roleNames: '',
};

export function isAuthBypassEnabled(): boolean {
  return AUTH_BYPASS_ENABLED;
}

export function getAuthBypassUser(): UserInfo {
  return AUTH_BYPASS_USER;
}

/**
 * 淇濆瓨璁よ瘉 token锛堜娇鐢?cookies 瀛樺偍锛屾敮鎸佸悓鍩熷悕鍜屽瓙鍩熷悕锛?
 */
export function saveToken(token: string): boolean {
  try {
    setCookie(STORAGE_KEYS.AUTH_TOKEN, token, 30); // 30 澶╄繃鏈?
    // 鍚屾椂淇濆瓨鍒?localStorage 浣滀负澶囩敤锛堝悜鍚庡吋瀹癸級
    storage.set(STORAGE_KEYS.AUTH_TOKEN, token);
    return true;
  } catch (error) {
    console.error('Failed to save token to cookie:', error);
    return false;
  }
}

/**
 * 鑾峰彇璁よ瘉 token锛堜紭鍏堜粠 cookies 璇诲彇锛屽鏋滄病鏈夊垯浠?localStorage 璇诲彇锛?
 */
export function getToken(): string | null {
  if (AUTH_BYPASS_ENABLED) {
    return AUTH_BYPASS_TOKEN;
  }
  // 浼樺厛浠?cookies 璇诲彇
  const cookieToken = getCookie(STORAGE_KEYS.AUTH_TOKEN);
  if (cookieToken) {
    return cookieToken;
  }
  // 濡傛灉娌℃湁锛屼粠 localStorage 璇诲彇锛堝悜鍚庡吋瀹癸級
  return storage.get<string>(STORAGE_KEYS.AUTH_TOKEN);
}

/**
 * 鍒犻櫎璁よ瘉 token锛堝悓鏃跺垹闄?cookies 鍜?localStorage锛?
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
 * 淇濆瓨鐢ㄦ埛淇℃伅
 */
export function saveUserInfo(userInfo: UserInfo): boolean {
  return storage.set(STORAGE_KEYS.USER_INFO, userInfo);
}

/**
 * 鑾峰彇鐢ㄦ埛淇℃伅
 */
export function getUserInfo(): UserInfo | null {
  if (AUTH_BYPASS_ENABLED) {
    return AUTH_BYPASS_USER;
  }
  return storage.get<UserInfo>(STORAGE_KEYS.USER_INFO);
}

/**
 * 鍒犻櫎鐢ㄦ埛淇℃伅
 */
export function removeUserInfo(): boolean {
  return storage.remove(STORAGE_KEYS.USER_INFO);
}

/**
 * 淇濆瓨 OAuth code
 */
export function saveOAuthCode(code: string): boolean {
  return storage.set(STORAGE_KEYS.OAUTH_CODE, code);
}

/**
 * 鑾峰彇 OAuth code
 */
export function getOAuthCode(): string | null {
  return storage.get<string>(STORAGE_KEYS.OAUTH_CODE);
}

/**
 * 鍒犻櫎 OAuth code
 */
export function removeOAuthCode(): boolean {
  return storage.remove(STORAGE_KEYS.OAUTH_CODE);
}

/**
 * 娓呴櫎鎵€鏈夎璇佺浉鍏虫暟鎹?
 */
export function clearAuth(): void {
  if (AUTH_BYPASS_ENABLED) {
    return;
  }
  removeToken();
  removeUserInfo();
  removeOAuthCode();
}

/**
 * 妫€鏌ユ槸鍚﹀凡鐧诲綍
 */
export function isAuthenticated(): boolean {
  return getToken() !== null;
}
