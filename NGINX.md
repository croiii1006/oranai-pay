# Nginx 配置文档

本文档包含 OranAI Vision Engine 项目的 Nginx 配置说明和优化指南。

## 📁 文件说明

- `nginx-optimized.conf` - **生产环境配置文件**（宝塔面板实际使用的配置）
  - 包含完整的 SSL、代理、缓存等配置
  - 适用于 `home.photog.art` 域名
  - 包含所有 API 代理配置

## 🚀 快速开始

### 1. 在宝塔面板中配置

1. 登录宝塔面板
2. 进入 **网站** → 选择 `home.photog.art` → **设置**
3. 点击 **配置文件** 标签
4. 将 `nginx-optimized.conf` 的内容复制到配置文件中
5. 点击 **保存** 并 **重载配置**

### 2. 自定义配置（如果需要）

如果您的域名或路径不同，需要修改以下配置：

```nginx
# 修改域名
server_name home.photog.art;  # 替换为您的域名

# 修改网站根目录
root /www/wwwroot/home.photog.art;  # 替换为您的实际项目路径

# 修改日志路径（可选）
access_log /www/wwwlogs/home.photog.art.log;
error_log /www/wwwlogs/home.photog.art.error.log;
```

## 📋 配置说明

### API 代理配置

所有 API 请求的代理配置如下：

| 前端请求路径 | 实际转发到 | 说明 |
|------------|-----------|------|
| `/auth/*` | `http://94.74.101.163:28080/auth/*` | AUTH 登录、用户信息接口 |
| `/oauth/*` | `http://94.74.101.163:28080/oauth/*` | OAuth 相关接口 |
| `/oauth2/*` | `http://94.74.101.163:28080/oauth2/*` | OAuth2 授权接口 |
| `/api/captcha/*` | `http://94.74.101.163:28080/api/captcha/*` | 验证码接口 |
| `/api/register/*` | `http://94.74.101.163:28080/api/register/*` | 注册接口 |
| `/api/models/*` | `https://models.photog.art/*` | Models API（移除前缀） |
| `/api/library/*` | `https://photog.art/*` | Library API（移除前缀） |

### 性能优化配置

#### 1. Gzip 压缩
- **状态**：已启用
- **压缩级别**：6（平衡压缩率和 CPU 使用）
- **最小压缩大小**：1024 字节
- **支持类型**：文本、JSON、JavaScript、CSS、XML、字体等
- **效果**：可减少 60-80% 的传输数据量

#### 2. 静态资源缓存
- **图片资源**：缓存 365 天（`.gif`, `.jpg`, `.png`, `.svg`, `.ico` 等）
- **字体文件**：缓存 365 天（`.woff`, `.woff2`, `.ttf`, `.eot` 等）
- **JS/CSS**：缓存 30 天
- **缓存策略**：`Cache-Control: public, immutable`

#### 3. HTTP/2 和 QUIC
- **HTTP/2**：已启用
- **QUIC**：已启用（HTTP/3）
- **效果**：提升并发性能和加载速度

### 安全配置

#### 1. SSL/TLS 配置
- **协议版本**：TLSv1.2, TLSv1.3（已移除不安全的 TLSv1.1）
- **加密套件**：使用安全的加密算法
- **HSTS**：已启用（`Strict-Transport-Security`）
- **自动重定向**：HTTP 自动重定向到 HTTPS

#### 2. 安全响应头
在 SPA 路由中添加了以下安全头：
- `X-Frame-Options: SAMEORIGIN` - 防止点击劫持
- `X-Content-Type-Options: nosniff` - 防止 MIME 类型嗅探
- `X-XSS-Protection: 1; mode=block` - XSS 保护
- `Referrer-Policy: strict-origin-when-cross-origin` - 控制 referrer 信息

#### 3. 文件访问限制
- 禁止访问隐藏文件（`.` 开头的文件）
- 禁止访问备份文件（`~` 结尾的文件）
- 禁止访问敏感文件（`.env`, `.git`, `.htaccess` 等）

