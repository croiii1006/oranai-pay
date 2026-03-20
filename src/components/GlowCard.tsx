import React, { useRef, useState } from 'react';
import { cn } from '@/lib/utils';

interface GlowCardProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
}

const GlowCard: React.FC<GlowCardProps> = ({ 
  children, 
  className,
  glowColor = 'rgba(255, 255, 255, 0.4)'
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [glowPosition, setGlowPosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setGlowPosition({ x, y });
  };

  return (
    <div
      ref={cardRef}
      className={cn(
        "relative rounded-2xl overflow-hidden",
        className
      )}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Border glow effect that follows mouse */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-300"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(600px circle at ${glowPosition.x}px ${glowPosition.y}px, ${glowColor}, transparent 50%)`,
        }}
      />
      
      {/* Inner content area with background */}
      <div className="absolute inset-[1px] rounded-2xl bg-card z-10" />
      
      {/* Content */}
      <div className="relative z-20">
        {children}
      </div>
    </div>
  );
};

export default GlowCard;
