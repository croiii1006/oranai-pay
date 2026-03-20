import React from 'react';

const logos = [
  { name: 'AWS', text: 'AWS' },
  { name: 'Google Cloud', text: 'Google Cloud' },
  { name: 'Tencent', text: 'Tencent' },
  { name: 'Plug and Play', text: 'Plug and Play' },
  { name: 'Microsoft', text: 'Microsoft' },
  { name: 'NVIDIA', text: 'NVIDIA' },
];

const InvestorLogos: React.FC = () => {
  return (
    <div className="w-full py-12 overflow-hidden">
      <p className="text-center text-muted-foreground/60 text-xs uppercase tracking-[0.2em] mb-8">
        Trusted by leading enterprises
      </p>
      <div className="relative">
        {/* Fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-background to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-background to-transparent z-10" />
        
        {/* Slow marquee */}
        <div className="flex animate-marquee">
          {[...logos, ...logos].map((logo, index) => (
            <div
              key={`${logo.name}-${index}`}
              className="flex-shrink-0 mx-12 flex items-center justify-center"
            >
              <span 
                className="text-lg font-light tracking-wide text-muted-foreground/40 grayscale opacity-50 hover:opacity-70 transition-opacity duration-500"
                style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
              >
                {logo.text}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InvestorLogos;