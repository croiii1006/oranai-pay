import React, { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
}

const ScrollReveal: React.FC<ScrollRevealProps> = ({ children, className }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [blurAmount, setBlurAmount] = useState(8);

  useEffect(() => {
    const handleScroll = () => {
      if (!ref.current) return;
      
      const rect = ref.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // Calculate how much of the element is in view
      const elementTop = rect.top;
      const elementBottom = rect.bottom;
      
      // Start revealing when element enters bottom 30% of viewport
      const revealPoint = windowHeight * 0.85;
      
      if (elementTop < revealPoint) {
        // Calculate blur based on position
        const progress = Math.min(1, (revealPoint - elementTop) / (windowHeight * 0.3));
        const newBlur = Math.max(0, 8 * (1 - progress));
        setBlurAmount(newBlur);
        
        if (progress >= 1) {
          setIsVisible(true);
        }
      } else {
        setBlurAmount(8);
        setIsVisible(false);
      }
    };

    handleScroll(); // Check initial state
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      ref={ref}
      className={cn(
        "transition-all duration-300",
        className
      )}
      style={{
        filter: isVisible ? 'none' : `blur(${blurAmount}px)`,
        opacity: isVisible ? 1 : Math.max(0.3, 1 - blurAmount / 16),
      }}
    >
      {children}
    </div>
  );
};

export default ScrollReveal;
