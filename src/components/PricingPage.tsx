import React, { useRef, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Check, Zap, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useIsMobile } from '@/hooks/use-mobile';
import { getToken } from '@/lib/utils/auth-storage';
import { PLAN_ORDER, type PlanId } from '@/lib/pricing';
import FeatureQuotaTable, { PLAN_QUOTAS } from '@/components/pricing/FeatureQuotaTable';

/* ================================================================
   DATA CONFIG
   ================================================================ */

const FEATURES = [
  { id: 'brandInsight', zh: '品牌洞察', en: 'Brand Insight' },
  { id: 'strategyPlan', zh: '策划方案', en: 'Strategy Plan' },
  { id: 'imageGen', zh: '图片生成', en: 'Image Generation' },
  { id: 'videoGen', zh: '视频生成', en: 'Video Generation' },
  { id: 'viralMatch', zh: '爆款视频匹配', en: 'Viral Video Matching' },
  { id: 'videoRemix', zh: '视频复刻', en: 'Video Remix' },
  { id: 'tkSolution', zh: 'TikTok 解决方案', en: 'TikTok Solution' },
];

interface PlanConfig {
  id: string;
  nameZh: string;
  nameEn: string;
  descZh: string;
  descEn: string;
  price: string;
  priceSubZh?: string;
  priceSubEn?: string;
  credits: string;
  creditsNoteZh?: string;
  creditsNoteEn?: string;
  isFree?: boolean;
  popular?: boolean;
  isEnterprise?: boolean;
}

const plans: PlanConfig[] = [
  {
    id: 'free',
    nameZh: '免费版',
    nameEn: 'Free',
    descZh: '注册即用，零门槛体验 AI 能力',
    descEn: 'Sign up and start exploring AI features',
    price: '$0',
    credits: '5 Credit',
    creditsNoteZh: '一次性',
    creditsNoteEn: 'One-time',
    isFree: true,
  },
  {
    id: 'basic',
    nameZh: '基础版',
    nameEn: 'Basic',
    descZh: '轻度创作者，满足日常生图和洞察报告需求',
    descEn: 'For light creators - daily image gen & insight reports',
    price: '$9.9',
    priceSubZh: '/ 月',
    priceSubEn: '/ month',
    credits: '400 Credit',
    creditsNoteZh: '',
    creditsNoteEn: '~17% premium',
  },
  {
    id: 'pro',
    nameZh: '专业版',
    nameEn: 'Pro',
    descZh: '重度用户/工作室，满足高频报告生成与短视频渲染需求',
    descEn: 'For power users - high-frequency reports & video rendering',
    price: '$39.9',
    priceSubZh: '/ 月',
    priceSubEn: '/ month',
    credits: '1600 Credit',
    creditsNoteZh: '',
    creditsNoteEn: '~16% premium',
    popular: true,
  },
  {
    id: 'enterprise',
    nameZh: '企业版',
    nameEn: 'Enterprise',
    descZh: '企业客户，需签署线下合同',
    descEn: 'For large organizations - custom contracts',
    price: '',
    credits: '',
    isEnterprise: true,
  },
];

interface TopUpPack {
  id: string;
  nameZh: string;
  nameEn: string;
  price: string;
  credits: string;
  originalCredits?: string;
  noteZh: string;
  noteEn: string;
  badgeZh?: string;
  badgeEn?: string;
  featured?: boolean;
}

const topUpPacks: TopUpPack[] = [
  {
    id: 'starter',
    nameZh: '体验包',
    nameEn: 'Starter',
    price: '$5',
    credits: '170 Credit',
    noteZh: '原价，无折让，适合首次体验或临时补量。',
    noteEn: 'Straight value with no bonus, ideal for a quick trial or small refill.',
  },
  {
    id: 'base',
    nameZh: '基础包',
    nameEn: 'Base',
    price: '$10',
    credits: '360 Credit',
    originalCredits: '340',
    noteZh: '到账多送 10 Credit，适合日常补量。',
    noteEn: 'Includes 10 extra Credits beyond the benchmark, ideal for routine top-ups.',
  },
  {
    id: 'value',
    nameZh: '超值包',
    nameEn: 'Value Pack',
    price: '$50',
    credits: '1800 Credit',
    originalCredits: '1700',
    noteZh: '到账多送近 100 Credit，更适合高频创作或集中补量。',
    noteEn: 'Adds nearly 100 bonus Credits, best for heavy creation or larger refills.',
    badgeZh: 'Best Value',
    badgeEn: 'Best Value',
    featured: true,
  },
];

