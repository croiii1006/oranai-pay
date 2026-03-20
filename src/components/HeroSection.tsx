import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import InteractiveParticles from './InteractiveParticles';
import AnimatedHeadline from './AnimatedHeadline';

interface HeroSectionProps {
  setActiveTab: (tab: string) => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ setActiveTab }) => {
  const { t } = useLanguage();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Dark background base */}
      <div className="absolute inset-0 bg-background" />
      
      {/* Interactive particles with mouse glow */}
      <InteractiveParticles />
      
      {/* Subtle noise texture */}
      <div className="absolute inset-0 noise pointer-events-none" />
      
      {/* Radial gradient overlay */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-background/60 pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="animate-fade-in-up">
          {/* Main headline with stronger gradient */}
          <AnimatedHeadline
            text={t('hero.title')}
            as="h1"
            className="heading-xl mb-6"
            charClassName="bg-clip-text text-transparent"
            charStyle={{
              backgroundImage: 'linear-gradient(90deg, hsl(0 0% 40%), hsl(0 0% 70%) 30%, hsl(0 0% 100%) 60%, hsl(0 0% 100%))',
              fontFamily: "'Century Gothic', sans-serif",
            }}
          />
          
          {/* Subtitle */}
          <h2 className="heading-md text-muted-foreground mb-6" style={{ fontSize: '162%' }}>
            {t('hero.subtitle')}
          </h2>
          
          {/* Description */}
          <p className="body-lg max-w-2xl mx-auto mb-12">
            {t('hero.description')}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => setActiveTab('solution')}
              className="group flex items-center space-x-2 px-8 py-4 rounded-full bg-foreground text-background font-medium transition-all duration-300 hover-lift glow-hover"
            >
              <span>{t('hero.exploreSolution')}</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </button>
            <button
              onClick={() => setActiveTab('models')}
              className="flex items-center space-x-2 px-8 py-4 rounded-full glass font-medium text-foreground transition-all duration-300 hover-lift glow-hover"
            >
              <span>{t('hero.viewModels')}</span>
            </button>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-foreground/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-foreground/3 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex items-start justify-center p-2">
          <div className="w-1 h-2 rounded-full bg-muted-foreground/50" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
