/**
 * Auth Types
 * 
 * 인증 관련 타입 정의
 */

import { User as SupabaseUser, Session as SupabaseSession } from '@supabase/supabase-js';

/**
 * 사용자 정보
 */
export interface User extends SupabaseUser {
  id: string;
  email: string;
  phone?: string;
  created_at?: string;
}

/**
 * 인증 세션
 */
export type AuthSession = SupabaseSession;
