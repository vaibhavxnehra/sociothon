import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

interface StudyRoomStageProps {
  children?: React.ReactNode;
  showDesk?: boolean;
}

export const StudyRoomStage: React.FC<StudyRoomStageProps> = ({
  children,
  showDesk = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLImageElement>(null);
  const deskRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const bg = bgRef.current;
    const desk = deskRef.current;
    if (!container || !bg) return;

    // Check reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const xToBg = gsap.quickTo(bg, 'x', { duration: 0.8, ease: 'power2.out' });
    const yToBg = gsap.quickTo(bg, 'y', { duration: 0.8, ease: 'power2.out' });

    let xToDesk: ((val: number) => void) | null = null;
    let yToDesk: ((val: number) => void) | null = null;

    if (desk) {
      xToDesk = gsap.quickTo(desk, 'x', { duration: 0.6, ease: 'power2.out' });
      yToDesk = gsap.quickTo(desk, 'y', { duration: 0.6, ease: 'power2.out' });
    }

    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const normX = (e.clientX / innerWidth - 0.5) * 2;
      const normY = (e.clientY / innerHeight - 0.5) * 2;

      // Background moves subtly with cursor
      xToBg(normX * 12);
      yToBg(normY * 8);

      // Foreground desk moves in opposite direction for rich 3D optical parallax
      if (xToDesk && yToDesk) {
        xToDesk(normX * -24);
        yToDesk(normY * -14);
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative min-h-screen w-full bg-[#0a0806] text-white overflow-x-hidden flex flex-col justify-between selection:bg-[#c5b8a5]/30 font-sans"
    >
      {/* Layer 1: Study Room Background */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none select-none">
        <img
          ref={bgRef}
          src="/nirmaan/study-room-bg.png"
          alt="Vintage Study Room"
          className="absolute inset-0 w-full h-full object-cover object-center scale-105"
        />

        {/* Cinematic Darkness & Left Gradient Overlay for crisp typographic contrast */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0806] via-[#0a0806]/85 to-transparent w-full md:w-[65%] z-[1]" />
        
        {/* Soft Ambient Vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0806] via-transparent to-[#0a0806]/70 z-[2]" />
        <div className="absolute inset-0 bg-black/25 z-[3]" />
      </div>

      {/* Layer 2: Foreground Antique Desk Cutout */}
      {showDesk && (
        <div className="absolute bottom-0 right-0 z-10 pointer-events-none select-none overflow-hidden flex justify-end items-end">
          <img
            ref={deskRef}
            src="/nirmaan/study-desk-fg.png"
            alt="Antique Study Desk"
            className="w-[58vw] max-w-[880px] min-w-[460px] translate-y-3 translate-x-2 drop-shadow-2xl"
          />
        </div>
      )}

      {/* Foreground Content */}
      <div className="relative z-20 flex-1 flex flex-col justify-between w-full">
        {children}
      </div>
    </div>
  );
};
