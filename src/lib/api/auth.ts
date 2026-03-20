import { logger } from '@/lib/logger';
import { config } from '@/lib/config';
import { handleHttpResponse, handleApiResponse } from '@/lib/utils/api-response-handler';
import { createAuthHeaders } from '@/lib/utils/api-request';
import { authApiClient } from './client';

// 登录请求参数（邮箱密码）
export interface LoginRequest {
  clientId: string;
  authType: 'EMAIL_PASSWORD';
  email: string;
  password: string;
}

// Google OAuth 回调登录请求参数（POST /auth/login）
export interface GoogleOAuthCallbackLoginRequest {
  clientId: string;
  authType: 'SOCIAL';
  source: 'google';
  code: string;
  state: string;
}

// 登录响应
export interface LoginResponse {
  code: number;
  msg: string;
  success: boolean;
  timestamp: number;
  data: {
    token: string;
  };
}

// 注册请求参数
export interface RegisterRequest {
  email: string;
  password: string;
  captcha: string;
}

// 注册响应
export interface RegisterResponse {
  code: number;
  msg: string;
  success: boolean;
  timestamp: number;
  data: boolean;
}

// 用户信息响应
export interface UserInfo {
  id: number;
  username: string;
  nickname: string;
  gender: number;
  email: string;
  phone: string;
  avatar: string;
  description: string;
  pwdResetTime: string;
  pwdExpired: boolean;
  registrationDate: string;
  deptId: number;
  deptName: string;
  permissions: string[];
  roles: string[];
  roleNames: string;
}

export interface UserInfoResponse {
  code: number;
  msg: string;
  success: boolean;
  timestamp: number;
  data: UserInfo;
}

// 发送验证码请求参数
export interface SendCaptchaRequest {
  email: string;
}

// 发送验证码响应
export interface SendCaptchaResponse {
  code: number;
  msg: string;
  success: boolean;
  timestamp: number;
  data: boolean;
}

// 忘记密码请求参数（password 需与注册一致使用 RSA 加密）
export interface ForgotPasswordRequest {
  email: string;
  password: string;
  captcha: string;
}

// 忘记密码响应
export interface ForgotPasswordResponse {
  code: number;
  msg: string;
  success: boolean;
  timestamp: number;
  data: null;
}

// Google OAuth 响应
export interface GoogleOAuthResponse {
  code: number;
  msg: string;
  success: boolean;
  timestamp: number;
  data: {
    authorizeUrl: string;
  };
}

// OAuth2 授权响应
export interface OAuth2AuthorizeResponse {
  code: number;
  msg: string;
  success: boolean;
  timestamp: number;
  data: {
    code: string;
  } | null;
}

/**
 * 登录接口
 */
export async function login(params: LoginRequest): Promise<LoginResponse> {
  try {
    const data = await authApiClient.post<{ token: string }>('/auth/login', params, {
      needAuth: false, // 登录不需要认证
    });
    
    logger.info('Login successful', { email: params.email });
    return {
      ...data,
      data: data.data!,
    } as LoginResponse;
  } catch (error) {
    logger.error('Login failed', error as Error);
    throw error;
  }
}

/**
 * 注册接口
 */
export async function register(params: RegisterRequest): Promise<RegisterResponse> {
  try {
    const data = await authApiClient.post<boolean>('/api/register/email', params, {
      needAuth: false, // 注册不需要认证
    });
    
    logger.info('Register successful', { email: params.email });
    return {
      ...data,
      data: data.data ?? false,
    } as RegisterResponse;
  } catch (error) {
    logger.error('Register failed', error as Error);
    throw error;
  }
}

/**
 * 获取用户信息接口
 * 注意：token 通过 Authorization 请求头传递（Bearer token）
 */
export async function getUserInfo(token?: string): Promise<UserInfoResponse> {
  try {
    const data = await authApiClient.get<UserInfo>('/auth/user/info', {
      needAuth: true,
    });
    
    logger.info('Get user info successful', { userId: data.data?.id });
    return {
      ...data,
      data: data.data!,
    } as UserInfoResponse;
  } catch (error) {
    logger.error('Get user info failed', error as Error);
    throw error;
  }
}

/**
 * 忘记密码接口（POST /auth/forgot-password，password 需 RSA 加密）
 */
export async function forgotPassword(params: ForgotPasswordRequest): Promise<ForgotPasswordResponse> {
  try {
    const data = await authApiClient.post<null>('/auth/forgot-password', params, {
      needAuth: false,
    });
    logger.info('Forgot password request successful', { email: params.email });
    return {
      ...data,
      data: null,
    } as ForgotPasswordResponse;
  } catch (error) {
    logger.error('Forgot password failed', error as Error);
    throw error;
  }
}

/**
 * 发送验证码接口
 */
export async function sendCaptcha(params: SendCaptchaRequest): Promise<SendCaptchaResponse> {
  try {
    const queryParams = new URLSearchParams({
      email: params.email,
    });

    const data = await authApiClient.get<boolean>(`/api/captcha/mail?${queryParams.toString()}`, {
      needAuth: false, // 发送验证码不需要认证
    });
    
    logger.info('Send captcha successful', { email: params.email });
    return {
      ...data,
      data: data.data ?? false,
    } as SendCaptchaResponse;
  } catch (error) {
    logger.error('Send captcha failed', error as Error);
    throw error;
  }
}

/**
 * Google OAuth 回调登录接口（POST /auth/login，用 code/state 换 token）
 */
export async function loginWithGoogleCallback(
  params: GoogleOAuthCallbackLoginRequest,
): Promise<LoginResponse> {
  try {
    const data = await authApiClient.post<{ token: string }>('/auth/login', params, {
      needAuth: false,
    });
    logger.info('Google OAuth callback login successful');
    return {
      ...data,
      data: data.data!,
    } as LoginResponse;
  } catch (error) {
    logger.error('Google OAuth callback login failed', error as Error);
    throw error;
  }
}

/**
 * Google OAuth 登录接口（GET /auth/google，返回跳转地址）
 */
export async function getGoogleOAuthUrl(): Promise<GoogleOAuthResponse> {
  try {
    const data = await authApiClient.get<{ authorizeUrl: string }>('/auth/google', {
      needAuth: false, // 获取 OAuth URL 不需要认证
    });
    
    logger.info('Get Google OAuth URL successful');
    return {
      ...data,
      data: data.data!,
    } as GoogleOAuthResponse;
  } catch (error) {
    logger.error('Get Google OAuth URL failed', error as Error);
    throw error;
  }
}

/**
 * OAuth2 授权接口
 * 注意：token 通过 Authorization 请求头传递（Bearer token）
 */
export async function oauth2Authorize(token?: string): Promise<OAuth2AuthorizeResponse> {
  try {
    const data = await authApiClient.get<{ code: string } | null>('/oauth2/authorize?clientId=portal-a', {
      needAuth: true,
    });
    
    logger.info('OAuth2 authorize successful');
    return {
      ...data,
      data: data.data ?? null,
    } as OAuth2AuthorizeResponse;
  } catch (error) {
    logger.error('OAuth2 authorize failed', error as Error);
    throw error;
  }
}
