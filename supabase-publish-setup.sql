-- Todayis Project - Supabase Publish System Setup
-- 이 스크립트를 Supabase SQL 에디터에서 실행하세요

-- 1. invitations 테이블 생성
CREATE TABLE IF NOT EXISTS public.invitations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    template_id UUID REFERENCES public.templates(id) ON DELETE CASCADE,
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL DEFAULT '웨딩 초대장',
    data JSONB NOT NULL DEFAULT '{}'::jsonb,
    layout JSONB NOT NULL DEFAULT '{}'::jsonb,
    is_published BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. 인덱스 생성 (성능 최적화)
CREATE INDEX IF NOT EXISTS idx_invitations_slug ON public.invitations(slug);
CREATE INDEX IF NOT EXISTS idx_invitations_user_id ON public.invitations(user_id);
CREATE INDEX IF NOT EXISTS idx_invitations_template_id ON public.invitations(template_id);
CREATE INDEX IF NOT EXISTS idx_invitations_is_published ON public.invitations(is_published);

-- 3. RLS (Row Level Security) 활성화
ALTER TABLE public.invitations ENABLE ROW LEVEL SECURITY;

-- 4. RLS 정책 설정
DROP POLICY IF EXISTS "Users can manage own invitations" ON public.invitations;
CREATE POLICY "Users can manage own invitations"
    ON public.invitations
    FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Anyone can view published invitations" ON public.invitations;
CREATE POLICY "Anyone can view published invitations"
    ON public.invitations
    FOR SELECT
    USING (is_published = true);

-- 5. updated_at 자동 업데이트 트리거
DROP TRIGGER IF EXISTS update_invitations_updated_at ON public.invitations;
CREATE TRIGGER update_invitations_updated_at
    BEFORE UPDATE ON public.invitations
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
