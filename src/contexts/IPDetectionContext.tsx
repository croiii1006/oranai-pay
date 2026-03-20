import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { isChinaIP } from '@/lib/utils/ip-detection';
import { logger } from '@/lib/logger';

interface IPDetectionContextType {
  isChinaIP: boolean | null; // null表示检测中
  isLoading: boolean;
}

const IPDetectionContext = createContext<IPDetectionContextType>({
  isChinaIP: null,
  isLoading: true,
});

interface IPDetectionProviderProps {
  children: ReactNode;
}

/**
 * IP检测Provider
 * 在应用初始化时请求一次IP检测，并缓存结果
 */
export const IPDetectionProvider: React.FC<IPDetectionProviderProps> = ({ children }) => {
  const [isChinaIPResult, setIsChinaIPResult] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // 只在组件挂载时执行一次
    const detectIP = async () => {
      try {
        setIsLoading(true);
        const result = await isChinaIP(false); // 使用缓存
        setIsChinaIPResult(result);
        logger.info('IP detection completed', { isChina: result });
      } catch (error) {
        logger.error('Failed to detect IP in context', error as Error);
        setIsChinaIPResult(false); // 出错时默认显示所有模型
      } finally {
        setIsLoading(false);
      }
    };

    detectIP();
  }, []); // 空依赖数组，确保只执行一次

  return (
    <IPDetectionContext.Provider value={{ isChinaIP: isChinaIPResult, isLoading }}>
      {children}
    </IPDetectionContext.Provider>
  );
};

/**
 * 使用IP检测结果的Hook
 */
export const useIPDetection = (): IPDetectionContextType => {
  const context = useContext(IPDetectionContext);
  if (!context) {
    throw new Error('useIPDetection must be used within IPDetectionProvider');
  }
  return context;
};

