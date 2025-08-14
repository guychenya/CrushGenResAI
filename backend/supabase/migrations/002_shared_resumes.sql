-- Create shared_resumes table
CREATE TABLE IF NOT EXISTS public.shared_resumes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    resume_id UUID REFERENCES public.resumes(id) ON DELETE CASCADE,
    shared_by_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    shared_with_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    permissions TEXT NOT NULL DEFAULT 'view', -- 'view' or 'edit'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_share UNIQUE (resume_id, shared_with_user_id)
);
