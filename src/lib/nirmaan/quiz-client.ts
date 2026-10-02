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
  selectedAnswer: 'A' | 'B' | 'C' | 'D',
  timeTakenSeconds = 0,
  currentQuestionIndex = 0,
  questionTimes: Record<string, number> = {}
): Promise<SaveAnswerResponse> {
  const { data, error } = await supabase.rpc('save_answer', {
    p_attempt_id: attemptId,
    p_question_id: questionId,
    p_selected_answer: selectedAnswer,
    p_time_taken_seconds: timeTakenSeconds,
    p_current_question_index: currentQuestionIndex,
    p_question_times: questionTimes,
  });

  if (error) throw new Error(error.message);
  return data as SaveAnswerResponse;
}

export async function saveQuizProgress(
  attemptId: string,
  currentQuestionIndex: number,
  questionTimes: Record<string, number>
): Promise<void> {
  try {
    await supabase.rpc('save_quiz_progress', {
      p_attempt_id: attemptId,
      p_current_question_index: currentQuestionIndex,
      p_question_times: questionTimes,
    });
  } catch (err) {
    console.warn('Silent saveQuizProgress fallback:', err);
  }
}

export async function getUserAttemptForQuiz(quizId: string) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from('quiz_attempts')
    .select('id, status, current_question_index, question_times')
    .eq('quiz_id', quizId)
    .eq('user_id', user.id)
    .maybeSingle();

  if (error) return null;
  return data;
}

export async function submitQuiz(
  attemptId: string,
  finalQuestionTimes?: Record<string, number>
): Promise<AttemptReviewResponse> {
  const { data, error } = await supabase.rpc('submit_quiz', {
    p_attempt_id: attemptId,
    p_final_question_times: finalQuestionTimes || {},
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

export async function adminCreateQuiz(
  quizDate: string,
  title: string,
  startTime?: string,
  endTime?: string
): Promise<string> {
  const { data, error } = await supabase.rpc('admin_create_quiz', {
    p_quiz_date: quizDate,
    p_title: title,
    p_start_time: startTime || null,
    p_end_time: endTime || null,
  });

  if (error) throw new Error(error.message);
  return data as string;
}

export async function adminUpdateQuizSchedule(
  quizId: string,
  quizDate: string,
  startTime: string,
  endTime: string
): Promise<void> {
  const { error } = await supabase.rpc('admin_update_quiz_schedule', {
    p_quiz_id: quizId,
    p_quiz_date: quizDate,
    p_start_time: startTime,
    p_end_time: endTime,
  });

  if (error) throw new Error(error.message);
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

export async function adminDeactivateQuiz(quizId: string): Promise<void> {
  // 1. Try secure RPC if deployed
  const { error: rpcError } = await supabase.rpc('admin_deactivate_quiz', {
    p_quiz_id: quizId,
  });

  if (!rpcError) {
    return;
  }

  // 2. Direct Admin RLS update on quizzes table
  const { data: updated, error: updateError } = await supabase
    .from('quizzes')
    .update({
      status: 'closed',
      updated_at: new Date().toISOString(),
    })
    .eq('id', quizId)
    .eq('status', 'published')
    .select();

  if (updateError) {
    throw new Error(updateError.message);
  }

  if (!updated || updated.length === 0) {
    throw new Error('Quiz not found or not in published state.');
  }

  // 3. Log admin activity
  try {
    const { data: userData } = await supabase.auth.getUser();
    if (userData?.user?.id) {
      await supabase.from('admin_activity').insert({
        admin_id: userData.user.id,
        action: 'DEACTIVATE_QUIZ',
        target_type: 'quiz',
        target_id: quizId,
        metadata: { deactivated_at: new Date().toISOString() },
      });
    }
  } catch (logErr) {
    console.warn('Failed to log admin activity:', logErr);
  }
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
