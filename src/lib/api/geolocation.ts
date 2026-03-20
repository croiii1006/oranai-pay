import { logger } from '@/lib/logger';

/**
 * IP地理位置响应接口
 */
export interface GeoLocationResponse {
  country_code?: string;
  country?: string;
  countryCode?: string;
  [key: string]: any;
}

/**
 * 检测用户IP地址所在国家
 * 使用免费的IP地理位置API
 */
export async function detectUserCountry(): Promise<string | null> {
  try {
    // 使用免费的IP地理位置API
    // 可以尝试多个API以提高可靠性
    const apis = [
      'https://ipapi.co/json/',
      'https://ip-api.com/json/?fields=status,countryCode',
    ];

    for (const apiUrl of apis) {
      try {
        const response = await fetch(apiUrl, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
        });

        if (!response.ok) {
          continue; // 尝试下一个API
        }

        const data: GeoLocationResponse = await response.json();
        
        // 处理不同的API响应格式
        const countryCode = data.country_code || data.countryCode || data.country;
        
        if (countryCode) {
          logger.info('User country detected', { countryCode, api: apiUrl });
          return countryCode.toUpperCase();
        }
      } catch (error) {
        logger.warn('Failed to detect country from API', { api: apiUrl, error });
        continue; // 尝试下一个API
      }
    }

    logger.warn('Failed to detect user country from all APIs');
    return null;
  } catch (error) {
    logger.error('Error detecting user country', error as Error);
    return null;
  }
}

/**
 * 判断是否是中国IP
 */
export async function isChinaIP(): Promise<boolean> {
  const countryCode = await detectUserCountry();
  return countryCode === 'CN' || countryCode === 'CHN';
}

