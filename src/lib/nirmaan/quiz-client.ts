import { supabase } from './supabase';
import type {
  StartQuizResponse,
  SaveAnswerResponse,
  AttemptReviewResponse,
  DailyLeaderboardResponse,
  OverallLeaderboardResponse,
  QuizHistoryResponse,
  Quiz,
  Question,
} from './types';

// ============================================================================
// PARTICIPANT RPC CALLS
// ============================================================================

export async function getTodayQuiz(): Promise<Quiz | null> {
  // Get date in YYYY-MM-DD for IST (UTC+5:30)
  const now = new Date();
  const istOffset = 5.5 * 60 * 60 * 1000;
  const istDate = new Date(now.getTime() + istOffset);
  const dateStr = istDate.toISOString().split('T')[0];

  const { data, error } = await supabase
    .from('quizzes')
    .select('*')
    .eq('quiz_date', dateStr)
    .maybeSingle();

  if (error) {
    console.error('Error fetching today quiz:', error);
    return null;
  }
  return data as Quiz | null;
}

export async function startQuiz(quizId: string): Promise<StartQuizResponse> {
  const { data, error } = await supabase.rpc('start_quiz', {
    p_quiz_id: quizId,
  });

  if (error) throw new Error(error.message);
  return data as StartQuizResponse;
}

export async function saveAnswer(
  attemptId: string,
  questionId: string,
  selectedAnswer: 'A' | 'B' | 'C' | 'D'
): Promise<SaveAnswerResponse> {
  const { data, error } = await supabase.rpc('save_answer', {
    p_attempt_id: attemptId,
    p_question_id: questionId,
    p_selected_answer: selectedAnswer,
  });

  if (error) throw new Error(error.message);
  return data as SaveAnswerResponse;
}

export async function submitQuiz(attemptId: string): Promise<AttemptReviewResponse> {
  const { data, error } = await supabase.rpc('submit_quiz', {
    p_attempt_id: attemptId,
  });

  if (error) throw new Error(error.message);
  return data as AttemptReviewResponse;
}

export async function getAttemptReview(attemptId: string): Promise<AttemptReviewResponse> {
  const { data, error } = await supabase.rpc('get_attempt_review', {
    p_attempt_id: attemptId,
  });

  if (error) throw new Error(error.message);
  return data as AttemptReviewResponse;
}

export async function getDailyLeaderboard(quizId: string): Promise<DailyLeaderboardResponse> {
  const { data, error } = await supabase.rpc('get_daily_leaderboard', {
    p_quiz_id: quizId,
  });

  if (error) throw new Error(error.message);
  return data as DailyLeaderboardResponse;
}

export async function getOverallLeaderboard(): Promise<OverallLeaderboardResponse> {
  const { data, error } = await supabase.rpc('get_overall_leaderboard');

  if (error) throw new Error(error.message);
  return data as OverallLeaderboardResponse;
}

export async function getUserQuizHistory(): Promise<QuizHistoryResponse> {
  const { data, error } = await supabase.rpc('get_user_quiz_history');

  if (error) throw new Error(error.message);
  return data as QuizHistoryResponse;
}

// ============================================================================
// ADMIN RPC & MANAGEMENT CALLS
// ============================================================================

export async function adminCreateQuestion(payload: {
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_answer: 'A' | 'B' | 'C' | 'D';
  explanation?: string;
}): Promise<string> {
  const { data, error } = await supabase.rpc('admin_create_question', {
    p_question_text: payload.question_text,
    p_option_a: payload.option_a,
    p_option_b: payload.option_b,
    p_option_c: payload.option_c,
    p_option_d: payload.option_d,
    p_correct_answer: payload.correct_answer,
    p_explanation: payload.explanation || null,
  });

  if (error) throw new Error(error.message);
  return data as string;
}

export async function adminCreateQuiz(quizDate: string, title: string): Promise<string> {
  const { data, error } = await supabase.rpc('admin_create_quiz', {
    p_quiz_date: quizDate,
    p_title: title,
  });

  if (error) throw new Error(error.message);
  return data as string;
}

export async function adminAssignQuestions(quizId: string, questionIds: string[]): Promise<void> {
  const { error } = await supabase.rpc('admin_assign_quiz_questions', {
    p_quiz_id: quizId,
    p_question_ids: questionIds,
  });

  if (error) throw new Error(error.message);
}

export async function adminPublishQuiz(quizId: string): Promise<void> {
  const { error } = await supabase.rpc('admin_publish_quiz', {
    p_quiz_id: quizId,
  });

  if (error) throw new Error(error.message);
}

export async function adminGetAllQuestions(): Promise<Question[]> {
  const { data, error } = await supabase
    .from('questions')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return (data || []) as Question[];
}

export async function adminGetAllQuizzes(): Promise<Quiz[]> {
  const { data, error } = await supabase
    .from('quizzes')
    .select('*')
    .order('quiz_date', { ascending: false });

  if (error) throw new Error(error.message);
  return (data || []) as Quiz[];
}
