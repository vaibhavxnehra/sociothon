import { createFileRoute, Link, useSearch } from '@tanstack/react-router';
import { useEffect, useState, useCallback } from 'react';
import {
  Trophy,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  ArrowRight,
  Loader2,
  History,
  Home,
} from 'lucide-react';
import { getAttemptReview } from '../../lib/nirmaan/quiz-client';
import type { AttemptReviewResponse } from '../../lib/nirmaan/types';

export const Route = createFileRoute('/nirmaan/result')({
  component: NirmaanResultPage,
  validateSearch: (search: Record<string, unknown>) => {
    return {
      attempt_id: typeof search.attempt_id === 'string' ? search.attempt_id : undefined,
    };
  },
});

function formatSeconds(sec: number): string {
  if (typeof sec !== 'number' || isNaN(sec)) return '0s';
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  const isDecimal = Math.round(s * 10) !== Math.round(s) * 10;
  const sFormatted = isDecimal ? s.toFixed(1) : String(Math.floor(s)).padStart(2, '0');
  if (m === 0) {
    return `${isDecimal ? s.toFixed(1) : s}s`;
  }
  return `${m}:${s < 10 ? '0' : ''}${sFormatted}`;
}

function NirmaanResultPage() {
  const search = useSearch({ from: '/nirmaan/result' });
  const [review, setReview] = useState<AttemptReviewResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fetchResult = useCallback(async (attemptId: string) => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const data = await getAttemptReview(attemptId);
      setReview(data);
    } catch (err: unknown) {
      console.error('Error fetching attempt review:', err);
      setErrorMsg(err instanceof Error ? err.message : 'Failed to load result review.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (search.attempt_id) {
      fetchResult(search.attempt_id);
    } else {
      setErrorMsg('No attempt ID provided.');
      setLoading(false);
    }
  }, [search.attempt_id, fetchResult]);

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-950 text-white flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-10 h-10 text-white animate-spin mx-auto opacity-70" />
          <p className="text-xs font-mono tracking-widest text-neutral-400 uppercase">Calculating Score...</p>
        </div>
      </div>
    );
  }

  if (errorMsg || !review) {
    return (
      <div className="min-h-screen bg-neutral-950 text-white flex items-center justify-center p-4">
        <div className="max-w-md w-full rounded-3xl border border-neutral-800 bg-neutral-900 p-8 text-center space-y-4">
          <AlertTriangle className="w-10 h-10 text-amber-400 mx-auto" />
          <h2 className="text-xl font-bold text-white">Result Not Found</h2>
          <p className="text-sm text-neutral-400">{errorMsg || 'Could not locate quiz attempt details.'}</p>
          <div className="pt-2">
            <Link
              to="/nirmaan"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-black font-semibold text-sm hover:bg-neutral-200 transition"
            >
              <Home className="w-4 h-4" />
              <span>Return to Hub</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const isAutoSubmitted = review.status === 'auto_submitted';

  return (
    <div className="min-h-screen bg-neutral-950 text-white py-12 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Result Header Banner */}
        <div className="rounded-3xl border border-neutral-800 bg-neutral-900/60 p-6 sm:p-10 backdrop-blur-xl text-center space-y-4 relative overflow-hidden shadow-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-800 border border-neutral-700 text-xs font-mono text-neutral-300">
            <span>{review.title}</span>
            <span>•</span>
            <span>{review.quiz_date}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            {isAutoSubmitted ? 'Quiz Auto-Submitted' : 'Quiz Completed!'}
          </h1>
          <p className="text-sm text-neutral-400 max-w-md mx-auto">
            {isAutoSubmitted
              ? 'Your timer or the quiz cutoff time was reached. Your answers have been recorded.'
              : 'Great job! Your answers have been evaluated and your rank has been calculated.'}
          </p>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-6 border-t border-neutral-800">
            <div className="p-4 rounded-2xl bg-neutral-950/60 border border-neutral-800/80">
              <div className="text-xs uppercase tracking-wider text-neutral-400 font-mono mb-1">Correct</div>
              <div className="text-xl font-bold font-mono text-emerald-400 flex items-center justify-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>{review.correct_count}</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-neutral-950/60 border border-neutral-800/80">
              <div className="text-xs uppercase tracking-wider text-neutral-400 font-mono mb-1">Wrong</div>
              <div className="text-xl font-bold font-mono text-white flex items-center justify-center gap-1.5">
                <XCircle className="w-4 h-4 text-red-400" />
                <span>{review.wrong_count}</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-neutral-950/60 border border-neutral-800/80">
              <div className="text-xs uppercase tracking-wider text-neutral-400 font-mono mb-1">Skipped</div>
              <div className="text-xl font-bold font-mono text-amber-300 flex items-center justify-center gap-1.5">
                <HelpCircle className="w-4 h-4 text-amber-400" />
                <span>{review.skipped_count || 0}</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-neutral-950/60 border border-neutral-800/80">
              <div className="text-xs uppercase tracking-wider text-neutral-400 font-mono mb-1">Penalty</div>
              <div className="text-xl font-bold font-mono text-amber-400 flex items-center justify-center gap-1">
                <span>+{review.penalty_seconds}s</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-neutral-950/60 border border-neutral-800/80 ring-1 ring-amber-500/30 col-span-2 sm:col-span-1">
              <div className="text-xs uppercase tracking-wider text-amber-400/80 font-mono mb-1">Final Time</div>
              <div className="text-xl font-bold font-mono text-amber-300 flex items-center justify-center gap-1.5">
                <Trophy className="w-4 h-4 text-amber-400" />
                <span>{formatSeconds(review.final_time_seconds)}</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/nirmaan/leaderboard"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-black font-semibold text-sm hover:bg-neutral-200 transition shadow"
            >
              <Trophy className="w-4 h-4" />
              <span>View Leaderboard</span>
            </Link>

            <Link
              to="/nirmaan/history"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-neutral-800 text-neutral-300 hover:text-white hover:bg-neutral-900 transition text-sm"
            >
              <History className="w-4 h-4 text-sky-400" />
              <span>Quiz History</span>
            </Link>

            <Link
              to="/nirmaan"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-neutral-800 text-neutral-300 hover:text-white hover:bg-neutral-900 transition text-sm"
            >
              <Home className="w-4 h-4" />
              <span>Hub</span>
            </Link>
          </div>
        </div>

        {/* Detailed Question Review */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
            <span>Question Breakdown & Explanations</span>
          </h2>

          <div className="space-y-4">
            {review.questions_review.map((item) => {
              const isSkipped = !item.selected_answer || item.is_skipped;

              return (
                <div
                  key={item.display_order}
                  className="rounded-2xl border border-neutral-800 bg-neutral-900/40 p-6 space-y-4 transition"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs uppercase tracking-wider font-mono text-neutral-400">
                      Question {item.display_order}
                    </span>

                    {item.is_correct ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Correct</span>
                      </span>
                    ) : isSkipped ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-semibold">
                        <HelpCircle className="w-3.5 h-3.5" />
                        <span>Skipped (No Penalty)</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/10 text-red-400 border border-red-500/20 text-xs font-semibold">
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Wrong (+0.5s)</span>
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-medium text-white">{item.question_text}</h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center justify-between">
                      <span className="text-neutral-400">Your Answer:</span>
                      <span
                        className={`font-mono font-bold ${
                          item.is_correct
                            ? 'text-emerald-400'
                            : isSkipped
                            ? 'text-amber-400'
                            : 'text-red-400'
                        }`}
                      >
                        {item.selected_answer ? `Option ${item.selected_answer}` : 'Skipped / Unanswered'}
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center justify-between">
                      <span className="text-neutral-400">Correct Answer:</span>
                      <span className="font-mono font-bold text-emerald-400">
                        Option {item.correct_answer}
                      </span>
                    </div>
                  </div>

                  {item.explanation && (
                    <div className="p-3.5 rounded-xl bg-neutral-950/80 border border-neutral-800/80 text-xs text-neutral-300 leading-relaxed">
                      <span className="font-semibold text-neutral-200 block mb-1">Explanation:</span>
                      {item.explanation}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
