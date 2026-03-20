import { useEffect, useRef, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { loginWithGoogleCallback, getUserInfo } from "@/lib/api/auth";
import { saveToken, saveUserInfo } from "@/lib/utils/auth-storage";
import { Button } from "@/components/ui/button";

const OAuthCallbackGoogle = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [errorMsg, setErrorMsg] = useState<string>("");
  const executedRef = useRef(false);

  useEffect(() => {
    if (executedRef.current) return;
    const code = searchParams.get("code");
    const state = searchParams.get("state");

    if (!code || !state) {
      setStatus("error");
      setErrorMsg("Missing code or state from Google callback.");
      return;
    }

    executedRef.current = true;

    const run = async () => {
      try {
        const res = await loginWithGoogleCallback({
          clientId: "portal-a",
          authType: "SOCIAL",
          source: "google",
          code,
          state,
        });

        if (!res.success || !res.data?.token) {
          setStatus("error");
          setErrorMsg("Login response invalid.");
          return;
        }

        saveToken(res.data.token);
        const userRes = await getUserInfo();
        if (userRes?.data) {
          saveUserInfo(userRes.data);
        }
        setStatus("success");
        navigate("/", { replace: true });
      } catch (err) {
        setStatus("error");
        const msg = err instanceof Error ? err.message : String(err);
        setErrorMsg(msg || "Google login failed. Please try again.");
      }
    };

    run();
  }, [searchParams, navigate]);

  if (status === "error") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted">
        <div className="text-center space-y-4 max-w-md px-4">
          <h1 className="text-xl font-semibold text-destructive">
            Google 登录失败
          </h1>
          <p className="text-sm text-muted-foreground">{errorMsg}</p>
          <Button onClick={() => navigate("/", { replace: true })}>
            返回首页
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted">
      <div className="text-center space-y-4">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        <p className="text-sm text-muted-foreground">正在完成 Google 登录...</p>
      </div>
    </div>
  );
};

export default OAuthCallbackGoogle;
