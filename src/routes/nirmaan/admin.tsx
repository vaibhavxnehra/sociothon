import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import React, { useEffect, useState, useCallback } from 'react';
import {
  Shield,
  PlusCircle,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Home,
  Loader2,
  FileQuestion,
  Send,
  Layers,
} from 'lucide-react';
import { useAuth } from '../../lib/nirmaan/auth';
import {
  adminCreateQuestion,
  adminCreateQuiz,
  adminAssignQuestions,
  adminPublishQuiz,
  adminGetAllQuestions,
  adminGetAllQuizzes,
} from '../../lib/nirmaan/quiz-client';
import type { Question, Quiz } from '../../lib/nirmaan/types';

export const Route = createFileRoute('/nirmaan/admin')({
  component: NirmaanAdminPage,
});

function NirmaanAdminPage() {
  const navigate = useNavigate();
  const { user, isAdmin, loading: authLoading } = useAuth();

  const [activeTab, setActiveTab] = useState<'create-question' | 'create-quiz' | 'quizzes'>('create-question');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // New Question Form state
  const [qText, setQText] = useState('');
  const [optA, setOptA] = useState('');
  const [optB, setOptB] = useState('');
  const [optC, setOptC] = useState('');
  const [optD, setOptD] = useState('');
  const [correctOpt, setCorrectOpt] = useState<'A' | 'B' | 'C' | 'D'>('A');
  const [explanation, setExplanation] = useState('');

  // New Quiz Form state
  const [quizDate, setQuizDate] = useState(() => {
    const now = new Date();
    const ist = new Date(now.getTime() + 5.5 * 3600 * 1000);
    return ist.toISOString().split('T')[0];
  });
  const [quizTitle, setQuizTitle] = useState('Daily Speed Quiz');
  const [selectedQuizId, setSelectedQuizId] = useState<string>('');
  const [selectedQIds, setSelectedQIds] = useState<string[]>([]);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [qs, qzs] = await Promise.all([adminGetAllQuestions(), adminGetAllQuizzes()]);
      setQuestions(qs);
      setQuizzes(qzs);
      if (qzs.length > 0 && !selectedQuizId) {
        setSelectedQuizId(qzs[0].id);
      }
    } catch (err: unknown) {
      console.error(err);
      setStatusMsg({ type: 'error', text: 'Failed to load admin data.' });
    } finally {
      setLoading(false);
    }
  }, [selectedQuizId]);

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        navigate({ to: '/nirmaan/login' });
      } else if (!isAdmin) {
        setStatusMsg({ type: 'error', text: 'Unauthorized: Admin role required.' });
      } else {
        loadData();
      }
    }
  }, [user, isAdmin, authLoading, navigate, loadData]);

  // Handle Question Creation
  const handleCreateQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);
    setStatusMsg(null);

    try {
      await adminCreateQuestion({
        question_text: qText.trim(),
        option_a: optA.trim(),
        option_b: optB.trim(),
        option_c: optC.trim(),
        option_d: optD.trim(),
        correct_answer: correctOpt,
        explanation: explanation.trim() || undefined,
      });

      setStatusMsg({ type: 'success', text: 'Question created successfully!' });
      // Reset form
      setQText('');
      setOptA('');
      setOptB('');
      setOptC('');
      setOptD('');
      setExplanation('');
      await loadData();
    } catch (err: unknown) {
      setStatusMsg({ type: 'error', text: err instanceof Error ? err.message : 'Failed to create question.' });
    } finally {
      setActionLoading(false);
    }
  };

  // Handle Quiz Creation
  const handleCreateQuiz = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);
    setStatusMsg(null);

    try {
      const newId = await adminCreateQuiz(quizDate, quizTitle.trim());
      setStatusMsg({ type: 'success', text: `Quiz created for ${quizDate} (7:00 PM – 10:00 PM IST)!` });
      setSelectedQuizId(newId);
      await loadData();
      setActiveTab('create-quiz');
    } catch (err: unknown) {
      setStatusMsg({ type: 'error', text: err instanceof Error ? err.message : 'Failed to create quiz.' });
    } finally {
      setActionLoading(false);
    }
  };

  // Handle Assigning 3 Questions
  const handleAssignQuestions = async () => {
    if (!selectedQuizId) return;
    if (selectedQIds.length !== 3) {
      setStatusMsg({ type: 'error', text: 'You must select exactly 3 unused questions.' });
      return;
    }

    setActionLoading(true);
    setStatusMsg(null);

    try {
      await adminAssignQuestions(selectedQuizId, selectedQIds);
      setStatusMsg({ type: 'success', text: '3 questions assigned successfully!' });
      await loadData();
    } catch (err: unknown) {
      setStatusMsg({ type: 'error', text: err instanceof Error ? err.message : 'Failed to assign questions.' });
    } finally {
      setActionLoading(false);
    }
  };

  // Handle Publishing Quiz
  const handlePublishQuiz = async (quizId: string) => {
    if (!confirm('Are you sure you want to publish this quiz? The 3 questions will be permanently locked.')) {
      return;
    }

    setActionLoading(true);
    setStatusMsg(null);

    try {
      await adminPublishQuiz(quizId);
      setStatusMsg({ type: 'success', text: 'Quiz published successfully!' });
      await loadData();
    } catch (err: unknown) {
      setStatusMsg({ type: 'error', text: err instanceof Error ? err.message : 'Failed to publish quiz.' });
    } finally {
      setActionLoading(false);
    }
  };

  if (authLoading || (loading && isAdmin)) {
    return (
      <div className="min-h-screen bg-neutral-950 text-white flex items-center justify-center">
        <div className="text-center space-y-3">
          <Loader2 className="w-8 h-8 text-purple-400 animate-spin mx-auto" />
          <p className="text-xs font-mono text-neutral-400 uppercase tracking-widest">Loading Admin Center...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-neutral-950 text-white flex items-center justify-center p-4">
        <div className="max-w-md w-full rounded-3xl border border-red-500/20 bg-neutral-900 p-8 text-center space-y-4">
          <Shield className="w-10 h-10 text-red-400 mx-auto" />
          <h2 className="text-xl font-bold text-white">Access Denied</h2>
          <p className="text-sm text-neutral-400">
            This section is restricted to administrators. Contact the system owner if you believe this is an error.
          </p>
          <Link
            to="/nirmaan"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-black font-semibold text-sm hover:bg-neutral-200 transition"
          >
            <Home className="w-4 h-4" />
            <span>Return to Hub</span>
          </Link>
        </div>
      </div>
    );
  }

  const unusedQuestions = questions.filter((q) => !q.used_at && q.is_active);

  return (
    <div className="min-h-screen bg-neutral-950 text-white selection:bg-white/20 pb-20">
      {/* Header */}
      <header className="border-b border-neutral-800 bg-neutral-900/50 backdrop-blur sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center justify-center">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs uppercase tracking-wider text-purple-400 font-mono">ADMIN PANEL</span>
              <h1 className="text-base font-semibold text-white tracking-tight">Quiz Management Center</h1>
            </div>
          </div>

          <Link
            to="/nirmaan"
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm text-neutral-300 hover:text-white hover:bg-neutral-800 transition"
          >
            <Home className="w-4 h-4" />
            <span>Hub</span>
          </Link>
        </div>
      </header>

      {/* Main Admin Body */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* Status Message */}
        {statusMsg && (
          <div
            className={`p-4 rounded-2xl border text-sm flex items-center gap-3 ${
              statusMsg.type === 'success'
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                : 'bg-red-500/10 border-red-500/30 text-red-300'
            }`}
          >
            {statusMsg.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
            <span>{statusMsg.text}</span>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-neutral-800 pb-3 overflow-x-auto">
          <button
            onClick={() => setActiveTab('create-question')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition whitespace-nowrap ${
              activeTab === 'create-question'
                ? 'bg-neutral-800 text-white shadow'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <PlusCircle className="w-4 h-4 text-purple-400" />
            <span>Add Question to Bank</span>
          </button>

          <button
            onClick={() => setActiveTab('create-quiz')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition whitespace-nowrap ${
              activeTab === 'create-quiz'
                ? 'bg-neutral-800 text-white shadow'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Calendar className="w-4 h-4 text-amber-400" />
            <span>Schedule & Assign Quiz</span>
          </button>

          <button
            onClick={() => setActiveTab('quizzes')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition whitespace-nowrap ${
              activeTab === 'quizzes'
                ? 'bg-neutral-800 text-white shadow'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Layers className="w-4 h-4 text-sky-400" />
            <span>All Quizzes ({quizzes.length})</span>
          </button>
        </div>

        {/* TAB 1: ADD QUESTION */}
        {activeTab === 'create-question' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 rounded-3xl border border-neutral-800 bg-neutral-900/40 p-6 sm:p-8 space-y-6">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <FileQuestion className="w-5 h-5 text-purple-400" />
                <span>Create New MCQ Question</span>
              </h2>

              <form onSubmit={handleCreateQuestion} className="space-y-4">
                <div>
                  <label className="block text-xs font-mono text-neutral-300 mb-1.5">Question Text</label>
                  <textarea
                    required
                    rows={3}
                    value={qText}
                    onChange={(e) => setQText(e.target.value)}
                    placeholder="Enter the question prompt..."
                    className="w-full px-4 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-sm focus:outline-none focus:border-purple-400 transition placeholder:text-neutral-600"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-neutral-300 mb-1">Option A</label>
                    <input
                      type="text"
                      required
                      value={optA}
                      onChange={(e) => setOptA(e.target.value)}
                      placeholder="Choice A"
                      className="w-full px-4 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-sm focus:outline-none focus:border-purple-400 transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-neutral-300 mb-1">Option B</label>
                    <input
                      type="text"
                      required
                      value={optB}
                      onChange={(e) => setOptB(e.target.value)}
                      placeholder="Choice B"
                      className="w-full px-4 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-sm focus:outline-none focus:border-purple-400 transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-neutral-300 mb-1">Option C</label>
                    <input
                      type="text"
                      required
                      value={optC}
                      onChange={(e) => setOptC(e.target.value)}
                      placeholder="Choice C"
                      className="w-full px-4 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-sm focus:outline-none focus:border-purple-400 transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-neutral-300 mb-1">Option D</label>
                    <input
                      type="text"
                      required
                      value={optD}
                      onChange={(e) => setOptD(e.target.value)}
                      placeholder="Choice D"
                      className="w-full px-4 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-sm focus:outline-none focus:border-purple-400 transition"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-neutral-300 mb-1">Correct Answer</label>
                    <select
                      value={correctOpt}
                      onChange={(e) => setCorrectOpt(e.target.value as 'A' | 'B' | 'C' | 'D')}
                      className="w-full px-4 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-sm focus:outline-none focus:border-purple-400 transition"
                    >
                      <option value="A">Option A</option>
                      <option value="B">Option B</option>
                      <option value="C">Option C</option>
                      <option value="D">Option D</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-neutral-300 mb-1">Explanation (Optional)</label>
                    <input
                      type="text"
                      value={explanation}
                      onChange={(e) => setExplanation(e.target.value)}
                      placeholder="Why this answer is correct"
                      className="w-full px-4 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-sm focus:outline-none focus:border-purple-400 transition"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={actionLoading}
                  className="py-3 px-6 rounded-xl bg-purple-500 text-white font-semibold text-sm hover:bg-purple-600 transition flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>{actionLoading ? 'Saving...' : 'Add Question to Bank'}</span>
                </button>
              </form>
            </div>

            {/* Unused Questions Summary */}
            <div className="rounded-3xl border border-neutral-800 bg-neutral-900/40 p-6 space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider font-mono text-neutral-400">
                Unused Question Bank ({unusedQuestions.length})
              </h3>
              <p className="text-xs text-neutral-400">
                These questions have never been assigned to any published quiz and are ready to be used.
              </p>
              <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
                {unusedQuestions.map((q) => (
                  <div key={q.id} className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 text-xs space-y-1">
                    <div className="font-medium text-white line-clamp-2">{q.question_text}</div>
                    <div className="text-neutral-500 font-mono">Correct: Option {q.correct_answer}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: SCHEDULE & ASSIGN QUIZ */}
        {activeTab === 'create-quiz' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Step 1: Create Quiz Form */}
            <div className="rounded-3xl border border-neutral-800 bg-neutral-900/40 p-6 sm:p-8 space-y-5">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Calendar className="w-5 h-5 text-amber-400" />
                <span>Step 1: Schedule Daily Quiz</span>
              </h2>

              <form onSubmit={handleCreateQuiz} className="space-y-4">
                <div>
                  <label className="block text-xs font-mono text-neutral-300 mb-1">Quiz Date (IST)</label>
                  <input
                    type="date"
                    required
                    value={quizDate}
                    onChange={(e) => setQuizDate(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-sm focus:outline-none focus:border-amber-400 transition"
                  />
                  <span className="text-xs text-neutral-500 block mt-1">
                    Start: 7:00 PM IST | End: 10:00 PM IST (Automatic)
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-mono text-neutral-300 mb-1">Quiz Title</label>
                  <input
                    type="text"
                    required
                    value={quizTitle}
                    onChange={(e) => setQuizTitle(e.target.value)}
                    placeholder="e.g. Daily Speed Quiz Day 1"
                    className="w-full px-4 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-sm focus:outline-none focus:border-amber-400 transition"
                  />
                </div>

                <button
                  type="submit"
                  disabled={actionLoading}
                  className="w-full py-3 rounded-xl bg-amber-500 text-black font-semibold text-sm hover:bg-amber-400 transition disabled:opacity-50"
                >
                  {actionLoading ? 'Creating...' : 'Create Draft Quiz'}
                </button>
              </form>
            </div>

            {/* Step 2: Assign Exactly 3 Questions */}
            <div className="rounded-3xl border border-neutral-800 bg-neutral-900/40 p-6 sm:p-8 space-y-5">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Send className="w-5 h-5 text-purple-400" />
                <span>Step 2: Assign 3 Questions & Publish</span>
              </h2>

              <div className="space-y-3">
                <label className="block text-xs font-mono text-neutral-300">Target Draft Quiz</label>
                <select
                  value={selectedQuizId}
                  onChange={(e) => setSelectedQuizId(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-sm focus:outline-none focus:border-purple-400 transition"
                >
                  {quizzes.filter((q) => q.status === 'draft').map((q) => (
                    <option key={q.id} value={q.id}>
                      {q.quiz_date} — {q.title} ({q.status})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono text-neutral-300 mb-2">
                  Select Exactly 3 Unused Questions ({selectedQIds.length}/3 selected)
                </label>

                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                  {unusedQuestions.map((q) => {
                    const isSelected = selectedQIds.includes(q.id);
                    return (
                      <div
                        key={q.id}
                        onClick={() => {
                          if (isSelected) {
                            setSelectedQIds((prev) => prev.filter((id) => id !== q.id));
                          } else {
                            if (selectedQIds.length < 3) {
                              setSelectedQIds((prev) => [...prev, q.id]);
                            }
                          }
                        }}
                        className={`p-3 rounded-xl border text-xs cursor-pointer transition flex items-center justify-between ${
                          isSelected
                            ? 'bg-purple-500/20 border-purple-500/50 text-white'
                            : 'bg-neutral-950 border-neutral-800 text-neutral-300 hover:border-neutral-700'
                        }`}
                      >
                        <span className="line-clamp-1 pr-2">{q.question_text}</span>
                        <span
                          className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                            isSelected ? 'bg-purple-500 border-purple-500 text-white' : 'border-neutral-600'
                          }`}
                        >
                          {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  disabled={actionLoading || selectedQIds.length !== 3 || !selectedQuizId}
                  onClick={handleAssignQuestions}
                  className="flex-1 py-2.5 rounded-xl bg-neutral-800 text-white font-medium text-xs hover:bg-neutral-700 transition disabled:opacity-40"
                >
                  Assign 3 Questions
                </button>

                <button
                  type="button"
                  disabled={actionLoading || !selectedQuizId}
                  onClick={() => handlePublishQuiz(selectedQuizId)}
                  className="flex-1 py-2.5 rounded-xl bg-emerald-500 text-black font-semibold text-xs hover:bg-emerald-400 transition disabled:opacity-40"
                >
                  Publish Quiz
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: ALL QUIZZES */}
        {activeTab === 'quizzes' && (
          <div className="rounded-3xl border border-neutral-800 bg-neutral-900/40 overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-neutral-950/80 border-b border-neutral-800 text-xs font-mono uppercase tracking-wider text-neutral-400">
                  <tr>
                    <th className="py-3.5 px-4 sm:px-6">Date</th>
                    <th className="py-3.5 px-4">Title</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4">Window (IST)</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800/60 font-sans">
                  {quizzes.map((q) => (
                    <tr key={q.id} className="hover:bg-white/[0.02] transition">
                      <td className="py-4 px-4 sm:px-6 font-mono text-white font-medium">{q.quiz_date}</td>
                      <td className="py-4 px-4 text-neutral-200">{q.title}</td>
                      <td className="py-4 px-4">
                        <span
                          className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                            q.status === 'published'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : q.status === 'draft'
                              ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                              : 'bg-neutral-800 text-neutral-400 border border-neutral-700'
                          }`}
                        >
                          {q.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-xs font-mono text-neutral-400">7:00 PM – 10:00 PM</td>
                      <td className="py-4 px-4 text-right">
                        {q.status === 'draft' && (
                          <button
                            onClick={() => handlePublishQuiz(q.id)}
                            className="px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold hover:bg-emerald-500/20 transition"
                          >
                            Publish
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
