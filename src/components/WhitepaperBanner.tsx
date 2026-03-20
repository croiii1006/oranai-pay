import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';

let hasShownInSession = false;

const WhitepaperBanner: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { language } = useLanguage();

  useEffect(() => {
    // Show once per SPA session; refresh will show again
    if (!hasShownInSession) {
      setIsVisible(true);
      hasShownInSession = true;
    }
  }, []);

  const handleClose = () => {
    setIsVisible(false);
  };

  const handleDetailsClick = () => {
    window.open('https://whitebook.photog.art/', '_blank');
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="fixed top-0 left-0 right-0 z-50 bg-primary text-primary-foreground px-4 py-2.5 flex items-center justify-center gap-3"
        >
          <span className="text-sm font-medium">
            {language === 'zh' ? '🎉 OranAI白皮书已上线！' : '🎉 OranAI Whitepaper is now live!'}
          </span>
          <button
            onClick={handleDetailsClick}
            className="text-sm font-semibold underline underline-offset-2 hover:opacity-80 transition-opacity"
          >
            {language === 'zh' ? '详情' : 'Details'}
          </button>
          <button
            onClick={handleClose}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-primary-foreground/10 rounded transition-colors"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default WhitepaperBanner;
