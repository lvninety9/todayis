/**
 * Supabase Server Client
 * 
 * 서버 사이드에서 사용하는 Supabase 인스턴스
 * service_role 키로 모든 테이블에 접근 가능
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

/**
 * 서버 사이드 Supabase 클라이언트 (service_role)
 */
export function createSupabaseServerClient() {
  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
