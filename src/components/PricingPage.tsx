import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Check, Zap, Mail, Lock, Unlock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useIsMobile } from '@/hooks/use-mobile';
import { getToken } from '@/lib/utils/auth-storage';

/* ================================================================
   DATA CONFIG — all plans, features, credit costs, FAQ driven here
   ================================================================ */

// 4 live features
const LIVE_FEATURES = [
  { id: 'brandHealth', zh: '品牌健康度诊断', en: 'Brand Health Diagnosis' },
  { id: 'tiktokViral', zh: 'TikTok 爆款视频', en: 'TikTok Viral Video' },
  { id: 'imageGen', zh: '图片生成', en: 'Image Generation' },
  { id: 'videoGen', zh: '视频生成', en: 'Video Generation' },
];

// Coming soon features (collapsed into one summary row)
const COMING_SOON_FEATURES = [
  { id: 'geoMonitor', zh: 'GEO 监控平台', en: 'GEO Monitoring' },
  { id: 'tiktokInsight', zh: 'TikTok 洞察报告', en: 'TikTok Insight Report' },
  { id: 'marketingPlan', zh: '营销策划方案', en: 'Marketing Plan' },
  { id: 'videoRemix', zh: '复刻视频', en: 'Video Remix' },
  { id: 'digitalHuman', zh: '数字人生成', en: 'Digital Human' },
  { id: 'b2bLead', zh: 'B2B 线索获客', en: 'B2B Lead Gen' },
];

interface PlanConfig {
  id: string;
  nameZh: string;
  nameEn: string;
  descZh: string;
  descEn: string;
  monthlyPrice: number | null;
  annualPrice: number | null;
  monthlyCredits: number | null;
  annualCredits: number | null;
  isFree?: boolean;
  freeCredits?: number;
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
    monthlyPrice: 0,
    annualPrice: 0,
    monthlyCredits: null,
    annualCredits: null,
    isFree: true,
    freeCredits: 200,
  },
  {
    id: 'basic',
    nameZh: '基础版',
    nameEn: 'Basic',
    descZh: '适合个人创作者与小型品牌起步',
    descEn: 'Great for individual creators getting started',
    monthlyPrice: 199,
    annualPrice: 1899,
    monthlyCredits: 2000,
    annualCredits: 24000,
  },
  {
    id: 'pro',
    nameZh: '专业版',
    nameEn: 'Pro',
    descZh: '适合专业营销人员与成长型品牌',
    descEn: 'For professional marketers and growing brands',
    monthlyPrice: 499,
    annualPrice: 4790,
    monthlyCredits: 6000,
    annualCredits: 72000,
    popular: true,
  },
  {
    id: 'enterprise',
    nameZh: '企业版',
    nameEn: 'Enterprise',
    descZh: '为大型企业量身定制的解决方案',
    descEn: 'Custom solutions for large organizations',
    monthlyPrice: 999,
    annualPrice: 9590,
    monthlyCredits: 15000,
    annualCredits: 180000,
    isEnterprise: true,
  },
];

// Credit cost descriptions
const creditCosts = {
  fixed: [
    { id: 'brandHealth', zh: '品牌健康度诊断', en: 'Brand Health Diagnosis', cost: 120 },
    { id: 'tiktokViral', zh: 'TikTok 爆款视频', en: 'TikTok Viral Video', cost: 80 },
  ],
  dynamic: [
    { id: 'imageGen', zh: '图片生成', en: 'Image Generation', rangeZh: '每张 2–6 Credit（按参数浮动）', rangeEn: '2–6 Credit per image (varies by params)' },
    { id: 'videoGen', zh: '视频生成', en: 'Video Generation', rangeZh: '每 10 秒 50–120 Credit（按参数浮动）', rangeEn: '50–120 Credit per 10s (varies by params)' },
  ],
};

