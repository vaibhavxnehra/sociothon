import { createFileRoute, Link } from '@tanstack/react-router';
import { useEffect, useState, useCallback } from 'react';
import {
  Trophy,
  Calendar,
  Clock,
  AlertCircle,
  Loader2,
  Medal,
  Home,
  User,
  Users,
} from 'lucide-react';
import { getTodayQuiz, getDailyLeaderboard, getOverallLeaderboard } from '../../lib/nirmaan/quiz-client';
import type {
  DailyLeaderboardResponse,
  OverallLeaderboardResponse,
  Quiz,
} from '../../lib/nirmaan/types';

export const Route = createFileRoute('/nirmaan/leaderboard')({
  component: NirmaanLeaderboardPage,
});

function formatSeconds(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

function NirmaanLeaderboardPage() {
  const [tab, setTab] = useState<'daily' | 'overall'>('daily');
  const [todayQuiz, setTodayQuiz] = useState<Quiz | null>(null);
  const [dailyData, setDailyData] = useState<DailyLeaderboardResponse | null>(null);
  const [overallData, setOverallData] = useState<OverallLeaderboardResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fetchDaily = useCallback(async (quizId: string) => {
    try {
      const data = await getDailyLeaderboard(quizId);
      setDailyData(data);
    } catch (err: unknown) {
      console.error('Error fetching daily leaderboard:', err);
      setErrorMsg(err instanceof Error ? err.message : 'Failed to load daily leaderboard.');
    }
  }, []);

  const fetchOverall = useCallback(async () => {
    try {
      const data = await getOverallLeaderboard();
      setOverallData(data);
    } catch (err: unknown) {
      console.error('Error fetching overall leaderboard:', err);
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    getTodayQuiz()
      .then(async (quiz) => {
        setTodayQuiz(quiz);
        if (quiz) {
          await fetchDaily(quiz.id);
        }
        await fetchOverall();
      })
      .catch((err) => {
        console.error(err);
        setErrorMsg('Could not fetch quiz info.');
      })
      .finally(() => setLoading(false));
  }, [fetchDaily, fetchOverall]);

  return (
    <div className="min-h-screen bg-neutral-950 text-white selection:bg-white/20 pb-16">
      {/* Top Header */}
      <header className="border-b border-neutral-800 bg-neutral-900/50 backdrop-blur sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs uppercase tracking-wider text-neutral-400 font-mono">NIRMAAN 2026</span>
              <h1 className="text-base font-semibold text-white tracking-tight">Competition Leaderboard</h1>
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

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* Tab Selector */}
        <div className="flex items-center justify-between flex-wrap gap-4 border-b border-neutral-800 pb-4">
          <div className="inline-flex p-1 bg-neutral-900 rounded-2xl border border-neutral-800 text-sm">
            <button
              onClick={() => setTab('daily')}
              className={`flex items-center gap-2 px-5 py-2 rounded-xl transition ${
                tab === 'daily'
                  ? 'bg-neutral-800 text-white font-semibold shadow'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Calendar className="w-4 h-4 text-amber-400" />
              <span>Daily Standings</span>
            </button>
            <button
              onClick={() => setTab('overall')}
              className={`flex items-center gap-2 px-5 py-2 rounded-xl transition ${
                tab === 'overall'
                  ? 'bg-neutral-800 text-white font-semibold shadow'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Trophy className="w-4 h-4 text-yellow-400" />
              <span>Overall All-Time</span>
            </button>
          </div>

          {tab === 'daily' && dailyData && (
            <div className="text-xs text-neutral-400 font-mono flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Date: {dailyData.quiz_date}</span>
            </div>
          )}
        </div>

        {loading ? (
          <div className="text-center py-20 space-y-3">
            <Loader2 className="w-8 h-8 text-white animate-spin mx-auto opacity-60" />
            <p className="text-xs font-mono text-neutral-400 uppercase tracking-widest">Loading Standings...</p>
          </div>
        ) : errorMsg ? (
          <div className="text-center py-16 space-y-3">
            <AlertCircle className="w-8 h-8 text-amber-400 mx-auto" />
            <p className="text-sm text-neutral-300">{errorMsg}</p>
          </div>
        ) : tab === 'daily' ? (
          // DAILY LEADERBOARD
          <div className="space-y-6">
            {!dailyData || dailyData.ranked.length === 0 ? (
              <div className="rounded-3xl border border-neutral-800 bg-neutral-900/40 p-12 text-center space-y-3">
                <Users className="w-10 h-10 text-neutral-600 mx-auto" />
                <h3 className="text-lg font-semibold text-white">No attempts recorded yet</h3>
                <p className="text-sm text-neutral-400 max-w-sm mx-auto">
                  Be the first participant to complete today’s quiz and take the #1 rank!
                </p>
                <div className="pt-2">
                  <Link
                    to="/nirmaan/quiz"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-black font-semibold text-sm hover:bg-neutral-200 transition"
                  >
                    Start Quiz Now
                  </Link>
                </div>
              </div>
            ) : (
              <div className="rounded-3xl border border-neutral-800 bg-neutral-900/40 overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-neutral-950/80 border-b border-neutral-800 text-xs font-mono uppercase tracking-wider text-neutral-400">
                      <tr>
                        <th className="py-3.5 px-4 sm:px-6">Rank</th>
                        <th className="py-3.5 px-4">Participant</th>
                        <th className="py-3.5 px-4 hidden sm:table-cell">Actual Time</th>
                        <th className="py-3.5 px-4 hidden sm:table-cell">Penalty</th>
                        <th className="py-3.5 px-4 font-bold text-amber-300">Final Time</th>
                        <th className="py-3.5 px-4 hidden md:table-cell">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-800/60 font-sans">
                      {dailyData.ranked.map((entry) => (
                        <tr
                          key={entry.user_id}
                          className={`hover:bg-white/[0.02] transition ${
                            entry.rank === 1 ? 'bg-amber-500/[0.04]' : ''
                          }`}
                        >
                          <td className="py-4 px-4 sm:px-6 font-mono font-semibold">
                            {entry.rank === 1 ? (
                              <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-amber-400 text-black font-bold text-xs shadow-md shadow-amber-400/20">
                                1
                              </span>
                            ) : entry.rank === 2 ? (
                              <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-slate-300 text-black font-bold text-xs">
                                2
                              </span>
                            ) : entry.rank === 3 ? (
                              <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-amber-700 text-white font-bold text-xs">
                                3
                              </span>
                            ) : (
                              <span className="text-neutral-400 pl-2">#{entry.rank}</span>
                            )}
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-neutral-800 border border-neutral-700 flex items-center justify-center text-xs font-semibold text-neutral-300">
                                {entry.full_name ? entry.full_name[0].toUpperCase() : 'U'}
                              </div>
                              <span className="font-medium text-white">{entry.full_name || 'Participant'}</span>
                            </div>
                          </td>
                          <td className="py-4 px-4 font-mono text-neutral-300 hidden sm:table-cell">
                            {formatSeconds(entry.actual_time_seconds || 0)}
                          </td>
                          <td className="py-4 px-4 font-mono text-amber-400 hidden sm:table-cell">
                            +{entry.penalty_seconds || 0}s ({entry.wrong_count || 0} wrong)
                          </td>
                          <td className="py-4 px-4 font-mono font-bold text-base text-amber-300">
                            {formatSeconds(entry.final_time_seconds || 0)}
                          </td>
                          <td className="py-4 px-4 hidden md:table-cell">
                            <span
                              className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                                entry.status === 'completed'
                                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                  : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                              }`}
                            >
                              {entry.status === 'completed' ? 'Completed' : 'Auto Submitted'}
                            </span>
                          </td>
                        </tr>
                      ))}

                      {/* Missed Participants */}
                      {dailyData.missed && dailyData.missed.length > 0 && (
                        <>
                          <tr className="bg-neutral-950/60">
                            <td colSpan={6} className="py-2.5 px-6 text-xs font-mono uppercase tracking-wider text-neutral-500">
                              Did Not Attempt (Missed)
                            </td>
                          </tr>
                          {dailyData.missed.map((m) => (
                            <tr key={m.user_id} className="opacity-50 hover:opacity-80 transition">
                              <td className="py-3 px-6 font-mono text-neutral-500">—</td>
                              <td className="py-3 px-4 text-neutral-400">{m.full_name}</td>
                              <td className="py-3 px-4 text-neutral-600 hidden sm:table-cell">—</td>
                              <td className="py-3 px-4 text-neutral-600 hidden sm:table-cell">—</td>
                              <td className="py-3 px-4 text-neutral-600">—</td>
                              <td className="py-3 px-4 hidden md:table-cell">
                                <span className="text-xs px-2 py-0.5 rounded-full bg-neutral-800 text-neutral-500">
                                  Missed
                                </span>
                              </td>
                            </tr>
                          ))}
                        </>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        ) : (
          // OVERALL LEADERBOARD
          <div className="space-y-6">
            {!overallData || overallData.overall_leaderboard.length === 0 ? (
              <div className="rounded-3xl border border-neutral-800 bg-neutral-900/40 p-12 text-center space-y-3">
                <Trophy className="w-10 h-10 text-neutral-600 mx-auto" />
                <h3 className="text-lg font-semibold text-white">No cumulative records yet</h3>
                <p className="text-sm text-neutral-400">
                  Overall standings update as daily speed quizzes are completed.
                </p>
              </div>
            ) : (
              <div className="rounded-3xl border border-neutral-800 bg-neutral-900/40 overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-neutral-950/80 border-b border-neutral-800 text-xs font-mono uppercase tracking-wider text-neutral-400">
                      <tr>
                        <th className="py-3.5 px-4 sm:px-6">Rank</th>
                        <th className="py-3.5 px-4">Participant</th>
                        <th className="py-3.5 px-4">Quizzes Completed</th>
                        <th className="py-3.5 px-4 font-bold text-amber-300">Total Time</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-800/60 font-sans">
                      {overallData.overall_leaderboard.map((entry) => (
                        <tr
                          key={entry.user_id}
                          className={`hover:bg-white/[0.02] transition ${
                            entry.rank === 1 ? 'bg-amber-500/[0.04]' : ''
                          }`}
                        >
                          <td className="py-4 px-4 sm:px-6 font-mono font-semibold">
                            {entry.rank === 1 ? (
                              <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-amber-400 text-black font-bold text-xs shadow-md shadow-amber-400/20">
                                1
                              </span>
                            ) : entry.rank === 2 ? (
                              <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-slate-300 text-black font-bold text-xs">
                                2
                              </span>
                            ) : entry.rank === 3 ? (
                              <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-amber-700 text-white font-bold text-xs">
                                3
                              </span>
                            ) : (
                              <span className="text-neutral-400 pl-2">#{entry.rank}</span>
                            )}
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-neutral-800 border border-neutral-700 flex items-center justify-center text-xs font-semibold text-neutral-300">
                                {entry.full_name ? entry.full_name[0].toUpperCase() : 'U'}
                              </div>
                              <span className="font-medium text-white">{entry.full_name || 'Participant'}</span>
                            </div>
                          </td>
                          <td className="py-4 px-4 font-mono text-neutral-300">
                            {entry.completed_quizzes} {entry.completed_quizzes === 1 ? 'quiz' : 'quizzes'}
                          </td>
                          <td className="py-4 px-4 font-mono font-bold text-base text-amber-300">
                            {formatSeconds(entry.total_time_seconds)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
