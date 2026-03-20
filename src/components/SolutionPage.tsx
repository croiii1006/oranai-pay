import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';

// Import solution images
interface SolutionSection {
  id: string;
  titleKey: string;
  descKey: string;
  tabs: { labelKey: string; contentKey: string }[];
}

const SolutionPage: React.FC = () => {
  const { t } = useLanguage();
  const [activeSection, setActiveSection] = useState('know');
  const [activeTab, setActiveTab] = useState(0);
  const descTextClass =
    'text-base md:text-lg text-muted-foreground leading-relaxed max-w-[32rem] text-left';
  const tabDescClass = 'text-lg text-muted-foreground leading-relaxed';

  const sections: SolutionSection[] = [
    {
      id: 'know',
      titleKey: 'solution.know',
      descKey: 'solution.knowDesc',
      tabs: [
        { labelKey: 'solution.marketInsight', contentKey: 'solution.marketInsightDesc' },
        { labelKey: 'solution.consumerInsight', contentKey: 'solution.consumerInsightDesc' },
        { labelKey: 'solution.brandHealthMetrics', contentKey: 'solution.brandHealthMetricsDesc' },
        { labelKey: 'solution.industryTrends', contentKey: 'solution.industryTrendsDesc' },
      ],
    },
    {
      id: 'build',
      titleKey: 'solution.build',
      descKey: 'solution.buildDesc',
      tabs: [
        { labelKey: 'solution.brandPositioningGen', contentKey: 'solution.brandPositioningGenDesc' },
        { labelKey: 'solution.contentEngine', contentKey: 'solution.contentEngineDesc' },
        { labelKey: 'solution.socialOps', contentKey: 'solution.socialOpsDesc' },
        { labelKey: 'solution.crmOps', contentKey: 'solution.crmOpsDesc' },
      ],
    },
    {
      id: 'manage',
      titleKey: 'solution.manage',
      descKey: 'solution.manageDesc',
      tabs: [
        { labelKey: 'solution.dataAssetMgmt', contentKey: 'solution.dataAssetMgmtDesc' },
        { labelKey: 'solution.sentimentMgmt', contentKey: 'solution.sentimentMgmtDesc' },
        { labelKey: 'solution.complianceMgmt', contentKey: 'solution.complianceMgmtDesc' },
        { labelKey: 'solution.salesServiceMgmt', contentKey: 'solution.salesServiceMgmtDesc' },
      ],
    },
    {
      id: 'scale',
      titleKey: 'solution.scale',
      descKey: 'solution.scaleDesc',
      tabs: [
        { labelKey: 'solution.geoSeoOpt', contentKey: 'solution.geoSeoOptDesc' },
        { labelKey: 'solution.localizationGrowth', contentKey: 'solution.localizationGrowthDesc' },
        { labelKey: 'solution.leadAdsOpt', contentKey: 'solution.leadAdsOptDesc' },
        { labelKey: 'solution.trendForecast', contentKey: 'solution.trendForecastDesc' },
      ],
    },
  ];

  const currentSection = sections.find(s => s.id === activeSection) || sections[0];

  return (
    <div className="min-h-screen flex flex-col pt-40 pb-20">
      <div className="w-full px-6 sm:px-10 lg:px-16">
        <div className="flex gap-8">
          {/* Left Sidebar Navigation */}
          <aside className="hidden lg:block w-20 flex-shrink-0">
            <div className="flex flex-col items-center gap-4">
              {sections.map((section, index) => (
                <button
                  key={section.id}
                  onClick={() => {
                    setActiveSection(section.id);
                    setActiveTab(0);
                  }}
                  className="group flex flex-col items-center gap-2"
                >
                  <div 
                    className={`w-3 h-3 rounded-full transition-all ${
                      activeSection === section.id 
                        ? 'bg-foreground scale-125' 
                        : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
                    }`}
                  />
                  <span 
                    className={`text-xs font-medium uppercase tracking-wider writing-mode-vertical transition-colors ${
                      activeSection === section.id 
                        ? 'text-foreground' 
                        : 'text-muted-foreground/50 group-hover:text-muted-foreground'
                    }`}
                    style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}
                  >
                    {t(section.titleKey)}
                  </span>
                </button>
              ))}
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="grid lg:grid-cols-2 gap-12 items-start">
                {/* Left - Title & Description */}
                <div className="space-y-6">
                  <div className="flex items-baseline gap-6">
                    <h1 className="text-6xl md:text-8xl font-bold tracking-tight">
                      {t(currentSection.titleKey)}
                    </h1>
                    <span className="text-2xl md:text-3xl font-light text-muted-foreground">
                      {t('solution.yourBrand')}
                    </span>
                  </div>
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25, duration: 0.5 }}
                    className={descTextClass}
                  >
                    {t(currentSection.descKey)}
                  </motion.p>
                </div>

                {/* Right - Tabs and Content */}
                <div className="flex flex-col gap-6">
                  <div className="flex items-center gap-2 border-b border-border/30 pb-4">
                    {currentSection.tabs.map((tab, index) => (
                      <button
                        key={index}
                        onClick={() => setActiveTab(index)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm transition-all ${
                          activeTab === index
                            ? 'bg-muted/50 text-foreground font-medium'
                            : 'text-muted-foreground hover:text-foreground'
                        }`}
                      >
                        <div 
                          className={`w-2 h-2 rounded-full ${
                            activeTab === index ? 'bg-foreground' : 'bg-muted-foreground/30'
                          }`}
                        />
                        {t(tab.labelKey)}
                      </button>
                    ))}
                  </div>
                  <p className={tabDescClass}>
                    {t(currentSection.tabs[activeTab].contentKey)}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Mobile Navigation */}
            <div className="lg:hidden fixed bottom-4 left-4 right-4 bg-background/90 backdrop-blur-md rounded-full border border-border/30 p-2 flex justify-around">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => {
                    setActiveSection(section.id);
                    setActiveTab(0);
                  }}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    activeSection === section.id
                      ? 'bg-foreground text-background'
                      : 'text-muted-foreground'
                  }`}
                >
                  {t(section.titleKey)}
                </button>
              ))}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default SolutionPage;
