-- ============================================================================
-- Migration: 20261002010000_quiz_skippable_timing_scheduling.sql
-- Description:
--   1. Support skippable questions & 0.5s penalty only on attempted wrong answers
--   2. Per-question time accumulation & progress persistence
--   3. Auto-resume existing active attempt (prevent duplicate attempts)
--   4. Admin date, start time, and end time scheduling (IST)
-- ============================================================================

-- 1. ALTER TABLES
ALTER TABLE public.quiz_attempts
    ALTER COLUMN actual_time_seconds TYPE NUMERIC(10,2),
    ALTER COLUMN penalty_seconds TYPE NUMERIC(10,2),
    ALTER COLUMN final_time_seconds TYPE NUMERIC(10,2);

ALTER TABLE public.quiz_attempts
    ADD COLUMN IF NOT EXISTS skipped_count INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN IF NOT EXISTS current_question_index INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN IF NOT EXISTS question_times JSONB NOT NULL DEFAULT '{}'::JSONB;

ALTER TABLE public.answers
    ADD COLUMN IF NOT EXISTS time_taken_seconds NUMERIC(10,2) NOT NULL DEFAULT 0;

-- 2. START QUIZ (With Auto-Resume & Progress Recovery)
CREATE OR REPLACE FUNCTION public.start_quiz(
    p_quiz_id UUID
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_user_id UUID := auth.uid();
    v_quiz RECORD;
    v_existing_attempt RECORD;
    v_attempt_id UUID;
    v_now TIMESTAMPTZ := now();
    v_effective_end_time TIMESTAMPTZ;
    v_q RECORD;
    v_aq RECORD;
    i INTEGER;
    v_display_order INTEGER := 1;
    v_shuffled_options JSONB;
    v_questions_output JSONB := '[]'::JSONB;
    v_saved_answers JSONB := '{}'::JSONB;
    v_option_keys TEXT[] := ARRAY['A', 'B', 'C', 'D'];
    v_permuted_keys TEXT[];
    v_q_item JSONB;
    v_opt_val TEXT;
    v_target_key TEXT;
    v_opts_map JSONB;
    v_ans RECORD;
BEGIN
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Not authenticated.';
    END IF;

    -- Verify quiz exists and is published
    SELECT * INTO v_quiz FROM public.quizzes WHERE id = p_quiz_id;
    IF v_quiz.id IS NULL THEN
        RAISE EXCEPTION 'Quiz not found.';
    END IF;

    IF v_quiz.status != 'published' THEN
        RAISE EXCEPTION 'Quiz is not available for attempts.';
    END IF;

    -- Check server time window
    IF v_now < v_quiz.start_time THEN
        RAISE EXCEPTION 'Quiz has not started yet. Starts at % IST.', 
            to_char(v_quiz.start_time AT TIME ZONE 'Asia/Kolkata', 'HH12:MI AM');
    END IF;

    IF v_now >= v_quiz.end_time THEN
        RAISE EXCEPTION 'Quiz has ended at % IST.', 
            to_char(v_quiz.end_time AT TIME ZONE 'Asia/Kolkata', 'HH12:MI AM');
    END IF;

    -- Check if user already has an attempt
    SELECT * INTO v_existing_attempt 
    FROM public.quiz_attempts 
    WHERE quiz_id = p_quiz_id AND user_id = v_user_id;

    IF v_existing_attempt.id IS NOT NULL THEN
        -- If already completed or auto_submitted, do not allow restart
        IF v_existing_attempt.status IN ('completed', 'auto_submitted') THEN
            RETURN jsonb_build_object(
                'status', v_existing_attempt.status,
                'attempt_id', v_existing_attempt.id,
                'message', 'You have already completed this quiz.'
            );
        END IF;

        -- Active attempt exists: check if timer has expired
        v_effective_end_time := LEAST(
            v_existing_attempt.started_at + (v_quiz.duration_seconds || ' seconds')::INTERVAL, 
            v_quiz.end_time
        );

        IF v_now > v_effective_end_time THEN
            -- Expired: auto-submit and return completed state
            PERFORM public.submit_quiz(v_existing_attempt.id);
            RETURN jsonb_build_object(
                'status', 'auto_submitted',
                'attempt_id', v_existing_attempt.id,
                'message', 'Time limit expired. Quiz has been submitted.'
            );
        END IF;

        -- RESUME ACTIVE ATTEMPT
        -- Rebuild question presentation matching persisted attempt_questions
        FOR v_aq IN
            SELECT aq.question_id, aq.display_order, aq.option_order,
                   q.question_text, q.option_a, q.option_b, q.option_c, q.option_d
            FROM public.attempt_questions aq
            JOIN public.questions q ON q.id = aq.question_id
            WHERE aq.attempt_id = v_existing_attempt.id
            ORDER BY aq.display_order ASC
        LOOP
            v_opts_map := '{}'::JSONB;
            FOR i IN 1..4 LOOP
                v_target_key := CASE i
                    WHEN 1 THEN 'A'
                    WHEN 2 THEN 'B'
                    WHEN 3 THEN 'C'
                    WHEN 4 THEN 'D'
                END;

                v_opt_val := CASE v_aq.option_order->>(i - 1)
                    WHEN 'A' THEN v_aq.option_a
                    WHEN 'B' THEN v_aq.option_b
                    WHEN 'C' THEN v_aq.option_c
                    WHEN 'D' THEN v_aq.option_d
                END;

                v_opts_map := v_opts_map || jsonb_build_object('option_' || lower(v_target_key), v_opt_val);
            END LOOP;

            v_q_item := jsonb_build_object(
                'id', v_aq.question_id,
                'display_order', v_aq.display_order,
                'question_text', v_aq.question_text,
                'option_a', v_opts_map->>'option_a',
                'option_b', v_opts_map->>'option_b',
                'option_c', v_opts_map->>'option_c',
                'option_d', v_opts_map->>'option_d'
            );

            v_questions_output := v_questions_output || jsonb_build_array(v_q_item);
        END LOOP;

        -- Collect saved answers
        FOR v_ans IN
            SELECT question_id, selected_answer, time_taken_seconds
            FROM public.answers
            WHERE attempt_id = v_existing_attempt.id
        LOOP
            v_saved_answers := v_saved_answers || jsonb_build_object(
                v_ans.question_id::text, v_ans.selected_answer
            );
        END LOOP;

        RETURN jsonb_build_object(
            'status', 'active',
            'attempt_id', v_existing_attempt.id,
            'quiz_id', p_quiz_id,
            'title', v_quiz.title,
            'started_at', v_existing_attempt.started_at,
            'effective_end_time', v_effective_end_time,
            'duration_seconds', v_quiz.duration_seconds,
            'current_question_index', COALESCE(v_existing_attempt.current_question_index, 0),
            'question_times', COALESCE(v_existing_attempt.question_times, '{}'::JSONB),
            'saved_answers', v_saved_answers,
            'questions', v_questions_output
        );
    END IF;

    -- CREATE BRAND NEW ATTEMPT
    v_effective_end_time := LEAST(v_now + (v_quiz.duration_seconds || ' seconds')::INTERVAL, v_quiz.end_time);

    INSERT INTO public.quiz_attempts (
        quiz_id, user_id, status, started_at, current_question_index, question_times
    ) VALUES (
        p_quiz_id, v_user_id, 'active', v_now, 0, '{}'::JSONB
    )
    RETURNING id INTO v_attempt_id;

    -- Randomize Questions and persist attempt_questions
    FOR v_q IN
        SELECT q.id, q.question_text, q.option_a, q.option_b, q.option_c, q.option_d
        FROM public.quiz_questions qq
        JOIN public.questions q ON q.id = qq.question_id
        WHERE qq.quiz_id = p_quiz_id
        ORDER BY random()
    LOOP
        -- Shuffle options
        SELECT array_agg(opt ORDER BY random())
        INTO v_permuted_keys
        FROM unnest(v_option_keys) AS opt;

        v_shuffled_options := to_jsonb(v_permuted_keys);

        INSERT INTO public.attempt_questions (
            attempt_id, question_id, display_order, option_order
        ) VALUES (
            v_attempt_id, v_q.id, v_display_order, v_shuffled_options
        );

        v_opts_map := '{}'::JSONB;
        FOR i IN 1..4 LOOP
            v_target_key := CASE i
                WHEN 1 THEN 'A'
                WHEN 2 THEN 'B'
                WHEN 3 THEN 'C'
                WHEN 4 THEN 'D'
            END;

            v_opt_val := CASE v_permuted_keys[i]
                WHEN 'A' THEN v_q.option_a
                WHEN 'B' THEN v_q.option_b
                WHEN 'C' THEN v_q.option_c
                WHEN 'D' THEN v_q.option_d
            END;

            v_opts_map := v_opts_map || jsonb_build_object('option_' || lower(v_target_key), v_opt_val);
        END LOOP;

        v_q_item := jsonb_build_object(
            'id', v_q.id,
            'display_order', v_display_order,
            'question_text', v_q.question_text,
            'option_a', v_opts_map->>'option_a',
            'option_b', v_opts_map->>'option_b',
            'option_c', v_opts_map->>'option_c',
            'option_d', v_opts_map->>'option_d'
        );

        v_questions_output := v_questions_output || jsonb_build_array(v_q_item);
        v_display_order := v_display_order + 1;
    END LOOP;

    RETURN jsonb_build_object(
        'status', 'active',
        'attempt_id', v_attempt_id,
        'quiz_id', p_quiz_id,
        'title', v_quiz.title,
        'started_at', v_now,
        'effective_end_time', v_effective_end_time,
        'duration_seconds', v_quiz.duration_seconds,
        'current_question_index', 0,
        'question_times', '{}'::JSONB,
        'saved_answers', '{}'::JSONB,
        'questions', v_questions_output
    );
END;
$$;

-- 3. SAVE ANSWER (With per-question timing and active question tracking)
CREATE OR REPLACE FUNCTION public.save_answer(
    p_attempt_id UUID,
    p_question_id UUID,
    p_selected_answer TEXT, -- 'A', 'B', 'C', or 'D'
    p_time_taken_seconds NUMERIC DEFAULT 0,
    p_current_question_index INTEGER DEFAULT 0,
    p_question_times JSONB DEFAULT '{}'::JSONB
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_user_id UUID := auth.uid();
    v_attempt RECORD;
    v_quiz RECORD;
    v_now TIMESTAMPTZ := now();
    v_effective_end_time TIMESTAMPTZ;
    v_aq RECORD;
    v_original_selected_key TEXT;
    v_correct_answer TEXT;
    v_is_correct BOOLEAN;
BEGIN
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Not authenticated.';
    END IF;

    IF p_selected_answer NOT IN ('A', 'B', 'C', 'D') THEN
        RAISE EXCEPTION 'Invalid selected answer.';
    END IF;

    -- Verify attempt
    SELECT * INTO v_attempt FROM public.quiz_attempts WHERE id = p_attempt_id;
    IF v_attempt.id IS NULL OR v_attempt.user_id != v_user_id THEN
        RAISE EXCEPTION 'Attempt not found or unauthorized.';
    END IF;

    IF v_attempt.status != 'active' THEN
        RAISE EXCEPTION 'Quiz attempt is already closed (%s).', v_attempt.status;
    END IF;

    -- Verify quiz & timeout
    SELECT * INTO v_quiz FROM public.quizzes WHERE id = v_attempt.quiz_id;
    v_effective_end_time := LEAST(v_attempt.started_at + (v_quiz.duration_seconds || ' seconds')::INTERVAL, v_quiz.end_time);

    IF v_now > v_effective_end_time THEN
        PERFORM public.submit_quiz(p_attempt_id);
        RAISE EXCEPTION 'Time limit reached. Quiz has been automatically submitted.';
    END IF;

    -- Look up question in attempt
    SELECT * INTO v_aq FROM public.attempt_questions
    WHERE attempt_id = p_attempt_id AND question_id = p_question_id;

    IF v_aq.id IS NULL THEN
        RAISE EXCEPTION 'Question does not belong to this attempt.';
    END IF;

    -- Map display letter to original letter
    v_original_selected_key := CASE p_selected_answer
        WHEN 'A' THEN v_aq.option_order->>0
        WHEN 'B' THEN v_aq.option_order->>1
        WHEN 'C' THEN v_aq.option_order->>2
        WHEN 'D' THEN v_aq.option_order->>3
    END;

    SELECT correct_answer INTO v_correct_answer FROM public.questions WHERE id = p_question_id;
    v_is_correct := (v_original_selected_key = v_correct_answer);

    -- Upsert answer
    INSERT INTO public.answers (
        attempt_id, question_id, selected_answer, is_correct, time_taken_seconds, answered_at
    ) VALUES (
        p_attempt_id, p_question_id, p_selected_answer, v_is_correct, p_time_taken_seconds, v_now
    )
    ON CONFLICT (attempt_id, question_id) DO UPDATE SET
        selected_answer = EXCLUDED.selected_answer,
        is_correct = EXCLUDED.is_correct,
        time_taken_seconds = EXCLUDED.time_taken_seconds,
        answered_at = EXCLUDED.answered_at;

    -- Update attempt active state
    UPDATE public.quiz_attempts
    SET current_question_index = p_current_question_index,
        question_times = p_question_times
    WHERE id = p_attempt_id;

    RETURN jsonb_build_object(
        'success', true,
        'question_id', p_question_id,
        'selected_answer', p_selected_answer,
        'time_taken_seconds', p_time_taken_seconds,
        'saved_at', v_now
    );
END;
$$;

-- 4. SAVE PROGRESS (When switching or skipping without answering)
CREATE OR REPLACE FUNCTION public.save_quiz_progress(
    p_attempt_id UUID,
    p_current_question_index INTEGER,
    p_question_times JSONB
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    UPDATE public.quiz_attempts
    SET current_question_index = p_current_question_index,
        question_times = p_question_times
    WHERE id = p_attempt_id AND user_id = auth.uid() AND status = 'active';

    RETURN jsonb_build_object('success', true);
END;
$$;

-- 5. SUBMIT QUIZ (Skipped questions receive 0 penalty, 0.5s only for attempted wrong answers)
CREATE OR REPLACE FUNCTION public.submit_quiz(
    p_attempt_id UUID,
    p_final_question_times JSONB DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_user_id UUID := auth.uid();
    v_attempt RECORD;
    v_quiz RECORD;
    v_now TIMESTAMPTZ := now();
    v_effective_end_time TIMESTAMPTZ;
    v_status TEXT;
    v_actual_time_seconds NUMERIC(10,2) := 0;
    v_correct_count INTEGER := 0;
    v_wrong_count INTEGER := 0;
    v_skipped_count INTEGER := 0;
    v_penalty_seconds NUMERIC(10,2) := 0;
    v_final_time_seconds NUMERIC(10,2) := 0;
    v_correct_time NUMERIC(10,2) := 0;
    v_wrong_time NUMERIC(10,2) := 0;
    v_q_time NUMERIC(10,2);
    v_aq RECORD;
    v_ans RECORD;
    v_times JSONB;
BEGIN
    SELECT * INTO v_attempt FROM public.quiz_attempts WHERE id = p_attempt_id;
    IF v_attempt.id IS NULL THEN
        RAISE EXCEPTION 'Attempt not found.';
    END IF;

    IF v_user_id IS NOT NULL AND v_attempt.user_id != v_user_id AND NOT public.is_admin() THEN
        RAISE EXCEPTION 'Unauthorized.';
    END IF;

    IF v_attempt.status IN ('completed', 'auto_submitted') THEN
        RETURN public.get_attempt_review(p_attempt_id);
    END IF;

    SELECT * INTO v_quiz FROM public.quizzes WHERE id = v_attempt.quiz_id;
    v_effective_end_time := LEAST(v_attempt.started_at + (v_quiz.duration_seconds || ' seconds')::INTERVAL, v_quiz.end_time);

    IF v_now <= v_effective_end_time THEN
        v_status := 'completed';
    ELSE
        v_status := 'auto_submitted';
        v_now := v_effective_end_time;
    END IF;

    v_times := COALESCE(p_final_question_times, v_attempt.question_times, '{}'::JSONB);

    -- Loop through all questions assigned to this attempt
    FOR v_aq IN
        SELECT * FROM public.attempt_questions
        WHERE attempt_id = p_attempt_id
        ORDER BY display_order ASC
    LOOP
        SELECT * INTO v_ans FROM public.answers
        WHERE attempt_id = p_attempt_id AND question_id = v_aq.question_id;

        IF v_ans.id IS NOT NULL THEN
            -- Attempted question
            v_q_time := COALESCE(
                (v_times->>v_aq.question_id::text)::NUMERIC,
                v_ans.time_taken_seconds,
                0
            );

            IF v_ans.is_correct THEN
                v_correct_count := v_correct_count + 1;
                v_correct_time := v_correct_time + v_q_time;
            ELSE
                v_wrong_count := v_wrong_count + 1;
                v_wrong_time := v_wrong_time + v_q_time;
            END IF;
        ELSE
            -- SKIPPED / UNANSWERED QUESTION:
            -- Do NOT count as correct.
            -- Do NOT count as wrong.
            -- Do NOT add 0.5s penalty.
            -- Do NOT add artificially assigned time.
            v_skipped_count := v_skipped_count + 1;
        END IF;
    END LOOP;

    -- Wrong-answer penalty: exactly 0.5 seconds ONLY per attempted wrong answer
    v_penalty_seconds := v_wrong_count * 0.5;

    -- Total actual time on attempted questions (minimum 0.1s to avoid 0)
    v_actual_time_seconds := GREATEST(0.10, v_correct_time + v_wrong_time);

    -- Final time for ranking and evaluation
    v_final_time_seconds := v_actual_time_seconds + v_penalty_seconds;

    UPDATE public.quiz_attempts
    SET status = v_status,
        submitted_at = v_now,
        actual_time_seconds = v_actual_time_seconds,
        correct_count = v_correct_count,
        wrong_count = v_wrong_count,
        skipped_count = v_skipped_count,
        penalty_seconds = v_penalty_seconds,
        final_time_seconds = v_final_time_seconds,
        question_times = v_times
    WHERE id = p_attempt_id;

    RETURN public.get_attempt_review(p_attempt_id);
END;
$$;

-- 6. GET ATTEMPT REVIEW
CREATE OR REPLACE FUNCTION public.get_attempt_review(
    p_attempt_id UUID
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_user_id UUID := auth.uid();
    v_attempt RECORD;
    v_quiz RECORD;
    v_aq RECORD;
    v_ans RECORD;
    v_q RECORD;
    i INTEGER;
    v_user_display_correct TEXT;
    v_review_list JSONB := '[]'::JSONB;
    v_review_item JSONB;
BEGIN
    SELECT * INTO v_attempt FROM public.quiz_attempts WHERE id = p_attempt_id;
    IF v_attempt.id IS NULL THEN
        RAISE EXCEPTION 'Attempt not found.';
    END IF;

    IF v_user_id IS NOT NULL AND v_attempt.user_id != v_user_id AND NOT public.is_admin() THEN
        RAISE EXCEPTION 'Unauthorized.';
    END IF;

    IF v_attempt.status = 'active' THEN
        RAISE EXCEPTION 'Quiz review is only accessible after completion.';
    END IF;

    SELECT * INTO v_quiz FROM public.quizzes WHERE id = v_attempt.quiz_id;

    FOR v_aq IN
        SELECT * FROM public.attempt_questions
        WHERE attempt_id = p_attempt_id
        ORDER BY display_order ASC
    LOOP
        SELECT * INTO v_ans FROM public.answers
        WHERE attempt_id = p_attempt_id AND question_id = v_aq.question_id;

        SELECT * INTO v_q FROM public.questions WHERE id = v_aq.question_id;

        -- Map correct answer to user's display letter
        FOR i IN 0..3 LOOP
            IF v_aq.option_order->>i = v_q.correct_answer THEN
                v_user_display_correct := CASE i
                    WHEN 0 THEN 'A'
                    WHEN 1 THEN 'B'
                    WHEN 2 THEN 'C'
                    WHEN 3 THEN 'D'
                END;
            END IF;
        END LOOP;

        v_review_item := jsonb_build_object(
            'display_order', v_aq.display_order,
            'question_text', v_q.question_text,
            'selected_answer', v_ans.selected_answer,
            'correct_answer', v_user_display_correct,
            'is_correct', COALESCE(v_ans.is_correct, false),
            'is_skipped', (v_ans.id IS NULL),
            'explanation', v_q.explanation
        );

        v_review_list := v_review_list || jsonb_build_array(v_review_item);
    END LOOP;

    RETURN jsonb_build_object(
        'quiz_id', v_quiz.id,
        'title', v_quiz.title,
        'quiz_date', v_quiz.quiz_date,
        'attempt_id', v_attempt.id,
        'status', v_attempt.status,
        'started_at', v_attempt.started_at,
        'submitted_at', v_attempt.submitted_at,
        'actual_time_seconds', v_attempt.actual_time_seconds,
        'correct_count', v_attempt.correct_count,
        'wrong_count', v_attempt.wrong_count,
        'skipped_count', COALESCE(v_attempt.skipped_count, 0),
        'penalty_seconds', v_attempt.penalty_seconds,
        'final_time_seconds', v_attempt.final_time_seconds,
        'questions_review', v_review_list
    );
END;
$$;

-- 7. GET DAILY LEADERBOARD (Ranks by: 1. Higher correct count, 2. Lower final time, 3. Earlier submission)
CREATE OR REPLACE FUNCTION public.get_daily_leaderboard(
    p_quiz_id UUID
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_quiz RECORD;
    v_ranked_list JSONB := '[]'::JSONB;
    v_missed_list JSONB := '[]'::JSONB;
    v_row RECORD;
    v_current_rank INTEGER := 1;
    v_is_closed BOOLEAN;
BEGIN
    SELECT * INTO v_quiz FROM public.quizzes WHERE id = p_quiz_id;
    IF v_quiz.id IS NULL THEN
        RAISE EXCEPTION 'Quiz not found.';
    END IF;

    v_is_closed := (now() >= v_quiz.end_time OR v_quiz.status = 'closed');

    -- Ranked participants
    FOR v_row IN
        SELECT 
            qa.id AS attempt_id,
            qa.status,
            qa.actual_time_seconds,
            qa.correct_count,
            qa.wrong_count,
            COALESCE(qa.skipped_count, 0) AS skipped_count,
            qa.penalty_seconds,
            qa.final_time_seconds,
            qa.submitted_at,
            p.id AS user_id,
            p.full_name,
            p.email,
            p.avatar_url
        FROM public.quiz_attempts qa
        JOIN public.profiles p ON p.id = qa.user_id
        WHERE qa.quiz_id = p_quiz_id
          AND qa.status IN ('completed', 'auto_submitted')
        ORDER BY qa.correct_count DESC, qa.final_time_seconds ASC, qa.submitted_at ASC
    LOOP
        v_ranked_list := v_ranked_list || jsonb_build_array(jsonb_build_object(
            'rank', v_current_rank,
            'user_id', v_row.user_id,
            'full_name', v_row.full_name,
            'avatar_url', v_row.avatar_url,
            'status', v_row.status,
            'correct_count', v_row.correct_count,
            'wrong_count', v_row.wrong_count,
            'skipped_count', v_row.skipped_count,
            'actual_time_seconds', v_row.actual_time_seconds,
            'penalty_seconds', v_row.penalty_seconds,
            'final_time_seconds', v_row.final_time_seconds,
            'submitted_at', v_row.submitted_at
        ));
        v_current_rank := v_current_rank + 1;
    END LOOP;

    -- Missed participants
    IF v_is_closed THEN
        FOR v_row IN
            SELECT p.id AS user_id, p.full_name, p.avatar_url
            FROM public.profiles p
            WHERE p.role = 'user'
              AND NOT EXISTS (
                  SELECT 1 FROM public.quiz_attempts qa
                  WHERE qa.quiz_id = p_quiz_id AND qa.user_id = p.id
              )
            ORDER BY p.full_name ASC
        LOOP
            v_missed_list := v_missed_list || jsonb_build_array(jsonb_build_object(
                'rank', null,
                'user_id', v_row.user_id,
                'full_name', v_row.full_name,
                'avatar_url', v_row.avatar_url,
                'status', 'missed',
                'correct_count', 0,
                'wrong_count', 0,
                'skipped_count', 0,
                'final_time_seconds', null,
                'submitted_at', null
            ));
        END LOOP;
    END IF;

    RETURN jsonb_build_object(
        'quiz_id', v_quiz.id,
        'title', v_quiz.title,
        'quiz_date', v_quiz.quiz_date,
        'is_closed', v_is_closed,
        'ranked', v_ranked_list,
        'missed', v_missed_list
    );
END;
$$;

-- 8. ADMIN CREATE QUIZ (Configurable start_time and end_time in IST)
CREATE OR REPLACE FUNCTION public.admin_create_quiz(
    p_quiz_date DATE,
    p_title TEXT,
    p_start_time TIMESTAMPTZ DEFAULT NULL,
    p_end_time TIMESTAMPTZ DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_start_time TIMESTAMPTZ;
    v_end_time TIMESTAMPTZ;
    v_new_id UUID;
BEGIN
    IF NOT public.is_admin() THEN
        RAISE EXCEPTION 'Unauthorized: Admin role required.';
    END IF;

    -- Use provided start/end time or fallback to 7:00 PM – 10:00 PM IST
    IF p_start_time IS NOT NULL THEN
        v_start_time := p_start_time;
    ELSE
        v_start_time := (p_quiz_date::text || ' 19:00:00+05:30')::TIMESTAMPTZ;
    END IF;

    IF p_end_time IS NOT NULL THEN
        v_end_time := p_end_time;
    ELSE
        v_end_time := (p_quiz_date::text || ' 22:00:00+05:30')::TIMESTAMPTZ;
    END IF;

    IF v_end_time <= v_start_time THEN
        RAISE EXCEPTION 'Quiz end time must be after start time.';
    END IF;

    INSERT INTO public.quizzes (
        quiz_date, title, start_time, end_time, duration_seconds, status, created_by
    ) VALUES (
        p_quiz_date, p_title, v_start_time, v_end_time, 600, 'draft', auth.uid()
    )
    RETURNING id INTO v_new_id;

    INSERT INTO public.admin_activity (admin_id, action, target_type, target_id, metadata)
    VALUES (auth.uid(), 'CREATE_QUIZ', 'quiz', v_new_id, jsonb_build_object(
        'date', p_quiz_date, 
        'title', p_title, 
        'start_time', v_start_time, 
        'end_time', v_end_time
    ));

    RETURN v_new_id;
END;
$$;

-- 9. ADMIN UPDATE QUIZ SCHEDULE
CREATE OR REPLACE FUNCTION public.admin_update_quiz_schedule(
    p_quiz_id UUID,
    p_quiz_date DATE,
    p_start_time TIMESTAMPTZ,
    p_end_time TIMESTAMPTZ
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    IF NOT public.is_admin() THEN
        RAISE EXCEPTION 'Unauthorized: Admin role required.';
    END IF;

    IF p_end_time <= p_start_time THEN
        RAISE EXCEPTION 'Quiz end time must be after start time.';
    END IF;

    UPDATE public.quizzes
    SET quiz_date = p_quiz_date,
        start_time = p_start_time,
        end_time = p_end_time,
        updated_at = now()
    WHERE id = p_quiz_id;

    RETURN jsonb_build_object('success', true);
END;
$$;
