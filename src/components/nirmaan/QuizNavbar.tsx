import React from 'react';
import { Sparkles, X } from 'lucide-react';
import { Link } from '@tanstack/react-router';

interface QuizNavbarProps {
  title?: string;
  currentQuestionIndex: number;
  totalQuestions: number;
  answeredQuestionIndices?: number[];
  onSelectQuestion?: (index: number) => void;
  onExit?: () => void;
}

export const QuizNavbar: React.FC<QuizNavbarProps> = ({
  title = 'DAILY SPEED QUIZ',
  currentQuestionIndex,
  totalQuestions,
  answeredQuestionIndices = [],
  onSelectQuestion,
  onExit,
}) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 py-4 md:px-8 flex justify-center pointer-events-none">
      <div className="w-full max-w-4xl bg-[#13110F]/85 border border-white/10 rounded-full px-4 sm:px-6 py-2.5 flex items-center justify-between pointer-events-auto backdrop-blur-xl shadow-2xl">
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

        {/* Center Free Question Navigation Pills */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {Array.from({ length: totalQuestions }).map((_, idx) => {
            const isActive = idx === currentQuestionIndex;
            const isAnswered = answeredQuestionIndices.includes(idx);

            return (
              <button
                key={idx}
                type="button"
                onClick={() => onSelectQuestion?.(idx)}
                className={`flex items-center gap-1 px-2.5 sm:px-3 py-1 rounded-full text-xs font-mono font-medium transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-[#E5DBCF] text-[#1E1B18] shadow-md shadow-[#E5DBCF]/30 scale-105 font-bold'
                    : isAnswered
                    ? 'bg-white/15 text-[#E5DBCF] border border-white/20 hover:bg-white/25'
                    : 'bg-white/5 text-[#A89E8F] border border-white/10 hover:bg-white/15 hover:text-white'
                }`}
                title={`Jump to Question ${idx + 1}${isAnswered ? ' (Answered)' : ' (Unanswered)'}`}
              >
                <span>Q{idx + 1}</span>
                {isAnswered && (
                  <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-[#1E1B18]' : 'bg-emerald-400'}`} />
                )}
              </button>
            );
          })}
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
