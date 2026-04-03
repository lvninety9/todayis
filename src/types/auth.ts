/**
 * Authentication Types
 * 
 * Supabase Auth 관련 타입 정의
 * D-01: Supabase Auth 사용 per user decision
 */

export interface User {
  id: string
  email: string
  user_metadata: {
    name?: string
    avatar_url?: string
  }
  created_at: string
}

export interface AuthResponse {
  user: User | null
  error: string | null
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface SignupCredentials {
  email: string
  password: string
  name: string
}

export type AuthProvider = 'google' | 'github'
