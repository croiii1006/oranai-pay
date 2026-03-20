import React from 'react';

interface HeroEmojiProps {
  type: 'solutions' | 'models' | 'products' | 'library';
  className?: string;
}

const HeroEmoji: React.FC<HeroEmojiProps> = ({ type, className = '' }) => {
  const baseClass = `inline-block align-middle ${className}`;
  
  switch (type) {
    case 'solutions':
      // Lightbulb/puzzle icon for Solutions
      return (
        <span className={`${baseClass} w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 lg:w-10 lg:h-10`}>
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-lg">
            {/* Lightbulb base */}
            <defs>
              <linearGradient id="solutionGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" className="[stop-color:hsl(var(--primary))]" stopOpacity="1" />
                <stop offset="100%" className="[stop-color:hsl(45,90%,55%)]" stopOpacity="1" />
              </linearGradient>
            </defs>
            <circle cx="50" cy="40" r="28" fill="url(#solutionGradient)" />
            <rect x="40" y="65" width="20" height="8" rx="2" className="fill-muted-foreground/60" />
            <rect x="42" y="75" width="16" height="6" rx="2" className="fill-muted-foreground/40" />
            {/* Light rays */}
            <line x1="50" y1="5" x2="50" y2="12" stroke="url(#solutionGradient)" strokeWidth="3" strokeLinecap="round" />
            <line x1="20" y1="25" x2="26" y2="30" stroke="url(#solutionGradient)" strokeWidth="3" strokeLinecap="round" />
            <line x1="80" y1="25" x2="74" y2="30" stroke="url(#solutionGradient)" strokeWidth="3" strokeLinecap="round" />
          </svg>
        </span>
      );
    
    case 'models':
      // AI/brain network icon for Models
      return (
        <span className={`${baseClass} w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 lg:w-10 lg:h-10`}>
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-lg">
            <defs>
              <linearGradient id="modelsGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" className="[stop-color:hsl(260,80%,60%)]" stopOpacity="1" />
                <stop offset="100%" className="[stop-color:hsl(280,70%,50%)]" stopOpacity="1" />
              </linearGradient>
            </defs>
            {/* Central brain/chip */}
            <rect x="30" y="30" width="40" height="40" rx="8" fill="url(#modelsGradient)" />
            {/* Connection nodes */}
            <circle cx="20" cy="30" r="8" className="fill-muted-foreground/50" />
            <circle cx="80" cy="30" r="8" className="fill-muted-foreground/50" />
            <circle cx="20" cy="70" r="8" className="fill-muted-foreground/50" />
            <circle cx="80" cy="70" r="8" className="fill-muted-foreground/50" />
            <circle cx="50" cy="15" r="6" className="fill-muted-foreground/40" />
            <circle cx="50" cy="85" r="6" className="fill-muted-foreground/40" />
            {/* Connection lines */}
            <line x1="30" y1="40" x2="20" y2="35" className="stroke-muted-foreground/40" strokeWidth="2" />
            <line x1="70" y1="40" x2="80" y2="35" className="stroke-muted-foreground/40" strokeWidth="2" />
            <line x1="30" y1="60" x2="20" y2="65" className="stroke-muted-foreground/40" strokeWidth="2" />
            <line x1="70" y1="60" x2="80" y2="65" className="stroke-muted-foreground/40" strokeWidth="2" />
            {/* Inner circuit lines */}
            <path d="M40 45 L50 50 L60 45" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" />
            <path d="M40 55 L50 50 L60 55" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" />
          </svg>
        </span>
      );
    
    case 'products':
      // App/window stack icon for Products
      return (
        <span className={`${baseClass} w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 lg:w-10 lg:h-10`}>
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-lg">
            <defs>
              <linearGradient id="productsGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" className="[stop-color:hsl(150,70%,45%)]" stopOpacity="1" />
                <stop offset="100%" className="[stop-color:hsl(170,60%,40%)]" stopOpacity="1" />
              </linearGradient>
            </defs>
            {/* Back card */}
            <rect x="25" y="15" width="55" height="45" rx="6" className="fill-muted-foreground/30" />
            {/* Middle card */}
            <rect x="18" y="25" width="55" height="45" rx="6" className="fill-muted-foreground/50" />
            {/* Front card */}
            <rect x="12" y="35" width="55" height="50" rx="6" fill="url(#productsGradient)" />
            {/* Window dots */}
            <circle cx="22" cy="45" r="3" className="fill-background/60" />
            <circle cx="32" cy="45" r="3" className="fill-background/60" />
            <circle cx="42" cy="45" r="3" className="fill-background/60" />
            {/* Content lines */}
            <rect x="20" y="55" width="30" height="4" rx="2" className="fill-background/40" />
            <rect x="20" y="63" width="20" height="4" rx="2" className="fill-background/30" />
            {/* Checkmark */}
            <circle cx="75" cy="72" r="12" className="fill-background" />
            <path d="M69 72 L73 76 L81 68" stroke="url(#productsGradient)" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      );
    
    case 'library':
      // Books/creative palette icon for Library
      return (
        <span className={`${baseClass} w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 lg:w-10 lg:h-10`}>
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-lg">
            <defs>
              <linearGradient id="libraryGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" className="[stop-color:hsl(25,90%,55%)]" stopOpacity="1" />
                <stop offset="100%" className="[stop-color:hsl(15,85%,50%)]" stopOpacity="1" />
              </linearGradient>
            </defs>
            {/* Book stack */}
            <rect x="20" y="60" width="60" height="12" rx="2" fill="url(#libraryGradient)" transform="rotate(-5 50 66)" />
            <rect x="22" y="48" width="56" height="12" rx="2" className="fill-muted-foreground/60" transform="rotate(3 50 54)" />
            <rect x="18" y="36" width="58" height="12" rx="2" className="fill-muted-foreground/40" transform="rotate(-2 50 42)" />
            {/* Creative sparkles */}
            <circle cx="75" cy="25" r="5" fill="url(#libraryGradient)" />
            <circle cx="85" cy="35" r="3" className="fill-muted-foreground/50" />
            <circle cx="70" cy="15" r="3" className="fill-muted-foreground/40" />
            {/* Pencil */}
            <rect x="10" y="20" width="6" height="25" rx="1" className="fill-muted-foreground/50" transform="rotate(30 13 32)" />
            <polygon points="13,45 10,52 16,52" className="fill-muted-foreground/60" transform="rotate(30 13 48)" />
          </svg>
        </span>
      );
    
    default:
      return null;
  }
};

export default HeroEmoji;
