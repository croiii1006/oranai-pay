import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

/* ----------------------------------------------------------------
   Types & Data
   ---------------------------------------------------------------- */

export type FeatureQuota = {
  brandInsight: number;
  strategyPlan: number;
  imageGen: number;
  videoGen: number;
  viralMatch: number;
  videoRemix: number;
  tkSolution: number;
};

export const FEATURE_KEYS: (keyof FeatureQuota)[] = [
  'brandInsight',
  'strategyPlan',
  'imageGen',
  'videoGen',
  'viralMatch',
  'videoRemix',
  'tkSolution',
];

export const FEATURE_LABELS: Record<keyof FeatureQuota, { zh: string; en: string }> = {
  brandInsight: { zh: '品牌洞察', en: 'Brand Insight' },
  strategyPlan: { zh: '策划方案', en: 'Strategy Plan' },
  imageGen: { zh: '图片生成', en: 'Image Generation' },
  videoGen: { zh: '视频生成', en: 'Video Generation' },
  viralMatch: { zh: '爆款视频匹配', en: 'Viral Match' },
  videoRemix: { zh: '复刻视频', en: 'Video Remix' },
  tkSolution: { zh: 'TK 解决方案', en: 'TK Solution' },
};

export const PLAN_QUOTAS: Record<string, FeatureQuota> = {
  free: {
    brandInsight: 0,
    strategyPlan: 0,
    imageGen: 1,
    videoGen: 0,
    viralMatch: 0,
    videoRemix: 0,
    tkSolution: 0,
  },
  basic: {
    brandInsight: 10,
    strategyPlan: 5,
    imageGen: 40,
    videoGen: 5,
    viralMatch: 10,
    videoRemix: 5,
    tkSolution: 5,
  },
  pro: {
    brandInsight: 40,
    strategyPlan: 20,
    imageGen: 160,
    videoGen: 20,
    viralMatch: 40,
    videoRemix: 20,
    tkSolution: 20,
  },
};

/* ----------------------------------------------------------------
   Component
   ---------------------------------------------------------------- */

interface Props {
  planId: string;
  isEnterprise?: boolean;
  highlightDiffFrom?: FeatureQuota | null;
}

const FeatureQuotaTable: React.FC<Props> = ({ planId, isEnterprise, highlightDiffFrom }) => {
  const { language } = useLanguage();
  const isZh = language === 'zh';
  const quota = PLAN_QUOTAS[planId];

  return (
    <div className="space-y-1">
      <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
        {isZh ? '可生成内容' : 'What you can generate'}
      </h4>

      <TooltipProvider delayDuration={200}>
        <ul className="space-y-0.5">
          {FEATURE_KEYS.map((key) => {
            const label = FEATURE_LABELS[key];
            const value = isEnterprise ? -1 : (quota?.[key] ?? 0);
            const prevValue = highlightDiffFrom?.[key] ?? null;
            const isGrowth = prevValue !== null && value > prevValue;
            const isUnlimited = value === -1;
            const isZero = value === 0;

            return (
              <Tooltip key={key}>
                <TooltipTrigger asChild>
                  <li
                    className={`flex items-center justify-between py-1.5 px-2 rounded-md text-sm transition-colors duration-200 ${
                      isGrowth
                        ? 'bg-foreground/[0.06]'
                        : 'hover:bg-foreground/[0.04]'
                    }`}
                  >
                    <span className={isZero ? 'text-muted-foreground/50' : ''}>
                      {isZh ? label.zh : label.en}
                    </span>

                    <span
                      className={`font-semibold tabular-nums transition-all duration-300 ${
                        isUnlimited
                          ? 'text-primary'
                          : isZero
                            ? 'text-muted-foreground/40'
                            : isGrowth
                              ? 'text-foreground scale-110'
                              : 'text-foreground'
                      }`}
                    >
                      {isUnlimited
                        ? (isZh ? '不限' : 'Unlimited')
                        : value}
                    </span>
                  </li>
                </TooltipTrigger>
                <TooltipContent side="top" className="text-xs max-w-[200px]">
                  {isZh
                    ? '基于平均积分消耗估算'
                    : 'Estimated based on average credit usage'}
                </TooltipContent>
              </Tooltip>
            );
          })}
        </ul>
      </TooltipProvider>

      <p className="text-[11px] text-muted-foreground/60 pt-1.5">
        {isZh ? '基于每月积分额度估算' : 'Based on your monthly credits'}
      </p>
    </div>
  );
};

export default FeatureQuotaTable;
