import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Globe, Sun, Moon, LogOut, Eye, EyeOff } from "lucide-react";
import CreditPill from "@/components/CreditPill";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { login, register, getUserInfo, sendCaptcha, getGoogleOAuthUrl, forgotPassword } from "@/lib/api/auth";
import { encryptPassword } from "@/lib/utils/rsa";
import {
  saveToken,
  saveUserInfo,
  clearAuth,
  getUserInfo as getCachedUserInfo,
  getToken,
} from "@/lib/utils/auth-storage";
import type { UserInfo } from "@/lib/api/auth";

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  isVisible?: boolean;
  setLibrarySubTab?: (tab: "video" | "voice" | "model") => void;
}

interface UserData {
  username: string;
  email: string;
  nickname?: string;
  avatar?: string;
}

const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  sidebarOpen,
  setSidebarOpen,
  isVisible = true,
  setLibrarySubTab,
}) => {
  const { language, setLanguage, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [user, setUser] = useState<UserData | null>(null);

  // Form fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [verificationCode, setVerificationCode] = useState("");

  // Password visibility
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Loading and error states
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSendingCode, setIsSendingCode] = useState(false);
  const [codeCountdown, setCodeCountdown] = useState(0);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const closeMenuTimerRef = useRef<NodeJS.Timeout | null>(null);
  const openedFromUrlRef = useRef<boolean>(false); // 记录是否通过 URL 参数打开登录框
  
  // 从缓存加载用户信息（在 App 初始化检查完成后）
  useEffect(() => {
    // 延迟一点确保 App 的初始化检查完成
    const timer = setTimeout(() => {
      const cachedUser = getCachedUserInfo();
      const token = getToken();
      if (cachedUser && token) {
        setUser({
          username: cachedUser.username,
          email: cachedUser.email,
          nickname: cachedUser.nickname,
          avatar: cachedUser.avatar,
        });
      } else {
        // 如果没有 token 或用户信息，确保是未登录状态
        setUser(null);
      }
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // 检查 URL 参数，如果存在 ?logon=1，自动弹出登录框
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const logonParam = urlParams.get('logon');
    
    if (logonParam === '1') {
      // 标记为通过 URL 参数打开
      openedFromUrlRef.current = true;
      
      // 打开登录对话框，并设置为登录模式（不是注册模式）
      setDialogOpen(true);
      setIsSignUp(false);
      
      // 可选：从 URL 中移除 logon 参数，避免刷新页面时再次弹出
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.delete('logon');
      window.history.replaceState({}, '', newUrl.toString());
    }
  }, []);

  // 清理定时器
  useEffect(() => {
    return () => {
      if (closeMenuTimerRef.current) {
        clearTimeout(closeMenuTimerRef.current);
      }
    };
  }, []);

  // 处理菜单打开
  const handleMenuOpen = (menuId: string | null) => {
    // 清除关闭定时器
    if (closeMenuTimerRef.current) {
      clearTimeout(closeMenuTimerRef.current);
      closeMenuTimerRef.current = null;
    }
    setOpenMenu(menuId);
  };

  // 处理菜单关闭（延迟关闭）
  const handleMenuClose = () => {
    // 清除之前的定时器
    if (closeMenuTimerRef.current) {
      clearTimeout(closeMenuTimerRef.current);
    }
    // 延迟关闭，给用户时间移动到菜单
    closeMenuTimerRef.current = setTimeout(() => {
      setOpenMenu(null);
      closeMenuTimerRef.current = null;
    }, 200); // 200ms 延迟
  };

  const tabs = [
    { id: "solution", label: t("nav.solution") },
    { id: "models", label: t("nav.models") },
    { id: "products", label: t("nav.products") },
    { id: "pricing", label: t("nav.pricing") },
    { id: "library", label: t("nav.library") },
  ];

  const menuConfigs: Record<
    string,
    {
      sections: { title: string; items: string[] }[];
    }
  > = {
    solution: {
      sections: [
        {
          title: language === "en" ? "Scenario Solutions" : "场景解决方案",
          items:
            language === "en"
              ? ["GEO", "TSocial Media Marketing", "Email Marketing", "Sales Support"]
              : ["GEO", "社媒营销", "邮件营销", "销售客服"],
        },
        {
          title: language === "en" ? "Industry Solutions" : "行业解决方案",
          items:
            language === "en"
              ? ["Beauty & FMCG", "Consumer Electronics", "Cross-border Expansion"]
              : ["美妆快消", "消费电子", "跨境出海"],
        },
      ],
    },
    models: {
      sections: [
        {
          title: language === "en" ? "Platform Capabilities" : "平台能力",
          items: language === "en" ? ["Data Center", "Model Library", "Skills", "MiniApps"] : ["数据中心", "模型库", "Skills", "MiniApps"],
        },
      ],
    },
    products: {
      sections: [
        {
          title: language === "en" ? "Product Matrix" : "产品矩阵",
          items:
            language === "en"
              ? ["Data Infrastructure", "Insights Hub", "Strategy Engine", "Content Factory"]
              : ["数据基建", "洞察中心", "策略引擎", "内容工厂"],
        },
      ],
    },
    library: {
      sections: [
        {
          title: language === "en" ? "Inspiration Library" : "灵感素材库",
          items: language === "en" ? ["Video", "Voice", "Model"] : ["视频", "语音", "模特"],
        },
      ],
    },
  };

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "zh" : "en");
  };

  const termsUrl = `https://policies.photog.art/terms?lang=${language === "en" ? "en" : "zh"}`;
  const privacyUrl = `https://policies.photog.art/privacy?lang=${language === "en" ? "en" : "zh"}`;

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setVerificationCode("");
    setShowPassword(false);
    setShowConfirmPassword(false);
    setError(null);
    setCodeCountdown(0);
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      // 加密密码
      const encryptedPassword = await encryptPassword(password);

      // 调用登录接口
      const response = await login({
        clientId: "portal-a",
        authType: "EMAIL_PASSWORD",
        email: email.trim(),
        password: encryptedPassword,
      });
      
      // 保存 token（保存到 cookies 和 localStorage）
      saveToken(response.data.token);
      
      // 获取用户信息（token 通过 Authorization 头传递）
      const userInfoResponse = await getUserInfo();
      
      // 保存用户信息到缓存
      saveUserInfo(userInfoResponse.data);

      // 更新 UI 状态
      setUser({
        username: userInfoResponse.data.username,
        email: userInfoResponse.data.email,
        nickname: userInfoResponse.data.nickname,
        avatar: userInfoResponse.data.avatar,
      });

      setDialogOpen(false);
      resetForm();
      
      // 如果是通过 URL 参数打开的登录框，登录成功后返回上一页
      if (openedFromUrlRef.current) {
        openedFromUrlRef.current = false; // 重置标记
        // 延迟一下，确保对话框关闭动画完成
        setTimeout(() => {
          window.history.back();
        }, 300);
      }
    } catch (error) {
      console.error('Login failed:', error);
      // 如果是 401 错误（token 过期），清除用户状态
      const errorMessage = error instanceof Error ? error.message : String(error);
      if (errorMessage.includes('401') || errorMessage.includes('登录已过期') || errorMessage.includes('token')) {
        setUser(null);
      }
      setError(
        error instanceof Error
          ? error.message
          : language === "en"
            ? "Login failed. Please try again."
            : "登录失败，请重试。",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // 验证密码匹配
    if (password !== confirmPassword) {
      setError(language === "en" ? "Passwords do not match" : "两次密码不一致");
      return;
    }

    // 验证验证码
    if (!verificationCode || verificationCode.trim() === "") {
      setError(language === "en" ? "Please enter verification code" : "请输入验证码");
      return;
    }

    setIsLoading(true);

    try {
      // 加密密码
      const encryptedPassword = await encryptPassword(password);

      // 调用注册接口
      await register({
        email: email.trim(),
        password: encryptedPassword,
        captcha: verificationCode.trim(),
      });

      // 注册成功后，自动登录
      const loginResponse = await login({
        clientId: "portal-a",
        authType: "EMAIL_PASSWORD",
        email: email.trim(),
        password: encryptedPassword,
      });
      
      // 保存 token（保存到 cookies 和 localStorage）
      saveToken(loginResponse.data.token);
      
      // 获取用户信息（token 通过 Authorization 头传递）
      const userInfoResponse = await getUserInfo();
      
      // 保存用户信息到缓存
      saveUserInfo(userInfoResponse.data);

      // 更新 UI 状态
      setUser({
        username: userInfoResponse.data.username,
        email: userInfoResponse.data.email,
        nickname: userInfoResponse.data.nickname,
        avatar: userInfoResponse.data.avatar,
      });

      setDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error('Register failed:', error);
      // 如果是 401 错误（token 过期），清除用户状态
      const errorMessage = error instanceof Error ? error.message : String(error);
      if (errorMessage.includes('401') || errorMessage.includes('登录已过期') || errorMessage.includes('token')) {
        setUser(null);
      }
      setError(
        error instanceof Error
          ? error.message
          : language === "en"
            ? "Registration failed. Please try again."
            : "注册失败，请重试。",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = () => {
    clearAuth();
    setUser(null);
  };

  const openSignIn = () => {
    setIsSignUp(false);
    resetForm();
    setDialogOpen(true);
  };

  const openSignUp = () => {
    setIsSignUp(true);
    setIsForgotPassword(false);
    resetForm();
    setDialogOpen(true);
  };

  const openForgotPassword = () => {
    setIsForgotPassword(true);
    setIsSignUp(false);
    setError(null);
    setDialogOpen(true);
  };

  const backToLogin = () => {
    setIsForgotPassword(false);
    setError(null);
  };

  // 处理对话框关闭
  const handleDialogClose = (open: boolean) => {
    setDialogOpen(open);
    if (!open) {
      setIsForgotPassword(false);
      if (openedFromUrlRef.current) {
        openedFromUrlRef.current = false;
      }
    }
  };

  const handleSendCode = async () => {
    // 验证邮箱
    if (!email || !email.trim()) {
      setError(language === "en" ? "Please enter your email address" : "请输入邮箱地址");
      return;
    }

    // 验证邮箱格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setError(language === "en" ? "Please enter a valid email address" : "请输入有效的邮箱地址");
      return;
    }

    // 如果正在倒计时，不允许重复发送
    if (codeCountdown > 0) {
      return;
    }

    setIsSendingCode(true);
    setError(null);

    try {
      await sendCaptcha({ email: email.trim() });

      // 开始倒计时（60秒）
      setCodeCountdown(60);
      const countdownInterval = setInterval(() => {
        setCodeCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(countdownInterval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (error) {
      console.error("Send captcha failed:", error);
      setError(
        error instanceof Error
          ? error.message
          : language === "en"
            ? "Failed to send verification code. Please try again."
            : "发送验证码失败，请重试。",
      );
    } finally {
      setIsSendingCode(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError(null);
    setIsGoogleLoading(true);
    try {
      const res = await getGoogleOAuthUrl();
      if (res.success && res.data?.authorizeUrl) {
        window.location.href = res.data.authorizeUrl;
        return;
      }
      setError(
        language === "en"
          ? "Failed to get Google login link."
          : "获取 Google 登录链接失败。",
      );
    } catch (err) {
      const msg =
        language === "en"
          ? "Google login failed. Please try again."
          : "Google 登录失败，请重试。";
      setError(msg);
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      setError(language === "en" ? "Please enter your email address" : "请输入邮箱地址");
      return;
    }
    if (!emailRegex.test(email.trim())) {
      setError(language === "en" ? "Please enter a valid email address" : "请输入有效的邮箱地址");
      return;
    }
    if (!verificationCode.trim()) {
      setError(language === "en" ? "Please enter the verification code" : "请输入验证码");
      return;
    }
    if (!password) {
      setError(language === "en" ? "Please enter your new password" : "请输入新密码");
      return;
    }
    if (password.length < 6) {
      setError(language === "en" ? "Password must be at least 6 characters" : "密码至少 6 位");
      return;
    }
    if (password !== confirmPassword) {
      setError(language === "en" ? "Passwords do not match" : "两次输入的密码不一致");
      return;
    }

    setIsLoading(true);
    try {
      const encryptedPassword = await encryptPassword(password);
      await forgotPassword({
        email: email.trim(),
        password: encryptedPassword,
        captcha: verificationCode.trim(),
      });
      resetForm();
      setIsForgotPassword(false);
      setError(null);
      setDialogOpen(false);
      toast.success(language === "en" ? "Password reset successfully" : "密码重置成功");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : language === "en"
            ? "Reset password failed. Please try again."
            : "重置密码失败，请重试。",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const getInitials = (name: string) => {
    return name.slice(0, 1).toUpperCase();
  };

  return (
    <>
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-full pointer-events-none"
      }`}
    >
      <div className="backdrop-blur bg-background/20 dark:bg-background/10">
        <div className="w-full px-6 sm:px-10 lg:px-16">
          <div className="relative flex items-center justify-between h-16">
            {/* Left - Logo with glassmorphism */}
            <div className="flex items-center space-x-3 z-10">
              {/* <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-lg text-foreground/80 hover:text-foreground hover:bg-accent transition-colors duration-200"
                aria-label="Toggle menu"
              >
                {sidebarOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button> */}
              <div 
                onClick={() => setActiveTab("hero")}
                className="glass px-4 py-1.5 rounded-full cursor-pointer hover:bg-accent/50 transition-all duration-300 glow-sm border border-foreground/10 dark:border-transparent"
              >
                <span 
                  className="text-lg font-semibold tracking-tight bg-clip-text text-transparent"
                  style={{
                    backgroundImage: "linear-gradient(90deg, hsl(0 0% 20%), hsl(0 0% 40%) 30%, hsl(0 0% 60%) 50%)",
                  }}
                >
                  <span className="dark:hidden">OranAI</span>
                </span>
                <span 
                  className="hidden dark:inline text-lg font-semibold tracking-tight bg-clip-text text-transparent"
                  style={{
                    backgroundImage:
                      "linear-gradient(90deg, hsl(0 0% 40%), hsl(0 0% 70%) 30%, hsl(0 0% 100%) 60%, hsl(0 0% 100%))",
                  }}
                >
                  OranAI
                </span>
              </div>
            </div>

            {/* Center - Main Navigation Tabs - Absolutely positioned for true center */}
            <div className="hidden md:flex flex-1 justify-center relative" onMouseLeave={handleMenuClose}>
              <nav className="flex items-center">
                <div className="rounded-full px-1.5 py-1.5 flex items-center space-x-1 border-0 dark:border dark:border-border/30 shadow-none dark:shadow-lg bg-transparent dark:bg-background/40 backdrop-blur dark:backdrop-blur-md relative">
                  {tabs.map((tab) =>
                    menuConfigs[tab.id] ? (
                      <div key={tab.id} className="relative">
                        <button
                          onMouseEnter={() => handleMenuOpen(tab.id)}
                          onClick={() => setActiveTab(tab.id)}
                          className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                            activeTab === tab.id
                              ? "bg-foreground text-background shadow-md"
                              : "text-foreground/60 dark:text-muted-foreground hover:text-foreground hover:bg-accent/50"
                          }`}
                        >
                          {tab.label}
                        </button>
                      </div>
                    ) : (
                  <button
                    key={tab.id}
                        onMouseEnter={() => handleMenuOpen(null)}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                      activeTab === tab.id
                        ? 'bg-foreground text-background shadow-md'
                        : 'text-foreground/60 dark:text-muted-foreground hover:text-foreground hover:bg-accent/50'
                    }`}
                  >
                    {tab.label}
                  </button>
                    )
                  )}
                </div>
              </nav>
            </div>
            {/* Right - Actions */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              <CreditPill
                onUpgradeClick={() => setActiveTab('pricing')}
                onUsageClick={() => setActiveTab('usage')}
              />
            <button
                onClick={toggleTheme}
                className="flex items-center justify-center p-2 rounded-lg text-foreground/70 hover:text-foreground transition-colors duration-200"
                aria-label="Toggle theme"
              >
                {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
              <button
                onClick={toggleLanguage}
                className="flex items-center space-x-1 px-3 py-2 rounded-lg text-sm text-foreground/70 hover:text-foreground transition-colors duration-200"
              >
                <Globe className="w-4 h-4" />
                <span className="hidden sm:inline">{language === "en" ? "EN" : "中文"}</span>
              </button>

              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="focus:outline-none">
                      <Avatar className="w-8 h-8 cursor-pointer hover:ring-2 hover:ring-primary/50 transition-all">
                        {user.avatar && <AvatarImage src={user.avatar} alt={user.nickname || user.username} />}
                        <AvatarFallback className="bg-primary text-primary-foreground text-sm font-medium">
                          {getInitials(user.nickname || user.username)}
                        </AvatarFallback>
                      </Avatar>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="w-48 backdrop-blur-md bg-background/80 dark:bg-background/60 border border-border/40"
                  >
                    <div className="px-2 py-1.5 text-sm font-medium text-foreground">
                      {user.nickname || user.username}
                    </div>
                    <div className="px-2 pb-2 text-xs text-muted-foreground">{user.email}</div>
                    <DropdownMenuItem onClick={handleSignOut} className="text-destructive cursor-pointer">
                      <LogOut className="w-4 h-4 mr-2" />
                      {language === "en" ? "Sign Out" : "退出登录"}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <button
                  onClick={openSignIn}
                  className="text-sm font-light text-foreground/70 hover:text-foreground hover:underline underline-offset-4 transition-all duration-200"
                >
                  {language === "en" ? "Sign In" : "登录"}
                </button>
              )}
            </div>
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden pb-4">
            <div className="rounded-full px-1.5 py-1.5 flex items-center justify-center space-x-1 border border-foreground/15 dark:border-border/30 bg-background/70 dark:bg-background/40 backdrop-blur-md">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    activeTab === tab.id
                      ? "bg-foreground text-background shadow-md"
                      : "text-foreground/60 dark:text-muted-foreground hover:text-foreground hover:bg-accent/50"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Sign In / Sign Up Dialog */}
      <Dialog open={dialogOpen} onOpenChange={handleDialogClose}>
        <DialogContent className="sm:max-w-[420px] bg-background border border-border rounded-3xl p-8">
          <TooltipProvider>
          {isForgotPassword ? (
            /* Forgot Password Form */
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-center text-foreground">
                {language === "en" ? "Forget password" : "忘记密码"}
              </h2>

              <form onSubmit={handleForgotPassword} className="space-y-4">
                {error && (
                  <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm">
                    {error}
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-sm font-medium text-primary">
                    {language === "en" ? "Email Address" : "邮箱地址"}
                  </label>
                  <Input
                    type="email"
                    placeholder={language === "en" ? "Email" : "邮箱"}
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setError(null);
                    }}
                    className="h-12 rounded-2xl bg-muted/50 border-0 px-4"
                    required
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-primary">
                    {language === "en" ? "Verification Code" : "验证码"}
                  </label>
                  <div className="flex gap-3">
                    <Input
                      type="text"
                      placeholder={language === "en" ? "Verification Code" : "验证码"}
                      value={verificationCode}
                      onChange={(e) => {
                        setVerificationCode(e.target.value);
                        setError(null);
                      }}
                      className="h-12 rounded-2xl bg-muted/50 border-0 px-4 flex-1"
                      required
                      disabled={isLoading}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={handleSendCode}
                      className="h-12 px-4 text-primary hover:text-primary/80 hover:bg-transparent font-medium whitespace-nowrap rounded-2xl bg-muted/50"
                      disabled={isLoading || isSendingCode || codeCountdown > 0}
                    >
                      {isSendingCode
                        ? language === "en"
                          ? "Sending..."
                          : "发送中..."
                        : codeCountdown > 0
                          ? `${codeCountdown}s`
                          : language === "en"
                            ? "Send Code"
                            : "发送验证码"}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-primary">
                    {language === "en" ? "New Password" : "新密码"}
                  </label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder={language === "en" ? "Password" : "密码"}
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        setError(null);
                      }}
                      className="h-12 rounded-2xl bg-muted/50 border-0 px-4 pr-12"
                      required
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-primary">
                    {language === "en" ? "Confirm Password" : "确认密码"}
                  </label>
                  <div className="relative">
                    <Input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder={language === "en" ? "Confirm" : "确认"}
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        setError(null);
                      }}
                      className="h-12 rounded-2xl bg-muted/50 border-0 px-4 pr-12"
                      required
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showConfirmPassword ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div className="text-sm text-muted-foreground">
                  {language === "en" ? "Already have an account?" : "已有账户？"}{" "}
                  <button
                    type="button"
                    onClick={backToLogin}
                    className="text-primary hover:underline font-medium"
                  >
                    {language === "en" ? "Login" : "登录"}
                  </button>
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 rounded-2xl bg-foreground text-background hover:bg-foreground/90 font-medium"
                  disabled={isLoading}
                >
                  {isLoading
                    ? (language === "en" ? "Resetting..." : "重置中...")
                    : (language === "en" ? "Reset Password" : "重置密码")}
                </Button>
              </form>

              <p className="text-xs text-center text-muted-foreground">
                {language === "en" ? "By continuing, you agree to our " : "继续即表示您同意我们的"}
                <button
                  type="button"
                  onClick={() => window.open(termsUrl, "_blank", "noopener,noreferrer")}
                  className="text-foreground font-medium hover:underline"
                >
                  {language === "en" ? "Terms of Service" : "服务条款"}
                </button>
                {language === "en" ? " and acknowledge our " : " 并确认我们的"}
                <button
                  type="button"
                  onClick={() => window.open(privacyUrl, "_blank", "noopener,noreferrer")}
                  className="text-foreground font-medium hover:underline"
                >
                  {language === "en" ? "Privacy Policy" : "隐私政策"}
                </button>
                。
              </p>
            </div>
          ) : isSignUp ? (
            /* Sign Up Form */
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-primary">
                {language === "en" ? "Sign up for an account" : "注册账号"}
              </h2>

              <form onSubmit={handleSignUp} className="space-y-4">
                {/* Error Message */}
                {error && (
                  <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm">
                    {error}
                  </div>
                )}

                {/* Email */}
                <Input
                  type="email"
                  placeholder={language === "en" ? "Email" : "邮箱"}
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError(null);
                  }}
                  className="h-12 rounded-2xl bg-muted/50 border-0 px-4"
                  required
                  disabled={isLoading}
                />

                {/* Password */}
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder={language === "en" ? "Password" : "密码"}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setError(null);
                    }}
                    className="h-12 rounded-2xl bg-muted/50 border-0 px-4 pr-12"
                    required
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                  </button>
                </div>

                {/* Confirm Password */}
                <div className="relative">
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder={language === "en" ? "Confirm" : "确认密码"}
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      setError(null);
                    }}
                    className="h-12 rounded-2xl bg-muted/50 border-0 px-4 pr-12"
                    required
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showConfirmPassword ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                  </button>
                </div>

                {/* Verification Code */}
                <div className="flex gap-3">
                  <Input
                    type="text"
                    placeholder={language === "en" ? "Verification Code" : "验证码"}
                    value={verificationCode}
                    onChange={(e) => {
                      setVerificationCode(e.target.value);
                      setError(null);
                    }}
                    className="h-12 rounded-2xl bg-muted/50 border-0 px-4 flex-1"
                    required
                    disabled={isLoading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={handleSendCode}
                    className="h-12 px-4 text-primary hover:text-primary/80 hover:bg-transparent font-medium whitespace-nowrap"
                    disabled={isLoading || isSendingCode || codeCountdown > 0}
                  >
                    {isSendingCode
                      ? language === "en"
                        ? "Sending..."
                        : "发送中..."
                      : codeCountdown > 0
                        ? `${codeCountdown}s`
                        : language === "en"
                          ? "Send Code"
                          : "发送验证码"}
                  </Button>
                </div>

                {/* Already have account */}
                <div className="text-sm text-muted-foreground">
                  {language === "en" ? "Already have an account?" : "已有账号？"}{" "}
                  <button
                    type="button"
                    onClick={() => {
                      setIsSignUp(false);
                      setError(null);
                    }}
                    className="text-primary hover:underline font-medium"
                  >
                    {language === "en" ? "Login" : "登录"}
                  </button>
                </div>

                {/* Sign Up Button */}
                <Button
                  type="submit"
                  className="w-full h-12 rounded-2xl bg-foreground text-background hover:bg-foreground/90 font-medium"
                  disabled={isLoading}
                >
                  {isLoading
                    ? language === "en"
                      ? "Signing up..."
                      : "注册中..."
                    : language === "en"
                      ? "Sign Up"
                      : "注册"}
                </Button>
              </form>

              {/* Terms */}
              <p className="text-xs text-center text-muted-foreground">
                {language === "en" ? "By continuing, you agree to our " : "继续即表示您同意我们的"}
                <button
                  onClick={() => window.open(termsUrl, "_blank", "noopener,noreferrer")}
                  className="text-foreground font-medium hover:underline"
                >
                  {language === "en" ? "Terms of Service" : "服务条款"}
                </button>
                {language === "en" ? " and acknowledge our " : " 并确认我们的"}
                <button
                  onClick={() => window.open(privacyUrl, "_blank", "noopener,noreferrer")}
                  className="text-foreground font-medium hover:underline"
                >
                  {language === "en" ? "Privacy Policy" : "隐私政策"}
                </button>
                。
              </p>
            </div>
          ) : (
            /* Login Form */
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-center text-foreground">
                {language === "en" ? "Create an account or Login" : "创建账号或登录"}
              </h2>

              {/* Google Login */}
              <Button
                type="button"
                onClick={handleGoogleLogin}
                disabled={isGoogleLoading}
                className="w-full h-12 rounded-2xl bg-foreground text-background hover:bg-foreground/90 font-medium"
              >
                <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                {isGoogleLoading
                  ? (language === "en" ? "Redirecting..." : "跳转中...")
                  : (language === "en" ? "Continue with Google" : "使用 Google 登录")}
              </Button>

              {/* Divider */}
              <div className="flex items-center gap-4">
                <div className="flex-1 h-px bg-border" />
                <span className="text-sm text-muted-foreground">or</span>
                <div className="flex-1 h-px bg-border" />
              </div>

              {/* Continue with email label */}
              <p className="text-primary font-medium">{language === "en" ? "Continue with email" : "使用邮箱登录"}</p>

              <form onSubmit={handleSignIn} className="space-y-4">
                {/* Error Message */}
                {error && (
                  <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm">
                    {error}
                  </div>
                )}

                {/* Email */}
                <Input
                  type="email"
                  placeholder={language === "en" ? "Email" : "邮箱"}
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError(null);
                  }}
                  className="h-12 rounded-2xl bg-muted/50 border-0 px-4"
                  required
                  disabled={isLoading}
                />

                {/* Password */}
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder={language === "en" ? "Password" : "密码"}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setError(null);
                    }}
                    className="h-12 rounded-2xl bg-muted/50 border-0 px-4 pr-12"
                    required
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                  </button>
                </div>

                {/* Login Button */}
                <Button
                  type="submit"
                  className="w-full h-12 rounded-2xl bg-foreground text-background hover:bg-foreground/90 font-medium"
                  disabled={isLoading}
                >
                  {isLoading
                    ? language === "en"
                      ? "Logging in..."
                      : "登录中..."
                    : language === "en"
                      ? "Login"
                      : "登录"}
                </Button>
              </form>

              {/* Sign Up & Forgot Password */}
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={openSignUp}
                  className="flex-1 h-12 rounded-2xl bg-muted/50 text-primary hover:bg-muted font-medium"
                >
                  {language === "en" ? "Sign Up" : "注册"}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={openForgotPassword}
                  className="flex-1 h-12 rounded-2xl bg-muted/50 text-primary hover:bg-muted font-medium"
                >
                  {language === "en" ? "Forgot Password" : "忘记密码"}
                </Button>
              </div>

              {/* Terms */}
              <p className="text-xs text-center text-muted-foreground">
                {language === "en" ? "By continuing, you agree to our " : "继续即表示您同意我们的"}
                <button
                  onClick={() => window.open(termsUrl, "_blank", "noopener,noreferrer")}
                  className="text-foreground font-medium hover:underline"
                >
                  {language === "en" ? "Terms of Service" : "服务条款"}
                </button>
                {language === "en" ? " and acknowledge our " : " 并确认我们的"}
                <button
                  onClick={() => window.open(privacyUrl, "_blank", "noopener,noreferrer")}
                  className="text-foreground font-medium hover:underline"
                >
                  {language === "en" ? "Privacy Policy" : "隐私政策"}
                </button>
                。
              </p>
            </div>
          )}
          </TooltipProvider>
        </DialogContent>
      </Dialog>
    </header>

      {/* Mega Menu - Outside header for backdrop-filter to work */}
      <AnimatePresence>
        {openMenu && menuConfigs[openMenu] && (
          <motion.div
            key="solution-mega"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="fixed left-0 right-0 top-16 py-4 pointer-events-none z-40 flex justify-center"
            onMouseEnter={() => handleMenuOpen(openMenu)}
            onMouseLeave={handleMenuClose}
          >
            <div className="backdrop-blur bg-background/50 pointer-events-auto w-fit rounded-3xl border border-border/30 ring-1 ring-white/10 dark:ring-white/10 shadow-[0_25px_80px_-40px_rgba(0,0,0,0.65)] px-8 py-6">
              {menuConfigs[openMenu]?.sections && (
                <div
                  className={`grid ${
                    menuConfigs[openMenu].sections.length > 1 ? "grid-cols-2" : "grid-cols-1"
                  } gap-10`}
                >
                  {menuConfigs[openMenu].sections.map((section) => (
                    <div className="space-y-3" key={section.title}>
                      <div className="text-[11px] uppercase tracking-[0.08em] text-muted-foreground">
                        {section.title}
                      </div>
                      <div className="space-y-2">
                        {section.items.map((item, index) => (
                          <button
                            key={item}
                            onClick={() => {
                              // Handle external links for solution menu items
                              const externalLinks: Record<string, string> = {
                                GEO: "http://orangeo.photog.art",
                                "Social Media Marketing": "http://tkfactory.photog.art",
                                社媒营销: "http://tkfactory.photog.art",
                                "Email Marketing": "http://aigrowth.photog.art",
                                邮件营销: "http://aigrowth.photog.art",
                                "Sales Support": "http://aisales.photog.art",
                                销售客服: "http://aisales.photog.art",
                                "Beauty & FMCG": "https://industrysolution.photog.art/",
                                美妆快消: "https://industrysolution.photog.art/",
                                "Consumer Electronics": "https://industrysolution.photog.art/",
                                消费电子: "https://industrysolution.photog.art/",
                                "Cross-border Expansion": "https://industrysolution.photog.art/",
                                跨境出海: "https://industrysolution.photog.art/",
                                "Data Infrastructure": "https://industrysolution.photog.art/",
                                数据基建: "https://industrysolution.photog.art/",
                                "Insights Hub": "https://insighthub.photog.art",
                                洞察中心: "https://insighthub.photog.art",
                                "Strategy Engine": "https://strategyengine.photog.art",
                                策略引擎: "https://strategyengine.photog.art",
                                "Content Factory": "https://toolbox.photog.art",
                                内容工厂: "https://toolbox.photog.art",
                              };

                              if (externalLinks[item]) {
                                window.open(externalLinks[item], "_blank");
                                setOpenMenu(null);
                                return;
                              }
                              // Handle library sub-tab navigation
                              if (openMenu === "library" && setLibrarySubTab) {
                                const subTabs: ("video" | "voice" | "model")[] = ["video", "voice", "model"];
                                setLibrarySubTab(subTabs[index]);
                              }
                              setActiveTab(openMenu);
                              setOpenMenu(null);
                            }}
                            className="w-full text-left px-3 py-2 rounded-xl text-sm text-foreground/80 hover:text-foreground hover:bg-foreground/5 transition-all"
                          >
                            {item}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;
