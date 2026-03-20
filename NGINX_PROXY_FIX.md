# Nginx 代理转发问题修复说明

## 🔍 问题分析

打包到服务器后请求接口报错的原因：

1. **生产环境配置使用绝对 URL**：
   - `authBaseUrl`: `http://94.74.101.163:28080`
   - `libraryBaseUrl`: `https://photog.art`
   - `modelsBaseUrl`: `https://models.photog.art`

2. **前端直接请求外部服务器**：
   - 浏览器会直接请求这些外部 URL
   - 不会经过 Nginx 代理
   - 导致 CORS 跨域问题

## ✅ 解决方案

### 方案一：修改前端配置（已修复）

**已修改 `src/lib/config.ts`**，让生产环境也使用相对路径：

```typescript
// 修改后（生产环境使用相对路径，通过 Nginx 代理）
authBaseUrl: import.meta.env.VITE_AUTH_API_BASE_URL || "",
libraryBaseUrl: import.meta.env.VITE_LIBRARY_API_BASE_URL || "",
modelsBaseUrl: import.meta.env.VITE_MODELS_API_BASE_URL || "",
```

这样所有 API 请求都会通过 Nginx 代理转发，避免 CORS 问题。

**重要**：修改配置后需要重新构建项目：
```bash
npm run build
```

### 方案二：使用环境变量（更灵活）

在构建时设置环境变量，让生产环境使用相对路径：

```bash
# 构建命令
VITE_AUTH_API_BASE_URL="" \
VITE_LIBRARY_API_BASE_URL="" \
VITE_MODELS_API_BASE_URL="" \
npm run build
```

或者在 `.env.production` 文件中设置：

```env
VITE_AUTH_API_BASE_URL=
VITE_LIBRARY_API_BASE_URL=
VITE_MODELS_API_BASE_URL=
```

## 📋 Nginx 代理配置检查清单

确保以下代理配置正确：

### ✅ AUTH API 代理
- `/auth/*` → `http://94.74.101.163:28080/auth/*`
- `/oauth/*` → `http://94.74.101.163:28080/oauth/*`
- `/oauth2/*` → `http://94.74.101.163:28080/oauth2/*`
- `/api/captcha/*` → `http://94.74.101.163:28080/api/captcha/*`
- `/api/register/*` → `http://94.74.101.163:28080/api/register/*`

### ✅ Models API 代理
- `/api/pricing` → `https://models.photog.art/api/pricing`
- `/api/models/*` → `https://models.photog.art/*` (移除前缀)

### ✅ Library API 代理
- `/api/app/*` → `https://photog.art/api/app/*` (保留完整路径)

## 🧪 测试步骤

1. **检查前端请求路径**：
   - 打开浏览器开发者工具
   - 查看 Network 标签
   - 确认 API 请求是相对路径（如 `/auth/login`）而不是绝对路径（如 `http://94.74.101.163:28080/auth/login`）

2. **检查 Nginx 日志**：
   ```bash
   tail -f /www/wwwlogs/www.oran.cn.log
   ```
   - 确认请求到达了 Nginx
   - 检查代理转发是否成功

3. **检查后端日志**：
   - 确认后端服务器收到了请求
   - 检查请求头是否正确（特别是 `Accept-Language` 和 `Authorization`）

## 🔧 常见错误及解决方法

### 错误 1: CORS 跨域错误
**原因**：前端直接请求外部服务器，未经过 Nginx 代理

**解决**：
- 修改 `config.ts`，使用相对路径
- 或确保 Nginx 代理配置正确

### 错误 2: 404 Not Found
**原因**：Nginx 代理路径配置错误

**解决**：
- 检查 `location` 匹配规则
- 检查 `proxy_pass` 配置
- 检查路径重写规则

### 错误 3: 502 Bad Gateway
**原因**：后端服务器无法访问

**解决**：
- 检查后端服务器是否正常运行
- 检查防火墙是否允许访问
- 检查 `proxy_pass` 目标地址是否正确

### 错误 4: Accept-Language 头未传递
**原因**：Nginx 未正确转发请求头

**解决**：
- 确保所有代理配置中都包含 `proxy_set_header Accept-Language $http_accept_language;`

## 📝 推荐配置

### 修改 config.ts（推荐）

```typescript
api: {
  // 生产环境也使用相对路径，通过 Nginx 代理
  authBaseUrl: import.meta.env.VITE_AUTH_API_BASE_URL || "",
  libraryBaseUrl: import.meta.env.VITE_LIBRARY_API_BASE_URL || "",
  modelsBaseUrl: import.meta.env.VITE_MODELS_API_BASE_URL || "",
  // ... 其他配置
}
```

### 或者使用环境变量

创建 `.env.production`：
```env
VITE_AUTH_API_BASE_URL=
VITE_LIBRARY_API_BASE_URL=
VITE_MODELS_API_BASE_URL=
```

这样构建后的代码会使用相对路径，所有请求都会通过 Nginx 代理转发。
