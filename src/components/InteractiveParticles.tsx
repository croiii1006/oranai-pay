import React, { useRef, useEffect } from 'react';

const InteractiveParticles: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const timeRef = useRef(0);
  const animationRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };

    const handleMouseLeave = () => {
      mouseRef.current = { x: -1000, y: -1000 };
    };

    const animate = () => {
      timeRef.current += 0.005;
      const time = timeRef.current;
      const mouse = mouseRef.current;
      
      // Mouse influence on gradient
      const mouseInfluenceX = mouse.x > 0 ? (mouse.x / canvas.width - 0.5) * 0.4 : 0;
      const mouseInfluenceY = mouse.y > 0 ? (mouse.y / canvas.height - 0.5) * 0.4 : 0;
      
      // Create flowing gradient affected by mouse
      const gradient = ctx.createLinearGradient(
        canvas.width * (0.5 + mouseInfluenceX) + Math.sin(time) * canvas.width * 0.2,
        0,
        canvas.width * (0.5 - mouseInfluenceX) + Math.cos(time * 0.7) * canvas.width * 0.2,
        canvas.height
      );
      
      // Dynamic black and white gradient stops
      const offset1 = (Math.sin(time * 0.8) + 1) * 0.15;
      const offset2 = 0.3 + (Math.sin(time * 0.5) + 1) * 0.1;
      const offset3 = 0.6 + (Math.cos(time * 0.6) + 1) * 0.1;
      
      gradient.addColorStop(0, `rgba(0, 0, 0, 1)`);
      gradient.addColorStop(offset1, `rgba(20, 20, 20, 1)`);
      gradient.addColorStop(offset2, `rgba(40, 40, 40, 1)`);
      gradient.addColorStop(offset3, `rgba(15, 15, 15, 1)`);
      gradient.addColorStop(1, `rgba(0, 0, 0, 1)`);
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Add secondary flowing gradient for depth - follows mouse
      const gradient2 = ctx.createRadialGradient(
        (mouse.x > 0 ? mouse.x * 0.6 : canvas.width * 0.3) + Math.sin(time * 0.4) * canvas.width * 0.1,
        (mouse.y > 0 ? mouse.y * 0.6 : canvas.height * 0.4) + Math.cos(time * 0.3) * canvas.height * 0.1,
        0,
        canvas.width * 0.5,
        canvas.height * 0.5,
        canvas.width * 0.8
      );
      
      gradient2.addColorStop(0, `rgba(70, 70, 70, 0.5)`);
      gradient2.addColorStop(0.5, `rgba(35, 35, 35, 0.25)`);
      gradient2.addColorStop(1, `rgba(0, 0, 0, 0)`);
      
      ctx.fillStyle = gradient2;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Third flowing element - also responds to mouse
      const gradient3 = ctx.createRadialGradient(
        (mouse.x > 0 ? canvas.width - mouse.x * 0.4 : canvas.width * 0.7) + Math.cos(time * 0.5) * canvas.width * 0.1,
        (mouse.y > 0 ? canvas.height - mouse.y * 0.4 : canvas.height * 0.6) + Math.sin(time * 0.4) * canvas.height * 0.1,
        0,
        canvas.width * 0.7,
        canvas.height * 0.6,
        canvas.width * 0.5
      );
      
      gradient3.addColorStop(0, `rgba(80, 80, 80, 0.35)`);
      gradient3.addColorStop(0.4, `rgba(40, 40, 40, 0.18)`);
      gradient3.addColorStop(1, `rgba(0, 0, 0, 0)`);
      
      ctx.fillStyle = gradient3;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Mouse spotlight - white glow
      if (mouse.x > 0 && mouse.y > 0) {
        const mouseGradient = ctx.createRadialGradient(
          mouse.x, mouse.y, 0,
          mouse.x, mouse.y, 300
        );
        mouseGradient.addColorStop(0, 'rgba(255, 255, 255, 0.08)');
        mouseGradient.addColorStop(0.3, 'rgba(200, 200, 200, 0.04)');
        mouseGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = mouseGradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);
    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-auto"
      style={{ background: 'transparent' }}
    />
  );
};

export default InteractiveParticles;
