import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import {
  ArrowRight,
  BarChart2,
  BookOpen,
  Calendar,
  Clock,
  Trophy,
  User,
} from 'lucide-react';
import { useAuth } from '../../lib/nirmaan/auth';
import { getTodayQuiz } from '../../lib/nirmaan/quiz-client';
import type { Quiz } from '../../lib/nirmaan/types';
import { StudyRoomStage } from '../../components/nirmaan/StudyRoomStage';
import '../../styles/quiz.css';

export const Route = createFileRoute('/nirmaan/')({
  component: NirmaanHub,
});

function NirmaanHub() {
  const navigate = useNavigate();
  const { user, profile, isAdmin, signOut } = useAuth();
  const [todayQuiz, setTodayQuiz] = useState<Quiz | null>(null);
  const [timeState, setTimeState] = useState<'upcoming' | 'live' | 'closed'>('upcoming');
  const [countdownText, setCountdownText] = useState<string>('');

  useEffect(() => {
    getTodayQuiz().then(setTodayQuiz).catch(console.error);
  }, []);

  // IST Time Status Calculation
  useEffect(() => {
    const updateStatus = () => {
      const now = new Date();

      if (!todayQuiz) {
        // Default window: 7:00 PM to 10:00 PM IST
        const istNow = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
        const currentHour = istNow.getHours();

        if (currentHour < 19) {
          setTimeState('upcoming');
          const target = new Date(istNow);
          target.setHours(19, 0, 0, 0);
          const diff = Math.max(0, target.getTime() - istNow.getTime());
          const h = Math.floor(diff / (1000 * 60 * 60));
          const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
          setCountdownText(`Starts in ${h}h ${m}m`);
        } else if (currentHour >= 19 && currentHour < 22) {
          setTimeState('live');
          const target = new Date(istNow);
          target.setHours(22, 0, 0, 0);
          const diff = Math.max(0, target.getTime() - istNow.getTime());
          const h = Math.floor(diff / (1000 * 60 * 60));
          const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
          setCountdownText(`Ends in ${h}h ${m}m`);
        } else {
          setTimeState('closed');
          setCountdownText('Closed for today');
        }
        return;
      }

      const start = new Date(todayQuiz.start_time).getTime();
      const end = new Date(todayQuiz.end_time).getTime();
      const current = now.getTime();

      if (current < start) {
        setTimeState('upcoming');
        const diff = Math.max(0, start - current);
        const h = Math.floor(diff / (1000 * 60 * 60));
        const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        setCountdownText(`Starts in ${h}h ${m}m`);
      } else if (current >= start && current < end) {
        setTimeState('live');
        const diff = Math.max(0, end - current);
        const h = Math.floor(diff / (1000 * 60 * 60));
        const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        setCountdownText(`Ends in ${h}h ${m}m`);
      } else {
        setTimeState('closed');
        setCountdownText('Quiz closed');
      }
    };

    updateStatus();
    const interval = setInterval(updateStatus, 30000);
    return () => clearInterval(interval);
  }, [todayQuiz]);

  const handleStartQuizClick = () => {
    if (!user) {
      navigate({ to: '/nirmaan/login' });
      return;
    }
    navigate({ to: '/nirmaan/quiz' });
  };

  return (
    <StudyRoomStage showDesk={true}>
      {/* 1. TOP NAVBAR */}
      <header className="w-full px-6 md:px-12 lg:px-16 py-6 flex items-center justify-between">
        {/* Brand */}
        <Link to="/nirmaan" className="flex flex-col group">
          <div className="font-nirmaan-brand tracking-[0.24em] text-lg sm:text-xl text-[#F4EFEA] font-medium uppercase transition-colors">
            NIRMAAN <span className="font-light text-[#D8CFBF] ml-1">2026</span>
          </div>
          <div className="text-[9px] uppercase tracking-[0.38em] text-[#C5B8A5]/90 font-mono -mt-0.5">
            DAILY QUIZ
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-9 text-sm">
          <Link
            to="/nirmaan"
            className="text-[#F4EFEA] pb-1 border-b-2 border-[#E3D9CC] font-medium transition-colors"
          >
            Home
          </Link>
          <Link
            to="/nirmaan/leaderboard"
            className="text-[#C4B8A6] hover:text-[#F4EFEA] pb-1 transition-colors"
          >
            Leaderboard
          </Link>
          <Link
            to="/nirmaan/history"
            className="text-[#C4B8A6] hover:text-[#F4EFEA] pb-1 transition-colors"
          >
            History
          </Link>
          {isAdmin && (
            <Link
              to="/nirmaan/admin"
              className="text-[#C4B8A6] hover:text-[#F4EFEA] pb-1 transition-colors"
            >
              Admin
            </Link>
          )}
        </nav>

        {/* Right User Badge / Auth */}
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/15 bg-black/40 backdrop-blur-md text-xs font-medium text-[#EAE2D7]">
                <User className="w-3.5 h-3.5 text-[#C5B8A5]" />
                <span>
                  {profile?.full_name || user.email?.split('@')[0]}
                  {isAdmin ? ' (Admin)' : ''}
                </span>
              </div>
              <button
                onClick={() => signOut()}
                className="text-xs text-[#A89E8F] hover:text-white transition-colors ml-2"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/nirmaan/login"
              className="px-5 py-1.5 rounded-full border border-white/20 bg-white/5 hover:bg-white/10 text-xs font-medium text-[#EAE2D7] transition-all"
            >
              Sign In
            </Link>
          )}
        </div>
      </header>

      {/* 2. MAIN HERO SECTION */}
      <main className="flex-1 flex flex-col justify-center px-6 md:px-14 lg:px-20 max-w-7xl mx-auto w-full py-8 md:py-12">
        <div className="max-w-xl">
          {/* Small tracking kicker */}
          <div className="text-xs uppercase tracking-[0.28em] text-[#C5B8A5] font-semibold mb-3">
            A DAILY TEST OF CURIOSITY
          </div>

          {/* Large Editorial Headline */}
          <h1 className="font-nirmaan-title text-5xl sm:text-6xl md:text-7xl lg:text-[76px] font-bold text-[#F5EFE6] leading-[1.04] tracking-tight">
            THREE<br />
            QUESTIONS<br />
            EVERY DAY
          </h1>

          {/* Subtitle */}
          <p className="font-nirmaan-title text-lg sm:text-xl text-[#E8DEC8] font-normal mt-3.5 tracking-wide">
            Think. Decide. Be the Fastest.
          </p>

          {/* Paragraph */}
          <p className="text-sm sm:text-base text-[#B3A694] leading-relaxed mt-3 font-normal">
            A daily 3-question quiz by NIRMAAN 2026. Test your knowledge, sharpen your speed and climb the leaderboard. Every day brings a new challenge.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-4 mt-7">
            <button
              onClick={handleStartQuizClick}
              className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-[#E5DBCF] hover:bg-[#F2ECE3] text-[#1E1B18] font-semibold text-sm transition-all duration-200 shadow-lg shadow-black/40 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              <span>Start Quiz</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <Link
              to="/nirmaan/leaderboard"
              className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full border border-white/20 bg-black/40 hover:bg-white/10 hover:border-white/30 backdrop-blur-md text-[#E8E0D5] font-medium text-sm transition-all duration-200"
            >
              <BarChart2 className="w-4 h-4 text-[#D5C7B3]" />
              <span>View Leaderboard</span>
            </Link>
          </div>

          {/* Daily Challenge Window tag */}
          <div className="flex items-center gap-2 text-xs text-[#9E907E] mt-5">
            <Calendar className="w-4 h-4 text-[#C5B8A5]" />
            <span>Daily Challenge Window: 7:00 PM – 10:00 PM IST</span>
            {countdownText && (
              <span className="ml-2 px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-[#D8CEBF] text-[11px] font-mono">
                {countdownText}
              </span>
            )}
          </div>
        </div>
      </main>

      {/* 3. BOTTOM FEATURE CARDS */}
      <footer className="w-full px-6 md:px-14 lg:px-20 max-w-7xl mx-auto pb-10 md:pb-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Card 1 */}
          <div className="rounded-2xl p-5 md:p-6 bg-[#13110F]/85 backdrop-blur-xl border border-white/10 hover:border-[#C5B8A5]/30 transition-all flex items-start gap-4 shadow-xl">
            <div className="w-12 h-12 rounded-full border border-white/15 bg-white/5 flex items-center justify-center text-[#E0D5C3] shrink-0">
              <BookOpen className="w-5 h-5 text-[#E0D5C3]" />
            </div>
            <div>
              <h3 className="font-nirmaan-title text-[#F2ECE1] font-semibold text-base">
                3 Questions Daily
              </h3>
              <p className="text-xs text-[#9E907E] leading-relaxed mt-1.5">
                Exactly 3 multiple choice questions with 4 options each. Questions and options are randomized for everyone.
              </p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="rounded-2xl p-5 md:p-6 bg-[#13110F]/85 backdrop-blur-xl border border-white/10 hover:border-[#C5B8A5]/30 transition-all flex items-start gap-4 shadow-xl">
            <div className="w-12 h-12 rounded-full border border-white/15 bg-white/5 flex items-center justify-center text-[#E0D5C3] shrink-0">
              <Clock className="w-5 h-5 text-[#E0D5C3]" />
            </div>
            <div>
              <h3 className="font-nirmaan-title text-[#F2ECE1] font-semibold text-base">
                10-Minute Challenge
              </h3>
              <p className="text-xs text-[#9E907E] leading-relaxed mt-1.5">
                You have 600 seconds from the moment you begin. Start after 9:50 PM and your timer ends at 10:00 PM IST.
              </p>
            </div>
          </div>

          {/* Card 3 */}
          <div className="rounded-2xl p-5 md:p-6 bg-[#13110F]/85 backdrop-blur-xl border border-white/10 hover:border-[#C5B8A5]/30 transition-all flex items-start gap-4 shadow-xl">
            <div className="w-12 h-12 rounded-full border border-white/15 bg-white/5 flex items-center justify-center text-[#E0D5C3] shrink-0">
              <Trophy className="w-5 h-5 text-[#E0D5C3]" />
            </div>
            <div>
              <h3 className="font-nirmaan-title text-[#F2ECE1] font-semibold text-base">
                5-Second Penalty
              </h3>
              <p className="text-xs text-[#9E907E] leading-relaxed mt-1.5">
                Final time = Actual time + (Wrong Answers × 5 seconds). More correct answers and lower time rank higher!
              </p>
            </div>
          </div>
        </div>
      </footer>
    </StudyRoomStage>
  );
}
