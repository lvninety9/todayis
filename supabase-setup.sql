-- Todayis Project - Supabase Database Setup
-- 이 스크립트를 Supabase SQL 에디터에서 실행하세요

-- 1. 기존 templates 테이블에 필요한 컬럼 추가
ALTER TABLE public.templates ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE public.templates ADD COLUMN IF NOT EXISTS thumbnail TEXT DEFAULT '';
ALTER TABLE public.templates ADD COLUMN IF NOT EXISTS fields JSONB NOT NULL DEFAULT '[]'::jsonb;
ALTER TABLE public.templates ADD COLUMN IF NOT EXISTS layout JSONB NOT NULL DEFAULT '{}'::jsonb;
ALTER TABLE public.templates ADD COLUMN IF NOT EXISTS is_published BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE public.templates ADD COLUMN IF NOT EXISTS download_count INTEGER NOT NULL DEFAULT 0;

-- 2. 인덱스 생성 (성능 최적화)
CREATE INDEX IF NOT EXISTS idx_templates_user_id ON public.templates(user_id);
CREATE INDEX IF NOT EXISTS idx_templates_is_published ON public.templates(is_published);

-- 3. RLS (Row Level Security) 활성화
ALTER TABLE public.templates ENABLE ROW LEVEL SECURITY;

-- 4. RLS 정책 설정
DROP POLICY IF EXISTS "Users can manage own templates" ON public.templates;
CREATE POLICY "Users can manage own templates"
    ON public.templates
    FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Anyone can view published templates" ON public.templates;
CREATE POLICY "Anyone can view published templates"
    ON public.templates
    FOR SELECT
    USING (is_published = true);

-- 5. updated_at 자동 업데이트 트리거
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_templates_updated_at ON public.templates;
CREATE TRIGGER update_templates_updated_at
    BEFORE UPDATE ON public.templates
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();