import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Check, Zap, Mail, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useIsMobile } from '@/hooks/use-mobile';
import { getToken } from '@/lib/utils/auth-storage';
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
  { id: 'videoRemix', zh: '复刻视频', en: 'Video Remix' },
  { id: 'tkSolution', zh: 'TK 解决方案', en: 'TK Solution' },
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
    descZh: '注册即享，零门槛体验 AI 能力',
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
    descEn: 'For light creators — daily image gen & insight reports',
    price: '$9.9',
    priceSubZh: '/ 月',
    priceSubEn: '/ month',
    credits: '400 Credit',
    creditsNoteZh: '溢价约 17%',
    creditsNoteEn: '~17% premium',
  },
  {
    id: 'pro',
    nameZh: '专业版',
    nameEn: 'Pro',
    descZh: '重度/工作室，满足高频报告生成与短视频渲染需求',
    descEn: 'For power users — high-frequency reports & video rendering',
    price: '$39.9',
    priceSubZh: '/ 月',
    priceSubEn: '/ month',
    credits: '1600 Credit',
    creditsNoteZh: '溢价约 16%',
    creditsNoteEn: '~16% premium',
    popular: true,
  },
  {
    id: 'enterprise',
    nameZh: '企业版',
    nameEn: 'Enterprise',
    descZh: '大客户，需签署线下合同',
    descEn: 'For large organizations — custom contracts',
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
  badgeZh?: string;
  badgeEn?: string;
}

const topUpPacks: TopUpPack[] = [
  {
    id: 'starter',
    nameZh: '体验包',
    nameEn: 'Starter',
    price: '$5',
    credits: '170 Credit',
  },
  {
    id: 'base',
    nameZh: '基础包',
    nameEn: 'Base',
    price: '$10',
    credits: '360 Credit',
    badgeZh: '赠送 10 积分',
    badgeEn: '+10 bonus',
  },
  {
    id: 'value',
    nameZh: '超值包',
    nameEn: 'Best Value',
    price: '$50',
    credits: '1800 Credit',
    badgeZh: '多送近 100 积分',
    badgeEn: '~100 bonus credits',
  },
];

