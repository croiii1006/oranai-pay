import { logger } from '@/lib/logger';
import { storage } from './storage';
import { STORAGE_KEYS } from '@/lib/constants';

/**
 * IP地理位置信息接口
 */
export interface IPLocationInfo {
  ip: string;
  city: string;
  region: string;
  country: string;
  country_code: string;
  country_code_iso3: string;
  country_capital: string;
  country_name: string;
  country_tld: string;
  continent_code: string;
  in_eu: boolean;
  postal: string;
  latitude: number;
  longitude: number;
  timezone: string;
  utc_offset: string;
  country_calling_code: string;
  currency: string;
  currency_name: string;
  languages: string;
  country_area: number;
  country_population: number;
  asn: string;
  org: string;
}

/**
 * IP检测结果缓存接口
 */
interface IPDetectionCache {
  isChina: boolean;
  timestamp: number;
  location?: IPLocationInfo;
}

/**
 * 缓存有效期（24小时）
 */
const CACHE_DURATION = 24 * 60 * 60 * 1000;

/**
 * 获取缓存的IP检测结果
 */
function getCachedIPDetection(): IPDetectionCache | null {
  const cached = storage.get<IPDetectionCache>(STORAGE_KEYS.IP_LOCATION);
  if (!cached) {
    return null;
  }
  
  // 检查缓存是否过期
  const now = Date.now();
  if (now - cached.timestamp > CACHE_DURATION) {
    storage.remove(STORAGE_KEYS.IP_LOCATION);
    return null;
  }
  
  return cached;
}

/**
 * 缓存IP检测结果
 */
function cacheIPDetection(isChina: boolean, location?: IPLocationInfo): void {
  const cache: IPDetectionCache = {
    isChina,
    timestamp: Date.now(),
    location,
  };
  storage.set(STORAGE_KEYS.IP_LOCATION, cache);
}

/**
 * 使用ipapi.co服务检测IP地址是否来自中国
 * 优先使用缓存，如果缓存不存在或过期则请求新数据
 * @param forceRefresh 是否强制刷新（忽略缓存）
 * @returns Promise<boolean> - true表示是中国IP，false表示不是中国IP
 */
export async function isChinaIP(forceRefresh: boolean = false): Promise<boolean> {
  // 如果不强制刷新，先检查缓存
  if (!forceRefresh) {
    const cached = getCachedIPDetection();
    if (cached) {
      logger.info('Using cached IP detection result', { 
        isChina: cached.isChina,
        cachedAt: new Date(cached.timestamp).toISOString()
      });
      return cached.isChina;
    }
  }

  try {
    const response = await fetch('https://ipapi.co/json/', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: IPLocationInfo = await response.json();
    
    // 检查国家代码是否为CN（中国）
    const isChina = data.country_code === 'CN';
    
    // 缓存结果
    cacheIPDetection(isChina, data);
    
    logger.info('IP location detected', { 
      country: data.country_name, 
      countryCode: data.country_code,
      isChina 
    });
    
    return isChina;
  } catch (error) {
    logger.error('Failed to detect IP location', error as Error);
    // 出错时尝试使用缓存（即使可能过期）
    const cached = getCachedIPDetection();
    if (cached) {
      logger.info('Using expired cache due to error', { isChina: cached.isChina });
      return cached.isChina;
    }
    // 完全没有缓存时默认返回false，显示所有模型
    return false;
  }
}

/**
 * 获取IP地理位置信息
 * @returns Promise<IPLocationInfo | null> - 地理位置信息，失败返回null
 */
export async function getIPLocation(): Promise<IPLocationInfo | null> {
  try {
    const response = await fetch('https://ipapi.co/json/', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: IPLocationInfo = await response.json();
    
    logger.info('IP location fetched', { 
      country: data.country_name, 
      countryCode: data.country_code 
    });
    
    return data;
  } catch (error) {
    logger.error('Failed to get IP location', error as Error);
    return null;
  }
}

