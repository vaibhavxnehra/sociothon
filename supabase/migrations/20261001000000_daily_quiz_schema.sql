-- ==============================================================================
-- NIRMAAN DAILY QUIZ BACKEND SCHEMA & FUNCTIONS
-- Production-Ready, Server-Authoritative, Zero Frontend Trust
-- Timezone: Asia/Kolkata (IST = UTC + 05:30)
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. TABLE: profiles
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL DEFAULT '',
    email TEXT NOT NULL DEFAULT '',
    avatar_url TEXT NULL,
    role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index on role
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);

-- Helper to check if current user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role = 'admin'
    );
$$;

-- Trigger to create/update profile when auth.users is created
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_role TEXT := 'user';
BEGIN
    -- Automatic elevation for initial admin
    IF LOWER(NEW.email) = '25mc3027@rgipt.ac.in' THEN
        v_role := 'admin';
    END IF;

    INSERT INTO public.profiles (id, full_name, email, role, avatar_url)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', ''),
        COALESCE(NEW.email, ''),
        v_role,
        NEW.raw_user_meta_data->>'avatar_url'
    )
    ON CONFLICT (id) DO UPDATE SET
        full_name = EXCLUDED.full_name,
        email = EXCLUDED.email,
        avatar_url = EXCLUDED.avatar_url,
        updated_at = now();

    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 3. TABLE: questions
CREATE TABLE IF NOT EXISTS public.questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    question_text TEXT NOT NULL,
    option_a TEXT NOT NULL,
    option_b TEXT NOT NULL,
    option_c TEXT NOT NULL,
    option_d TEXT NOT NULL,
    correct_answer TEXT NOT NULL CHECK (correct_answer IN ('A', 'B', 'C', 'D')),
    explanation TEXT NULL,
    created_by UUID NOT NULL REFERENCES public.profiles(id),
    is_active BOOLEAN NOT NULL DEFAULT true,
    used_at TIMESTAMPTZ NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_questions_is_active ON public.questions(is_active);
CREATE INDEX IF NOT EXISTS idx_questions_used_at ON public.questions(used_at);

-- 4. TABLE: quizzes
CREATE TABLE IF NOT EXISTS public.quizzes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    quiz_date DATE NOT NULL UNIQUE,
    title TEXT NOT NULL,
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    duration_seconds INTEGER NOT NULL DEFAULT 600 CHECK (duration_seconds = 600),
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'closed', 'cancelled')),
    created_by UUID NOT NULL REFERENCES public.profiles(id),
    published_at TIMESTAMPTZ NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT chk_quiz_time_window CHECK (end_time > start_time)
);

CREATE INDEX IF NOT EXISTS idx_quizzes_date ON public.quizzes(quiz_date);
CREATE INDEX IF NOT EXISTS idx_quizzes_status ON public.quizzes(status);
CREATE INDEX IF NOT EXISTS idx_quizzes_window ON public.quizzes(start_time, end_time);

-- 5. TABLE: quiz_questions
CREATE TABLE IF NOT EXISTS public.quiz_questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    quiz_id UUID NOT NULL REFERENCES public.quizzes(id) ON DELETE CASCADE,
    question_id UUID NOT NULL REFERENCES public.questions(id),
    question_order INTEGER NOT NULL CHECK (question_order IN (1, 2, 3)),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT uq_quiz_questions_quiz_question UNIQUE (quiz_id, question_id),
    CONSTRAINT uq_quiz_questions_quiz_order UNIQUE (quiz_id, question_order),
    CONSTRAINT uq_quiz_questions_single_use UNIQUE (question_id) -- A question cannot be assigned to multiple quizzes
);

CREATE INDEX IF NOT EXISTS idx_quiz_questions_quiz_id ON public.quiz_questions(quiz_id);

-- 6. TABLE: quiz_attempts
CREATE TABLE IF NOT EXISTS public.quiz_attempts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    quiz_id UUID NOT NULL REFERENCES public.quizzes(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    status TEXT NOT NULL CHECK (status IN ('active', 'completed', 'auto_submitted')),
    started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    submitted_at TIMESTAMPTZ NULL,
    actual_time_seconds INTEGER NULL,
    correct_count INTEGER NOT NULL DEFAULT 0,
    wrong_count INTEGER NOT NULL DEFAULT 0,
    penalty_seconds INTEGER NOT NULL DEFAULT 0,
    final_time_seconds INTEGER NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT uq_user_quiz_attempt UNIQUE (user_id, quiz_id)
);