### CORS 配置

所有 API 代理都配置了 CORS 支持：
- `Access-Control-Allow-Origin: *` - 允许所有来源
- `Access-Control-Allow-Methods` - 支持 GET, POST, PUT, DELETE, OPTIONS
- `Access-Control-Allow-Headers` - 包含 Cookie，确保 cookies 可以正常传递
- `Access-Control-Allow-Credentials: true` - 允许携带凭证

### 代理配置

#### 超时设置
- **AUTH API**：60 秒（连接、发送、读取）
- **其他 API**：30 秒（连接、发送、读取）

#### 缓冲设置
- `proxy_buffer_size`: 4k
- `proxy_buffers`: 8 4k
- `proxy_busy_buffers_size`: 8k

#### WebSocket 支持
AUTH API 代理支持 WebSocket 连接（如果需要）。

## ⚙️ 环境配置

### 开发环境
- **AUTH API 地址**：`http://94.74.101.163:28080`
- **配置位置**：`src/lib/config.ts`

### 生产环境
- **AUTH API 地址**：`http://94.74.101.163:28080`
- **配置位置**：`src/lib/config.ts` 和 Nginx 代理配置

## 🔧 故障排查

### 1. 检查配置语法
在宝塔面板中点击 **测试配置**，检查 Nginx 配置是否有语法错误。

### 2. 查看日志
```bash
# 访问日志
tail -f /www/wwwlogs/home.photog.art.log

# 错误日志
tail -f /www/wwwlogs/home.photog.art.error.log
```

### 3. 常见问题

#### API 请求失败
- 检查后端服务是否正常运行：访问 `http://94.74.101.163:28080`
- 检查防火墙是否允许 28080 端口访问
- 检查 Nginx 代理配置是否正确

#### Cookies 无法传递
- 确保后端服务器支持从 cookies 中读取 token
- 确保 cookies 的 domain 配置正确（`.photog.art`）
- 检查 CORS 配置中是否包含 `Cookie` 头

#### 静态资源无法加载
- 检查网站根目录路径是否正确
- 检查文件权限（确保 Nginx 有读取权限）
- 检查缓存配置是否生效

#### SSL 证书问题
- 检查证书文件路径是否正确
- 检查证书是否过期
- 在宝塔面板中重新申请或更新证书

## 🧪 测试建议

### 1. 功能测试
- ✅ 访问网站首页，检查是否能正常加载
- ✅ 测试登录功能，检查 API 请求是否正常
- ✅ 测试注册功能
- ✅ 测试获取用户信息
- ✅ 检查 cookies 是否正确传递

### 2. 性能测试
- ✅ 使用浏览器开发者工具检查 Gzip 压缩是否生效
- ✅ 检查静态资源缓存是否生效（查看 Response Headers）
- ✅ 使用 PageSpeed Insights 测试页面性能
- ✅ 检查 HTTP/2 是否启用（查看 Network 面板的 Protocol 列）

### 3. 安全测试
- ✅ 检查安全头是否正确设置（使用 securityheaders.com）
- ✅ 测试 CORS 是否正常工作
- ✅ 检查 HTTPS 重定向是否正常
- ✅ 测试 SSL 证书是否有效

## 📝 注意事项

1. **Cookies 配置**
   - 确保后端服务器支持从 cookies 中读取 token
   - 确保 cookies 的 domain 配置正确（`.photog.art`）

2. **防火墙配置**
   - 确保服务器防火墙允许 `94.74.101.163:28080` 的访问

3. **SSL 证书**
   - 生产环境必须使用有效的 SSL 证书
   - 证书过期前及时更新

4. **备份配置**
   - 修改配置前请先备份
   - 建议使用版本控制管理配置文件

## 🔗 相关文档

- [宝塔面板官方文档](https://www.bt.cn/bbs/forum-40-1.html)
- [Nginx 官方文档](https://nginx.org/en/docs/)
- [项目开发文档](./DEVELOPMENT.md)
