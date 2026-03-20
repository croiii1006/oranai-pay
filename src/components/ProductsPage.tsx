import React, { useState } from 'react';
import { ArrowUp, Globe, Sparkles, ChevronDown } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { config } from '@/lib/config';

// Import thumbnail images
import imageGenThumb from '@/assets/products/image-gen-thumb.png';
import videoGenThumb from '@/assets/products/video-gen-thumb.png';
import digitalHumanThumb from '@/assets/products/digital-human-thumb.png';
import geoMonitorThumb from '@/assets/products/geo-monitor-thumb.png';
import brandHealthThumb from '@/assets/products/brand-health-thumb.png';
import brandStrategyThumb from '@/assets/products/brand-strategy-thumb.png';
interface SubTab {
  id: string;
  labelKey: string;
  image: string;
  url?: string; // URL to navigate to when clicked
}
interface TabConfig {
  id: string;
  labelKey: string;
  subTabs?: SubTab[];
}
const ProductsPage: React.FC = () => {
  const {
    t
  } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('insight');
  const [activeSubTab, setActiveSubTab] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState<string | null>(null);
  const [selectedSearchSource, setSelectedSearchSource] = useState<string | null>(null);
  
  const modelOptions = [
    { id: 'claude', labelKey: 'products.modelClaude' },
    { id: 'chatgpt', labelKey: 'products.modelChatGPT' },
    { id: 'deepseek', labelKey: 'products.modelDeepSeek' },
    { id: 'gemini', labelKey: 'products.modelGemini' },
    { id: 'doubao', labelKey: 'products.modelDoubao' },
  ];

  const searchSources = [{
    id: 'redbook',
    labelKey: 'products.redbook',
    enabled: true
  }, {
    id: 'youtube',
    labelKey: 'products.youtube',
    enabled: false
  }, {
    id: 'tiktok',
    labelKey: 'products.tiktok',
    enabled: false
  }, {
    id: 'amazon',
    labelKey: 'products.amazon',
    enabled: false
  }, {
    id: 'semrush',
    labelKey: 'products.semrush',
    enabled: false
  }];
  const tabsConfig: TabConfig[] = [{
    id: 'insight',
    labelKey: 'products.insight',
    subTabs: [{
      id: 'geoMonitor',
      labelKey: 'products.geoMonitor',
      image: geoMonitorThumb,
      url: 'https://orangeo.photog.art/'
    }, {
      id: 'brandHealth',
      labelKey: 'products.brandHealth',
      image: brandHealthThumb,
      url: '' // TODO: Add Brand Health URL
    }]
  }, {
    id: 'strategy',
    labelKey: 'products.strategy',
    subTabs: [{
      id: 'brandStrategy',
      labelKey: 'products.brandStrategy',
      image: brandStrategyThumb,
      url: '' // TODO: Add Brand Strategy URL
    }]
  }, {
    id: 'material',
    labelKey: 'products.material',
    subTabs: [{
      id: 'imageGen',
      labelKey: 'products.imageGen',
      image: imageGenThumb,
      url: undefined // 鍔ㄦ€佽幏鍙栵紝涓嶅湪杩欓噷璁剧疆
    }, {
      id: 'videoGen',
      labelKey: 'products.videoGen',
      image: videoGenThumb,
      url: undefined // 鍔ㄦ€佽幏鍙栵紝浣跨敤 OAuth2 鎺堟潈
    }, {
      id: 'digitalHuman',
      labelKey: 'products.digitalHuman',
      image: digitalHumanThumb,
      url: '' // TODO: Add Digital Human URL
    }]
  }, {
    id: 'operation',
    labelKey: 'products.operation',
    subTabs: [{
      id: 'b2bLead',
      labelKey: 'products.b2bLead',
      image: brandStrategyThumb,
      url: ''
    }]
  }];
  const currentTabConfig = tabsConfig.find(tab => tab.id === activeTab);
  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    const tab = tabsConfig.find(t => t.id === tabId);
    if (tab?.subTabs && tab.subTabs.length > 0) {
      setActiveSubTab(tab.subTabs[0].id);
    } else {
      setActiveSubTab(null);
    }
  };

  // Initialize activeSubTab on mount
  React.useEffect(() => {
    if (currentTabConfig?.subTabs && currentTabConfig.subTabs.length > 0 && !activeSubTab) {
      setActiveSubTab(currentTabConfig.subTabs[0].id);
    }
  }, [currentTabConfig, activeSubTab]);

  /**
   * 澶勭悊宸ュ叿璺宠浆
   * @param subTabId 瀛愭爣绛?ID锛堝 'imageGen', 'videoGen'锛?
   */
  const handleToolNavigation = (subTabId: string) => {
    let targetUrl: string;
    
    if (subTabId === 'imageGen') {
      targetUrl = searchQuery ? `${config.api.imageGenUrl}?search=${searchQuery}` : config.api.imageGenUrl;
    } else if (subTabId === 'videoGen') {
      targetUrl = searchQuery ? `${config.api.videoGenUrl}?search=${searchQuery}` : config.api.videoGenUrl;
    } else {
      return;
    }
    
    // 鐩存帴璺宠浆锛屼笉闇€瑕?OAuth2 鎺堟潈
    window.location.href = targetUrl;
  };
  return <div className="min-h-screen pt-24 pb-16">
      <div className="w-full px-6 sm:px-10 lg:px-16 py-[61px]">
        {/* Product Title */}
        <h1 className="text-3xl tracking-tight mb-12 md:text-base py-0 font-extralight">
          {t('')}
        </h1>

        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-2xl mb-3 font-medium font-sans text-current md:text-3xl">
            {t('products.headline')}
          </h2>
          <p className="text-lg text-foreground font-extralight md:text-2xl">
            {t('products.subheadline')}
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center justify-center gap-3 mb-6">
          {tabsConfig.map(tab => <button key={tab.id} onClick={() => handleTabChange(tab.id)} className={`px-6 py-2 rounded-full text-base font-medium transition-all ${activeTab === tab.id ? 'bg-foreground text-background' : 'text-muted-foreground hover:text-foreground'}`}>
              {t(tab.labelKey)}
            </button>)}
        </div>

        {/* Search Dialog Box */}
        <div className="max-w-2xl mx-auto mb-6 rounded-xl border-2 border-border bg-background/50 backdrop-blur-sm p-3">
          {/* Input Area */}
          <div className="mb-3">
            <input type="text" placeholder={t('products.chatPlaceholder')} value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full px-3 py-2 bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none text-base" />
          </div>

          {/* Bottom Action Bar */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {/* Web Search Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${selectedSearchSource ? 'bg-primary/10 text-primary border border-primary/30' : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground'}`}>
                    <Globe className="w-3.5 h-3.5" />
                    <span>{selectedSearchSource ? t(searchSources.find(s => s.id === selectedSearchSource)?.labelKey || '') : t('products.webSearch')}</span>
                    <ChevronDown className="w-2.5 h-2.5" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="min-w-[120px]">
                  {searchSources.map(source => (
                    <DropdownMenuItem 
                      key={source.id} 
                      onClick={() => source.enabled && setSelectedSearchSource(selectedSearchSource === source.id ? null : source.id)}
                      disabled={!source.enabled}
                      className={`${selectedSearchSource === source.id ? 'bg-primary/10 text-primary' : ''} ${!source.enabled ? 'opacity-40 cursor-not-allowed' : ''}`}
                    >
                      {t(source.labelKey)}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Thinking Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${selectedModel ? 'bg-primary/10 text-primary border border-primary/30' : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground'}`}>
                    <Sparkles className={`w-3.5 h-3.5 ${selectedModel ? 'animate-pulse' : ''}`} />
                    <span>{selectedModel ? t(modelOptions.find(m => m.id === selectedModel)?.labelKey || '') : t('products.thinking')}</span>
                    <ChevronDown className="w-2.5 h-2.5" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="min-w-[120px]">
                  {modelOptions.map(model => (
                    <DropdownMenuItem 
                      key={model.id} 
                      onClick={() => setSelectedModel(selectedModel === model.id ? null : model.id)}
                      className={selectedModel === model.id ? 'bg-primary/10 text-primary' : ''}
                    >
                      {t(model.labelKey)}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Sub Tab Dropdown - Shows cards */}
              {currentTabConfig?.subTabs && currentTabConfig.subTabs.length > 0 && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${activeSubTab ? 'bg-primary/10 text-primary border border-primary/30' : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground'}`}>
                      {activeSubTab && currentTabConfig.subTabs?.find(st => st.id === activeSubTab) && (
                        <img 
                          src={currentTabConfig.subTabs.find(st => st.id === activeSubTab)?.image} 
                          alt="" 
                          className="w-4 h-4 rounded object-cover"
                        />
                      )}
                      <span>
                        {activeSubTab 
                          ? t(currentTabConfig.subTabs?.find(st => st.id === activeSubTab)?.labelKey || '')
                          : 'Select Tool'
                        }
                      </span>
                      <ChevronDown className="w-2.5 h-2.5" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="min-w-[200px] max-h-[400px] overflow-y-auto">
                    {currentTabConfig.subTabs.map(subTab => {
                      const isComingSoon = ['brandHealth', 'brandStrategy', 'digitalHuman', 'b2bLead'].includes(subTab.id);
                      return (
                        <DropdownMenuItem 
                          key={subTab.id}
                          onClick={() => {
                            if (!isComingSoon) {
                              setActiveSubTab(subTab.id);
                            }
                          }}
                          disabled={isComingSoon}
                          className={`flex items-center gap-2 ${activeSubTab === subTab.id ? 'bg-primary/10 text-primary' : ''} ${isComingSoon ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          {/* <img 
                            src={subTab.image} 
                            alt="" 
                            className="w-8 h-8 rounded object-cover flex-shrink-0"
                          /> */}
                          <span className="flex-1">
                            {t(subTab.labelKey)}
                            {isComingSoon && (
                              <span className="ml-2 text-xs text-muted-foreground">
                                ({t('products.comingSoon')})
                              </span>
                            )}
                          </span>
                        </DropdownMenuItem>
                      );
                    })}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>

            {/* Send Button */}
            <button 
              onClick={() => {
                if (!activeSubTab || !currentTabConfig?.subTabs) {
                  // 濡傛灉娌℃湁閫夋嫨宸ュ叿锛屼娇鐢ㄩ粯璁よ涓?
                  window.open('https://toolbox.oran.cn', '_blank');
                  return;
                }

                const subTab = currentTabConfig.subTabs.find(st => st.id === activeSubTab);
                if (!subTab) {
                  window.open('https://toolbox.oran.cn', '_blank');
                  return;
                }

                const isComingSoon = ['brandHealth', 'brandStrategy', 'digitalHuman', 'b2bLead'].includes(subTab.id);
                if (isComingSoon) {
                  return;
                }

                // Image Generation 鍜?Video Generation 鐩存帴璺宠浆
                if (subTab.id === 'imageGen' || subTab.id === 'videoGen') {
                  handleToolNavigation(subTab.id);
                } else if (subTab.url) {
                  window.open(subTab.url, '_blank');
                } else {
                  // 榛樿琛屼负
                  window.open('https://toolbox.oran.cn', '_blank');
                }
              }}
              className="p-2.5 rounded-full bg-foreground text-background font-medium hover:bg-foreground/90 transition-colors"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Insight Case Card - below search box */}
        {activeTab === 'insight' && (
          <div className="max-w-xl mx-auto mb-6">
            <a
              href="https://haifeisianalysis.photog.art/"
              target="_blank"
              rel="noreferrer"
              className="block relative group w-full max-w-[350px] max-h-[150px] cursor-pointer"
            >
              <div className="absolute -right-3 -bottom-3 h-[70%] w-[70%] rounded-[50px] bg-[radial-gradient(60%_60%_at_100%_100%,rgba(0,0,0,0.18),rgba(0,0,0,0))] blur-[16px] z-0" aria-hidden="true"></div>
              <div className="absolute inset-0 flex items-center overflow-clip bg-[#f6f6f7] dark:bg-[#0c0c0d] rounded-[20px] backdrop-blur-[5px] z-10" data-name="Query卡片">
                <div className="-translate-x-1/2 -translate-y-1/2 absolute h-[132px] left-1/2 overflow-clip top-1/2 w-[256px]"></div>

                <div className="absolute flex h-[150px] items-center justify-center right-[-14.15px] top-[1.73px] w-[113.041px] z-10 transition-transform duration-300 ease-out group-hover:translate-x-[-8px] group-hover:translate-y-[-6px]">
                  <div className="flex-none rotate-[-6deg] transition-transform duration-300 ease-out group-hover:rotate-[-4deg]">
                    <div className="bg-white overflow-hidden rounded-[4px] shadow-[0px_2px_20px_0px_rgba(35,35,35,0.2)] w-[100px] h-[130px] relative">
                      <div className="flex items-center gap-[3px] px-[6px] py-[4px]">
                        <img alt="" className="block max-w-none size-[3px]" src="https://www.figma.com/api/mcp/asset/8434a1fc-659d-48f5-938c-ba64498b102d" />
                      </div>
                      <div className="flex items-start gap-[4px] px-[6px] pt-[2px] pb-[4px]">
                        <div className="flex flex-col gap-[4px] flex-1 min-w-0">
                          <p className="font-semibold leading-[normal] line-clamp-1 not-italic text-[6px] text-[#141414]">海飞丝市场洞察深度报告</p>
                          <div className="flex items-center gap-[2px]">
                            <div className="size-[7px] rounded-full overflow-hidden bg-gray-100">
                              <img alt="OranAI" src="/logo_dark.svg" className="w-full h-full object-contain" />
                            </div>
                            <p className="font-medium leading-[normal] not-italic text-[5px] text-[#919191] truncate">OranAI</p>
                          </div>
                          <div className="flex items-center gap-[2.667px]">
                            <div className="flex items-center gap-px">
                              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-play size-[4px] text-[#919191] fill-[#919191]">
                                <polygon points="6 3 20 12 6 21 6 3"></polygon>
                              </svg>
                              <p className="font-medium leading-[4.85px] not-italic text-[4px] text-[#919191] tracking-[-0.0716px]">1080w</p>
                            </div>
                            <div className="flex items-center gap-px">
                              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-heart size-[4px] text-[#919191]">
                                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>
                              </svg>
                              <p className="font-medium leading-[normal] not-italic text-[4px] text-[#919191]">28w</p>
                            </div>
                            <div className="flex items-center gap-px">
                              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-message-square size-[4px] text-[#919191]">
                                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                              </svg>
                              <p className="font-medium leading-[normal] not-italic text-[4px] text-[#919191]">12w</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="relative h-[90px] rounded-[4px] mx-[6px] mb-[6px] overflow-hidden">
                        <img alt="" className="absolute inset-0 max-w-none object-cover size-full" src="/haifeisi.jpg" />
                      </div>
                      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[70%] bg-gradient-to-t from-[#e0e0e2] to-transparent"></div>
                    </div>
                  </div>
                </div>

                <div className="absolute inset-0 z-20 flex items-center justify-center rounded-[20px] bg-black/55 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <p className="text-white text-[12px] leading-[1.4] font-medium">
                    点击查看洞察报告案例
                  </p>
                </div>
              </div>

              <div className="absolute bottom-[-0px] h-[85px] left-0 w-[100%] overflow-clip z-20">
                <div className="absolute left-0 bottom-0 flex flex-col gap-[6px] items-start justify-end p-[18px] py-[13px] w-full" style={{ backgroundSize: 'cover', backgroundPosition: 'center bottom' }}>
                  <p className="font-semibold leading-[1.35] not-italic relative shrink-0 text-[13px] text-[#363636] w-[232px] whitespace-pre-wrap mb-0 group-hover:opacity-0 transition-opacity duration-200">
                    海飞丝市场洞察深度报告<br />整合宏观趋势、全球化市场、人群画像、和竞品分析
                  </p>
                </div>
              </div>
              <div className="absolute inset-0 rounded-[8px] dark:ring-[#333] pointer-events-none z-[30]"></div>
              <div className="relative h-[210px] w-full"></div>
            </a>
          </div>
        )}
      </div>
    </div>;
};
export default ProductsPage;
