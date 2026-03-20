# 开发指南

本文档说明项目的工程化优化和开发规范。

## 项目结构

```
src/
├── components/          # React 组件
│   ├── ErrorBoundary.tsx  # 全局错误边界
│   └── ui/              # UI 组件库
├── contexts/            # React Context
├── hooks/               # 自定义 Hooks
├── lib/                 # 工具库
│   ├── config.ts        # 应用配置
│   ├── constants.ts     # 常量定义
│   ├── logger.ts        # 日志工具
│   └── utils/           # 工具函数
│       ├── error-handler.ts  # 错误处理
│       ├── performance.ts    # 性能监控
│       └── storage.ts        # 本地存储
└── pages/               # 页面组件
```

## 核心功能

### 1. 错误处理

#### 全局错误边界
使用 `ErrorBoundary` 组件包裹应用，捕获 React 组件树中的错误：

```tsx
import { ErrorBoundary } from "@/components/ErrorBoundary";

<ErrorBoundary>
  <App />
</ErrorBoundary>
```

#### 错误处理工具
使用统一的错误处理工具：

```tsx
import { handleError, getErrorMessage } from "@/lib/utils/error-handler";

try {
  // 你的代码
} catch (error) {
  const appError = handleError(error, { context: "additional info" });
  const message = getErrorMessage(error);
}
```

### 2. 日志系统

使用统一的日志工具替代 `console.log`：

```tsx
import { logger } from "@/lib/logger";

logger.debug("调试信息", { data });
logger.info("信息", { data });
logger.warn("警告", { data });
logger.error("错误", error, { context });
logger.performance("操作名称", duration);
logger.track("用户行为", { properties });
```

### 3. 配置管理

使用统一的配置管理：

```tsx
import { config } from "@/lib/config";

// 访问配置
config.env                    // 当前环境
config.api.baseUrl            // API 地址
config.features.enableAnalytics  // 功能开关
```

### 4. 性能监控

使用性能监控工具：

```tsx
import { PerformanceMonitor } from "@/lib/utils/performance";

// 测量同步操作
const result = PerformanceMonitor.measureSync("操作名称", () => {
  // 你的代码
});

// 测量异步操作
const result = await PerformanceMonitor.measureAsync("操作名称", async () => {
  // 你的异步代码
});
```

### 5. 本地存储

使用类型安全的存储工具：

```tsx
import { storage, getLanguage, setLanguage } from "@/lib/utils/storage";

// 通用方法
storage.set("key", value);
const value = storage.get<Type>("key");
storage.remove("key");

// 便捷方法
setLanguage("zh");
const lang = getLanguage();
```

### 6. 常量管理

使用统一的常量定义：

```tsx
import { ROUTES, STORAGE_KEYS, ERROR_MESSAGES } from "@/lib/constants";

ROUTES.HOME
STORAGE_KEYS.LANGUAGE
ERROR_MESSAGES.NETWORK_ERROR
```

## 开发命令

```bash
# 开发服务器
npm run dev

# 构建生产版本
npm run build:prod

# 构建开发版本
npm run build:dev

# 类型检查
npm run type-check

# 代码检查
npm run lint

# 自动修复代码问题
npm run lint:fix

# 代码格式化
npm run format

# 检查代码格式
npm run format:check

# 预览构建结果
npm run preview
```

## 环境变量

创建 `.env` 文件（参考 `.env.example`）：

```env
VITE_APP_NAME=OranAI Vision Engine
VITE_API_BASE_URL=https://api.example.com
VITE_ENABLE_ANALYTICS=false
```

## 代码规范

### TypeScript

- 使用类型注解，避免使用 `any`
- 优先使用接口定义类型
- 使用 `const` 和 `as const` 定义常量

### 组件规范

- 使用函数组件和 Hooks
- 组件文件使用 PascalCase 命名
- 导出组件使用 `export default`

### 文件组织

- 相关文件放在同一目录
- 工具函数放在 `lib/utils`
- 常量定义放在 `lib/constants`
- 类型定义放在对应的文件中

## 性能优化

### 代码分割

项目已配置自动代码分割：
- React 相关库
- UI 组件库
- 工具库

### 懒加载

使用 React.lazy 进行组件懒加载：

```tsx
import { lazy } from "react";

const LazyComponent = lazy(() => import("./LazyComponent"));
```

### 缓存策略

QueryClient 已配置合理的缓存策略：
- 数据缓存时间：5分钟
- 垃圾回收时间：10分钟
- 自动重试机制

## 错误监控

### 开发环境

错误信息会显示在控制台，包含详细的堆栈信息。

### 生产环境

错误会自动上报到监控服务（需要配置）：
- Sentry（可选）
- LogRocket（可选）
- 自定义监控服务

## 最佳实践

1. **错误处理**：始终使用错误边界和错误处理工具
2. **日志记录**：使用 logger 替代 console.log
3. **类型安全**：充分利用 TypeScript 类型系统
4. **性能监控**：对关键操作进行性能测量
5. **代码复用**：使用工具函数和常量，避免重复代码
6. **配置管理**：使用统一的配置管理，避免硬编码

## 故障排查

### 常见问题

1. **构建失败**：运行 `npm run type-check` 检查类型错误
2. **运行时错误**：查看浏览器控制台和错误边界
3. **性能问题**：使用性能监控工具定位瓶颈

### 调试技巧

- 开发环境启用详细日志
- 使用 React DevTools 检查组件状态
- 使用浏览器性能分析工具

