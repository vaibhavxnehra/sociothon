import React, { useEffect } from 'react';
import type { AttemptQuestionItem } from '../../lib/nirmaan/types';

interface QuizQuestionCardProps {
  question: AttemptQuestionItem;
  questionNumber: number;
  totalQuestions: number;
  selectedAnswer?: 'A' | 'B' | 'C' | 'D' | null;
  onSelectOption: (option: 'A' | 'B' | 'C' | 'D') => void;
  disabled?: boolean;
}

export const QuizQuestionCard: React.FC<QuizQuestionCardProps> = ({
  question,
  questionNumber,
  totalQuestions,
  selectedAnswer,
  onSelectOption,
  disabled = false,
}) => {
  const options: Array<{ key: 'A' | 'B' | 'C' | 'D'; label: string }> = [
    { key: 'A', label: question.option_a },
    { key: 'B', label: question.option_b },
    { key: 'C', label: question.option_c },
    { key: 'D', label: question.option_d },
  ];

  // Keyboard shortcut listener: 'A', 'B', 'C', 'D' or '1', '2', '3', '4'
  useEffect(() => {
    if (disabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (['input', 'textarea'].includes((e.target as HTMLElement).tagName.toLowerCase())) {
        return;
      }

      const key = e.key.toUpperCase();
      if (key === 'A' || key === '1') onSelectOption('A');
      else if (key === 'B' || key === '2') onSelectOption('B');
      else if (key === 'C' || key === '3') onSelectOption('C');
      else if (key === 'D' || key === '4') onSelectOption('D');
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [disabled, onSelectOption]);

  return (
    <div className="w-full max-w-2xl mx-auto bg-[#13110F]/90 border border-white/10 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-2xl">
      {/* Header Tag */}
      <div className="flex items-center justify-between mb-6">
        <span className="text-xs uppercase tracking-widest text-[#C5B8A5] font-mono">
          QUESTION {questionNumber} OF {totalQuestions}
        </span>
        <span className="text-xs text-[#9E907E] font-mono hidden sm:inline">
          Press [A] [B] [C] [D] to select
        </span>
      </div>

      {/* Question Text */}
      <h2 className="font-nirmaan-title text-xl sm:text-2xl font-medium text-[#F5EFE6] mb-8 leading-snug tracking-tight">
        {question.question_text}
      </h2>

      {/* Options Grid */}
      <div className="grid grid-cols-1 gap-3.5">
        {options.map((opt) => {
          const isSelected = selectedAnswer === opt.key;

          return (
            <button
              key={opt.key}
              type="button"
              disabled={disabled}
              onClick={() => onSelectOption(opt.key)}
              className={`w-full group text-left px-5 py-4 rounded-2xl transition-all duration-200 flex items-center justify-between border ${
                isSelected
                  ? 'border-[#E5DBCF] bg-[#E5DBCF]/15 ring-1 ring-[#E5DBCF]/40 shadow-lg shadow-black/40'
                  : 'bg-white/[0.03] border-white/10 hover:bg-white/[0.07] hover:border-white/20'
              } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer active:scale-[0.99]'}`}
            >
              <div className="flex items-center gap-4">
                <span
                  className={`w-8 h-8 rounded-xl flex items-center justify-center font-mono text-xs font-semibold border transition-all duration-200 ${
                    isSelected
                      ? 'bg-[#E5DBCF] text-[#1E1B18] border-[#E5DBCF] shadow-md'
                      : 'bg-white/5 text-[#D8CEBF] border-white/10 group-hover:border-[#C5B8A5]/40 group-hover:text-white'
                  }`}
                >
                  {opt.key}
                </span>
                <span
                  className={`text-sm sm:text-base font-normal tracking-wide transition-colors ${
                    isSelected ? 'text-[#F5EFE6] font-medium' : 'text-[#D8CEBF] group-hover:text-white'
                  }`}
                >
                  {opt.label}
                </span>
              </div>

              {/* Indicator dot */}
              <div
                className={`w-2.5 h-2.5 rounded-full border transition-all duration-200 ${
                  isSelected
                    ? 'bg-[#E5DBCF] border-[#E5DBCF] scale-110 shadow-[0_0_8px_rgba(229,219,207,0.8)]'
                    : 'border-white/20 group-hover:border-white/40'
                }`}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
};