const faqItems = [
  {
    qZh: '积分会过期吗？',
    qEn: 'Do Credits expire?',
    aZh: '订阅赠送的积分按月清零（Use-it-or-lose-it）。系统按购买时间戳精确到分钟计算，例如 1 月 15 日 08:00 购买，则在 2 月 15 日 08:00 执行清零并重置新一月额度。充值包积分有效期为购买后一个月。',
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
    aZh: '支付成功后立刻切换到新套餐，并立即发放新套餐完整 Credit。旧套餐剩余时间不折算、不补差价、不顺延。',
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
    ? '你好，我想咨询 OranAI 企业版。\n使用场景：________\n联系方式：________'
    : 'Hi, I\'d like to inquire about OranAI Enterprise.\nUse case: ________\nContact: ________';
  return `mailto:hey@photog.art?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
};

/* ================================================================
   COMPONENT
   ================================================================ */

const PricingPage: React.FC = () => {
  const { language } = useLanguage();
  const isMobile = useIsMobile();
  const isZh = language === 'zh';
  const planKeys = ['free', 'basic', 'pro', 'enterprise'] as const;
  const [hoveredPlan, setHoveredPlan] = useState<string | null>(null);
  const isSubscribed = true; // TODO: restore to !!getToken() after testing

  const handleSubscribe = (plan: PlanConfig) => {
    if (plan.isEnterprise) {
      window.location.href = buildMailto(isZh);
      return;
    }
    const token = getToken();
    if (!token) {
      window.location.href = '/?logon=1';
    } else if (plan.isFree) {
      window.open('https://toolbox.photog.art', '_blank');
    } else {
      window.open(`https://toolbox.photog.art/checkout?plan=${plan.id}`, '_blank');
    }
  };

  const handleContactSales = () => {
    window.location.href = buildMailto(isZh);
  };

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="w-full px-6 sm:px-10 lg:px-16">

        {/* ========== A) Hero ========== */}
        <section className="text-center py-16 max-w-3xl mx-auto">
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
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto mb-20">
          {plans.map((plan) => {
            // Determine comparison quota for hover highlight
            const compareQuota = hoveredPlan && hoveredPlan !== plan.id
              ? null
              : hoveredPlan === plan.id && plan.id === 'pro'
                ? PLAN_QUOTAS['basic']
                : hoveredPlan === plan.id && plan.id === 'basic'
                  ? PLAN_QUOTAS['free']
                  : null;

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

              <h3 className="text-lg font-semibold mb-1">
                {isZh ? plan.nameZh : plan.nameEn}
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                {isZh ? plan.descZh : plan.descEn}
              </p>

              {/* Price */}
              {!plan.isEnterprise ? (
                <div className="mb-2">
                  <span className="text-3xl font-bold">{plan.price}</span>
                  {plan.priceSubZh && (
                    <span className="text-sm text-muted-foreground ml-1">
                      {isZh ? plan.priceSubZh : plan.priceSubEn}
                    </span>
                  )}
                </div>
              ) : (
                <div className="mb-2">
                  <span className="text-3xl font-bold">{isZh ? '定制' : 'Custom'}</span>
                </div>
              )}

              {/* Credits (subdued) */}
              {!plan.isEnterprise && (
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                  <Zap className="w-3 h-3" />
                  <span>{plan.credits}</span>
                  {plan.creditsNoteZh && (
                    <span className="ml-0.5">
                      ({isZh ? plan.creditsNoteZh : plan.creditsNoteEn})
                    </span>
                  )}
                </div>
              )}
              {plan.isEnterprise && (
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                  <Zap className="w-3 h-3" />
                  <span>{isZh ? '定制额度' : 'Custom Credits'}</span>
                </div>
              )}

              <div className="h-px bg-border my-4" />

              {/* ⭐ What you can generate */}
              <FeatureQuotaTable
                planId={plan.id}
                isEnterprise={plan.isEnterprise}
                highlightDiffFrom={compareQuota}
              />

              <div className="flex-1" />

              {/* CTA */}
              <div className="space-y-2">
                <Button
                  onClick={() => handleSubscribe(plan)}
                  variant={plan.popular ? 'default' : 'outline'}
                  className="w-full rounded-full"
                >
                  {plan.isEnterprise
                    ? (isZh ? '联系销售' : 'Contact Sales')
                    : plan.isFree
                      ? (isZh ? '开始使用' : 'Get Started')
                      : (isZh ? '立即订阅' : 'Subscribe')}
                </Button>
              </div>

              {/* Top-Up Packs (only for paid plans) */}
              {isSubscribed && !plan.isFree && !plan.isEnterprise && (
                <>
                  <div className="h-px bg-border my-4" />
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                    {isZh ? '加油包' : 'Top-Up Packs'}
                  </h4>
                  <div className="space-y-2">
                    {topUpPacks.map((pack) => (
                      <button
                        key={pack.id}
                        onClick={() => {
                          const token = getToken();
                          if (!token) {
                            window.location.href = '/?logon=1';
                          } else {
                            window.open(`https://toolbox.photog.art/checkout?topup=${pack.id}`, '_blank');
                          }
                        }}
                        className="w-full flex items-center justify-between py-2 px-3 rounded-lg border border-border text-sm hover:bg-foreground/[0.04] transition-colors duration-200"
                      >
                        <span className="flex items-center gap-1.5">
                          <Sparkles className="w-3 h-3 text-muted-foreground" />
                          <span>{isZh ? pack.nameZh : pack.nameEn}</span>
                          {pack.badgeZh && (
                            <span className="text-[10px] text-primary">
                              {isZh ? pack.badgeZh : pack.badgeEn}
                            </span>
                          )}
                        </span>
                        <span className="font-semibold tabular-nums">{pack.price}</span>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
            );
          })}
        </section>

        {/* Top-Up section removed — packs are now inside each paid plan card */}

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
                          <span className={`font-semibold tabular-nums ${val === -1 ? 'text-primary' : val === 0 ? 'text-muted-foreground/40' : 'text-foreground'}`}>
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
              onClick={() => handleSubscribe(plans[2])}
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
  );
};

export default PricingPage;
