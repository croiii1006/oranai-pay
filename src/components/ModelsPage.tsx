import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { ArrowUp, ArrowRight, ChevronDown, ChevronUp, Sparkles, Brain, Diamond, Layers, Wind, Moon, Zap, Play, Video, Grid3X3, MessageCircle, ShoppingBag, Bot, HelpCircle, type LucideIcon } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useIPDetection } from '@/contexts/IPDetectionContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { fetchPricingData, type ModelData, type Vendor } from '@/lib/api/models';
import { logger } from '@/lib/logger';

// 供应商图标映射
const vendorIconMap: Record<string, LucideIcon> = {
  'Anthropic': Sparkles,
  'DeepSeek': Brain,
  'Google': Diamond,
  'Meta': Layers,
  'Mistral': Wind,
  'Moonshot': Moon,
  'OpenAI': Sparkles,
  'xAI': Zap,
  '字节跳动': Play,
  '快手': Video,
  '智谱': Grid3X3,
  '腾讯': MessageCircle,
  '阿里巴巴': ShoppingBag,
  '零一万物': Bot,
};

// 显示用的模型接口
interface DisplayModel {
  model_name: string;
  vendor_id?: number;
  vendor_name?: string;
  quota_type: number;
  model_ratio: number;
  model_price: number;
  completion_ratio: number;
  supported_endpoint_types: string[];
  originalData: ModelData;
}

