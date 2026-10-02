import { createFileRoute, useNavigate } from '@tanstack/react-router';
import React, { useEffect, useState, useCallback, useRef } from 'react';
import { ArrowLeft, ArrowRight, Check, AlertCircle, Loader2, HelpCircle } from 'lucide-react';
import { useAuth } from '../../lib/nirmaan/auth';
import { getTodayQuiz, startQuiz, saveAnswer, saveQuizProgress, submitQuiz } from '../../lib/nirmaan/quiz-client';
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
  const [questionTimes, setQuestionTimes] = useState<Record<string, number>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const isSubmittingRef = useRef(false);
  const questionStartTimeRef = useRef<number>(Date.now());

  // Accumulate elapsed active time for the current question
  const flushCurrentQuestionTime = useCallback((): Record<string, number> => {
    if (!attemptData || !attemptData.questions) return questionTimes;
    const currentQ = attemptData.questions[currentIndex];
    if (!currentQ) return questionTimes;

    const now = Date.now();
    const elapsedSeconds = Math.max(0, (now - questionStartTimeRef.current) / 1000);
    const updated = {
      ...questionTimes,
      [currentQ.id]: Math.round(((questionTimes[currentQ.id] || 0) + elapsedSeconds) * 100) / 100,
    };
    questionStartTimeRef.current = now;
    setQuestionTimes(updated);
    return updated;
  }, [attemptData, currentIndex, questionTimes]);

  // 1. Check Auth & Start/Resume Quiz Attempt
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

      // Call start_quiz RPC (creates new or safely resumes existing attempt)
      const data = await startQuiz(todayQuiz.id);

      // If user has already completed this quiz, redirect to results
      if (data.status === 'completed' || data.status === 'auto_submitted') {
        navigate({
          to: '/nirmaan/result',
          search: { attempt_id: data.attempt_id },
        });
        return;
      }

      setAttemptData(data);

      // Restore saved progress from server / localStorage cache
      let initialIndex = data.current_question_index ?? 0;
      let initialAnswers: Record<string, 'A' | 'B' | 'C' | 'D'> = data.saved_answers || {};
      let initialTimes: Record<string, number> = data.question_times || {};

      try {
        const cachedRaw = localStorage.getItem(`nirmaan_attempt_${data.attempt_id}`);
        if (cachedRaw) {
          const cached = JSON.parse(cachedRaw);
          if (cached.selectedAnswers) {
            initialAnswers = { ...initialAnswers, ...cached.selectedAnswers };
          }
          if (cached.questionTimes) {
            initialTimes = { ...initialTimes, ...cached.questionTimes };
          }
          if (typeof cached.currentIndex === 'number' && cached.currentIndex >= 0) {
            initialIndex = cached.currentIndex;
          }
        }
      } catch {
        // ignore storage errors
      }

      // Ensure valid question index bounds
      const maxIndex = (data.questions?.length || 1) - 1;
      const safeIndex = Math.min(Math.max(0, initialIndex), maxIndex);

      setCurrentIndex(safeIndex);
      setSelectedAnswers(initialAnswers);
      setQuestionTimes(initialTimes);
      questionStartTimeRef.current = Date.now();
    } catch (err: unknown) {
      console.error('Quiz start error:', err);
      setErrorMsg(err instanceof Error ? err.message : 'Failed to start quiz.');
    } finally {
      setLoading(false);
    }
  }, [user, navigate]);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate({ to: '/nirmaan/login' });
      return;
    }

    if (user) {
      initializeQuiz();
    }
  }, [user, authLoading, navigate, initializeQuiz]);

  // Periodic state persistence to localStorage
  useEffect(() => {
    if (!attemptData?.attempt_id) return;
    const interval = setInterval(() => {
      try {
        localStorage.setItem(
          `nirmaan_attempt_${attemptData.attempt_id}`,
          JSON.stringify({
            currentIndex,
            selectedAnswers,
            questionTimes,
          })
        );
      } catch {
        // ignore
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [attemptData, currentIndex, selectedAnswers, questionTimes]);

  // 2. Free Question Switching
  const handleSwitchQuestion = useCallback(
    (targetIndex: number) => {
      if (!attemptData || !attemptData.questions || isSubmitting) return;
      if (targetIndex < 0 || targetIndex >= attemptData.questions.length) return;
      if (targetIndex === currentIndex) return;

      const updatedTimes = flushCurrentQuestionTime();
      setCurrentIndex(targetIndex);
      questionStartTimeRef.current = Date.now();

      // Persist progress to server and localStorage
      saveQuizProgress(attemptData.attempt_id, targetIndex, updatedTimes);
      try {
        localStorage.setItem(
          `nirmaan_attempt_${attemptData.attempt_id}`,
          JSON.stringify({
            currentIndex: targetIndex,
            selectedAnswers,
            questionTimes: updatedTimes,
          })
        );
      } catch {
        // ignore
      }
    },
    [attemptData, currentIndex, isSubmitting, flushCurrentQuestionTime, selectedAnswers]
  );

  // 3. Select Option & Upsert Answer
  const handleSelectOption = async (option: 'A' | 'B' | 'C' | 'D') => {
    if (!attemptData || !attemptData.questions || isSubmitting) return;

    const currentQ = attemptData.questions[currentIndex];
    if (!currentQ) return;

    const updatedTimes = flushCurrentQuestionTime();
    const newAnswers = {
      ...selectedAnswers,
      [currentQ.id]: option,
    };
    setSelectedAnswers(newAnswers);

    try {
      localStorage.setItem(
        `nirmaan_attempt_${attemptData.attempt_id}`,
        JSON.stringify({
          currentIndex,
          selectedAnswers: newAnswers,
          questionTimes: updatedTimes,
        })
      );
    } catch {
      // ignore
    }

    try {
      await saveAnswer(
        attemptData.attempt_id,
        currentQ.id,
        option,
        updatedTimes[currentQ.id] || 0,
        currentIndex,
        updatedTimes
      );
    } catch (err: unknown) {
      console.error('Error saving answer:', err);
    }
  };

  // 4. Submit Quiz (Manual or Timeout)
  const handleSubmit = useCallback(
    async (isAuto = false) => {
      if (!attemptData || isSubmittingRef.current) return;
      isSubmittingRef.current = true;
      setIsSubmitting(true);
      setShowConfirmModal(false);

      const finalTimes = flushCurrentQuestionTime();

      try {
        await submitQuiz(attemptData.attempt_id, finalTimes);
        try {
          localStorage.removeItem(`nirmaan_attempt_${attemptData.attempt_id}`);
        } catch {
          // ignore
        }
        navigate({
          to: '/nirmaan/result',
          search: { attempt_id: attemptData.attempt_id },
        });
      } catch (err: unknown) {
        console.error('Submission error:', err);
        navigate({
          to: '/nirmaan/result',
          search: { attempt_id: attemptData.attempt_id },
        });
      } finally {
        setIsSubmitting(false);
      }
    },
    [attemptData, flushCurrentQuestionTime, navigate]
  );

  const handleRequestSubmit = () => {
    if (!attemptData?.questions) return;
    const answeredCount = Object.keys(selectedAnswers).length;
    const totalCount = attemptData.questions.length;

    if (answeredCount < totalCount) {
      // Prompt confirmation with clear explanation that skipped questions get 0 penalty
      setShowConfirmModal(true);
    } else {
      handleSubmit(false);
    }
  };

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
              className="w-full py-3 rounded-xl bg-white text-black font-semibold text-sm hover:bg-white/90 transition shadow-lg cursor-pointer"
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
  const isCurrentAnswered = currentQ ? !!selectedAnswers[currentQ.id] : false;

  // Compute which question indices are answered
  const answeredQuestionIndices = attemptData.questions
    .map((q, idx) => (selectedAnswers[q.id] ? idx : -1))
    .filter((idx) => idx !== -1);

  const answeredCount = Object.keys(selectedAnswers).length;
  const unansweredCount = attemptData.questions.length - answeredCount;

  return (
    <div className="nirmaan-quiz-scope relative min-h-screen flex flex-col justify-between overflow-x-hidden selection:bg-white/20">
      {/* Cinematic Background */}
      <QuizBackground />

      {/* Floating Navbar with Free Navigation Pills */}
      <QuizNavbar
        title={attemptData.title}
        currentQuestionIndex={currentIndex}
        totalQuestions={attemptData.questions.length}
        answeredQuestionIndices={answeredQuestionIndices}
        onSelectQuestion={handleSwitchQuestion}
        onExit={() => {
          if (confirm('Are you sure you want to exit? Your attempt and timer will continue running until submission.')) {
            navigate({ to: '/nirmaan' });
          }
        }}
      />

      {/* Main Quiz Interaction Area */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 pt-24 pb-28 w-full">
        {/* Floating Timer Bar */}
        <div className="mb-4 flex items-center justify-center">
          <QuizTimer
            effectiveEndTime={attemptData.effective_end_time || ''}
            onTimeout={handleTimeout}
            frozen={isSubmitting}
          />
        </div>

        {/* Question Selector Tabs */}
        <div className="mb-4 flex items-center gap-2 bg-[#13110F]/80 px-3 py-1.5 rounded-full border border-white/10 backdrop-blur-md">
          {attemptData.questions.map((q, idx) => {
            const isActive = idx === currentIndex;
            const isAnswered = !!selectedAnswers[q.id];

            return (
              <button
                key={q.id}
                type="button"
                onClick={() => handleSwitchQuestion(idx)}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium transition cursor-pointer ${
                  isActive
                    ? 'bg-[#E5DBCF] text-[#1E1B18] font-bold shadow'
                    : isAnswered
                    ? 'bg-white/15 text-[#E5DBCF] hover:bg-white/20'
                    : 'bg-white/5 text-[#A89E8F] hover:bg-white/10 hover:text-white'
                }`}
              >
                <span>Question {idx + 1}</span>
                {isAnswered ? (
                  <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-[#1E1B18]' : 'bg-emerald-400'}`} />
                ) : (
                  <span className="text-[10px] text-white/40 font-mono">(skip)</span>
                )}
              </button>
            );
          })}
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
            onClick={() => handleSwitchQuestion(currentIndex - 1)}
            className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium text-[#C5B8A5] hover:text-white hover:bg-white/10 transition disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Previous</span>
          </button>

          {/* Quick Info & Direct Jump */}
          <div className="text-xs font-mono text-[#9E907E] tracking-wider text-center">
            <span className="text-white font-semibold">{answeredCount}</span> of {attemptData.questions.length} Answered
            {unansweredCount > 0 && (
              <span className="text-amber-400/80 text-[11px] block sm:inline sm:ml-2">({unansweredCount} skipped)</span>
            )}
          </div>

          {/* Action Buttons: Next / Skip or Submit */}
          <div className="flex items-center gap-2">
            {!isLastQuestion ? (
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => handleSwitchQuestion(currentIndex + 1)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#E5DBCF] hover:bg-[#F2ECE3] text-[#1E1B18] font-semibold text-xs tracking-wider uppercase transition shadow-lg shadow-black/40 active:scale-95 cursor-pointer"
              >
                <span>{isCurrentAnswered ? 'Next' : 'Skip & Next'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleRequestSubmit}
                className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#E5DBCF] hover:bg-[#F2ECE3] text-[#1E1B18] font-semibold text-xs tracking-wider uppercase transition shadow-lg shadow-black/40 active:scale-95 disabled:opacity-50 cursor-pointer"
              >
                <span>{isSubmitting ? 'Submitting...' : 'Submit Quiz'}</span>
                <Check className="w-4 h-4" />
              </button>
            )}

            {/* Optional Early Submit Button if not on last question but wants to submit */}
            {!isLastQuestion && answeredCount > 0 && (
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleRequestSubmit}
                className="hidden md:flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-medium text-amber-300 hover:text-amber-200 bg-amber-500/10 border border-amber-500/20 hover:bg-amber-500/20 transition cursor-pointer"
                title="Finish and submit quiz now"
              >
                <span>Submit</span>
              </button>
            )}
          </div>
        </div>
      </footer>

      {/* Confirmation Modal for Submitting with Unanswered / Skipped Questions */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="max-w-md w-full rounded-3xl bg-[#181614] border border-white/10 p-6 sm:p-8 space-y-5 text-center shadow-2xl">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto border border-amber-500/20">
              <HelpCircle className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold tracking-tight text-white">Submit Quiz?</h3>
            <div className="text-xs text-neutral-300 space-y-2 leading-relaxed text-left bg-neutral-900/60 p-4 rounded-2xl border border-white/5 font-mono">
              <p>
                • Answered Questions: <strong className="text-emerald-400">{answeredCount}</strong>
              </p>
              <p>
                • Skipped Questions: <strong className="text-amber-400">{unansweredCount}</strong>
              </p>
              <p className="text-[11px] text-neutral-400 pt-1 border-t border-white/10">
                ℹ️ <strong>Rule:</strong> Skipped questions receive <strong>0 penalty time</strong> and are NOT counted as wrong.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="py-2.5 px-4 rounded-xl border border-white/10 text-neutral-300 hover:bg-white/5 text-xs font-medium transition cursor-pointer"
              >
                Review Questions
              </button>
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => handleSubmit(false)}
                className="py-2.5 px-4 rounded-xl bg-white text-black hover:bg-neutral-200 text-xs font-semibold transition cursor-pointer flex items-center justify-center gap-1.5"
              >
                {isSubmitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                <span>Confirm & Submit</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