const faqItems = [
  {
    qZh: '积分会过期吗？',
    qEn: 'Do Credits expire?',
    aZh: '订阅赠送的积分按月清零（Use-it-or-lose-it）。系统按购买时间精确到分钟计算，例如 1 月 15 日 08:00 购买，则在 2 月 15 日 08:00 清零并重置新一月额度。充值包积分有效期为购买后一个月。',
    aEn: 'Subscription credits reset monthly (use-it-or-lose-it), calculated to the minute from purchase time. Top-up credits expire one month after purchase.',
  },
  {
    qZh: '是否可以随时取消订阅？',
    qEn: 'Can I cancel my subscription anytime?',
    aZh: '可以随时取消自动续费。取消后当前周期仍可使用，到期未续费则权益降级。',
    aEn: 'Yes. Cancel auto-renewal anytime. Benefits remain until the period ends, then downgrade.',
  },
  {
    qZh: '升级规则是什么？',
    qEn: 'What are the upgrade rules?',
    aZh: '支付成功后立即切换到新套餐，并立即发放新套餐完整 Credit。旧套餐剩余时间不折算、不补差价、不顺延。',
    aEn: 'Plan switches immediately upon payment with full new Credits. Old plan time is not prorated or carried over.',
  },
  {
    qZh: '充值包如何使用？',
    qEn: 'How do top-up packs work?',
    aZh: '单次支付，不绑定代扣。充值积分有效期为购买后一个月，到期清零。',
    aEn: 'One-off payment, no recurring billing. Credits expire one month after purchase.',
  },
  {
    qZh: '是否支持退款？',
    qEn: 'Do you support refunds?',
    aZh: '不支持退款、不支持降级、不支持平级切换。如需特殊需求请联系销售。',
    aEn: 'We do not support refunds, downgrades, or lateral plan changes. Contact sales for special requests.',
  },
];

