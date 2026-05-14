-- Todayis Project - Guestbooks Table Setup
-- 방명록 테이블 생성 및 RLS 정책

-- 1. guestbooks 테이블 생성
CREATE TABLE IF NOT EXISTS public.guestbooks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    author TEXT NOT NULL DEFAULT '손님',
    message TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_guestbooks_created_at ON public.guestbooks(created_at DESC);

-- 3. RLS 활성화
ALTER TABLE public.guestbooks ENABLE ROW LEVEL SECURITY;

-- 4. RLS 정책 - 누구나 읽기 가능
DROP POLICY IF EXISTS "Anyone can view guestbooks" ON public.guestbooks;
CREATE POLICY "Anyone can view guestbooks"
    ON public.guestbooks
    FOR SELECT
    USING (true);

-- 5. RLS 정책 - 누구나 쓰기 가능 (인증 불필요)
DROP POLICY IF EXISTS "Anyone can insert guestbooks" ON public.guestbooks;
CREATE POLICY "Anyone can insert guestbooks"
    ON public.guestbooks
    FOR INSERT
    WITH CHECK (true);

-- 6. updated_at 자동 업데이트 트리거
DROP TRIGGER IF EXISTS update_guestbooks_updated_at ON public.guestbooks;
CREATE TRIGGER update_guestbooks_updated_at
    BEFORE UPDATE ON public.guestbooks
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
