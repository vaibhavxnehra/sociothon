import React, { useEffect, useState } from 'react';
import { Timer, AlertTriangle } from 'lucide-react';

interface QuizTimerProps {
  effectiveEndTime: string;
  onTimeout?: () => void;
  frozen?: boolean;
}

export const QuizTimer: React.FC<QuizTimerProps> = ({
  effectiveEndTime,
  onTimeout,
  frozen = false,
}) => {
  const [remainingMs, setRemainingMs] = useState<number>(0);
  const [hasTimedOut, setHasTimedOut] = useState(false);

  useEffect(() => {
    if (frozen) return;

    const targetTime = new Date(effectiveEndTime).getTime();

    const updateTimer = () => {
      const now = Date.now();
      const diff = targetTime - now;

      if (diff <= 0) {
        setRemainingMs(0);
        if (!hasTimedOut) {
          setHasTimedOut(true);
          onTimeout?.();
        }
      } else {
        setRemainingMs(diff);
      }
    };

    updateTimer();
    const intervalId = setInterval(updateTimer, 100);

    return () => clearInterval(intervalId);
  }, [effectiveEndTime, onTimeout, frozen, hasTimedOut]);

  const totalSeconds = Math.max(0, Math.floor(remainingMs / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const tenths = Math.floor((remainingMs % 1000) / 100);

  const isUrgent = totalSeconds < 60;
  const isCritical = totalSeconds < 20;

  return (
    <div
      className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full transition-all duration-300 ${
        isCritical
          ? 'bg-red-500/20 text-red-300 border border-red-500/40 animate-pulse'
          : isUrgent
          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
          : 'bg-[#13110F]/85 text-[#F5EFE6] border border-white/10 shadow-lg backdrop-blur-xl'
      }`}
    >
      {isCritical ? (
        <AlertTriangle className="w-4 h-4 text-red-400" />
      ) : (
        <Timer className="w-4 h-4 text-white/60" />
      )}
      <span className="font-mono text-sm tracking-wider font-semibold">
        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
        <span className="text-xs text-white/40">.{tenths}</span>
      </span>
    </div>
  );
};
