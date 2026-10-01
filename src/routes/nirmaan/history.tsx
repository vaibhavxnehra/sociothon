import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { History, Calendar, Clock, Trophy, Home, Loader2, ArrowRight } from 'lucide-react';
import { useAuth } from '../../lib/nirmaan/auth';
import { getUserQuizHistory } from '../../lib/nirmaan/quiz-client';
import type { QuizHistoryItem } from '../../lib/nirmaan/types';

export const Route = createFileRoute('/nirmaan/history')({
  component: NirmaanHistoryPage,
});

function formatSeconds(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

function NirmaanHistoryPage() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [history, setHistory] = useState<QuizHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate({ to: '/nirmaan/login' });
      return;
    }

    if (user) {
      getUserQuizHistory()
        .then((res) => setHistory(res.history))
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [user, authLoading, navigate]);

  return (
    <div className="min-h-screen bg-neutral-950 text-white selection:bg-white/20 pb-16">
      {/* Header */}
      <header className="border-b border-neutral-800 bg-neutral-900/50 backdrop-blur sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20 flex items-center justify-center">
              <History className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs uppercase tracking-wider text-neutral-400 font-mono">NIRMAAN 2026</span>
              <h1 className="text-base font-semibold text-white tracking-tight">Your Quiz History</h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/nirmaan"
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm text-neutral-300 hover:text-white hover:bg-neutral-800 transition"
            >
              <Home className="w-4 h-4" />
              <span>Hub</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main List */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        {loading ? (
          <div className="text-center py-20 space-y-3">
            <Loader2 className="w-8 h-8 text-white animate-spin mx-auto opacity-60" />
            <p className="text-xs font-mono text-neutral-400 uppercase tracking-widest">Loading Records...</p>
          </div>
        ) : history.length === 0 ? (
          <div className="rounded-3xl border border-neutral-800 bg-neutral-900/40 p-12 text-center space-y-3">
            <Calendar className="w-10 h-10 text-neutral-600 mx-auto" />
            <h3 className="text-lg font-semibold text-white">No quiz history available</h3>
            <p className="text-sm text-neutral-400">
              Completed and missed quizzes will automatically appear here.
            </p>
          </div>
        ) : (
          <div className="rounded-3xl border border-neutral-800 bg-neutral-900/40 overflow-hidden shadow-2xl">
            <div className="divide-y divide-neutral-800/60">
              {history.map((item) => {
                const isCompleted = item.status === 'completed';
                const isAutoSubmitted = item.status === 'auto_submitted';
                const isMissed = item.status === 'missed';

                return (
                  <div
                    key={item.quiz_id}
                    className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-white/[0.02] transition"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2.5">
                        <span className="text-xs font-mono text-neutral-400">{item.quiz_date}</span>
                        <span
                          className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${
                            isCompleted
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : isAutoSubmitted
                              ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                              : isMissed
                              ? 'bg-neutral-800 text-neutral-400 border border-neutral-700'
                              : 'bg-sky-500/10 text-sky-400 border border-sky-500/20'
                          }`}
                        >
                          {item.status.toUpperCase()}
                        </span>
                      </div>
                      <h3 className="text-base font-medium text-white">{item.title}</h3>
                    </div>

                    <div className="flex items-center gap-4">
                      {item.final_time_seconds != null ? (
                        <div className="text-right">
                          <div className="text-xs text-neutral-400 font-mono">Final Time</div>
                          <div className="text-sm sm:text-base font-bold font-mono text-amber-300">
                            {formatSeconds(item.final_time_seconds)}
                          </div>
                        </div>
                      ) : (
                        <div className="text-right text-xs font-mono text-neutral-500">—</div>
                      )}

                      {item.attempt_id && (
                        <Link
                          to="/nirmaan/result"
                          search={{ attempt_id: item.attempt_id }}
                          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-neutral-800 text-xs text-neutral-200 hover:text-white hover:bg-neutral-700 transition"
                        >
                          <span>Review</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
