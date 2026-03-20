import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { IPDetectionProvider } from "@/contexts/IPDetectionContext";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { logger } from "@/lib/logger";
import { useEffect, useRef } from "react";
import { getToken, clearAuth, saveUserInfo, isAuthBypassEnabled, getAuthBypassUser } from "@/lib/utils/auth-storage";
import { getUserInfo } from "@/lib/api/auth";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import OAuthCallbackGoogle from "./pages/OAuthCallbackGoogle";

/**
 * 配置 QueryClient
 * 优化缓存策略和错误处理
 */
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // 缓存时间：5分钟
      staleTime: 5 * 60 * 1000,
      // 垃圾回收时间：10分钟
      gcTime: 10 * 60 * 1000,
      // 失败重试次数
      retry: 3,
      // 重试延迟：指数退避
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      // 窗口聚焦时重新获取
      refetchOnWindowFocus: false,
      // 网络重连时重新获取
      refetchOnReconnect: true,
    },
    mutations: {
      // 失败重试次数
      retry: 1,
      // 错误处理
      onError: (error) => {
        logger.error("Mutation failed", error as Error);
      },
    },
  },
});

const App = () => {
  // 使用 ref 防止重复初始化（React StrictMode 会导致 useEffect 执行两次）
  const initializedRef = useRef(false);

  // 页面初始化时检查 token 和用户信息
  useEffect(() => {
    // 防止重复调用
    if (initializedRef.current) {
      return;
    }
    initializedRef.current = true;

    const initializeAuth = async () => {
      const token = getToken();
      const authBypass = isAuthBypassEnabled();

      if (authBypass) {
        saveUserInfo(getAuthBypassUser());
        return;
      }
      
      if (token) {
        // 如果有 token，尝试获取用户信息（token 通过 Authorization 头传递）
        try {
          const userInfoResponse = await getUserInfo();
          // 保存用户信息到缓存
          saveUserInfo(userInfoResponse.data);
        } catch (error) {
          // 如果获取用户信息失败（包括 401 token 过期），清空 token，变成未登录状态
          // handleHttpResponse 已经处理了 401 并清除了认证信息，这里只需要记录日志
          const errorMessage = error instanceof Error ? error.message : String(error);
          if (errorMessage.includes('401') || errorMessage.includes('登录已过期')) {
            logger.warn('Token expired (401), auth data already cleared', { error: String(error) });
          } else {
            logger.warn('Failed to get user info, clearing token', { error: String(error) });
            clearAuth();
          }
        }
      } else {
        // 如果没有 token，确保是未登录状态（清除可能存在的旧数据）
        clearAuth();
      }
    };

    initializeAuth();
  }, []);

  return (
    <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <LanguageProvider>
          <IPDetectionProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/oauth/callback/google" element={<OAuthCallbackGoogle />} />
                <Route path="/api/oauth/callback/google" element={<OAuthCallbackGoogle />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
          </IPDetectionProvider>
        </LanguageProvider>
      </ThemeProvider>
    </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;
