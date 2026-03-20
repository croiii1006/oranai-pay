/**
 * 应用配置管理
 * 统一管理环境变量和应用配置
 */

/**
 * 应用环境类型
 */
export type AppEnvironment = "development" | "staging" | "production";

/**
 * 获取当前环境
 */
export const getEnvironment = (): AppEnvironment => {
  const mode = import.meta.env.MODE;
  if (mode === "production") return "production";
  if (mode === "staging") return "staging";
  return "development";
};

/**
 * 应用配置
 */
export const config = {
  // 环境信息
  env: getEnvironment(),
  isDev: import.meta.env.DEV,
  isProd: import.meta.env.PROD,
  
  // API 配置
  api: {
    baseUrl: import.meta.env.VITE_API_BASE_URL || "",
    timeout: Number(import.meta.env.VITE_API_TIMEOUT) || 30000,
    // 模型页面API地址
    // 开发环境使用代理路径，生产环境也使用相对路径通过 Nginx 代理转发
    modelsBaseUrl: import.meta.env.VITE_MODELS_API_BASE_URL || "",
    // LIBRARY页面API地址
    // 开发环境使用代理路径，生产环境也使用相对路径通过 Nginx 代理转发
    libraryBaseUrl: import.meta.env.VITE_LIBRARY_API_BASE_URL || "",
    // AUTH页面API地址
    // 开发环境：使用空字符串，通过 Vite 代理转发（代理配置在 vite.config.ts）
    // 生产环境：使用空字符串，通过 Nginx 代理转发（代理配置在 nginx-baota-www.oran.cn.conf）
    authBaseUrl: import.meta.env.VITE_AUTH_API_BASE_URL || "",
    // Image Generation 工具地址
    imageGenUrl: import.meta.env.VITE_IMAGE_GEN_URL || 
      (import.meta.env.PROD ? "https://toolbox.oran.cn/ai-toolbox/text-to-image" : "http://localhost:8081/ai-toolbox/text-to-image"),
    // Video Generation 工具地址（与 Image Generation 使用相同地址）
    videoGenUrl: import.meta.env.VITE_VIDEO_GEN_URL || 
      (import.meta.env.PROD ? "https://toolbox.oran.cn/ai-toolbox/text-to-video" : "http://localhost:8081/ai-toolbox/text-to-video"),
  },

  // 应用信息
  app: {
    name: import.meta.env.VITE_APP_NAME || "OranAI Vision Engine",
    version: import.meta.env.VITE_APP_VERSION || "1.0.0",
  },

  // 功能开关
  features: {
    enableAnalytics: import.meta.env.VITE_ENABLE_ANALYTICS === "true",
    enableErrorReporting: import.meta.env.VITE_ENABLE_ERROR_REPORTING !== "false",
    enablePerformanceMonitoring: import.meta.env.VITE_ENABLE_PERFORMANCE_MONITORING === "true",
  },

  // 第三方服务配置
  services: {
    // 错误监控服务（如 Sentry）
    sentry: {
      dsn: import.meta.env.VITE_SENTRY_DSN || "",
      enabled: import.meta.env.VITE_SENTRY_ENABLED === "true",
    },
    // 分析服务（如 Google Analytics）
    analytics: {
      id: import.meta.env.VITE_ANALYTICS_ID || "",
      enabled: import.meta.env.VITE_ANALYTICS_ENABLED === "true",
    },
  },
} as const;

/**
 * 验证必需的配置项
 */
export const validateConfig = (): void => {
  const requiredEnvVars: string[] = [];
  
  // 根据环境添加必需的配置项检查
  if (config.isProd) {
    // 生产环境必需的配置
  }

  if (requiredEnvVars.length > 0) {
    const missing = requiredEnvVars.filter((key) => !import.meta.env[key]);
    if (missing.length > 0) {
      console.warn(
        `缺少以下环境变量: ${missing.join(", ")}. 应用可能无法正常工作.`
      );
    }
  }
};

// 在模块加载时验证配置
if (typeof window !== "undefined") {
  validateConfig();
}

