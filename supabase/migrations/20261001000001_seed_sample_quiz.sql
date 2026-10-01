-- ==============================================================================
-- NIRMAAN DAILY QUIZ SEED & ADMIN SETUP
-- Admin: 25mc3027@rgipt.ac.in (Aman)
-- ==============================================================================

DO $$
DECLARE
    v_admin_id UUID;
    v_q1 UUID;
    v_q2 UUID;
    v_q3 UUID;
    v_quiz_id UUID;
BEGIN
    -- Check if user with admin email already exists in profiles
    SELECT id INTO v_admin_id FROM public.profiles WHERE LOWER(email) = '25mc3027@rgipt.ac.in';

    IF v_admin_id IS NOT NULL THEN
        -- Elevate to admin
        UPDATE public.profiles
        SET role = 'admin', updated_at = now()
        WHERE id = v_admin_id;

        RAISE NOTICE 'Elevated existing profile % to admin.', v_admin_id;
    ELSE
        RAISE NOTICE 'Admin profile for 25mc3027@rgipt.ac.in not yet registered. Trigger will automatically assign admin role upon registration.';
    END IF;
END $$;
