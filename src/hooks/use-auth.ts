'use client'

import { createClient } from '@/lib/supabase/client'
import { User, LoginCredentials, SignupCredentials, AuthProvider, AuthResponse } from '@/types/auth'
import { useState, useEffect } from 'react'

/**
 * Authentication State Interface
 */
interface AuthState {
  user: User | null
  isLoading: boolean
  error: string | null
}

/**
 * useAuth Hook
 * 
 * Supabase Auth 연동 커스텀 훅
 * Client-side session management 및 인증 상태 관리
 * 
 * @returns {user, isLoading, error, signIn, signUp, signOut, signInWithProvider}
 */
export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: true,
    error: null,
  })

  const supabase = createClient()

  /**
   * Session loading 및 auth state change listener
   */
  useEffect(() => {
    let mounted = true

    // Load initial session
    const loadSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (!mounted) return
        
        if (error) {
          setState(prev => ({ ...prev, isLoading: false, error: error.message }))
          return
        }

        if (session) {
          const { data: { user } } = await supabase.auth.getUser()
          setState({
            user: user as User,
            isLoading: false,
            error: null,
          })
        } else {
          setState({
            user: null,
            isLoading: false,
            error: null,
          })
        }
      } catch (err) {
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: err instanceof Error ? err.message : 'Unknown error',
        }))
      }
    }

    loadSession()

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return

        try {
          if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
            const { data: { user } } = await supabase.auth.getUser()
            setState({
              user: user as User,
              isLoading: false,
              error: null,
            })
          } else if (event === 'SIGNED_OUT') {
            setState({
              user: null,
              isLoading: false,
              error: null,
            })
          } else if (event === 'USER_UPDATED') {
            const { data: { user } } = await supabase.auth.getUser()
            setState(prev => ({
              ...prev,
              user: user as User,
              isLoading: false,
              error: null,
            }))
          }
        } catch (err) {
          setState(prev => ({
            ...prev,
            error: err instanceof Error ? err.message : 'Unknown error',
          }))
        }
      }
    )

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [supabase])

  /**
   * Email/Password 로그인
   */
  const signIn = async (credentials: LoginCredentials): Promise<AuthResponse> => {
    setState(prev => ({ ...prev, isLoading: true, error: null }))

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      })

      if (error) {
        // Supabase error codes 처리
        let message = error.message
        if (error.message.includes('Invalid login credentials')) {
          message = '이메일 또는 비밀번호가 잘못되었습니다.'
        } else if (error.message.includes('Email not confirmed')) {
          message = '이메일 인증이 필요합니다.'
        }

        setState(prev => ({ ...prev, isLoading: false, error: message }))
        return { user: null, error: message }
      }

      if (data.user) {
        const { data: { user } } = await supabase.auth.getUser()
        setState({
          user: user as User,
          isLoading: false,
          error: null,
        })
        return { user: user as User, error: null }
      }

      return { user: null, error: '로그인 실패' }
    } catch (err) {
      const message = err instanceof Error ? err.message : '로그인 중 오류가 발생했습니다.'
      setState(prev => ({ ...prev, isLoading: false, error: message }))
      return { user: null, error: message }
    }
  }

  /**
   * Email/Password 회원가입
   */
  const signUp = async (credentials: SignupCredentials): Promise<AuthResponse> => {
    setState(prev => ({ ...prev, isLoading: true, error: null }))

    try {
      const { data, error } = await supabase.auth.signUp({
        email: credentials.email,
        password: credentials.password,
        options: {
          data: {
            name: credentials.name,
          },
        },
      })

      if (error) {
        let message = error.message
        if (error.message.includes('User already registered')) {
          message = '이미 가입된 이메일입니다.'
        } else if (error.message.includes('password should be at least')) {
          message = '비밀번호는 6 자 이상이어야 합니다.'
        }

        setState(prev => ({ ...prev, isLoading: false, error: message }))
        return { user: null, error: message }
      }

      // 회원가입 성공 (자동 로그인)
      if (data.user) {
        const { data: { user } } = await supabase.auth.getUser()
        setState({
          user: user as User,
          isLoading: false,
          error: null,
        })
        return { user: user as User, error: null }
      }

      return { user: null, error: '회원가입 실패' }
    } catch (err) {
      const message = err instanceof Error ? err.message : '회원가입 중 오류가 발생했습니다.'
      setState(prev => ({ ...prev, isLoading: false, error: message }))
      return { user: null, error: message }
    }
  }

  /**
   * 로그아웃
   */
  const signOut = async (): Promise<void> => {
    setState(prev => ({ ...prev, isLoading: true, error: null }))

    try {
      const { error } = await supabase.auth.signOut()
      
      if (error) {
        setState(prev => ({ ...prev, isLoading: false, error: error.message }))
        return
      }

      setState({
        user: null,
        isLoading: false,
        error: null,
      })
    } catch (err) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: err instanceof Error ? err.message : '로그아웃 중 오류가 발생했습니다.',
      }))
    }
  }

  /**
   * 소셜 로그인 (OAuth)
   */
  const signInWithProvider = (provider: AuthProvider): void => {
    try {
      const redirectTo = `${window.location.origin}/auth/callback`
      
      if (provider === 'google') {
        supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo,
          },
        })
      } else if (provider === 'github') {
        supabase.auth.signInWithOAuth({
          provider: 'github',
          options: {
            redirectTo,
          },
        })
      }
    } catch (err) {
      setState(prev => ({
        ...prev,
        error: err instanceof Error ? err.message : '소셜 로그인 중 오류가 발생했습니다.',
      }))
    }
  }

  return {
    user: state.user,
    isLoading: state.isLoading,
    error: state.error,
    signIn,
    signUp,
    signOut,
    signInWithProvider,
  }
}
