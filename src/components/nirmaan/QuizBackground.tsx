import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

interface QuizBackgroundProps {
  useStudyRoom?: boolean;
}

export const QuizBackground: React.FC<QuizBackgroundProps> = ({
  useStudyRoom = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const bg = bgRef.current;
    if (!container || !bg) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const xTo = gsap.quickTo(bg, 'x', { duration: 0.8, ease: 'power2.out' });
    const yTo = gsap.quickTo(bg, 'y', { duration: 0.8, ease: 'power2.out' });

    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const xNorm = (e.clientX / innerWidth - 0.5) * 2;
      const yNorm = (e.clientY / innerHeight - 0.5) * 2;
      xTo(xNorm * 12);
      yTo(yNorm * 8);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[#0a0806]"
      aria-hidden="true"
    >
      <img
        ref={bgRef}
        src="/nirmaan/study-room-bg.png"
        alt=""
        className="w-full h-full object-cover scale-105 opacity-50 will-change-transform"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0806]/90 via-[#0a0806]/60 to-[#0a0806]/95 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(255,255,255,0.02)_0%,_transparent_70%)] pointer-events-none" />
    </div>
  );
};
