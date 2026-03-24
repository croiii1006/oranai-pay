import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import HomePage from '@/components/HomePage';
import ModelsPage from '@/components/ModelsPage';
import ProductsPage from '@/components/ProductsPage';
import PricingPage from '@/components/PricingPage';
import LibraryPage from '@/components/LibraryPage';
import UsagePage from '@/components/UsagePage';
import Footer from '@/components/Footer';
import type { PlanId } from '@/lib/pricing';

const Index = () => {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [libraryFooterVisible, setLibraryFooterVisible] = useState(false);
  const [librarySubTab, setLibrarySubTab] = useState<'video' | 'voice' | 'model'>('video');
  const [currentPlanId, setCurrentPlanId] = useState<PlanId>('free');
  // 首页 footer 只在滚动到 "Trend & Revenue Forecasting" 模块时显示，初始隐藏
  const [showFooterInSolution, setShowFooterInSolution] = useState(false);

  const handleScrollToFooter = () => {
    setShowFooterInSolution(true);
    // 滚动到页面底部
    setTimeout(() => {
      window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' });
    }, 100);
  };

  const handleHideFooter = () => {
    setShowFooterInSolution(false);
  };

  // 当切换到非 solution 页面时，重置 footer 状态
  useEffect(() => {
    if (activeTab !== 'solution') {
      setShowFooterInSolution(false);
    }
  }, [activeTab]);

  // Check if header should be visible (not on hero view)
  const isHeroView = activeTab === 'home' || activeTab === 'hero';

  const renderContent = () => {
    switch (activeTab) {
      case 'models':
        return <ModelsPage />;
      case 'products':
        return <ProductsPage />;
      case 'pricing':
        return <PricingPage currentPlanId={currentPlanId} setCurrentPlanId={setCurrentPlanId} />;
      case 'usage':
        return <UsagePage />;
      case 'library':
        return <LibraryPage initialTab={librarySubTab} />;
      case 'home':
      case 'hero':
      case 'solution':
      default:
        return <HomePage activeTab={activeTab} setActiveTab={setActiveTab} onScrollToFooter={handleScrollToFooter} onHideFooter={handleHideFooter} />;
    }
  };

  const isLibrary = activeTab === 'library';
  const isSolution = activeTab === 'solution';
  const showFooter = (isLibrary && libraryFooterVisible) || (!isLibrary && !isSolution) || (isSolution && showFooterInSolution);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentPlanId={currentPlanId}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        isVisible={!isHeroView}
        setLibrarySubTab={setLibrarySubTab}
      />
      
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="animate-fade-in flex-1">
        {renderContent()}
      </main>

      {showFooter && <Footer setActiveTab={setActiveTab} />}
    </div>
  );
};

export default Index;
