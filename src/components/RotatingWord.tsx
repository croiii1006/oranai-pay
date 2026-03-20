import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

interface RotatingWordProps {
  words: string[];
  interval?: number;
  className?: string;
}

const RotatingWord: React.FC<RotatingWordProps> = ({
  words,
  interval = 2200,
  className = '',
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) return;
    
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % words.length);
    }, interval);

    return () => clearInterval(timer);
  }, [words.length, interval, prefersReducedMotion]);

  if (prefersReducedMotion) {
    return <span className={className}>{words[0]}</span>;
  }

  const maxWidth = Math.max(...words.map(w => w.length));

  return (
    <span 
      className={`inline-block align-baseline ${className}`}
      style={{ 
        width: `${maxWidth}ch`,
        height: '1em',
        position: 'relative',
        verticalAlign: 'baseline',
      }}
    >
      <AnimatePresence mode="wait">
        <motion.span
          key={currentIndex}
          initial={{ 
            opacity: 0, 
            y: 18,
            filter: 'blur(8px)',
          }}
          animate={{ 
            opacity: 1, 
            y: 0,
            filter: 'blur(0px)',
          }}
          exit={{ 
            opacity: 0, 
            y: -18,
            filter: 'blur(8px)',
          }}
          transition={{
            duration: 0.6,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="absolute right-0 bottom-0 whitespace-nowrap"
        >
          {words[currentIndex]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
};

export default RotatingWord;
