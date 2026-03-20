import React, { useState, useEffect } from 'react';
import { Zap, ChevronRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { getToken, getUserInfo as getCachedUserInfo } from '@/lib/utils/auth-storage';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

interface CreditPillProps {
  onUpgradeClick: () => void;
  onUsageClick: () => void;
}

// Mock credit service — replace with real API later
const getMockCredits = () => ({
  available: 4280,
  frozen: 360,
  plan: 'pro' as string,
});

const planLabels: Record<string, { zh: string; en: string }> = {
  free: { zh: '免费版', en: 'Free' },
  basic: { zh: '基础版', en: 'Basic' },
  pro: { zh: '专业版', en: 'Pro' },
  enterprise: { zh: '企业版', en: 'Enterprise' },
};

const CreditPill: React.FC<CreditPillProps> = ({ onUpgradeClick, onUsageClick }) => {
  const { language } = useLanguage();
  const isZh = language === 'zh';
  const token = getToken();
  const user = getCachedUserInfo();
  const isLoggedIn = !!token && !!user;

  const credits = isLoggedIn ? getMockCredits() : null;

  if (!isLoggedIn) {
    return (
      <div className="flex items-center gap-1.5">
        <button
          onClick={onUpgradeClick}
          className="text-xs font-medium px-3 py-1.5 rounded-full border border-border hover:bg-accent/50 transition-colors"
        >
          {isZh ? '升级' : 'Upgrade'}
        </button>
        <div className="flex items-center gap-1 text-xs text-muted-foreground px-2 py-1.5 rounded-full border border-border/50">
          <Zap className="w-3.5 h-3.5" />
          <span>-</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1.5">
      <button
        onClick={onUpgradeClick}
        className="text-xs font-medium px-3 py-1.5 rounded-full border border-border hover:bg-accent/50 transition-colors"
      >
        {isZh ? '升级' : 'Upgrade'}
      </button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center gap-1 text-xs font-medium px-2.5 py-1.5 rounded-full border border-border/50 hover:bg-accent/50 transition-colors">
            <Zap className="w-3.5 h-3.5" />
            <span>{credits?.available.toLocaleString()}</span>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="w-64 p-4 space-y-3"
        >
          {/* Plan */}
          <div className="text-xs text-muted-foreground">
            {isZh ? '当前套餐' : 'Current Plan'}
          </div>
          <div className="text-sm font-semibold">
            {planLabels[credits?.plan || 'free']?.[isZh ? 'zh' : 'en']}
          </div>

          {/* Available */}
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">{isZh ? '可用 Credit' : 'Available'}</span>
            <span className="font-medium flex items-center gap-1">
              <Zap className="w-3.5 h-3.5" />
              {credits?.available.toLocaleString()}
            </span>
          </div>

          {/* Frozen */}
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">{isZh ? '冻结 Credit' : 'Frozen'}</span>
            <span className="font-medium">{credits?.frozen.toLocaleString()}</span>
          </div>

          {/* Credit source note */}
          <div className="text-[11px] text-muted-foreground/60 pt-1 border-t border-border/50">
            {credits?.plan === 'free'
              ? (isZh ? '注册一次性赠送' : 'One-time signup bonus')
              : (isZh ? '每次支付成功发放' : 'Granted per successful payment')}
          </div>

          {/* Usage details link */}
          <Button
            variant="ghost"
            onClick={onUsageClick}
            className="w-full justify-between text-sm h-9 px-2"
          >
            {isZh ? '使用详情' : 'Usage details'}
            <ChevronRight className="w-4 h-4" />
          </Button>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default CreditPill;
