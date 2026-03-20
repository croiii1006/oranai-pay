import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Zap, Filter } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

type EventType = 'grant' | 'charge' | 'freeze' | 'settle' | 'revert';

interface LedgerEntry {
  id: string;
  description: { zh: string; en: string };
  type: EventType;
  status: { zh: string; en: string };
  amount: number; // positive = credit in, negative = credit out
  isFrozen?: boolean;
  time: string;
}

const statusLabels: Record<EventType, { zh: string; en: string }> = {
  grant: { zh: '已获取', en: 'Granted' },
  charge: { zh: '已扣减', en: 'Charged' },
  freeze: { zh: '已冻结', en: 'Frozen' },
  settle: { zh: '已结算', en: 'Settled' },
  revert: { zh: '已退回', en: 'Reverted' },
};

const filterOptions: { value: string; zh: string; en: string }[] = [
  { value: 'all', zh: '全部', en: 'All' },
  { value: 'grant', zh: '发放', en: 'Granted' },
  { value: 'charge', zh: '扣减', en: 'Charged' },
  { value: 'freeze', zh: '冻结', en: 'Frozen' },
  { value: 'revert', zh: '退回', en: 'Reverted' },
];

// Mock ledger data
const mockLedger: LedgerEntry[] = [
  {
    id: '1',
    description: { zh: '注册赠送', en: 'Signup Bonus' },
    type: 'grant',
    status: statusLabels.grant,
    amount: 200,
    time: '2025-12-01 10:00',
  },
  {
    id: '2',
    description: { zh: '购买发放（专业版 · 月付）', en: 'Purchase Grant (Pro · Monthly)' },
    type: 'grant',
    status: statusLabels.grant,
    amount: 6000,
    time: '2025-12-05 14:30',
  },
  {
    id: '3',
    description: { zh: '品牌健康度诊断', en: 'Brand Health Diagnosis' },
    type: 'charge',
    status: statusLabels.charge,
    amount: -120,
    time: '2025-12-06 09:15',
  },
  {
    id: '4',
    description: { zh: 'TikTok 爆款视频', en: 'TikTok Viral Video' },
    type: 'charge',
    status: statusLabels.charge,
    amount: -80,
    time: '2025-12-07 11:00',
  },
  {
    id: '5',
    description: { zh: '图片生成（冻结）', en: 'Image Generation (Freeze)' },
    type: 'freeze',
    status: statusLabels.freeze,
    amount: -18,
    isFrozen: true,
    time: '2025-12-08 16:20',
  },
  {
    id: '6',
    description: { zh: '图片生成（结算：实际 4 Credit）', en: 'Image Generation (Settled: 4 Credit)' },
    type: 'settle',
    status: statusLabels.settle,
    amount: -4,
    time: '2025-12-08 16:21',
  },
  {
    id: '7',
    description: { zh: '图片生成（退回冻结差额 14 Credit）', en: 'Image Generation (Revert: 14 Credit)' },
    type: 'revert',
    status: statusLabels.revert,
    amount: 14,
    time: '2025-12-08 16:21',
  },
  {
    id: '8',
    description: { zh: '视频生成（冻结）', en: 'Video Generation (Freeze)' },
    type: 'freeze',
    status: statusLabels.freeze,
    amount: -120,
    isFrozen: true,
    time: '2025-12-09 10:00',
  },
  {
    id: '9',
    description: { zh: '视频生成（失败退回）', en: 'Video Generation (Task Failed — Revert)' },
    type: 'revert',
    status: statusLabels.revert,
    amount: 120,
    time: '2025-12-09 10:05',
  },
  {
    id: '10',
    description: { zh: '续费发放（专业版 · 月付）', en: 'Renewal Grant (Pro · Monthly)' },
    type: 'grant',
    status: statusLabels.grant,
    amount: 6000,
    time: '2026-01-05 14:30',
  },
  {
    id: '11',
    description: { zh: '升级发放（企业版 · 月付）', en: 'Upgrade Grant (Enterprise · Monthly)' },
    type: 'grant',
    status: statusLabels.grant,
    amount: 15000,
    time: '2026-02-01 09:00',
  },
];