CREATE INDEX IF NOT EXISTS idx_quiz_attempts_user_quiz ON public.quiz_attempts(user_id, quiz_id);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_quiz_status ON public.quiz_attempts(quiz_id, status);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_leaderboard ON public.quiz_attempts(quiz_id, status, final_time_seconds, submitted_at);

-- 7. TABLE: attempt_questions
CREATE TABLE IF NOT EXISTS public.attempt_questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    attempt_id UUID NOT NULL REFERENCES public.quiz_attempts(id) ON DELETE CASCADE,
    question_id UUID NOT NULL REFERENCES public.questions(id),
    display_order INTEGER NOT NULL CHECK (display_order IN (1, 2, 3)),
    option_order JSONB NOT NULL, -- e.g. ["C", "A", "D", "B"]
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT uq_attempt_question UNIQUE (attempt_id, question_id),
    CONSTRAINT uq_attempt_display_order UNIQUE (attempt_id, display_order)
);

CREATE INDEX IF NOT EXISTS idx_attempt_questions_attempt ON public.attempt_questions(attempt_id);

-- 8. TABLE: answers
CREATE TABLE IF NOT EXISTS public.answers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    attempt_id UUID NOT NULL REFERENCES public.quiz_attempts(id) ON DELETE CASCADE,
    question_id UUID NOT NULL REFERENCES public.questions(id),
    selected_answer TEXT NOT NULL CHECK (selected_answer IN ('A', 'B', 'C', 'D')),
    is_correct BOOLEAN NOT NULL,
    answered_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT uq_attempt_question_answer UNIQUE (attempt_id, question_id)
);

CREATE INDEX IF NOT EXISTS idx_answers_attempt ON public.answers(attempt_id);

-- 9. TABLE: admin_activity
CREATE TABLE IF NOT EXISTS public.admin_activity (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_id UUID NOT NULL REFERENCES public.profiles(id),
    action TEXT NOT NULL,
    target_type TEXT NULL,
    target_id UUID NULL,
    metadata JSONB NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_admin_activity_created_at ON public.admin_activity(created_at DESC);

-- ==============================================================================
-- IMMUTABILITY & PROTECTION TRIGGERS
-- ==============================================================================

-- Prevent question edits/deletes if assigned to a published/closed quiz
CREATE OR REPLACE FUNCTION public.check_question_immutability()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    IF EXISTS (
        SELECT 1
        FROM public.quiz_questions qq
        JOIN public.quizzes q ON q.id = qq.quiz_id
        WHERE qq.question_id = OLD.id
          AND q.status IN ('published', 'closed')
    ) THEN
        RAISE EXCEPTION 'Question has already been used in a published or closed quiz and cannot be modified or deleted.';
    END IF;
    RETURN OLD;
END;
$$;

DROP TRIGGER IF EXISTS trg_question_immutability_update ON public.questions;
CREATE TRIGGER trg_question_immutability_update
    BEFORE UPDATE OF question_text, option_a, option_b, option_c, option_d, correct_answer, explanation
    ON public.questions
    FOR EACH ROW
    EXECUTE FUNCTION public.check_question_immutability();

DROP TRIGGER IF EXISTS trg_question_immutability_delete ON public.questions;
CREATE TRIGGER trg_question_immutability_delete
    BEFORE DELETE ON public.questions
    FOR EACH ROW
    EXECUTE FUNCTION public.check_question_immutability();

-- Prevent normal users from altering their own role
CREATE OR REPLACE FUNCTION public.protect_profile_role()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    IF OLD.role IS DISTINCT FROM NEW.role THEN
        IF NOT public.is_admin() THEN
            RAISE EXCEPTION 'Unauthorized: Only administrators can modify roles.';
        END IF;
    END IF;
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_protect_profile_role ON public.profiles;
CREATE TRIGGER trg_protect_profile_role
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.protect_profile_role();

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ==============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attempt_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_activity ENABLE ROW LEVEL SECURITY;

-- profiles RLS
CREATE POLICY "Profiles are viewable by authenticated users"
    ON public.profiles FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Users can update their own profile"
    ON public.profiles FOR UPDATE
    TO authenticated
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- questions RLS (CRITICAL: normal participants can NEVER directly SELECT from questions)
CREATE POLICY "Admins have full access to questions"
    ON public.questions FOR ALL
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- quizzes RLS
CREATE POLICY "Anyone can view published or closed quizzes"
    ON public.quizzes FOR SELECT
    TO authenticated
    USING (status IN ('published', 'closed') OR public.is_admin());

CREATE POLICY "Admins have full access to quizzes"
    ON public.quizzes FOR ALL
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- quiz_questions RLS
CREATE POLICY "Admins have full access to quiz_questions"
    ON public.quiz_questions FOR ALL
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- quiz_attempts RLS
CREATE POLICY "Users can view their own attempts"
    ON public.quiz_attempts FOR SELECT
    TO authenticated
    USING (user_id = auth.uid() OR public.is_admin());

-- attempt_questions RLS
CREATE POLICY "Users can view questions for their attempt"
    ON public.attempt_questions FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.quiz_attempts a
            WHERE a.id = attempt_id AND (a.user_id = auth.uid() OR public.is_admin())
        )
    );

