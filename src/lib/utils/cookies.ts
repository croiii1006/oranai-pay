/**
 * Cookies 工具函数
 * 用于管理 cookies，支持同域名和子域名共享
 */

/**
 * 获取当前域名的基础域名（用于设置 cookies 的 domain）
 * 例如：www.oran.cn -> .oran.cn
 *      localhost -> localhost
 */
function getCookieDomain(): string {
  if (typeof window === 'undefined') {
    return '';
  }

  const hostname = window.location.hostname;

  // 本地开发环境
  if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname.includes('192.168.')) {
    return hostname;
  }

  // 生产环境：提取基础域名
  // 例如：www.oran.cn -> .oran.cn
  //      toolbox.oran.cn -> .oran.cn
  const parts = hostname.split('.');
  if (parts.length >= 2) {
    // 取最后两部分作为基础域名
    const baseDomain = '.' + parts.slice(-2).join('.');
    return baseDomain;
  }

  return hostname;
}

/**
 * 设置 cookie
 * @param name cookie 名称
 * @param value cookie 值
 * @param days 过期天数（默认 30 天）
 * @param path cookie 路径（默认 /）
 */
export function setCookie(name: string, value: string, days: number = 30, path: string = '/'): void {
  if (typeof document === 'undefined') {
    return;
  }

  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);

  const domain = getCookieDomain();
  const cookieString = `${name}=${encodeURIComponent(value)}; expires=${expires.toUTCString()}; path=${path}${domain ? `; domain=${domain}` : ''}; SameSite=Lax`;

  document.cookie = cookieString;
}

/**
 * 获取 cookie
 * @param name cookie 名称
 * @returns cookie 值，如果不存在则返回 null
 */
export function getCookie(name: string): string | null {
  if (typeof document === 'undefined') {
    return null;
  }

  const nameEQ = name + '=';
  const cookies = document.cookie.split(';');

  for (let i = 0; i < cookies.length; i++) {
    let cookie = cookies[i];
    while (cookie.charAt(0) === ' ') {
      cookie = cookie.substring(1, cookie.length);
    }
    if (cookie.indexOf(nameEQ) === 0) {
      return decodeURIComponent(cookie.substring(nameEQ.length, cookie.length));
    }
  }

  return null;
}

/**
 * 删除 cookie
 * @param name cookie 名称
 * @param path cookie 路径（默认 /）
 */
export function removeCookie(name: string, path: string = '/'): void {
  if (typeof document === 'undefined') {
    return;
  }

  const domain = getCookieDomain();
  // 设置过期时间为过去的时间来删除 cookie
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path}${domain ? `; domain=${domain}` : ''}; SameSite=Lax`;
}

/**
 * 检查 cookie 是否存在
 * @param name cookie 名称
 * @returns 如果存在返回 true，否则返回 false
 */
export function hasCookie(name: string): boolean {
  return getCookie(name) !== null;
}