const ModelsPage: React.FC = () => {
  const { t, language } = useLanguage();
  const { isChinaIP: isChinaIPAddress, isLoading: isIPDetecting } = useIPDetection();
  const queryClient = useQueryClient();
  
  // 搜索输入值（立即更新，用于显示）
  const [searchInput, setSearchInput] = useState('');
  // 实际用于筛选的搜索关键词（防抖后更新）
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedModel, setSelectedModel] = useState<DisplayModel | null>(null);
  
  // 防抖定时器引用
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Filter states
  const [supplierFilter, setSupplierFilter] = useState<string>('all');
  const [billingFilter, setBillingFilter] = useState<string>('all');
  const [endpointFilter, setEndpointFilter] = useState<string>('all');

  // Expand states
  const [supplierExpanded, setSupplierExpanded] = useState(false);
  const [endpointExpanded, setEndpointExpanded] = useState(false);

  // 分页状态
  const [displayedCount, setDisplayedCount] = useState<number>(18); // 初始显示18个
  const itemsPerPage = 18; // 每次加载18个
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // 中国大模型供应商名称列表
  const chinaVendorNames = useMemo(() => [
    '字节跳动',
    '快手',
    '智谱',
    '腾讯',
    '阿里巴巴',
    '零一万物',
    '橙果视界',
    '月之暗面',
    'DeepSeek',
  ], []);
  const chinaVendorNames_en = useMemo(() => [
    'ByteDance',
    'Kuaishou',
    'Zhipu',
    '腾讯',
    'Alibaba',
    '01.AI',
    'OranAI',
    'Moonshot',
    'DeepSeek',
  ], []);

  // 获取数据
  // 注意：queryKey 不包含 language，因为数据本身不依赖语言，只是请求头需要 Accept-Language
  const { data: pricingData, isLoading, error, refetch } = useQuery({
    queryKey: ['pricing'],
    queryFn: fetchPricingData,
  });

  // 监听语言变化，重新请求模型接口
  useEffect(() => {
    // 当语言变化时，重新获取模型数据
    // 使用 refetch 确保使用最新的 Accept-Language 头重新请求
    if (pricingData || !isLoading) {
      refetch();
      logger.info('Language changed, refetching pricing data', { language });
    }
  }, [language, refetch, pricingData, isLoading]);
  // 处理数据：添加供应商名称，并根据IP地址过滤
  const displayModels = useMemo<DisplayModel[]>(() => {
    if (!pricingData) {
      logger.info('No pricing data available', { pricingData });
      return [];
    }
    
    // 如果IP检测还未完成，返回空数组（避免显示错误数据）
    if (isChinaIPAddress === null) {
      logger.info('IP detection not completed yet', { isChinaIPAddress });
      return [];
    }
    
    const models = pricingData.data.map((model) => {
      const vendor = model.vendor_id
        ? pricingData.vendors.find((v) => v.id === model.vendor_id)
        : null;
      
      return {
        ...model,
        vendor_name: vendor?.name,
        originalData: model,
      };
    });
    
    logger.info('Processing models', { 
      totalModels: models.length, 
      isChinaIP: isChinaIPAddress,
      language 
    });
    
    // 如果是中国IP，只显示中国大模型
    if (isChinaIPAddress) {
      const filtered = models.filter((model) => {
        if (language === 'en') {
          return model.vendor_name && chinaVendorNames_en.includes(model.vendor_name);
        } else {
          return model.vendor_name && chinaVendorNames.includes(model.vendor_name);
        }
      });
      logger.info('Filtered models for China IP', { filteredCount: filtered.length });
      return filtered;
    }
    // 非中国IP，显示所有模型
    logger.info('Showing all models for non-China IP', { modelsCount: models.length });
    return models;
  }, [pricingData, isChinaIPAddress, chinaVendorNames, chinaVendorNames_en, language]);
  // 构建供应商选项（根据IP地址过滤）
  const supplierOptions = useMemo(() => {
    if (!pricingData) return [];
    
    // 如果IP检测还未完成，返回空数组
    if (isChinaIPAddress === null) {
      return [];
    }
    
    const baseOptions = [
      {
    id: 'all',
    labelKey: 'models.allSuppliers',
        icon: Grid3X3,
        name: t('models.allSuppliers'),
      },
    ];

    // 根据IP地址过滤供应商
    let filteredVendors = pricingData.vendors;
    if (isChinaIPAddress) {
      // 如果是中国IP，只显示中国供应商
      if (language === 'en') {
        filteredVendors = pricingData.vendors.filter((vendor) => 
          chinaVendorNames_en.includes(vendor.name)
        );
      } else {
        filteredVendors = pricingData.vendors.filter((vendor) => 
          chinaVendorNames.includes(vendor.name)
        );
      }
    }
    // 如果不是中国IP，显示所有供应商（不需要过滤）

    const vendorOptions = filteredVendors.map((vendor) => {
      const icon = vendorIconMap[vendor.name] || HelpCircle;
      return {
        id: vendor.id.toString(),
        labelKey: vendor.name,
        icon,
        name: vendor.name,
      };
    });

    // 添加未知供应商选项（如果有模型没有vendor_id）
    const hasUnknown = displayModels.some((m) => !m.vendor_id);
    if (hasUnknown) {
      vendorOptions.push({
    id: 'unknown',
    labelKey: 'models.unknownSupplier',
        icon: HelpCircle,
        name: t('models.unknownSupplier'),
      });
    }

    return [...baseOptions, ...vendorOptions];
  }, [pricingData, displayModels, t, isChinaIPAddress, chinaVendorNames, chinaVendorNames_en]);

  // 构建端点选项
  const endpointOptions = useMemo(() => {
    if (!pricingData) return [];
    
    const baseOptions = [
      {
    id: 'all',
        labelKey: 'models.allEndpoints',
        name: t('models.allEndpoints'),
      },
    ];

    const endpointKeys = Object.keys(pricingData.supported_endpoint);
    const endpointOpts = endpointKeys.map((key) => ({
      id: key,
      labelKey: key,
      name: key,
    }));

    return [...baseOptions, ...endpointOpts];
  }, [pricingData, t]);

  // 计费选项
  const billingOptions = [
    { id: 'all', labelKey: 'models.allTypes', name: t('models.allTypes') },
    { id: '0', labelKey: 'models.usageBilling', name: t('models.usageBilling') },
    { id: '1', labelKey: 'models.timesBilling', name: t('models.timesBilling') },
  ];

  // 筛选模型
  const filteredModels = useMemo(() => {
    return displayModels.filter((model) => {
      // 搜索筛选
      const matchesSearch = model.model_name.toLowerCase().includes(searchQuery.toLowerCase());
      
      // 供应商筛选
      const matchesSupplier = 
        supplierFilter === 'all' ||
        (supplierFilter === 'unknown' && !model.vendor_id) ||
        (model.vendor_id && model.vendor_id.toString() === supplierFilter);
      
      // 计费类型筛选
      const matchesBilling =
        billingFilter === 'all' ||
        model.quota_type.toString() === billingFilter;
      
      // 端点类型筛选
      const matchesEndpoint =
        endpointFilter === 'all' ||
        model.supported_endpoint_types.includes(endpointFilter);
      
      return matchesSearch && matchesSupplier && matchesBilling && matchesEndpoint;
    });
  }, [displayModels, searchQuery, supplierFilter, billingFilter, endpointFilter]);

  // 显示的子集（用于分页）
  const displayedModels = useMemo(() => {
    const result = filteredModels.slice(0, displayedCount);
    logger.info('Displayed models calculated', { 
      filteredCount: filteredModels.length,
      displayedCount: result.length,
      language,
      isChinaIP: isChinaIPAddress
    });
    return result;
  }, [filteredModels, displayedCount, language, isChinaIPAddress]);

  // 是否还有更多数据
  const hasMore = displayedCount < filteredModels.length;

  // 搜索防抖：用户停止输入300ms后才更新searchQuery
  useEffect(() => {
    // 清除之前的定时器
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    
    // 设置新的防抖定时器
    debounceTimerRef.current = setTimeout(() => {
      setSearchQuery(searchInput);
    }, 300); // 300ms防抖延迟
    
    // 清理函数：组件卸载或searchInput变化时清除定时器
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
        debounceTimerRef.current = null;
      }
    };
  }, [searchInput]);
  
  // 组件卸载时清理防抖定时器
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
        debounceTimerRef.current = null;
      }
    };
  }, []);

  // 当筛选条件改变时，重置显示数量
  useEffect(() => {
    setDisplayedCount(itemsPerPage);
  }, [searchQuery, supplierFilter, billingFilter, endpointFilter]);

  // 滚动加载更多
  useEffect(() => {
    if (!hasMore) return;

    const currentRef = loadMoreRef.current;
    if (!currentRef) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setDisplayedCount((prev) => Math.min(prev + itemsPerPage, filteredModels.length));
        }
      },
      {
        rootMargin: '200px', // 提前200px加载
        threshold: 0.1,
      }
    );

    observer.observe(currentRef);

    return () => {
      observer.unobserve(currentRef);
    };
  }, [hasMore, filteredModels.length]);

  // 格式化价格显示
  const formatPrice = (model: DisplayModel): string => {
    if (model.quota_type === 1) {
      // 按次计费
      return model.model_price > 0 ? `$${model.model_price.toFixed(4)}` : 'Free';
    } else {
      // 按量计费
      if (model.model_ratio === 37.5) {
        return 'N/A';
      }
      return model.model_ratio > 0 ? `${model.model_ratio}x` : 'Free';
    }
  };

  // Gradient styles for cards
  const gradients = [
    'bg-gradient-to-br from-fuchsia-400 via-orange-300 to-cyan-300',
    'bg-gradient-to-br from-orange-400 via-pink-300 to-cyan-200',
    'bg-gradient-to-br from-cyan-200 via-pink-200 to-orange-300',
    'bg-gradient-to-br from-purple-400 via-pink-300 to-yellow-200',
    'bg-gradient-to-br from-blue-300 via-purple-200 to-pink-300',
    'bg-gradient-to-br from-teal-300 via-cyan-200 to-pink-200',
  ];

  // 如果数据加载中或IP检测中，显示加载状态
  if (isLoading || isIPDetecting || isChinaIPAddress === null) {
    return (
      <div className="min-h-screen pt-32 pb-20 flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg text-muted-foreground">{t('models.loading')}</div>
        </div>
      </div>
    );
  }

  if (error) {
    logger.error('Failed to load models', error as Error);
    return (
      <div className="min-h-screen pt-32 pb-20 flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg text-destructive">{t('models.loadFailed')}</div>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 rounded-full bg-foreground text-background"
          >
            {t('models.retry')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-20">
      <div className="w-full px-6 sm:px-10 lg:px-16">
        {/* Header with Title and Search */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-12">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
            {t('models.title')}
          </h1>
          
          <div className="flex items-center gap-4 flex-1 max-w-2xl">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder={t('common.search')}
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full px-6 py-3 rounded-full border border-border/50 bg-background/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground/50 transition-colors"
              />
            </div>
            <button className="px-8 py-3 rounded-full bg-foreground text-background font-medium hover:bg-foreground/90 transition-colors">
              <ArrowUp className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Left Sidebar */}
          <aside className="hidden lg:block w-52 flex-shrink-0">
            <div className="sticky top-32 max-h-[calc(100vh-10rem)] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              {/* Header with title and reset */}
              <motion.div
                className="flex items-center justify-between mb-6"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              >
                <h3 className="text-base font-medium">{t('models.filter')}</h3>
                <button
                  onClick={() => {
                setSupplierFilter('all');
                setBillingFilter('all');
                setEndpointFilter('all');
                  }}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {t('models.reset')}
                </button>
              </motion.div>

              {/* 供应商 Section */}
              <motion.div
                className="mb-6 border-t border-border/30 pt-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              >
                <h4 className="text-sm font-medium mb-3 text-left">{t('models.supplier')}</h4>
                <div className="flex flex-col gap-2">
                  {(supplierExpanded ? supplierOptions : supplierOptions.slice(0, 4)).map((option, index) => {
                  const IconComponent = option.icon;
                    return (
                      <motion.button
                        key={option.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{
                          duration: 0.3,
                          delay: 0.2 + index * 0.05,
                          ease: [0.16, 1, 0.3, 1],
                        }}
                        onClick={() => setSupplierFilter(option.id)}
                        className={`px-3 py-2 rounded-lg text-xs flex items-center justify-center gap-2 transition-colors ${
                          supplierFilter === option.id
                            ? 'bg-foreground/20 text-foreground'
                            : 'bg-muted/30 text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                        }`}
                      >
                        <IconComponent className="w-4 h-4 flex-shrink-0" />
                        <span>{option.name}</span>
                      </motion.button>
                    );
                })}
                  {supplierOptions.length > 4 && (
                    <motion.button
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{
                        duration: 0.3,
                        delay: 0.2 + (supplierExpanded ? supplierOptions.length : 4) * 0.05,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                      onClick={() => setSupplierExpanded(!supplierExpanded)}
                      className="gap-1 text-xs text-muted-foreground hover:text-foreground py-1 flex items-center justify-end"
                    >
                      {supplierExpanded ? (
                        <>
                          {t('models.collapse')} <ChevronUp className="w-3 h-3" />
                        </>
                      ) : (
                        <>
                          {t('models.expand')} <ChevronDown className="w-3 h-3" />
                        </>
                      )}
                    </motion.button>
                  )}
                </div>
              </motion.div>

              {/* 计费类型 Section */}
              <motion.div
                className="mb-6 border-t border-border/30 pt-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              >
                <h4 className="text-sm font-medium mb-3 text-left">{t('models.billingType')}</h4>
                <div className="flex flex-col gap-2">
                  {billingOptions.map((option, index) => (
                    <motion.button
                      key={option.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        duration: 0.3,
                        delay: 0.25 + index * 0.05,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                      onClick={() => setBillingFilter(option.id)}
                      className={`px-3 py-2 rounded-lg text-xs text-center transition-colors ${
                        billingFilter === option.id
                          ? 'bg-foreground/20 text-foreground'
                          : 'bg-muted/30 text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                      }`}
                    >
                      {option.name}
                    </motion.button>
                  ))}
                </div>
              </motion.div>

              {/* 端点类型 Section */}
              <motion.div
                className="border-t border-border/30 pt-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              >
                <h4 className="text-sm font-medium mb-3 text-left">{t('models.endpointType')}</h4>
                <div className="flex flex-col gap-2">
                  {(endpointExpanded ? endpointOptions : endpointOptions.slice(0, 4)).map((option, index) => (
                    <motion.button
                      key={option.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        duration: 0.3,
                        delay: 0.3 + index * 0.05,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                      onClick={() => setEndpointFilter(option.id)}
                      className={`px-3 py-2 rounded-lg text-xs text-center transition-colors ${
                        endpointFilter === option.id
                          ? 'bg-foreground/20 text-foreground'
                          : 'bg-muted/30 text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                      }`}
                    >
                      {option.name}
                    </motion.button>
                  ))}
                  {endpointOptions.length > 4 && (
                    <motion.button
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{
                        duration: 0.3,
                        delay: 0.3 + (endpointExpanded ? endpointOptions.length : 4) * 0.05,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                      onClick={() => setEndpointExpanded(!endpointExpanded)}
                      className="flex items-center justify-center gap-1 text-xs text-muted-foreground hover:text-foreground py-1"
                    >
                      {endpointExpanded ? (
                        <>
                          {t('models.collapse')} <ChevronUp className="w-3 h-3" />
                        </>
                      ) : (
                        <>
                          {t('models.expand')} <ChevronDown className="w-3 h-3" />
                        </>
                      )}
                    </motion.button>
                  )}
                </div>
              </motion.div>
            </div>
          </aside>
          {/* Main Content - Model Grid */}
          <main className="flex-1">
            {displayedModels.length === 0 && !isLoading && !isIPDetecting && isChinaIPAddress !== null ? (
              <div className="text-center py-12">
                <div className="text-lg text-muted-foreground">
                  {t('models.noModels') || 'No models available'}
                </div>
                <div className="text-sm text-muted-foreground mt-2">
                  Debug: pricingData={pricingData ? 'exists' : 'null'}, 
                  displayModels={displayModels.length}, 
                  filteredModels={filteredModels.length},
                  isChinaIP={String(isChinaIPAddress)},
                  language={language}
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {displayedModels.map((model, index) => (
                <motion.div
                  key={model.model_name}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{
                    duration: 0.4,
                    delay: (index % itemsPerPage) * 0.05,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  onClick={() => setSelectedModel(model)}
                  className={`group rounded-2xl overflow-hidden cursor-pointer hover:scale-[1.02] transition-transform duration-300 relative min-h-[420px] ${
                    gradients[index % gradients.length]
                  }`}
                >
                  {/* Hover overlay with Learn more */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <div className="flex items-center gap-2 text-white font-light text-lg">
                      <span>Learn more</span>
                      <ArrowRight className="w-5 h-5" />
                    </div>
                  </div>

                  {/* Content floating on gradient */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-gray-800 group-hover:opacity-0 transition-opacity duration-300">
                    <h3 className="text-3xl font-sans font-light tracking-tight mb-4">
                      {model.model_name}
                    </h3>
                    
                    <div className="space-y-0.5 text-sm font-light">
                      <p>Price: {formatPrice(model)}</p>
                      {model.quota_type === 0 && model.completion_ratio > 0 && (
                        <p>Completion Ratio: {model.completion_ratio}x</p>
                      )}
                    </div>
                    
                    <div className="mt-4 space-y-0.5 text-sm font-light">
                      {model.vendor_name && <p>Vendor: {model.vendor_name}</p>}
                      <p>Endpoints: {model.supported_endpoint_types.join(', ')}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
                {/* 加载更多触发器 */}
                {hasMore && (
                  <div ref={loadMoreRef} className="flex justify-center items-center py-8">
                    <div className="text-sm text-muted-foreground">{t('models.loadingMore')}</div>
                  </div>
                )}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Model Detail Dialog */}
      <Dialog open={!!selectedModel} onOpenChange={() => setSelectedModel(null)}>
        <DialogContent className="max-w-2xl">
          {selectedModel && (
            <>
              <DialogHeader>
                <DialogTitle className="text-3xl font-light">{selectedModel.model_name}</DialogTitle>
              </DialogHeader>
              
              <div className="mt-6 space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                      Pricing
                    </h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Price</span>
                        <span className="font-medium">{formatPrice(selectedModel)}</span>
                      </div>
                      {selectedModel.quota_type === 0 && (
                        <>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Model Ratio</span>
                            <span className="font-medium">{selectedModel.model_ratio}x</span>
                          </div>
                          {selectedModel.completion_ratio > 0 && (
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Completion Ratio</span>
                              <span className="font-medium">{selectedModel.completion_ratio}x</span>
                            </div>
                          )}
                        </>
                      )}
                      {selectedModel.quota_type === 1 && selectedModel.model_price > 0 && (
                      <div className="flex justify-between">
                          <span className="text-muted-foreground">Price per call</span>
                          <span className="font-medium">${selectedModel.model_price.toFixed(4)}</span>
                      </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                      Information
                    </h4>
                    <div className="space-y-2">
                      {selectedModel.vendor_name && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Vendor</span>
                          <span className="font-medium">{selectedModel.vendor_name}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Billing Type</span>
                        <span className="font-medium">
                          {selectedModel.quota_type === 0 ? t('models.usageBilling') : t('models.timesBilling')}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Endpoints</span>
                        <span className="font-medium text-right max-w-[200px] break-words">
                          {selectedModel.supported_endpoint_types.join(', ')}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="pt-4">
                  <button 
                    onClick={() => window.open('https://models.photog.art', '_blank')}
                    className="w-full py-3 rounded-full bg-foreground text-background font-medium hover:bg-foreground/90 transition-colors flex items-center justify-center gap-2"
                  >
                    <span>Try this model</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ModelsPage;