-- answers RLS
CREATE POLICY "Users can view their own answers"
    ON public.answers FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.quiz_attempts a
            WHERE a.id = attempt_id AND (a.user_id = auth.uid() OR public.is_admin())
        )
    );

-- admin_activity RLS
CREATE POLICY "Only admins can view or insert admin activity"
    ON public.admin_activity FOR ALL
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- ==============================================================================
-- ADMIN OPERATIONS (SECURITY DEFINER)
-- ==============================================================================

-- Create Question
CREATE OR REPLACE FUNCTION public.admin_create_question(
    p_question_text TEXT,
    p_option_a TEXT,
    p_option_b TEXT,
    p_option_c TEXT,
    p_option_d TEXT,
    p_correct_answer TEXT,
    p_explanation TEXT DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_new_id UUID;
BEGIN
    IF NOT public.is_admin() THEN
        RAISE EXCEPTION 'Unauthorized: Admin role required.';
    END IF;

    IF p_correct_answer NOT IN ('A', 'B', 'C', 'D') THEN
        RAISE EXCEPTION 'Invalid correct answer option. Must be A, B, C, or D.';
    END IF;

    INSERT INTO public.questions (
        question_text, option_a, option_b, option_c, option_d,
        correct_answer, explanation, created_by
    ) VALUES (
        p_question_text, p_option_a, p_option_b, p_option_c, p_option_d,
        p_correct_answer, p_explanation, auth.uid()
    )
    RETURNING id INTO v_new_id;

    INSERT INTO public.admin_activity (admin_id, action, target_type, target_id, metadata)
    VALUES (auth.uid(), 'CREATE_QUESTION', 'question', v_new_id, jsonb_build_object('text', p_question_text));

    RETURN v_new_id;
END;
$$;

-- Create Quiz (Defaults strictly to 7 PM IST -> 10 PM IST on given date)
CREATE OR REPLACE FUNCTION public.admin_create_quiz(
    p_quiz_date DATE,
    p_title TEXT
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

    -- 7:00 PM IST is 13:30:00 UTC
    v_start_time := (p_quiz_date::text || ' 19:00:00+05:30')::TIMESTAMPTZ;
    -- 10:00 PM IST is 16:30:00 UTC
    v_end_time := (p_quiz_date::text || ' 22:00:00+05:30')::TIMESTAMPTZ;

    INSERT INTO public.quizzes (
        quiz_date, title, start_time, end_time, duration_seconds, status, created_by
    ) VALUES (
        p_quiz_date, p_title, v_start_time, v_end_time, 600, 'draft', auth.uid()
    )
    RETURNING id INTO v_new_id;

    INSERT INTO public.admin_activity (admin_id, action, target_type, target_id, metadata)
    VALUES (auth.uid(), 'CREATE_QUIZ', 'quiz', v_new_id, jsonb_build_object('date', p_quiz_date, 'title', p_title));

    RETURN v_new_id;
END;
$$;

-- Assign 3 Unused Questions to Quiz
CREATE OR REPLACE FUNCTION public.admin_assign_quiz_questions(
    p_quiz_id UUID,
    p_question_ids UUID[]
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_quiz_status TEXT;
    v_qid UUID;
    v_order INTEGER := 1;
BEGIN
    IF NOT public.is_admin() THEN
        RAISE EXCEPTION 'Unauthorized: Admin role required.';
    END IF;

    IF array_length(p_question_ids, 1) != 3 THEN
        RAISE EXCEPTION 'A quiz must contain exactly 3 questions.';
    END IF;

    SELECT status INTO v_quiz_status FROM public.quizzes WHERE id = p_quiz_id;
    IF v_quiz_status IS NULL THEN
        RAISE EXCEPTION 'Quiz not found.';
    END IF;

    IF v_quiz_status NOT IN ('draft') THEN
        RAISE EXCEPTION 'Cannot modify question assignments for a published or closed quiz.';
    END IF;

    -- Check each question
    FOREACH v_qid IN ARRAY p_question_ids LOOP
        -- Check active
        IF NOT EXISTS (SELECT 1 FROM public.questions WHERE id = v_qid AND is_active = true) THEN
            RAISE EXCEPTION 'Question % is either inactive or does not exist.', v_qid;
        END IF;

        -- Check not assigned to another quiz
        IF EXISTS (SELECT 1 FROM public.quiz_questions WHERE question_id = v_qid AND quiz_id != p_quiz_id) THEN
            RAISE EXCEPTION 'Question % is already assigned to another quiz and cannot be reused.', v_qid;
        END IF;
    END LOOP;

    -- Clear existing assignments for this draft quiz
    DELETE FROM public.quiz_questions WHERE quiz_id = p_quiz_id;

    -- Insert assignments
    FOREACH v_qid IN ARRAY p_question_ids LOOP
        INSERT INTO public.quiz_questions (quiz_id, question_id, question_order)
        VALUES (p_quiz_id, v_qid, v_order);
        v_order := v_order + 1;
    END LOOP;

    INSERT INTO public.admin_activity (admin_id, action, target_type, target_id, metadata)
    VALUES (auth.uid(), 'ASSIGN_QUESTIONS', 'quiz', p_quiz_id, jsonb_build_object('question_ids', p_question_ids));
END;
$$;

-- Publish Quiz
CREATE OR REPLACE FUNCTION public.admin_publish_quiz(
    p_quiz_id UUID
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_count INTEGER;
    v_status TEXT;
BEGIN
    IF NOT public.is_admin() THEN
        RAISE EXCEPTION 'Unauthorized: Admin role required.';
    END IF;

    SELECT status INTO v_status FROM public.quizzes WHERE id = p_quiz_id;
    IF v_status IS NULL THEN
        RAISE EXCEPTION 'Quiz not found.';
    END IF;

    IF v_status != 'draft' THEN
        RAISE EXCEPTION 'Only draft quizzes can be published.';
    END IF;

    SELECT COUNT(*) INTO v_count FROM public.quiz_questions WHERE quiz_id = p_quiz_id;
    IF v_count != 3 THEN
        RAISE EXCEPTION 'Quiz must have exactly 3 questions assigned before publishing. Current count: %', v_count;
    END IF;

    -- Update status and timestamp
    UPDATE public.quizzes
    SET status = 'published',
        published_at = now(),
        updated_at = now()
    WHERE id = p_quiz_id;

    -- Mark questions as used_at
    UPDATE public.questions
    SET used_at = now(),
        updated_at = now()
    WHERE id IN (SELECT question_id FROM public.quiz_questions WHERE quiz_id = p_quiz_id);

    INSERT INTO public.admin_activity (admin_id, action, target_type, target_id, metadata)
    VALUES (auth.uid(), 'PUBLISH_QUIZ', 'quiz', p_quiz_id, jsonb_build_object('published_at', now()));
END;
$$;

-- ==============================================================================
-- PARTICIPANT QUIZ LIFECYCLE (SECURITY DEFINER)
-- ==============================================================================

-- 1. START QUIZ
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
    v_attempt_id UUID;
    v_now TIMESTAMPTZ := now();
    v_effective_end_time TIMESTAMPTZ;
    v_q RECORD;
    v_display_order INTEGER := 1;
    v_shuffled_options JSONB;
    v_questions_output JSONB := '[]'::JSONB;
    v_option_keys TEXT[] := ARRAY['A', 'B', 'C', 'D'];
    v_permuted_keys TEXT[];
    v_q_item JSONB;
    v_opt_val TEXT;
    v_target_key TEXT;
    v_opts_map JSONB;
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

    -- Check if user already attempted or is active
    SELECT id INTO v_attempt_id FROM public.quiz_attempts WHERE quiz_id = p_quiz_id AND user_id = v_user_id;
    IF v_attempt_id IS NOT NULL THEN
        RAISE EXCEPTION 'You have already attempted or started this quiz. Only one attempt is permitted.';
    END IF;

    -- Calculate effective end time = LEAST(v_now + 10 minutes, v_quiz.end_time)
    v_effective_end_time := LEAST(v_now + (v_quiz.duration_seconds || ' seconds')::INTERVAL, v_quiz.end_time);

    -- Create attempt row
    INSERT INTO public.quiz_attempts (
        quiz_id, user_id, status, started_at
    ) VALUES (
        p_quiz_id, v_user_id, 'active', v_now
    )
    RETURNING id INTO v_attempt_id;

    -- Randomize Questions (order by random()) and assign display_order 1, 2, 3
    FOR v_q IN (
        SELECT q.id, q.question_text, q.option_a, q.option_b, q.option_c, q.option_d
        FROM public.quiz_questions qq
        JOIN public.questions q ON q.id = qq.question_id
        WHERE qq.quiz_id = p_quiz_id
        ORDER BY random()
    ) LOOP
        -- Shuffle options A, B, C, D
        SELECT array_agg(opt ORDER BY random())
        INTO v_permuted_keys
        FROM unnest(v_option_keys) AS opt;

        v_shuffled_options := to_jsonb(v_permuted_keys);

        -- Persist mapping into attempt_questions
        INSERT INTO public.attempt_questions (
            attempt_id, question_id, display_order, option_order
        ) VALUES (
            v_attempt_id, v_q.id, v_display_order, v_shuffled_options
        );

        -- Build presentation options for frontend
        -- v_permuted_keys[1] will be shown as option_a to user, etc.
        v_opts_map := '{}'::JSONB;
        FOR i IN 1..4 LOOP
            v_target_key := CASE i
                WHEN 1 THEN 'A'
                WHEN 2 THEN 'B'
                WHEN 3 THEN 'C'
                WHEN 4 THEN 'D'
            END;

            -- get original option value
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
        'attempt_id', v_attempt_id,
        'quiz_id', p_quiz_id,
        'title', v_quiz.title,
        'started_at', v_now,
        'effective_end_time', v_effective_end_time,
        'duration_seconds', v_quiz.duration_seconds,
        'questions', v_questions_output
    );
END;
$$;

-- 2. SAVE ANSWER (Allows changing answers while active and before timeout)
CREATE OR REPLACE FUNCTION public.save_answer(
    p_attempt_id UUID,
    p_question_id UUID,
    p_selected_answer TEXT -- 'A', 'B', 'C', or 'D' as displayed to the participant
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
        -- Timeout occurred! Automatically submit quiz
        PERFORM public.submit_quiz(p_attempt_id);
        RAISE EXCEPTION 'Time limit reached. Quiz has been automatically submitted.';
    END IF;

    -- Look up attempt question to map participant's display option to original question option
    SELECT * INTO v_aq FROM public.attempt_questions
    WHERE attempt_id = p_attempt_id AND question_id = p_question_id;

    IF v_aq.id IS NULL THEN
        RAISE EXCEPTION 'Question does not belong to this attempt.';
    END IF;

    -- Map display letter to original letter:
    -- option_order is JSONB array like ["C", "A", "D", "B"]
    -- Index 0 -> 'A', Index 1 -> 'B', Index 2 -> 'C', Index 3 -> 'D'
    v_original_selected_key := CASE p_selected_answer
        WHEN 'A' THEN v_aq.option_order->>0
        WHEN 'B' THEN v_aq.option_order->>1
        WHEN 'C' THEN v_aq.option_order->>2
        WHEN 'D' THEN v_aq.option_order->>3
    END;

    -- Check correctness server-side
    SELECT correct_answer INTO v_correct_answer FROM public.questions WHERE id = p_question_id;
    v_is_correct := (v_original_selected_key = v_correct_answer);

    -- Upsert answer record
    INSERT INTO public.answers (
        attempt_id, question_id, selected_answer, is_correct, answered_at
    ) VALUES (
        p_attempt_id, p_question_id, p_selected_answer, v_is_correct, v_now
    )
    ON CONFLICT (attempt_id, question_id) DO UPDATE SET
        selected_answer = EXCLUDED.selected_answer,
        is_correct = EXCLUDED.is_correct,
        answered_at = EXCLUDED.answered_at;

    RETURN jsonb_build_object(
        'success', true,
        'question_id', p_question_id,
        'selected_answer', p_selected_answer,
        'saved_at', v_now
    );
END;
$$;

-- 3. SUBMIT QUIZ (Handles manual submit & auto-submission)
CREATE OR REPLACE FUNCTION public.submit_quiz(
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
    v_now TIMESTAMPTZ := now();
    v_effective_end_time TIMESTAMPTZ;
    v_status TEXT;
    v_actual_time_seconds INTEGER;
    v_correct_count INTEGER := 0;
    v_wrong_count INTEGER := 0;
    v_penalty_seconds INTEGER := 0;
    v_final_time_seconds INTEGER := 0;
    v_aq RECORD;
    v_ans RECORD;
    v_q RECORD;
    v_user_display_correct TEXT;
    v_review_list JSONB := '[]'::JSONB;
    v_review_item JSONB;
BEGIN
    SELECT * INTO v_attempt FROM public.quiz_attempts WHERE id = p_attempt_id;
    IF v_attempt.id IS NULL THEN
        RAISE EXCEPTION 'Attempt not found.';
    END IF;

    -- If caller is regular user, verify ownership
    IF v_user_id IS NOT NULL AND v_attempt.user_id != v_user_id AND NOT public.is_admin() THEN
        RAISE EXCEPTION 'Unauthorized.';
    END IF;

    -- If already completed/auto_submitted, return existing result
    IF v_attempt.status IN ('completed', 'auto_submitted') THEN
        RETURN public.get_attempt_review(p_attempt_id);
    END IF;

    SELECT * INTO v_quiz FROM public.quizzes WHERE id = v_attempt.quiz_id;
    v_effective_end_time := LEAST(v_attempt.started_at + (v_quiz.duration_seconds || ' seconds')::INTERVAL, v_quiz.end_time);

    -- Determine status: completed vs auto_submitted
    IF v_now <= v_effective_end_time THEN
        v_status := 'completed';
    ELSE
        v_status := 'auto_submitted';
        v_now := v_effective_end_time; -- Cap submitted_at to effective_end_time
    END IF;

    -- Calculate actual time in seconds
    v_actual_time_seconds := GREATEST(1, EXTRACT(EPOCH FROM (v_now - v_attempt.started_at))::INTEGER);

    -- Evaluate each of the 3 assigned questions
    FOR v_aq IN (
        SELECT * FROM public.attempt_questions
        WHERE attempt_id = p_attempt_id
        ORDER BY display_order ASC
    ) LOOP
        SELECT * INTO v_ans FROM public.answers
        WHERE attempt_id = p_attempt_id AND question_id = v_aq.question_id;

        IF v_ans.id IS NOT NULL AND v_ans.is_correct THEN
            v_correct_count := v_correct_count + 1;
        ELSE
            -- Either answered incorrectly OR unattempted -> counted as wrong
            v_wrong_count := v_wrong_count + 1;
        END IF;
    END LOOP;

    -- Penalty: 5 seconds per wrong answer
    v_penalty_seconds := v_wrong_count * 5;
    v_final_time_seconds := v_actual_time_seconds + v_penalty_seconds;

    -- Update attempt with final calculations
    UPDATE public.quiz_attempts
    SET status = v_status,
        submitted_at = v_now,
        actual_time_seconds = v_actual_time_seconds,
        correct_count = v_correct_count,
        wrong_count = v_wrong_count,
        penalty_seconds = v_penalty_seconds,
        final_time_seconds = v_final_time_seconds
    WHERE id = p_attempt_id;

    RETURN public.get_attempt_review(p_attempt_id);
END;
$$;

-- 4. GET ATTEMPT REVIEW (Accessible only after attempt is completed or auto_submitted)
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
    v_display_correct TEXT;
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
        RAISE EXCEPTION 'Review is only available after quiz submission.';
    END IF;

    SELECT * INTO v_quiz FROM public.quizzes WHERE id = v_attempt.quiz_id;

    FOR v_aq IN (
        SELECT aq.*, q.question_text, q.correct_answer, q.explanation
        FROM public.attempt_questions aq
        JOIN public.questions q ON q.id = aq.question_id
        WHERE aq.attempt_id = p_attempt_id
        ORDER BY aq.display_order ASC
    ) LOOP
        SELECT * INTO v_ans FROM public.answers
        WHERE attempt_id = p_attempt_id AND question_id = v_aq.question_id;

        -- Find which display letter corresponds to the correct_answer
        -- aq.option_order is e.g. ["C", "A", "D", "B"]
        v_display_correct := CASE
            WHEN v_aq.option_order->>0 = v_aq.correct_answer THEN 'A'
            WHEN v_aq.option_order->>1 = v_aq.correct_answer THEN 'B'
            WHEN v_aq.option_order->>2 = v_aq.correct_answer THEN 'C'
            WHEN v_aq.option_order->>3 = v_aq.correct_answer THEN 'D'
        END;

        v_review_item := jsonb_build_object(
            'display_order', v_aq.display_order,
            'question_text', v_aq.question_text,
            'selected_answer', v_ans.selected_answer,
            'correct_answer', v_display_correct,
            'is_correct', COALESCE(v_ans.is_correct, false),
            'explanation', v_aq.explanation
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
        'penalty_seconds', v_attempt.penalty_seconds,
        'final_time_seconds', v_attempt.final_time_seconds,
        'questions_review', v_review_list
    );
END;
$$;

-- ==============================================================================
-- LEADERBOARD & HISTORY FUNCTIONS
-- ==============================================================================

-- 1. DAILY LEADERBOARD
-- Completed/auto-submitted ranked by: final_time_seconds ASC, submitted_at ASC
-- Missed participants shown at bottom without rank
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

    -- Ranked participants (completed or auto_submitted)
    FOR v_row IN (
        SELECT 
            qa.id AS attempt_id,
            qa.status,
            qa.actual_time_seconds,
            qa.wrong_count,
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
        ORDER BY qa.final_time_seconds ASC, qa.submitted_at ASC
    ) LOOP
        v_ranked_list := v_ranked_list || jsonb_build_array(jsonb_build_object(
            'rank', v_current_rank,
            'user_id', v_row.user_id,
            'full_name', v_row.full_name,
            'avatar_url', v_row.avatar_url,
            'status', v_row.status,
            'actual_time_seconds', v_row.actual_time_seconds,
            'wrong_count', v_row.wrong_count,
            'penalty_seconds', v_row.penalty_seconds,
            'final_time_seconds', v_row.final_time_seconds,
            'submitted_at', v_row.submitted_at
        ));
        v_current_rank := v_current_rank + 1;
    END LOOP;

    -- If quiz has closed, append MISSED users (normal users with no attempt)
    IF v_is_closed THEN
        FOR v_row IN (
            SELECT p.id AS user_id, p.full_name, p.avatar_url
            FROM public.profiles p
            WHERE p.role = 'user'
              AND NOT EXISTS (
                  SELECT 1 FROM public.quiz_attempts qa
                  WHERE qa.quiz_id = p_quiz_id AND qa.user_id = p.id
              )
            ORDER BY p.full_name ASC
        ) LOOP
            v_missed_list := v_missed_list || jsonb_build_array(jsonb_build_object(
                'rank', null,
                'user_id', v_row.user_id,
                'full_name', v_row.full_name,
                'avatar_url', v_row.avatar_url,
                'status', 'missed',
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

-- 2. OVERALL LEADERBOARD (ALL-TIME)
-- SUM(final_time_seconds) across completed/auto_submitted quizzes.
-- Missed quizzes contribute 0 seconds (no penalty).
-- Sort by: total_time_seconds ASC, latest_submitted_at ASC
CREATE OR REPLACE FUNCTION public.get_overall_leaderboard()
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_list JSONB := '[]'::JSONB;
    v_row RECORD;
    v_rank INTEGER := 1;
BEGIN
    FOR v_row IN (
        SELECT 
            p.id AS user_id,
            p.full_name,
            p.email,
            p.avatar_url,
            COUNT(qa.id)::INTEGER AS completed_quizzes,
            SUM(qa.final_time_seconds)::INTEGER AS total_time_seconds,
            MAX(qa.submitted_at) AS latest_submitted_at
        FROM public.profiles p
        JOIN public.quiz_attempts qa ON qa.user_id = p.id
        WHERE qa.status IN ('completed', 'auto_submitted')
        GROUP BY p.id, p.full_name, p.email, p.avatar_url
        HAVING COUNT(qa.id) > 0
        ORDER BY SUM(qa.final_time_seconds) ASC, MAX(qa.submitted_at) ASC
    ) LOOP
        v_list := v_list || jsonb_build_array(jsonb_build_object(
            'rank', v_rank,
            'user_id', v_row.user_id,
            'full_name', v_row.full_name,
            'avatar_url', v_row.avatar_url,
            'completed_quizzes', v_row.completed_quizzes,
            'total_time_seconds', v_row.total_time_seconds,
            'latest_submitted_at', v_row.latest_submitted_at
        ));
        v_rank := v_rank + 1;
    END LOOP;

    RETURN jsonb_build_object(
        'overall_leaderboard', v_list
    );
END;
$$;

-- 3. USER QUIZ HISTORY
-- Lists all historical quizzes and user status: COMPLETED, AUTO_SUBMITTED, MISSED, ACTIVE, or NOT_STARTED
CREATE OR REPLACE FUNCTION public.get_user_quiz_history()
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_user_id UUID := auth.uid();
    v_list JSONB := '[]'::JSONB;
    v_row RECORD;
    v_derived_status TEXT;
BEGIN
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Not authenticated.';
    END IF;

    FOR v_row IN (
        SELECT 
            q.id AS quiz_id,
            q.title,
            q.quiz_date,
            q.start_time,
            q.end_time,
            q.status AS quiz_status,
            qa.id AS attempt_id,
            qa.status AS attempt_status,
            qa.actual_time_seconds,
            qa.wrong_count,
            qa.penalty_seconds,
            qa.final_time_seconds,
            qa.submitted_at
        FROM public.quizzes q
        LEFT JOIN public.quiz_attempts qa ON qa.quiz_id = q.id AND qa.user_id = v_user_id
        WHERE q.status IN ('published', 'closed')
        ORDER BY q.quiz_date DESC
    ) LOOP
        IF v_row.attempt_status IS NOT NULL THEN
            v_derived_status := v_row.attempt_status;
        ELSIF now() >= v_row.end_time OR v_row.quiz_status = 'closed' THEN
            v_derived_status := 'missed';
        ELSE
            v_derived_status := 'not_started';
        END IF;

        v_list := v_list || jsonb_build_array(jsonb_build_object(
            'quiz_id', v_row.quiz_id,
            'title', v_row.title,
            'quiz_date', v_row.quiz_date,
            'start_time', v_row.start_time,
            'end_time', v_row.end_time,
            'status', v_derived_status,
            'attempt_id', v_row.attempt_id,
            'final_time_seconds', v_row.final_time_seconds,
            'submitted_at', v_row.submitted_at
        ));
    END LOOP;

    RETURN jsonb_build_object(
        'history', v_list
    );
END;
$$;