// --- helpers ---
const buildMailto = (isZh: boolean) => {
  const subject = isZh ? 'OranAI 企业版咨询' : 'OranAI Enterprise Inquiry';
  const body = isZh
    ? '你好，我想咨询 OranAI 企业版。\n使用场景：_______\n联系方式：_______'
    : 'Hi, I\'d like to inquire about OranAI Enterprise.\nUse case: ________\nContact: ________';
  return `mailto:hey@photog.art?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
};

/* ================================================================
   COMPONENT
   ================================================================ */

interface PricingPageProps {
  currentPlanId: PlanId;
  setCurrentPlanId: React.Dispatch<React.SetStateAction<PlanId>>;
}

const PricingPage: React.FC<PricingPageProps> = ({ currentPlanId, setCurrentPlanId }) => {
  const { language } = useLanguage();
  const isMobile = useIsMobile();
  const isZh = language === 'zh';
  const planKeys = ['free', 'basic', 'pro', 'enterprise'] as const;
  const planOrder = PLAN_ORDER;
  const planRank = new Map(planOrder.map((id, index) => [id, index]));
  const plansSectionRef = useRef<HTMLElement | null>(null);
  const [hoveredPlan, setHoveredPlan] = useState<string | null>(null);
  const [isTopUpAccessDialogOpen, setIsTopUpAccessDialogOpen] = useState(false);
  const [isTopUpDialogOpen, setIsTopUpDialogOpen] = useState(false);
  const [selectedTopUpPack, setSelectedTopUpPack] = useState<TopUpPack | null>(null);
  const [autoRenewByPlan, setAutoRenewByPlan] = useState<Record<string, boolean>>({
    basic: true,
    pro: true,
  });
  const [pendingAutoRenewChange, setPendingAutoRenewChange] = useState<{
    planId: PlanId;
    nextValue: boolean;
  } | null>(null);

  const handleSubscribe = (plan: PlanConfig) => {
    const currentRank = planRank.get(currentPlanId) ?? 0;
    const nextRank = planRank.get(plan.id as PlanId) ?? 0;

    if (plan.isEnterprise) {
      window.location.href = buildMailto(isZh);
      return;
    }
    if (plan.id === currentPlanId || nextRank < currentRank) {
      return;
    }
    const token = getToken();
    if (!token) {
      window.location.href = '/?logon=1';
    } else if (plan.isFree) {
      window.open('https://toolbox.photog.art', '_blank');
      setCurrentPlanId(plan.id as PlanId);
    } else {
      window.open(`https://toolbox.photog.art/checkout?plan=${plan.id}`, '_blank');
      setCurrentPlanId(plan.id as PlanId);
    }
  };

  const handleContactSales = () => {
    window.location.href = buildMailto(isZh);
  };

  const handleScrollToPlans = () => {
    plansSectionRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

  const handleTopUpDialogOpen = () => {
    if (currentPlanId === 'free') {
      setIsTopUpAccessDialogOpen(true);
      return;
    }
    setSelectedTopUpPack(null);
    setIsTopUpDialogOpen(true);
  };

  const handleTopUpSelect = (pack: TopUpPack) => {
    setSelectedTopUpPack(pack);
  };

  const handleTopUpCheckout = () => {
    if (!selectedTopUpPack) {
      return;
    }
    const token = getToken();
    if (!token) {
      window.location.href = '/?logon=1';
      return;
    }
    window.open(`https://toolbox.photog.art/checkout?topup=${selectedTopUpPack.id}`, '_blank');
    setIsTopUpDialogOpen(false);
    setSelectedTopUpPack(null);
  };

  const handleAutoRenewToggle = (planId: PlanId) => {
    const currentValue = autoRenewByPlan[planId] ?? true;

    setPendingAutoRenewChange({
      planId,
      nextValue: !currentValue,
    });
  };

  const handleAutoRenewDialogChange = (open: boolean) => {
    if (!open) {
      setPendingAutoRenewChange(null);
    }
  };

  const handleConfirmAutoRenewChange = () => {
    if (!pendingAutoRenewChange) {
      return;
    }

    setAutoRenewByPlan((current) => ({
      ...current,
      [pendingAutoRenewChange.planId]: pendingAutoRenewChange.nextValue,
    }));
    setPendingAutoRenewChange(null);
  };

  const getPlanActionLabel = (
    plan: PlanConfig,
    isCurrent: boolean,
    isHigher: boolean,
    isLower: boolean,
  ) => {
    if (plan.isEnterprise) {
      return isZh ? '联系销售' : 'Contact Sales';
    }

    if (isCurrent) {
      return isZh ? '当前套餐' : 'Current Plan';
    }

    if (isHigher) {
      return isZh ? `升级为${plan.nameZh}` : `Upgrade to ${plan.nameEn}`;
    }

    if (isLower) {
      return isZh ? `切换至${plan.nameZh}` : `Switch to ${plan.nameEn}`;
    }

    return isZh ? `切换至${plan.nameZh}` : `Switch to ${plan.nameEn}`;
  };

  const pendingAutoRenewPlan = pendingAutoRenewChange
    ? plans.find((plan) => plan.id === pendingAutoRenewChange.planId)
    : null;

  return (
    <>
      <div className="min-h-screen pt-24 pb-16">
        <div className="w-full px-6 sm:px-10 lg:px-16">

        {/* ========== A) Hero ========== */}
        <section className="text-center py-20 max-w-3xl mx-auto">
          <h1 className="heading-lg mb-4">
            {isZh ? '选择适合你的会员计划' : 'Choose the plan that fits you'}
          </h1>
          <p className="body-lg">
            {isZh
              ? '用 OranAI 的洞察与创意能力，让增长更简单。'
              : "Use OranAI's insights and creative tools to grow faster."}
          </p>
        </section>

        {/* ========== B) Plan Cards ========== */}
        <section
          ref={plansSectionRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto mb-20 scroll-mt-28"
        >
          {plans.map((plan) => {
            // Determine comparison quota for hover highlight
            const compareQuota = hoveredPlan && hoveredPlan !== plan.id
              ? null
              : hoveredPlan === plan.id && plan.id === 'pro'
                ? PLAN_QUOTAS['basic']
                : hoveredPlan === plan.id && plan.id === 'basic'
                  ? PLAN_QUOTAS['free']
                  : null;
            const currentRank = planRank.get(currentPlanId) ?? 0;
            const thisRank = planRank.get(plan.id as PlanId) ?? 0;
            const isCurrent = plan.id === currentPlanId;
            const isLower = thisRank < currentRank;
            const isHigher = thisRank > currentRank;
            const showAutoRenewToggle = isHigher && !plan.isEnterprise;
            const isAutoRenewEnabled = autoRenewByPlan[plan.id] ?? true;

            return (
            <div
              key={plan.id}
              onMouseEnter={() => setHoveredPlan(plan.id)}
              onMouseLeave={() => setHoveredPlan(null)}
              className={`relative rounded-2xl border p-6 flex flex-col transition-all duration-300 hover-lift ${
                plan.popular
                  ? 'border-foreground/30 bg-foreground/5 shadow-lg'
                  : 'border-border bg-card'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-xs font-medium bg-foreground text-background">
                  {isZh ? '推荐' : 'Most Popular'}
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-normal mb-1">
                    {isZh ? plan.nameZh : plan.nameEn}
                  </h3>
                  <p className="text-xs text-muted-foreground min-h-[3.75rem] lg:min-h-[2.25rem]">
                    {isZh ? plan.descZh : plan.descEn}
                  </p>
                </div>

                {/* Price */}
                {!plan.isEnterprise ? (
                  <div className="relative space-y-2 pr-28">
                    <div className="flex items-end">
                      <div className="flex shrink-0 items-end whitespace-nowrap">
                        <span className="text-3xl font-medium">{plan.price}</span>
                        {plan.priceSubZh && (
                          <span className="text-sm text-muted-foreground ml-1">
                            {isZh ? plan.priceSubZh : plan.priceSubEn}
                          </span>
                        )}
                      </div>
                      {showAutoRenewToggle && (
                        <button
                          type="button"
                          onClick={() => handleAutoRenewToggle(plan.id as PlanId)}
                          className="absolute bottom-0 right-0 inline-flex items-center gap-1.5 rounded-full px-0.5 py-0.5 text-[11px] leading-none text-muted-foreground transition-colors hover:text-foreground"
                          role="checkbox"
                          aria-checked={isAutoRenewEnabled}
                        >
                          <span
                            className={`inline-flex h-4 w-4 items-center justify-center rounded-full border transition-colors ${
                              isAutoRenewEnabled
                                ? 'border-foreground bg-foreground text-background'
                                : 'border-border bg-background text-transparent'
                            }`}
                          >
                            <Check className="h-2.5 w-2.5" />
                          </span>
                          <span>{isZh ? '连续订阅' : 'Auto renew'}</span>
                        </button>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Zap className="w-3 h-3" />
                      <span>{plan.credits}</span>
                      {!plan.isFree && plan.creditsNoteZh && (
                        <span className="ml-0.5">
                          ({isZh ? plan.creditsNoteZh : plan.creditsNoteEn})
                        </span>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div>
                      <span className="text-3xl font-medium">{isZh ? '定制' : 'Custom'}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Zap className="w-3 h-3" />
                      <span>{isZh ? '定制额度' : 'Custom Credits'}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* CTA */}
              {!isLower && (
                <div className="space-y-2 mt-3">
                  <Button
                    onClick={() => handleSubscribe(plan)}
                    variant={plan.popular ? 'default' : 'outline'}
                    className="w-full rounded-full"
                    disabled={isCurrent}
                  >
                    {getPlanActionLabel(plan, isCurrent, isHigher, isLower)}
                  </Button>
                </div>
              )}

              <div className="h-px bg-border mt-4 mb-4" />

              {/* What you can generate */}
              <FeatureQuotaTable
                planId={plan.id}
                isEnterprise={plan.isEnterprise}
                highlightDiffFrom={compareQuota}
              />

              <div className="flex-1" />
            </div>
            );
          })}
        </section>

        <section className="max-w-6xl mx-auto mb-20 text-center">
          <button
            type="button"
            onClick={handleTopUpDialogOpen}
            className="inline-flex items-center gap-1 text-large text-muted-foreground transition-colors duration-200 hover:text-foreground"
          >
            <span>{isZh ? '套餐额度不够？' : 'Need more credits?'}</span>
            <span className="font-medium text-orange-600 ">
              {isZh ? '购买加油包' : 'Buy top-up packs'}
            </span>
            <span aria-hidden="true" className="text-orange-600">&gt;</span>
          </button>
        </section>

        {/* ========== D) Comparison Table ========== */}
        <section className="max-w-5xl mx-auto mb-20">
          <h2 className="heading-md text-center mb-10">
            {isZh ? '权益对比' : 'Plan Comparison'}
          </h2>

          {isMobile ? (
            <div className="space-y-3">
              {FEATURES.map((f) => (
                <div key={f.id} className="border border-border rounded-xl p-4">
                  <h4 className="text-sm font-medium mb-2">{isZh ? f.zh : f.en}</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {planKeys.map((key) => {
                      const quota = PLAN_QUOTAS[key];
                      const featureKey = f.id as keyof import('@/components/pricing/FeatureQuotaTable').FeatureQuota;
                      const val = key === 'enterprise' ? -1 : (quota?.[featureKey] ?? 0);
                      return (
                        <div key={key} className="text-xs p-2 rounded-lg border border-border">
                          <div className="font-medium text-muted-foreground mb-0.5">
                            {plans.find(p => p.id === key)?.[isZh ? 'nameZh' : 'nameEn']}
                          </div>
                          <span className={`font-medium tabular-nums ${val === -1 ? 'text-primary' : val === 0 ? 'text-muted-foreground/40' : 'text-foreground'}`}>
                            {val === -1 ? (isZh ? '不限' : '∞') : val}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left p-4 font-medium text-muted-foreground w-[220px]">
                      {isZh ? '功能' : 'Feature'}
                    </th>
                    {plans.map((p) => (
                      <th key={p.id} className="p-4 text-center font-medium">
                        {isZh ? p.nameZh : p.nameEn}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {FEATURES.map((f) => {
                    const featureKey = f.id as keyof import('@/components/pricing/FeatureQuotaTable').FeatureQuota;
                    return (
                      <tr key={f.id} className="border-b border-border last:border-b-0">
                        <td className="p-4 font-medium">{isZh ? f.zh : f.en}</td>
                        {planKeys.map((key) => {
                          const quota = PLAN_QUOTAS[key];
                          const val = key === 'enterprise' ? -1 : (quota?.[featureKey] ?? 0);
                          return (
                            <td key={key} className="p-4 text-center">
                              <span className={`font-semibold tabular-nums ${val === -1 ? 'text-primary' : val === 0 ? 'text-muted-foreground/40' : 'text-foreground'}`}>
                                {val === -1 ? (isZh ? '不限' : '∞') : val}
                              </span>
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* ========== E) FAQ ========== */}
        <section className="max-w-3xl mx-auto mb-20">
          <h2 className="heading-md text-center mb-10">
            {isZh ? '常见问题' : 'Frequently Asked Questions'}
          </h2>
          <Accordion type="single" collapsible className="space-y-2">
            {faqItems.map((faq, idx) => (
              <AccordionItem key={idx} value={`faq-${idx}`} className="border border-border rounded-xl overflow-hidden px-4">
                <AccordionTrigger className="text-left text-sm font-medium">
                  {isZh ? faq.qZh : faq.qEn}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground">
                  {isZh ? faq.aZh : faq.aEn}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>

        {/* ========== F) Bottom CTA ========== */}
        <section className="text-center py-16 border-t border-border">
          <h2 className="heading-md mb-4">
            {isZh ? '准备好开始使用 OranAI 了吗？' : 'Ready to start with OranAI?'}
          </h2>
          <div className="flex items-center justify-center gap-4 mt-6">
            <Button
              onClick={handleScrollToPlans}
              className="rounded-full px-8"
            >
              {isZh ? '立即订阅' : 'Subscribe'}
            </Button>
            <Button
              variant="outline"
              onClick={handleContactSales}
              className="rounded-full px-8"
            >
              <Mail className="w-4 h-4 mr-1" />
              {isZh ? '联系销售' : 'Contact Sales'}
            </Button>
          </div>
        </section>
        </div>
      </div>
      <Dialog open={!!pendingAutoRenewChange} onOpenChange={handleAutoRenewDialogChange}>
        <DialogContent className="!border-black/5 !bg-white/92 backdrop-blur-2xl shadow-[0_24px_80px_rgba(15,23,42,0.14)] dark:!border-border dark:!bg-[hsl(var(--background)/0.95)] dark:backdrop-blur-sm sm:max-w-md">
          <DialogHeader className="pr-8">
            <DialogTitle>
              {pendingAutoRenewChange?.nextValue
                ? (isZh ? '恢复连续订阅？' : 'Resume recurring subscription?')
                : (isZh ? '取消连续订阅？' : 'Cancel recurring subscription?')}
            </DialogTitle>
            <DialogDescription className="leading-relaxed pt-3">
              {pendingAutoRenewChange?.nextValue
                ? (isZh
                  ? `恢复后，升级至${pendingAutoRenewPlan ? (isZh ? pendingAutoRenewPlan.nameZh : pendingAutoRenewPlan.nameEn) : ''}时将默认开启连续续订。`
                  : `Recurring subscription will be re-enabled by default for ${pendingAutoRenewPlan?.nameEn ?? 'this plan'}.`)
                : (isZh
                  ? `取消后，升级至${pendingAutoRenewPlan ? (isZh ? pendingAutoRenewPlan.nameZh : pendingAutoRenewPlan.nameEn) : ''}时将按非连续订阅处理。`
                  : `Recurring subscription will be turned off for ${pendingAutoRenewPlan?.nameEn ?? 'this plan'}.`)}
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="pt-2">
            <Button
              variant="outline"
              className="rounded-full px-6"
              onClick={() => setPendingAutoRenewChange(null)}
            >
              {isZh ? '暂不修改' : 'Keep current'}
            </Button>
            <Button
              className="rounded-full px-6"
              onClick={handleConfirmAutoRenewChange}
            >
              {pendingAutoRenewChange?.nextValue
                ? (isZh ? '恢复连续订阅' : 'Resume recurring')
                : (isZh ? '取消连续订阅' : 'Cancel recurring')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={isTopUpAccessDialogOpen} onOpenChange={setIsTopUpAccessDialogOpen}>
        <DialogContent className="!border-black/5 !bg-white/92 backdrop-blur-2xl shadow-[0_24px_80px_rgba(15,23,42,0.14)] dark:!border-border dark:!bg-[hsl(var(--background)/0.95)] dark:backdrop-blur-sm sm:max-w-md">
          <DialogHeader className="pr-8">
            <DialogTitle>
              {isZh ? '加油包权益提示' : 'Top-up access notice'}
            </DialogTitle>
            <DialogDescription className="leading-relaxed pt-3">
              {isZh
                ? '解锁更多使用空间：升级后可按需购买加油包'
                : 'Top-up packs are available only after upgrading to the Basic or Pro plan.'}
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="pt-2">
            <Button
              variant="outline"
              className="rounded-full px-6"
              onClick={() => setIsTopUpAccessDialogOpen(false)}
            >
              {isZh ? '我知道了' : 'Got it'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog
        open={isTopUpDialogOpen}
        onOpenChange={(open) => {
          setIsTopUpDialogOpen(open);
          if (!open) {
            setSelectedTopUpPack(null);
          }
        }}
      >
        <DialogContent className="!border-black/5 !bg-white/92 backdrop-blur-2xl shadow-[0_24px_80px_rgba(15,23,42,0.14)] dark:!border-border dark:!bg-[hsl(var(--background)/0.95)] dark:backdrop-blur-sm sm:max-w-4xl">
          <DialogHeader className="pr-8">
            <DialogTitle>
              {isZh ? '购买加油包' : 'Choose a top-up pack'}
            </DialogTitle>
            <DialogDescription>
              {isZh
                ? '单次支付，不会自动续费；到账积分自购买起 1 个月有效，到期清零。'
                : 'One-off payment with no recurring billing. Top-up credits stay valid for one month from purchase.'}
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            {topUpPacks.map((pack) => {
              const isSelected = selectedTopUpPack?.id === pack.id;

              return (
                <button
                  key={pack.id}
                  type="button"
                  onClick={() => handleTopUpSelect(pack)}
                  aria-pressed={isSelected}
                  className={`relative rounded-xl border p-4 text-left transition-all duration-200 ${
                    isSelected
                      ? 'border-primary bg-primary/[0.05] shadow-sm'
                      : 'border-border bg-background/70 hover:border-foreground/20 hover:bg-foreground/[0.04]'
                  }`}
                >
                  {isSelected && (
                    <span className="absolute right-3 top-3 inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      <Check className="h-3.5 w-3.5" />
                    </span>
                  )}

                  <div className="flex items-start justify-between gap-3 pr-8">
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-xl font-semibold text-foreground">
                          {isZh ? pack.nameZh : pack.nameEn}
                        </span>
                        {pack.badgeZh && (
                          <span
                            className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                              pack.featured
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-primary/10 text-primary'
                            }`}
                          >
                            {isZh ? pack.badgeZh : pack.badgeEn}
                          </span>
                        )}
                      </div>
                      <p className="mt-1.5 text-xs text-muted-foreground">
                        {isZh ? '一次性补量包' : 'One-off refill pack'}
                      </p>
                    </div>
                    <span className="shrink-0 text-2xl font-semibold tabular-nums text-foreground">
                      {pack.price}
                    </span>
                  </div>

                  <div className="mt-4 rounded-lg bg-muted/50 px-3 py-3">
                    <div className="text-[11px] text-muted-foreground">
                      {isZh ? '实际到账' : 'You Receive'}
                    </div>
                    <div className="mt-1.5 flex items-baseline gap-2">
                      {pack.originalCredits && (
                        <span className="text-lg tabular-nums text-muted-foreground line-through">
                          {pack.originalCredits}
                        </span>
                      )}
                      <span className="text-xl font-semibold tabular-nums text-foreground">
                        {pack.credits}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 flex items-start gap-2 text-xs leading-relaxed text-muted-foreground">
                    <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                    <span>{isZh ? pack.noteZh : pack.noteEn}</span>
                  </div>
                </button>
              );
            })}
          </div>

          <DialogFooter className="pt-2">
            <Button
              variant="outline"
              className="rounded-full px-6"
              onClick={() => setIsTopUpDialogOpen(false)}
            >
              {isZh ? '取消' : 'Cancel'}
            </Button>
            <Button
              className="rounded-full px-6"
              disabled={!selectedTopUpPack}
              onClick={handleTopUpCheckout}
            >
              {isZh ? '购买' : 'Purchase'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PricingPage;
