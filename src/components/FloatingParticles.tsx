import React from 'react';

const FloatingParticles: React.FC = () => {
  const particles = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    size: Math.random() * 3 + 1,
    left: Math.random() * 100,
    top: Math.random() * 100,
    duration: Math.random() * 20 + 15,
    delay: Math.random() * 10,
    opacity: Math.random() * 0.3 + 0.1,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute rounded-full bg-foreground animate-float"
          style={{
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            left: `${particle.left}%`,
            top: `${particle.top}%`,
            opacity: particle.opacity,
            animationDuration: `${particle.duration}s`,
            animationDelay: `${particle.delay}s`,
          }}
        />
      ))}
      {/* Larger subtle glowing orbs */}
      <div 
        className="absolute w-64 h-64 rounded-full animate-float-slow"
        style={{
          background: 'radial-gradient(circle, hsl(var(--foreground) / 0.03) 0%, transparent 70%)',
          left: '10%',
          top: '20%',
          animationDuration: '25s',
        }}
      />
      <div 
        className="absolute w-96 h-96 rounded-full animate-float-slow"
        style={{
          background: 'radial-gradient(circle, hsl(var(--foreground) / 0.02) 0%, transparent 70%)',
          right: '5%',
          bottom: '10%',
          animationDuration: '30s',
          animationDelay: '5s',
        }}
      />
      <div 
        className="absolute w-48 h-48 rounded-full animate-float-slow"
        style={{
          background: 'radial-gradient(circle, hsl(var(--foreground) / 0.04) 0%, transparent 70%)',
          left: '60%',
          top: '60%',
          animationDuration: '20s',
          animationDelay: '10s',
        }}
      />
    </div>
  );
};

export default FloatingParticles;
