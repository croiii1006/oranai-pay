import React, { useEffect, useState, useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';

interface AnimatedHeadlineProps {
  text: string;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'span';
  style?: React.CSSProperties;
  charClassName?: string;
  charStyle?: React.CSSProperties;
}

const AnimatedHeadline: React.FC<AnimatedHeadlineProps> = ({
  text,
  className = '',
  as: Component = 'h2',
  style,
  charClassName = '',
  charStyle,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { amount: 0.6, once: true });
  const prefersReducedMotion = useReducedMotion();
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (isInView && !hasAnimated) {
      setHasAnimated(true);
    }
  }, [isInView, hasAnimated]);

  // Split text into characters, preserving spaces
  const characters = text.split('');

  // Fallback for reduced motion preference
  if (prefersReducedMotion) {
    return (
      <Component className={className} style={style}>
        {text}
      </Component>
    );
  }

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.02,
      },
    },
  };

  const characterVariants = {
    hidden: {
      opacity: 0,
      y: 14,
      filter: 'blur(10px)',
    },
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: {
        duration: 0.45,
        ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
      },
    },
  };

  return (
    <div ref={ref}>
      <Component className={className} style={style}>
        <motion.span
          className="inline-block"
          variants={containerVariants}
          initial="hidden"
          animate={hasAnimated ? 'visible' : 'hidden'}
          aria-label={text}
        >
          {characters.map((char, index) => (
            <motion.span
              key={index}
              variants={characterVariants}
              className={`inline-block ${charClassName}`}
              style={{
                whiteSpace: char === ' ' ? 'pre' : 'normal',
                ...charStyle,
              }}
            >
              {char === ' ' ? '\u00A0' : char}
            </motion.span>
          ))}
        </motion.span>
      </Component>
    </div>
  );
};

export default AnimatedHeadline;
