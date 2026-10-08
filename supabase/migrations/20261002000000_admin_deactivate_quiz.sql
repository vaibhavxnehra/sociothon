-- Migration: Add admin_deactivate_quiz RPC
-- Safe deactivation of a published quiz preserving all questions, attempts, and historical results.

CREATE OR REPLACE FUNCTION public.admin_deactivate_quiz(
    p_quiz_id UUID
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_quiz RECORD;
BEGIN
    IF NOT public.is_admin() THEN
        RAISE EXCEPTION 'Unauthorized: Admin role required.';
    END IF;

    SELECT * INTO v_quiz FROM public.quizzes WHERE id = p_quiz_id;
    IF v_quiz.id IS NULL THEN
        RAISE EXCEPTION 'Quiz not found.';
    END IF;

    IF v_quiz.status != 'published' THEN
        RAISE EXCEPTION 'Only published quizzes can be deactivated. Current status: %', v_quiz.status;
    END IF;

    -- Update only status to 'closed'. All questions, attempts, answers, and leaderboards are preserved.
    UPDATE public.quizzes
    SET status = 'closed',
        updated_at = now()
    WHERE id = p_quiz_id;

    -- Log admin audit activity
    INSERT INTO public.admin_activity (admin_id, action, target_type, target_id, metadata)
    VALUES (
        auth.uid(),
        'DEACTIVATE_QUIZ',
        'quiz',
        p_quiz_id,
        jsonb_build_object(
            'deactivated_at', now(),
            'quiz_date', v_quiz.quiz_date,
            'title', v_quiz.title,
            'previous_status', v_quiz.status
        )
    );
END;
$$;

GRANT EXECUTE ON FUNCTION public.admin_deactivate_quiz(UUID) TO authenticated;
