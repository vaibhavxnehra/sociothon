export type UserRole = 'user' | 'admin';

export interface Profile {
  id: string;
  full_name: string;
  email: string;
  avatar_url?: string | null;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface Question {
  id: string;
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_answer?: 'A' | 'B' | 'C' | 'D';
  explanation?: string | null;
  created_by?: string;
  is_active: boolean;
  used_at?: string | null;
  created_at: string;
}

export type QuizStatus = 'draft' | 'published' | 'closed' | 'cancelled';

export interface Quiz {
  id: string;
  quiz_date: string;
  title: string;
  start_time: string;
  end_time: string;
  duration_seconds: number;
  status: QuizStatus;
  created_by?: string;
  published_at?: string | null;
  created_at: string;
}

export type AttemptStatus = 'active' | 'completed' | 'auto_submitted';

export interface AttemptQuestionItem {
  id: string;
  display_order: number;
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
}

export interface StartQuizResponse {
  attempt_id: string;
  quiz_id: string;
  title: string;
  started_at: string;
  effective_end_time: string;
  duration_seconds: number;
  questions: AttemptQuestionItem[];
}

export interface SaveAnswerResponse {
  success: boolean;
  question_id: string;
  selected_answer: 'A' | 'B' | 'C' | 'D';
  saved_at: string;
}

export interface QuestionReviewItem {
  display_order: number;
  question_text: string;
  selected_answer: string | null;
  correct_answer: string;
  is_correct: boolean;
  explanation?: string | null;
}

export interface AttemptReviewResponse {
  quiz_id: string;
  title: string;
  quiz_date: string;
  attempt_id: string;
  status: AttemptStatus;
  started_at: string;
  submitted_at: string;
  actual_time_seconds: number;
  correct_count: number;
  wrong_count: number;
  penalty_seconds: number;
  final_time_seconds: number;
  questions_review: QuestionReviewItem[];
}

export interface DailyLeaderboardItem {
  rank: number | null;
  user_id: string;
  full_name: string;
  avatar_url?: string | null;
  status: 'completed' | 'auto_submitted' | 'missed';
  actual_time_seconds?: number | null;
  wrong_count?: number | null;
  penalty_seconds?: number | null;
  final_time_seconds?: number | null;
  submitted_at?: string | null;
}

export interface DailyLeaderboardResponse {
  quiz_id: string;
  title: string;
  quiz_date: string;
  is_closed: boolean;
  ranked: DailyLeaderboardItem[];
  missed: DailyLeaderboardItem[];
}

export interface OverallLeaderboardItem {
  rank: number;
  user_id: string;
  full_name: string;
  avatar_url?: string | null;
  completed_quizzes: number;
  total_time_seconds: number;
  latest_submitted_at: string;
}

export interface OverallLeaderboardResponse {
  overall_leaderboard: OverallLeaderboardItem[];
}

export interface QuizHistoryItem {
  quiz_id: string;
  title: string;
  quiz_date: string;
  start_time: string;
  end_time: string;
  status: 'completed' | 'auto_submitted' | 'missed' | 'active' | 'not_started';
  attempt_id?: string | null;
  final_time_seconds?: number | null;
  submitted_at?: string | null;
}

export interface QuizHistoryResponse {
  history: QuizHistoryItem[];
}