const faqItems = [
  {
    qZh: '是否可以随时取消订阅？',
    qEn: 'Can I cancel my subscription anytime?',
    aZh: '可以随时取消自动续费。取消后当前周期仍可使用，但不退款。',
    aEn: 'You can cancel auto-renewal anytime. Your benefits remain active until the end of the current billing period. No refunds.',
  },
  {
    qZh: '年付如何计费？是否自动续费？',
    qEn: 'How does annual billing work? Is it auto-renewed?',
    aZh: '年付为一次性支付全年费用。订阅到期后将自动续费，您可在到期前取消。每次续费成功后立即发放该套餐对应的 Credit 包。',
    aEn: 'Annual billing is a one-time payment for the full year. Subscriptions auto-renew. You can cancel before expiration. Credits are granted immediately upon each successful payment.',
  },
  {
    qZh: 'Credit 会过期吗？可以累计吗？',
    qEn: 'Do Credits expire? Can they accumulate?',
    aZh: 'Credit 永不过期，可长期累计。只要账户余额有 Credit，即使订阅到期也可继续使用已上线功能。',
    aEn: 'Credits never expire and accumulate over time. As long as you have Credits, you can use available features even after your subscription ends.',
  },
  {
    qZh: '免费版 Credit 如何获得？',
    qEn: 'How do I get Free plan Credits?',
    aZh: '注册成功时一次性赠送 200 Credit，后续不再自动赠送。',
    aEn: 'You receive 200 Credits as a one-time signup bonus. No further free Credits are granted.',
  },
  {
    qZh: '升级规则是什么？',
    qEn: 'What are the upgrade rules?',
    aZh: '支付成功后立刻切换到新套餐，并立即发放新套餐完整 Credit。旧套餐剩余时间不折算、不补差价、不顺延。',
    aEn: 'Upon successful payment, your plan switches immediately and the full Credit package of the new plan is granted. Remaining time on the old plan is not prorated, refunded, or carried over.',
  },
  {
    qZh: '是否支持退款、降级或平级切换？',
    qEn: 'Do you support refunds, downgrades, or lateral plan changes?',
    aZh: '不支持退款、不支持降级、不支持平级切换。如需特殊需求请联系销售。',
    aEn: 'We do not support refunds, downgrades, or lateral plan changes. For special requests, please contact sales.',
  },
  {
    qZh: '是否支持多人同时使用？',
    qEn: 'Do you support multiple users?',
    aZh: '当前所有套餐默认 1 个席位（单人使用）。如需企业定制请联系销售。',
    aEn: 'All plans include 1 seat (single user). For enterprise needs, contact sales.',
  },
];

