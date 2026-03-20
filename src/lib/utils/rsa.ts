/**
 * RSA 加密工具
 * 使用 jsencrypt 进行 RSA 公钥加密
 * 
 * 注意：需要安装 jsencrypt 包
 * npm install jsencrypt
 */

// 默认 RSA 公钥（如果后端提供，应该从配置或接口获取）
// 这里使用一个示例公钥，实际使用时应该从后端获取
const DEFAULT_PUBLIC_KEY = `MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBAM51dgYtMyF+tTQt80sfFOpSV27a7t9uaUVeFrdGiVxscuizE7H8SMntYqfn9lp8a5GH5P1/GGehVjUD2gF/4kcCAwEAAQ==`;

/**
 * RSA 加密密码
 * @param password 原始密码
 * @param publicKey RSA 公钥（可选，默认使用内置公钥）
 * @returns 加密后的密码
 */
export async function encryptPassword(
  password: string,
  publicKey?: string
): Promise<string> {
  try {
    // 尝试使用 jsencrypt（如果已安装）
    return await encryptPasswordWithJSEncrypt(password, publicKey);
  } catch (error) {
    // 如果 jsencrypt 未安装或加密失败，返回原始密码（仅用于开发测试）
    // 生产环境必须安装 jsencrypt 并正确配置 RSA 公钥
    console.warn('RSA encryption failed, using plain password (development only):', error);
    return password;
  }
}

/**
 * 使用 jsencrypt 进行 RSA 加密（推荐方案）
 * 需要安装 jsencrypt: npm install jsencrypt
 */
export async function encryptPasswordWithJSEncrypt(
  password: string,
  publicKey?: string
): Promise<string> {
  try {
    // 动态导入 jsencrypt（如果已安装）
    const JSEncrypt = (await import('jsencrypt')).default;
    const encrypt = new JSEncrypt();
    encrypt.setPublicKey(publicKey || DEFAULT_PUBLIC_KEY);
    const encrypted = encrypt.encrypt(password);
    
    if (!encrypted) {
      throw new Error('RSA encryption failed: encryption returned null');
    }
    
    return encrypted;
  } catch (error) {
    // 如果 jsencrypt 未安装，抛出错误
    if (error instanceof Error && error.message.includes('Cannot find module')) {
      throw new Error('jsencrypt is not installed. Please run: npm install jsencrypt');
    }
    throw error;
  }
}
