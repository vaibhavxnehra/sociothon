import { createFileRoute, useNavigate } from '@tanstack/react-router';
import React, { useEffect, useState, useCallback, useRef } from 'react';
import { ArrowLeft, ArrowRight, Check, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../../lib/nirmaan/auth';
import { getTodayQuiz, startQuiz, saveAnswer, submitQuiz } from '../../lib/nirmaan/quiz-client';
import type { StartQuizResponse } from '../../lib/nirmaan/types';
import { QuizBackground } from '../../components/nirmaan/QuizBackground';
import { QuizNavbar } from '../../components/nirmaan/QuizNavbar';
import { QuizTimer } from '../../components/nirmaan/QuizTimer';
import { QuizQuestionCard } from '../../components/nirmaan/QuizQuestionCard';
import '../../styles/quiz.css';

export const Route = createFileRoute('/nirmaan/quiz')({
  component: NirmaanQuizPage,
});

function NirmaanQuizPage() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();

  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [attemptData, setAttemptData] = useState<StartQuizResponse | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, 'A' | 'B' | 'C' | 'D'>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isSubmittingRef = useRef(false);

  // 1. Check Auth & Start Quiz
  const initializeQuiz = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setErrorMsg(null);

    try {
      const todayQuiz = await getTodayQuiz();
      if (!todayQuiz) {
        throw new Error('No quiz scheduled for today.');
      }

      if (todayQuiz.status !== 'published') {
        throw new Error('Today’s quiz is not currently active.');
      }

      // Call start_quiz RPC (creates or resumes attempt securely)
      const data = await startQuiz(todayQuiz.id);
      setAttemptData(data);
    } catch (err: unknown) {
      console.error('Quiz start error:', err);
      setErrorMsg(err instanceof Error ? err.message : 'Failed to start quiz.');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate({ to: '/nirmaan/login' });
      return;
    }

    if (user) {
      initializeQuiz();
    }
  }, [user, authLoading, navigate, initializeQuiz]);

  // 2. Select Option & Upsert Answer
  const handleSelectOption = async (option: 'A' | 'B' | 'C' | 'D') => {
    if (!attemptData || isSubmitting) return;

    const currentQ = attemptData.questions[currentIndex];
    if (!currentQ) return;

    // Optimistic update
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQ.id]: option,
    }));

    try {
      await saveAnswer(attemptData.attempt_id, currentQ.id, option);
    } catch (err: unknown) {
      console.error('Error saving answer:', err);
    }
  };

  // 3. Submit Quiz (Manual or Timeout)
  const handleSubmit = useCallback(
    async (isAuto = false) => {
      if (!attemptData || isSubmittingRef.current) return;
      isSubmittingRef.current = true;
      setIsSubmitting(true);

      try {
        await submitQuiz(attemptData.attempt_id);
        navigate({
          to: '/nirmaan/result',
          search: { attempt_id: attemptData.attempt_id },
        });
      } catch (err: unknown) {
        console.error('Submission error:', err);
        // If already submitted, still forward to result
        navigate({
          to: '/nirmaan/result',
          search: { attempt_id: attemptData.attempt_id },
        });
      } finally {
        setIsSubmitting(false);
      }
    },
    [attemptData, navigate]
  );

  // Timeout handler triggered by QuizTimer
  const handleTimeout = useCallback(() => {
    handleSubmit(true);
  }, [handleSubmit]);

  if (authLoading || loading) {
    return (
      <div className="nirmaan-quiz-scope flex items-center justify-center min-h-screen">
        <QuizBackground />
        <div className="relative z-10 text-center space-y-4">
          <Loader2 className="w-10 h-10 text-white animate-spin mx-auto opacity-70" />
          <p className="text-sm font-mono tracking-widest text-white/50 uppercase">Loading Quiz Session...</p>
        </div>
      </div>
    );
  }

  if (errorMsg) {
    return (
      <div className="nirmaan-quiz-scope flex items-center justify-center min-h-screen p-4">
        <QuizBackground />
        <div className="relative z-10 max-w-md w-full liquid-glass-strong rounded-3xl p-8 text-center space-y-5 border border-white/10 backdrop-blur-xl">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto border border-amber-500/20">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-semibold tracking-tight text-white">Quiz Unavailable</h2>
          <p className="text-sm text-white/60 leading-relaxed">{errorMsg}</p>
          <div className="pt-2">
            <button
              onClick={() => navigate({ to: '/nirmaan' })}
              className="w-full py-3 rounded-xl bg-white text-black font-semibold text-sm hover:bg-white/90 transition shadow-lg"
            >
              Return to Hub
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!attemptData || !attemptData.questions || attemptData.questions.length === 0) {
    return null;
  }

  const currentQ = attemptData.questions[currentIndex];
  const isLastQuestion = currentIndex === attemptData.questions.length - 1;

  return (
    <div className="nirmaan-quiz-scope relative min-h-screen flex flex-col justify-between overflow-x-hidden selection:bg-white/20">
      {/* Cinematic Background */}
      <QuizBackground />

      {/* Floating Navbar */}
      <QuizNavbar
        title={attemptData.title}
        currentQuestionIndex={currentIndex}
        totalQuestions={attemptData.questions.length}
        onExit={() => {
          if (confirm('Are you sure you want to exit? Your timer will continue running until submission.')) {
            navigate({ to: '/nirmaan' });
          }
        }}
      />

      {/* Main Quiz Interaction Area */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 pt-24 pb-28 w-full">
        {/* Floating Timer Bar */}
        <div className="mb-6 flex items-center justify-center">
          <QuizTimer
            effectiveEndTime={attemptData.effective_end_time}
            onTimeout={handleTimeout}
            frozen={isSubmitting}
          />
        </div>

        {/* Question Card */}
        {currentQ && (
          <QuizQuestionCard
            question={currentQ}
            questionNumber={currentIndex + 1}
            totalQuestions={attemptData.questions.length}
            selectedAnswer={selectedAnswers[currentQ.id]}
            onSelectOption={handleSelectOption}
            disabled={isSubmitting}
          />
        )}
      </main>

      {/* Bottom Floating Control Bar */}
      <footer className="fixed bottom-0 left-0 right-0 z-40 p-4 sm:p-6 flex justify-center pointer-events-none">
        <div className="w-full max-w-2xl bg-[#13110F]/90 rounded-full px-5 py-3 flex items-center justify-between pointer-events-auto border border-white/10 backdrop-blur-xl shadow-2xl">
          {/* Previous Button */}
          <button
            type="button"
            disabled={currentIndex === 0 || isSubmitting}
            onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
            className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium text-[#C5B8A5] hover:text-white hover:bg-white/10 transition disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Previous</span>
          </button>

          {/* Quick Info */}
          <div className="text-xs font-mono text-[#9E907E] tracking-wider">
            {Object.keys(selectedAnswers).length} of {attemptData.questions.length} Answered
          </div>

          {/* Next or Submit Button */}
          {isLastQuestion ? (
            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => handleSubmit(false)}
              className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#E5DBCF] hover:bg-[#F2ECE3] text-[#1E1B18] font-semibold text-xs tracking-wider uppercase transition shadow-lg shadow-black/40 active:scale-95 disabled:opacity-50"
            >
              <span>{isSubmitting ? 'Submitting...' : 'Submit Quiz'}</span>
              <Check className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => setCurrentIndex((prev) => Math.min(attemptData.questions.length - 1, prev + 1))}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#E5DBCF] hover:bg-[#F2ECE3] text-[#1E1B18] font-semibold text-xs tracking-wider uppercase transition shadow-lg shadow-black/40 active:scale-95"
            >
              <span>Next</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </footer>
    </div>
  );
}
