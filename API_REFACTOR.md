# API 接口封装说明

## 📁 文件结构

```
src/lib/api/
├── index.ts          # 统一导出文件
├── client.ts         # API 客户端封装（核心）
├── auth.ts           # 认证相关接口
├── library.ts        # Library 相关接口
├── models.ts         # Models 相关接口
└── geolocation.ts    # 地理位置相关接口
```

## 🎯 核心设计

### 1. API 客户端 (`client.ts`)

提供了统一的 `ApiClient` 类，封装了所有 API 请求的通用逻辑：

```typescript
// 创建客户端实例
const client = createApiClient(baseUrl);

// 使用客户端发送请求
const data = await client.get<T>('/endpoint', { needAuth: true });
const data = await client.post<T>('/endpoint', body, { needAuth: true });
```

**特性：**
- ✅ 自动添加 Authorization 头（Bearer token）
- ✅ 统一错误处理（包括 401 token 过期）
- ✅ 统一日志记录
- ✅ 支持自定义 headers 和配置
- ✅ 类型安全的请求和响应

### 2. 预配置的客户端实例

```typescript
// AUTH API 客户端
import { authApiClient } from '@/lib/api/client';
await authApiClient.get('/auth/user/info');

// LIBRARY API 客户端
import { libraryApiClient } from '@/lib/api/client';
await libraryApiClient.get('/api/app/material-square/page');

// MODELS API 客户端
import { modelsApiClient } from '@/lib/api/client';
await modelsApiClient.get('/api/pricing');
```

## 📝 使用示例

### 基础用法

```typescript
import { authApiClient } from '@/lib/api/client';

// GET 请求（需要认证）
const userInfo = await authApiClient.get<UserInfo>('/auth/user/info', {
  needAuth: true,
});

// POST 请求（不需要认证）
const loginResult = await authApiClient.post<{ token: string }>('/auth/login', {
  email: 'user@example.com',
  password: 'password',
}, {
  needAuth: false,
});
```

### 在现有 API 文件中使用

```typescript
// 之前的方式
export async function getUserInfo(): Promise<UserInfoResponse> {
  const response = await fetch(`${config.api.authBaseUrl}/auth/user/info`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${getToken()}`,
    },
  });
  // ... 处理响应
}

// 现在的方式
export async function getUserInfo(): Promise<UserInfoResponse> {
  const data = await authApiClient.get<UserInfo>('/auth/user/info', {
    needAuth: true,
  });
  return {
    ...data,
    data: data.data!,
  } as UserInfoResponse;
}
```

## 🔧 配置选项

### ApiRequestOptions

```typescript
interface ApiRequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  body?: any;                    // 请求体
  headers?: Record<string, string>; // 自定义 headers
  needAuth?: boolean;            // 是否需要认证（默认 true）
  contentType?: string;          // Content-Type（默认 'application/json'）
  baseUrl?: string;              // 自定义 base URL
}
```

## ✨ 优势

### 1. **代码复用**
   - 所有 API 请求使用相同的配置和错误处理逻辑
   - 减少重复代码

### 2. **统一管理**
   - 集中管理认证、错误处理、日志记录
   - 易于维护和扩展

### 3. **类型安全**
   - 完整的 TypeScript 类型支持
   - 编译时类型检查

### 4. **易于测试**
   - 可以轻松 mock 客户端实例
   - 统一的接口便于单元测试

### 5. **自动处理**
   - 自动添加 Authorization 头
   - 自动处理 401 错误（token 过期）
   - 自动记录请求和响应日志

## 📋 迁移指南

### 步骤 1: 导入客户端

```typescript
import { authApiClient } from './client';
// 或
import { libraryApiClient } from './client';
```

### 步骤 2: 替换 fetch 调用

```typescript
// 旧代码
const response = await fetch(url, {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`,
  },
});

// 新代码
const data = await authApiClient.get('/endpoint', {
  needAuth: true,
});
```

### 步骤 3: 处理响应

```typescript
// 旧代码
const json = await response.json();
if (!json.success) {
  throw new Error(json.msg);
}

// 新代码
// handleHttpResponse 已经处理了错误，直接使用 data
const data = await authApiClient.get<T>('/endpoint');
// data 已经是 ApiResponse<T> 格式
```

## 🔍 已封装的接口

### Auth API (`auth.ts`)
- ✅ `login` - 登录
- ✅ `register` - 注册
- ✅ `getUserInfo` - 获取用户信息
- ✅ `sendCaptcha` - 发送验证码
- ✅ `getGoogleOAuthUrl` - 获取 Google OAuth URL
- ✅ `oauth2Authorize` - OAuth2 授权

### Library API (`library.ts`)
- ✅ `fetchMaterialSquareList` - 获取素材列表
- ✅ `fetchMaterialSquareDetail` - 获取素材详情
- ✅ `fetchMaterialSquareAudioList` - 获取音频列表
- ✅ `fetchMaterialSquareAudioDetail` - 获取音频详情
- ✅ `fetchMaterialSquareModelList` - 获取模型列表
- ✅ `fetchMaterialSquareModelDetail` - 获取模型详情

### Models API (`models.ts`)
- ✅ `fetchPricingData` - 获取定价数据

## 🚀 未来扩展

可以轻松添加新的 API 客户端：

```typescript
// 创建新的客户端
export const customApiClient = createApiClient('https://api.example.com');

// 使用新客户端
const data = await customApiClient.get('/custom/endpoint');
```
