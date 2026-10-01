import React from 'react';
import { Sparkles, X } from 'lucide-react';
import { Link } from '@tanstack/react-router';

interface QuizNavbarProps {
  title?: string;
  currentQuestionIndex: number;
  totalQuestions: number;
  onExit?: () => void;
}

export const QuizNavbar: React.FC<QuizNavbarProps> = ({
  title = 'DAILY SPEED QUIZ',
  currentQuestionIndex,
  totalQuestions,
  onExit,
}) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 py-4 md:px-8 flex justify-center pointer-events-none">
      <div className="w-full max-w-4xl bg-[#13110F]/85 border border-white/10 rounded-full px-6 py-3 flex items-center justify-between pointer-events-auto backdrop-blur-xl shadow-2xl">
        {/* Left Branding */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-white/5 border border-white/15 flex items-center justify-center text-[#E0D5C3]">
            <Sparkles className="w-4 h-4 text-[#C5B8A5]" />
          </div>
          <div className="flex flex-col">
            <span className="font-nirmaan-brand text-xs uppercase tracking-[0.22em] text-[#F4EFEA] font-medium">
              NIRMAAN 2026
            </span>
            <span className="text-[9px] uppercase tracking-[0.25em] text-[#C5B8A5]/80 font-mono -mt-0.5">
              {title}
            </span>
          </div>
        </div>

        {/* Center Progress Dots */}
        <div className="flex items-center gap-2">
          {Array.from({ length: totalQuestions }).map((_, idx) => (
            <div
              key={idx}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                idx === currentQuestionIndex
                  ? 'w-7 bg-[#E5DBCF] shadow-sm shadow-[#E5DBCF]/50'
                  : idx < currentQuestionIndex
                  ? 'w-2.5 bg-[#E5DBCF]/60'
                  : 'w-2.5 bg-white/20'
              }`}
            />
          ))}
          <span className="text-xs text-[#9E907E] ml-2 font-mono hidden sm:inline">
            {currentQuestionIndex + 1}/{totalQuestions}
          </span>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {onExit ? (
            <button
              onClick={onExit}
              className="p-1.5 rounded-full text-[#A89E8F] hover:text-white hover:bg-white/10 transition-colors"
              title="Exit Quiz"
            >
              <X className="w-5 h-5" />
            </button>
          ) : (
            <Link
              to="/nirmaan"
              className="p-1.5 rounded-full text-[#A89E8F] hover:text-white hover:bg-white/10 transition-colors"
              title="Exit Quiz"
            >
              <X className="w-5 h-5" />
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};