// --- helpers ---
const buildMailto = (isZh: boolean, isAnnual: boolean) => {
  const period = isAnnual ? (isZh ? '年度' : 'Annual') : (isZh ? '月度' : 'Monthly');
  const subject = isZh
    ? `OranAI 企业版咨询（${period}）`
    : `OranAI Enterprise Inquiry (${period})`;
  const body = isZh
    ? `你好，我想咨询 OranAI 企业版。\n期望周期：${period}\n使用场景：________\n联系方式：________`
    : `Hi, I'd like to inquire about OranAI Enterprise.\nBilling cycle: ${period}\nUse case: ________\nContact: ________`;
  return `mailto:hey@photog.art?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
};

/* ================================================================
   COMPONENT
   ================================================================ */

const PricingPage: React.FC = () => {
  const { language } = useLanguage();
  const [isAnnual, setIsAnnual] = useState(false);
  const isMobile = useIsMobile();
  const isZh = language === 'zh';
  const planKeys = ['free', 'basic', 'pro', 'enterprise'] as const;

  const handleSubscribe = (plan: PlanConfig) => {
    if (plan.isEnterprise) {
      window.location.href = buildMailto(isZh, isAnnual);
      return;
    }
    const token = getToken();
    if (!token) {
      window.location.href = '/?logon=1';
    } else if (plan.isFree) {
      // already logged in, go to dashboard
      window.open('https://toolbox.photog.art', '_blank');
    } else {
      // placeholder checkout
      const period = isAnnual ? 'annual' : 'monthly';
      window.open(`https://toolbox.photog.art/checkout?plan=${plan.id}&period=${period}`, '_blank');
    }
  };

  const handleContactSales = () => {
    window.location.href = buildMailto(isZh, isAnnual);
  };

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="w-full px-6 sm:px-10 lg:px-16">

        {/* ========== A) Hero ========== */}
        <section className="text-center py-16 max-w-3xl mx-auto">
          <h1 className="heading-lg mb-4">
            {isZh ? '选择适合你的会员计划' : 'Choose the plan that fits you'}
          </h1>
          <p className="body-lg mb-10">
            {isZh
              ? '用 OranAI 的洞察与创意能力，让增长更简单。'
              : "Use OranAI's insights and creative tools to grow faster."}
          </p>

          {/* Toggle */}
          <div className="flex items-center justify-center gap-3">
            <span className={`text-sm font-medium ${!isAnnual ? 'text-foreground' : 'text-muted-foreground'}`}>
              {isZh ? '月度' : 'Monthly'}
            </span>
            <Switch checked={isAnnual} onCheckedChange={setIsAnnual} />
            <span className={`text-sm font-medium ${isAnnual ? 'text-foreground' : 'text-muted-foreground'}`}>
              {isZh ? '年度' : 'Annual'}
            </span>
            {isAnnual && (
              <span className="ml-2 text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                {isZh ? '立省 20%' : 'Save 20%'}
              </span>
            )}
          </div>
        </section>

        {/* ========== B) Plan Cards ========== */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto mb-20">
          {plans.map((plan) => {
            const credits = plan.isFree
              ? plan.freeCredits
              : isAnnual
                ? plan.annualCredits
                : plan.monthlyCredits;

            return (
              <div
                key={plan.id}
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
                {!plan.isEnterprise && (
                  <div className="mb-4">
                    {plan.isFree ? (
                      <span className="text-3xl font-bold">¥0</span>
                    ) : (
                      <>
                        <span className="text-3xl font-bold">
                          ¥{isAnnual
                            ? plan.annualPrice?.toLocaleString()
                            : plan.monthlyPrice?.toLocaleString()}
                        </span>
                        <span className="text-sm text-muted-foreground ml-1">
                          / {isAnnual ? (isZh ? '年' : 'year') : (isZh ? '月' : 'month')}
                        </span>
                        {isAnnual && (
                          <div className="text-xs text-muted-foreground mt-1">
                            {isZh ? '立省 20%' : 'Save 20%'}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                )}

                {/* Credits */}
                {!plan.isEnterprise && (
                  <div className="flex items-center gap-1.5 text-sm mb-2">
                    <Zap className="w-4 h-4 text-foreground/70" />
                    <span className="font-medium">
                      {plan.isFree
                        ? (isZh ? `注册一次性赠送 ${credits} Credit` : `${credits} Credit one-time signup bonus`)
                        : (isZh
                            ? `每次${isAnnual ? '年' : '月'}付发放 ${credits?.toLocaleString()} Credit`
                            : `${credits?.toLocaleString()} Credit per ${isAnnual ? 'annual' : 'monthly'} payment`)}
                    </span>
                  </div>
                )}

                {/* Seats — hidden for Enterprise */}
                {!plan.isEnterprise && (
                  <div className="text-xs text-muted-foreground mb-4">
                    {isZh ? '席位：1（单人使用）' : 'Seats: 1 (single user)'}
                  </div>
                )}
                {plan.isEnterprise && <div className="mb-4" />}

                {/* Live features */}
                <ul className="space-y-1.5 mb-3 flex-1">
                  {LIVE_FEATURES.map((f) => (
                    <li key={f.id} className="flex items-center gap-2 text-sm">
                      <Unlock className="w-3.5 h-3.5 text-foreground/60 shrink-0" />
                      <span>{isZh ? f.zh : f.en}</span>
                      <span className="text-xs text-muted-foreground ml-auto">
                        {isZh ? '可用' : 'Included'}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* Coming soon summary */}
                <div className="text-xs text-muted-foreground/60 mb-6 flex items-start gap-1.5">
                  <Lock className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                  <span>
                    {isZh
                      ? `${COMING_SOON_FEATURES.map(f => f.zh).join('、')} — 即将上线`
                      : `${COMING_SOON_FEATURES.map(f => f.en).join(', ')} — Coming soon`}
                  </span>
                </div>

                {/* CTA */}
                <div className="space-y-2">
                  <Button
                    onClick={() => handleSubscribe(plan)}
                    variant={plan.popular ? 'default' : 'outline'}
                    className="w-full rounded-full"
                  >
                    {plan.isFree
                      ? (isZh ? '开始使用' : 'Get started')
                      : (isZh ? '立即订阅' : 'Subscribe')}
                  </Button>
                  {plan.isEnterprise && (
                    <Button
                      onClick={handleContactSales}
                      variant="ghost"
                      className="w-full rounded-full text-muted-foreground"
                    >
                      <Mail className="w-4 h-4 mr-1" />
                      {isZh ? '联系销售' : 'Contact Sales'}
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </section>

        {/* ========== C) Credit Cost Explanation ========== */}
        <section className="max-w-4xl mx-auto mb-20">
          <h2 className="heading-md text-center mb-4">
            {isZh ? '功能扣费说明' : 'Credit Usage & Costs'}
          </h2>
          <p className="text-sm text-muted-foreground text-center mb-8 max-w-2xl mx-auto">
            {isZh
              ? '套餐等级不影响单次功能扣费数量，套餐主要影响每次支付发放的 Credit 总量。'
              : 'Your plan tier does not affect per-use credit costs — it determines how many Credits you receive per payment.'}
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Fixed */}
            <div className="rounded-xl border border-border p-5">
              <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-foreground/60" />
                {isZh ? '固定扣费 (Fixed)' : 'Fixed Charge'}
              </h3>
              <p className="text-xs text-muted-foreground mb-3">
                {isZh ? '每次使用扣除固定数量的 Credit。' : 'A fixed number of Credits is deducted per use.'}
              </p>
              {creditCosts.fixed.map((c) => (
                <div key={c.id} className="flex items-center justify-between text-sm py-1.5 border-t border-border/50">
                  <span>{isZh ? c.zh : c.en}</span>
                  <span className="font-medium">{c.cost} Credit</span>
                </div>
              ))}
            </div>

            {/* Dynamic */}
            <div className="rounded-xl border border-border p-5">
              <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-foreground/60" />
                {isZh ? '动态扣费 (Dynamic)' : 'Dynamic Charge'}
              </h3>
              <p className="text-xs text-muted-foreground mb-3">
                {isZh
                  ? '根据参数预估 Credit → 冻结 → 结算；任务失败退回未消耗额度。'
                  : 'Credits are estimated → frozen → settled based on parameters. Failed tasks refund unused Credits.'}
              </p>
              {creditCosts.dynamic.map((c) => (
                <div key={c.id} className="flex items-center justify-between text-sm py-1.5 border-t border-border/50">
                  <span>{isZh ? c.zh : c.en}</span>
                  <span className="text-xs text-muted-foreground">{isZh ? c.rangeZh : c.rangeEn}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ========== D) Comparison Table ========== */}
        <section className="max-w-5xl mx-auto mb-20">
          <h2 className="heading-md text-center mb-10">
            {isZh ? '权益对比' : 'Plan Comparison'}
          </h2>

          {isMobile ? (
            <Accordion type="multiple" className="space-y-3">
              {/* Live features */}
              <AccordionItem value="live" className="border border-border rounded-xl overflow-hidden">
                <AccordionTrigger className="px-4 text-base font-medium">
                  {isZh ? '已上线功能' : 'Available Features'}
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4">
                  {LIVE_FEATURES.map((f) => (
                    <div key={f.id} className="mb-3 last:mb-0">
                      <h4 className="text-sm font-medium mb-2">{isZh ? f.zh : f.en}</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {planKeys.map((key) => (
                          <div key={key} className="text-xs p-2 rounded-lg border border-border">
                            <div className="font-medium text-muted-foreground mb-0.5 capitalize">
                              {plans.find(p => p.id === key)?.[isZh ? 'nameZh' : 'nameEn']}
                            </div>
                            <div className="flex items-center gap-1">
                              <Check className="w-3 h-3 text-foreground/60" />
                              <span>{isZh ? '可用' : 'Included'}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </AccordionContent>
              </AccordionItem>

              {/* Coming soon */}
              <AccordionItem value="coming" className="border border-border rounded-xl overflow-hidden">
                <AccordionTrigger className="px-4 text-base font-medium text-muted-foreground">
                  {isZh ? '即将上线功能' : 'Coming Soon'}
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4">
                  <div className="space-y-1">
                    {COMING_SOON_FEATURES.map((f) => (
                      <div key={f.id} className="text-sm text-muted-foreground/60 py-1">
                        {isZh ? f.zh : f.en} — {isZh ? '即将上线' : 'Coming soon'}
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>

            </Accordion>
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
                  {/* Live features header */}
                  <tr className="border-b border-border bg-muted/30">
                    <td colSpan={5} className="p-3 font-semibold text-sm">
                      {isZh ? '已上线功能' : 'Available Features'}
                    </td>
                  </tr>
                  {LIVE_FEATURES.map((f) => (
                    <tr key={f.id} className="border-b border-border">
                      <td className="p-4 font-medium">{isZh ? f.zh : f.en}</td>
                      {planKeys.map((key) => (
                        <td key={key} className="p-4 text-center">
                          <div className="flex items-center justify-center gap-1 text-foreground/70">
                            <Check className="w-4 h-4" />
                            <span className="text-xs">{isZh ? '可用' : 'Included'}</span>
                          </div>
                        </td>
                      ))}
                    </tr>
                  ))}

                  {/* Coming soon header */}
                  <tr className="border-b border-border bg-muted/30">
                    <td colSpan={5} className="p-3 font-semibold text-sm text-muted-foreground">
                      {isZh ? '即将上线' : 'Coming Soon'}
                    </td>
                  </tr>
                  {COMING_SOON_FEATURES.map((f) => (
                    <tr key={f.id} className="border-b border-border opacity-50">
                      <td className="p-4 font-medium text-muted-foreground">{isZh ? f.zh : f.en}</td>
                      {planKeys.map((key) => (
                        <td key={key} className="p-4 text-center text-xs text-muted-foreground/60">
                          {isZh ? '即将上线' : 'Coming soon'}
                        </td>
                      ))}
                    </tr>
                  ))}

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
