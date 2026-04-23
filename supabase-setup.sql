-- Todayis Project - Supabase Database Setup
-- 이 스크립트를 Supabase SQL 에디터에서 실행하세요

-- 1. templates 테이블 생성
CREATE TABLE IF NOT EXISTS public.templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL DEFAULT 'general',
    thumbnail TEXT DEFAULT '',
    fields JSONB NOT NULL DEFAULT '[]'::jsonb,
    layout JSONB NOT NULL DEFAULT '{}'::jsonb,
    is_published BOOLEAN NOT NULL DEFAULT false,
    download_count INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. RLS (Row Level Security) 활성화
ALTER TABLE public.templates ENABLE ROW LEVEL SECURITY;

-- 3. 사용자는 자신의 템플릿만 조회/수정/삭제 가능
CREATE POLICY "Users can manage own templates"
    ON public.templates
    FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- 4. 공개된 템플릿은所有人都能看到 (읽기 전용)
CREATE POLICY "Anyone can view published templates"
    ON public.templates
    FOR SELECT
    USING (is_published = true);

-- 5. 인덱스 생성 (성능 최적화)
CREATE INDEX IF NOT EXISTS idx_templates_user_id ON public.templates(user_id);
CREATE INDEX IF NOT EXISTS idx_templates_is_published ON public.templates(is_published);
CREATE INDEX IF NOT EXISTS idx_templates_created_at ON public.templates(created_at DESC);

-- 6. updated_at 자동 업데이트 트리거
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_templates_updated_at
    BEFORE UPDATE ON public.templates
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();