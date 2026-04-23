/**
 * Auth Types
 * 
 * 인증 관련 타입 정의
 */

import { User as SupabaseUser, Session as SupabaseSession } from '@supabase/supabase-js';

/**
 * 사용자 정보 (Supabase User 타입 사용)
 */
export type User = SupabaseUser;

/**
 * 인증 세션
 */
export type AuthSession = SupabaseSession;