const tabs = [
  { id: 'usage', zh: '用量', en: 'Usage' },
  { id: 'account', zh: '账户管理', en: 'Account' },
  { id: 'billing', zh: '账单', en: 'Billing' },
];

const UsagePage: React.FC = () => {
  const { language } = useLanguage();
  const isZh = language === 'zh';
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState('usage');
  const [filter, setFilter] = useState('all');

  const filteredLedger = filter === 'all'
    ? mockLedger
    : mockLedger.filter((e) => e.type === filter);

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="w-full px-6 sm:px-10 lg:px-16 max-w-5xl mx-auto">
        {/* Tabs */}
        <div className="flex items-center gap-1 mb-8 rounded-full border border-border/50 bg-muted/30 p-1 w-fit">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                activeTab === tab.id
                  ? 'bg-foreground text-background shadow-md'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {isZh ? tab.zh : tab.en}
            </button>
          ))}
        </div>

        {activeTab === 'usage' ? (
          <>
            <h1 className="heading-md mb-6">{isZh ? '用量明细' : 'Usage Details'}</h1>

            {/* Filter */}
            <div className="flex items-center gap-2 mb-6 flex-wrap">
              <Filter className="w-4 h-4 text-muted-foreground" />
              {filterOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setFilter(opt.value)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors border ${
                    filter === opt.value
                      ? 'bg-foreground text-background border-foreground'
                      : 'border-border text-muted-foreground hover:text-foreground hover:border-foreground/30'
                  }`}
                >
                  {isZh ? opt.zh : opt.en}
                </button>
              ))}
            </div>

            {/* Table */}
            {isMobile ? (
              <div className="space-y-3">
                {filteredLedger.map((entry) => (
                  <div key={entry.id} className="border border-border rounded-xl p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">
                        {isZh ? entry.description.zh : entry.description.en}
                      </span>
                      <span className={`text-sm font-semibold ${
                        entry.amount > 0 ? 'text-foreground' : 'text-muted-foreground'
                      }`}>
                        {entry.amount > 0 ? '+' : ''}{entry.amount.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span className={`px-2 py-0.5 rounded-full border border-border/50 ${
                        entry.isFrozen ? 'text-muted-foreground/60' : ''
                      }`}>
                        {isZh ? entry.status.zh : entry.status.en}
                      </span>
                      <span>{entry.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-border overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/30">
                      <th className="text-left p-4 font-medium text-muted-foreground">
                        {isZh ? '明细' : 'Description'}
                      </th>
                      <th className="text-left p-4 font-medium text-muted-foreground">
                        {isZh ? '状态' : 'Status'}
                      </th>
                      <th className="text-left p-4 font-medium text-muted-foreground">
                        {isZh ? '日期' : 'Date'}
                      </th>
                      <th className="text-right p-4 font-medium text-muted-foreground">
                        {isZh ? '积分变化' : 'Credits'}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredLedger.map((entry) => (
                      <tr key={entry.id} className="border-b border-border hover:bg-muted/20 transition-colors">
                        <td className="p-4 font-medium">
                          {isZh ? entry.description.zh : entry.description.en}
                        </td>
                        <td className="p-4">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs border border-border/50 ${
                            entry.isFrozen ? 'text-muted-foreground/60' : 'text-muted-foreground'
                          }`}>
                            {isZh ? entry.status.zh : entry.status.en}
                          </span>
                        </td>
                        <td className="p-4 text-muted-foreground">{entry.time}</td>
                        <td className={`p-4 text-right font-semibold ${
                          entry.amount > 0 ? 'text-foreground' : 'text-muted-foreground'
                        }`}>
                          <span className="flex items-center justify-end gap-1">
                            <Zap className="w-3.5 h-3.5" />
                            {entry.amount > 0 ? '+' : ''}{entry.amount.toLocaleString()}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20">
            <p className="text-muted-foreground">
              {isZh ? '此功能即将上线' : 'This feature is coming soon'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UsagePage;
