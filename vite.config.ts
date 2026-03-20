import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    // 开发服务器优化
    hmr: {
      overlay: true,
    },
    // 代理配置，解决跨域问题
    proxy: {
      // 模型页面 API 代理（匹配 /api/pricing 等路径）
      '/api/pricing': {
        target: 'https://models.photog.art',
        changeOrigin: true,
      },
      // 模型页面其他 API 代理
      '/api/models': {
        target: 'https://models.photog.art',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/models/, ''),
      },
      // LIBRARY 页面 API 代理（匹配 /api/app 路径）
      '/api/app': {
        target: 'https://photog.art',
        changeOrigin: true,
      },
      // AUTH 相关 API 代理 - 代理到开发服务器
      '/auth': {
        // target: 'http://94.74.101.163:28080',
        target: 'http://192.168.112.253:8000/',
        changeOrigin: true,
        secure: false, // 如果是 http，设置为 false
        ws: true, // 支持 WebSocket
      },
      // OAuth 相关 API 代理（/oauth/callback/google 由前端 SPA 处理，不转发到后端）
      '/oauth': {
        // target: 'http://94.74.101.163:28080',
        target: 'http://192.168.112.253:8000/',
        changeOrigin: true,
        secure: false,
        bypass(req) {
          // 回调页由前端路由处理，返回 index.html 让 React Router 渲染 OAuthCallbackGoogle
          if (req.url?.startsWith('/oauth/callback/google')) {
            return '/index.html';
          }
        },
      },
      '/oauth2': {
        // target: 'http://94.74.101.163:28080',
        target: 'http://192.168.112.253:8000/',
        changeOrigin: true,
        secure: false,
      },
      // 验证码 API 代理
      '/api/captcha': {
        // target: 'http://94.74.101.163:28080',
        target: 'http://192.168.112.253:8000/',
        changeOrigin: true,
        secure: false,
      },
      // 注册 API 代理
      '/api/register': {
        // target: 'http://94.74.101.163:28080',
        target: 'http://192.168.112.253:8000/',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // 构建目标
    target: "es2015",
    // 输出目录
    outDir: "dist",
    // 生成 source map（生产环境可选）
    sourcemap: mode === "development",
    // 代码分割配置
    rollupOptions: {
      output: {
        // 手动代码分割
        manualChunks: {
          // React 相关库
          "react-vendor": ["react", "react-dom", "react-router-dom"],
          // UI 组件库
          "ui-vendor": [
            "@radix-ui/react-dialog",
            "@radix-ui/react-dropdown-menu",
            "@radix-ui/react-tooltip",
            "@radix-ui/react-toast",
          ],
          // 工具库
          "utils-vendor": ["framer-motion", "@tanstack/react-query"],
        },
        // 文件命名规则
        chunkFileNames: "assets/js/[name]-[hash].js",
        entryFileNames: "assets/js/[name]-[hash].js",
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name?.split(".") || [];
          const ext = info[info.length - 1];
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(ext)) {
            return "assets/images/[name]-[hash][extname]";
          }
          if (/woff2?|eot|ttf|otf/i.test(ext)) {
            return "assets/fonts/[name]-[hash][extname]";
          }
          return "assets/[name]-[hash][extname]";
        },
      },
    },
    // 压缩配置
    minify: mode === "production" ? "esbuild" : false,
    // Chunk 大小警告阈值（KB）
    chunkSizeWarningLimit: 1000,
    // 启用 CSS 代码分割
    cssCodeSplit: true,
  },
  // 优化依赖预构建
  optimizeDeps: {
    include: [
      "react",
      "react-dom",
      "react-router-dom",
      "@tanstack/react-query",
      "framer-motion",
      "@radix-ui/react-tooltip",
      "@radix-ui/react-dialog",
      "@radix-ui/react-dropdown-menu",
      "@radix-ui/react-toast",
    ],
  },
}));
