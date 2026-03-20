import React from 'react';
import { Lightbulb, Hammer, Settings, Globe, ArrowUpRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import GlowCard from './GlowCard';
import ScrollReveal from './ScrollReveal';
import AnimatedHeadline from './AnimatedHeadline';

const BusinessPage: React.FC = () => {
  const { t } = useLanguage();

  const applications = [
    { icon: Lightbulb, title: t('business.knowBrand'), desc: t('business.knowBrandDesc') },
    { icon: Hammer, title: t('business.buildBrand'), desc: t('business.buildBrandDesc') },
    { icon: Settings, title: t('business.manageBrand'), desc: t('business.manageBrandDesc') },
    { icon: Globe, title: t('business.scaleBrand'), desc: t('business.scaleBrandDesc') },
  ];

  const services = [
    t('business.marketInsight'),
    t('business.consumerInsight'),
    t('business.healthInsight'),
    t('business.brandPositioning'),
    t('business.brandStory'),
    t('business.contentGeneration'),
    t('business.socialMedia'),
    t('business.community'),
    t('business.dam'),
    t('business.sentiment'),
    t('business.compliance'),
    t('business.customerService'),
    t('business.sales'),
    t('business.seo'),
    t('business.localization'),
    t('business.email'),
    t('business.advertising'),
    t('business.trend'),
  ];

  const platforms = [
    { name: t('business.voyaAI'), desc: t('business.voyaAIDesc') },
    { name: t('business.photoG'), desc: t('business.photoGDesc') },
    { name: t('business.dataG'), desc: t('business.dataGDesc') },
    { name: t('business.apiServices'), desc: t('business.apiServicesDesc') },
    { name: t('business.agency'), desc: t('business.agencyDesc') },
  ];

  return (
    <div className="min-h-screen pt-32">
      {/* Application Section */}
      <ScrollReveal>
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-32">
          <AnimatedHeadline text={t('business.application')} as="h2" className="heading-lg mb-4" />
          <div className="w-16 h-px bg-foreground/20 mb-12" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {applications.map((app, index) => (
              <GlowCard
                key={index}
                className="group glass hover-lift cursor-pointer"
              >
                <div className="p-8">
                  <app.icon className="w-8 h-8 mb-6 text-muted-foreground group-hover:text-foreground transition-colors duration-300" />
                  <h3 className="text-lg font-medium mb-3">{app.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{app.desc}</p>
                </div>
              </GlowCard>
            ))}
          </div>
        </section>
      </ScrollReveal>

      {/* Services Section */}
      <ScrollReveal>
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-32">
          <AnimatedHeadline text={t('business.services')} as="h2" className="heading-lg mb-4" />
          <div className="w-16 h-px bg-foreground/20 mb-12" />
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {services.map((service, index) => (
              <div
                key={index}
                className="glass px-4 py-3 rounded-lg text-center hover:bg-accent transition-colors duration-200 cursor-pointer"
              >
                <span className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  {service}
                </span>
              </div>
            ))}
          </div>
        </section>
      </ScrollReveal>

      {/* Platform Section */}
      <ScrollReveal>
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-32">
          <AnimatedHeadline text={t('business.platform')} as="h2" className="heading-lg mb-4" />
          <div className="w-16 h-px bg-foreground/20 mb-12" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {platforms.map((platform, index) => (
              <GlowCard
                key={index}
                className="group glass hover-lift cursor-pointer"
              >
                <div className="relative p-8">
                  <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <ArrowUpRight className="w-5 h-5" />
                  </div>
                  <h3 className="text-xl font-medium mb-3 font-mono">{platform.name}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{platform.desc}</p>
                  
                  {/* Decorative gradient */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-foreground/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </GlowCard>
            ))}
          </div>
        </section>
      </ScrollReveal>
    </div>
  );
};

export default BusinessPage;
