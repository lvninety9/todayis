/**
 * Supabase Client
 * 
 * 클라이언트용 Supabase 인스턴스
 */

import { createBrowserClient } from '@supabase/ssr';

// Singleton instance for direct use in hooks/components
export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Factory function for cases where you need a fresh instance
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
