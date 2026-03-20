import React from 'react';

const partnerLogos = [
  { name: 'Aosom', src: '/partners/aosom.png' },
  { name: 'AWS', src: '/partners/aws.png' },
  { name: 'Funny Fuzzy', src: '/partners/funny-fuzzy.png' },
  { name: 'Google', src: '/partners/google.png' },
  { name: 'Matrix', src: '/partners/matrix.png' },
  { name: 'Plug and Play', src: '/partners/plug-and-play.png' },
  { name: 'Tencent', src: '/partners/tencent.png' },
];

const PartnerLogoMarquee: React.FC = () => {
  return (
    <div className="relative w-full overflow-hidden py-2">
      <div className="flex animate-marquee-right gap-12 sm:gap-16">
        {[...partnerLogos, ...partnerLogos].map((logo, index) => (
          <div
            key={`${logo.name}-${index}`}
            className="flex-shrink-0 flex items-center justify-center px-2 sm:px-4 w-[150px] sm:w-[180px]"
          >
            <img
              src={logo.src}
              alt={`${logo.name} logo`}
              className="h-10 sm:h-12 w-auto object-contain opacity-80 hover:opacity-100 transition-opacity duration-300"
              loading="lazy"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default PartnerLogoMarquee;
