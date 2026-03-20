/**
 * 应用常量定义
 * 统一管理应用中的常量值
 */

/**
 * 路由路径常量
 */
export const ROUTES = {
  HOME: "/",
  PLATFORMS: "/models",
  PRODUCTS: "/products",
  LIBRARY: "/library",
  NOT_FOUND: "*",
} as const;

/**
 * 本地存储键名
 */
export const STORAGE_KEYS = {
  LANGUAGE: "app_language",
  THEME: "app_theme",
  USER_PREFERENCES: "user_preferences",
  IP_LOCATION: "app_ip_location",
  AUTH_TOKEN: "auth_token",
  USER_INFO: "user_info",
  OAUTH_CODE: "oauth_code",
} as const;

/**
 * API 端点常量
 */
export const API_ENDPOINTS = {
  // 示例端点，根据实际 API 调整
  PLATFORMS: "/api/models",
  PRODUCTS: "/api/products",
  LIBRARY: "/api/library",
} as const;

/**
 * 应用配置常量
 */
export const APP_CONSTANTS = {
  // 分页
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
  
  // 超时时间（毫秒）
  DEFAULT_TIMEOUT: 30000,
  SHORT_TIMEOUT: 5000,
  LONG_TIMEOUT: 60000,
  
  // 重试配置
  MAX_RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
  
  // 缓存时间（毫秒）
  CACHE_TIME: 5 * 60 * 1000, // 5分钟
  LONG_CACHE_TIME: 30 * 60 * 1000, // 30分钟
} as const;

/**
 * 错误消息常量
 */
export const ERROR_MESSAGES = {
  NETWORK_ERROR: "网络连接失败，请检查您的网络设置",
  TIMEOUT_ERROR: "请求超时，请稍后重试",
  UNAUTHORIZED: "未授权访问，请先登录",
  FORBIDDEN: "没有权限访问此资源",
  NOT_FOUND: "请求的资源不存在",
  SERVER_ERROR: "服务器错误，请稍后重试",
  UNKNOWN_ERROR: "发生未知错误，请稍后重试",
} as const;

/**
 * 成功消息常量
 */
export const SUCCESS_MESSAGES = {
  SAVE_SUCCESS: "保存成功",
  DELETE_SUCCESS: "删除成功",
  UPDATE_SUCCESS: "更新成功",
  OPERATION_SUCCESS: "操作成功",
} as const;

