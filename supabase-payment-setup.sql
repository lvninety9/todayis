-- Todayis Project - Payment System Database Setup
-- 이 스크립트를 Supabase SQL 에디터에서 실행하세요

-- 1. payments 테이블 생성
CREATE TABLE IF NOT EXISTS public.payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    template_id UUID REFERENCES public.templates(id),
    amount INTEGER NOT NULL,
    status TEXT NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'DONE', 'CANCELED', 'EXPIRED')),
    payment_key TEXT UNIQUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. templates 테이블 확장 (가격 컬럼 추가)
ALTER TABLE public.templates ADD COLUMN IF NOT EXISTS price INTEGER NOT NULL DEFAULT 0;
ALTER TABLE public.templates ADD COLUMN IF NOT EXISTS is_premium BOOLEAN NOT NULL DEFAULT false;

-- 3. 인덱스 생성 (성능 최적화)
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON public.payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_template_id ON public.payments(template_id);
CREATE INDEX IF NOT EXISTS idx_templates_is_premium ON public.templates(is_premium);

-- 4. RLS (Row Level Security) 활성화
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- 5. RLS 정책 설정
DROP POLICY IF EXISTS "Users can view own payments" ON public.payments;
CREATE POLICY "Users can view own payments"
    ON public.payments
    FOR SELECT
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can manage own payments" ON public.payments;
CREATE POLICY "Users can manage own payments"
    ON public.payments
    FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Anyone can view completed payments for templates" ON public.payments;
CREATE POLICY "Anyone can view completed payments for templates"
    ON public.payments
    FOR SELECT
    USING (status = 'DONE');

-- 6. 기존 템플릿에 기본 가격 설정 (무료 템플릿 제외)
UPDATE public.templates SET price = 9900, is_premium = true WHERE is_premium = false;
