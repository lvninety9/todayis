/**
 * Supabase Client
 * 
 * 클라이언트용 Supabase 인스턴스
 * E2E 테스트에서 __SUPABASE_MOCK_MODE__ 플래그가 설정되면 mock client 반환
 */

import { createBrowserClient } from '@supabase/ssr';
import type { SupabaseClient } from '@supabase/supabase-js';

/**
 * Mock session data for E2E tests
 */
export const MOCK_SESSION = {
  access_token: 'test-jwt-token',
  refresh_token: 'test-refresh-token',
  expires_at: Math.floor(Date.now() / 1000) + 3600,
  expires_in: 3600,
  token_type: 'bearer',
  user: {
    id: 'test-user-123',
    email: 'test@test.com',
    aud: 'authenticated',
    role: 'authenticated',
    app_metadata: { provider: 'email' },
    user_metadata: { nickname: '테스트사용자' },
    identities: [{ id: 'test-user-123', identity_data: { email: 'test@test.com' } }]
  }
};

/**
 * Check if E2E test mock mode is enabled
 */
function isMockMode(): boolean {
  if (typeof window === 'undefined') return false;
  return window.localStorage?.getItem('__SUPABASE_MOCK_MODE__') === 'true';
}

/**
 * Check if dev mode is enabled (for local development without auth)
 * Auto-enabled in development mode
 */
function isDevMode(): boolean {
  if (typeof window === 'undefined') return false;
  // Auto-enable in dev environment
  if (process.env.NODE_ENV === 'development') {
    // Auto-set if not already set
    if (!localStorage.getItem('__DEV_MODE__')) {
      localStorage.setItem('__DEV_MODE__', 'true');
    }
    return true;
  }
  return window.localStorage?.getItem('__DEV_MODE__') === 'true';
}

/**
 * Mock Supabase client for E2E testing
 */
function createMockClient(): SupabaseClient {
  const AUTH_KEY = 'sb-jiesomglvobttxujsakz-auth-token';
  
  return {
    auth: {
      getSession: async () => {
        let session = MOCK_SESSION;
        if (typeof window !== 'undefined') {
          const stored = window.localStorage.getItem(AUTH_KEY);
          if (stored) {
            try {
              session = JSON.parse(stored);
            } catch {
              // use default
            }
          }
        }
        return { data: { session }, error: null };
      },
      
      getUser: async () => {
        let session = MOCK_SESSION;
        if (typeof window !== 'undefined') {
          const stored = window.localStorage.getItem(AUTH_KEY);
          if (stored) {
            try {
              session = JSON.parse(stored);
            } catch {
              // use default
            }
          }
        }
        return { data: { user: session?.user ?? null }, error: null };
      },
      
      setSession: async (session: any) => {
        if (typeof window !== 'undefined' && session) {
          window.localStorage.setItem(AUTH_KEY, JSON.stringify(session));
        }
        return { data: { session: session ?? MOCK_SESSION, user: session?.user ?? MOCK_SESSION.user }, error: null };
      },
      
      signInWithPassword: async ({ email, password }: { email: string; password: string }) => {
        if (email && password) {
          return { data: { session: MOCK_SESSION, user: MOCK_SESSION.user }, error: null };
        }
        return { data: { session: null, user: null }, error: { message: 'Invalid credentials' } };
      },
      
      signUp: async ({ email, password }: { email: string; password: string }) => {
        return { data: { session: MOCK_SESSION, user: { ...MOCK_SESSION.user, email } }, error: null };
      },
      
      signOut: async () => {
        if (typeof window !== 'undefined') {
          window.localStorage.removeItem(AUTH_KEY);
        }
        return { error: null };
      },
      
      resetPasswordForEmail: async () => {
        return { data: {}, error: null };
      },
      
      updateUser: async () => {
        let session = MOCK_SESSION;
        if (typeof window !== 'undefined') {
          const stored = window.localStorage.getItem(AUTH_KEY);
          if (stored) {
            try {
              session = JSON.parse(stored);
            } catch {
              // use default
            }
          }
        }
        return { data: { user: session?.user ?? null }, error: null };
      },
      
      onAuthStateChange: (callback: (event: string, session: any) => void) => {
        let session = MOCK_SESSION;
        if (typeof window !== 'undefined') {
          const stored = window.localStorage.getItem(AUTH_KEY);
          if (stored) {
            try {
              session = JSON.parse(stored);
            } catch {
              // use default
            }
          }
        }
        callback('INITIAL_SESSION', session);
        return { data: { subscription: { unsubscribe: () => {} } } };
      },
    },
    
    from: () => ({
      select: () => ({
        eq: () => ({
          single: async () => ({ data: null, error: null }),
          maybeSingle: async () => ({ data: null, error: null }),
        }),
        order: () => ({
          limit: () => ({
            single: async () => ({ data: null, error: null }),
            maybeSingle: async () => ({ data: null, error: null }),
          }),
        }),
        limit: () => ({
          single: async () => ({ data: null, error: null }),
          maybeSingle: async () => ({ data: null, error: null }),
        }),
        single: async () => ({ data: null, error: null }),
        maybeSingle: async () => ({ data: null, error: null }),
      }),
      insert: () => ({
        select: () => ({
          single: async () => ({ data: null, error: null }),
          maybeSingle: async () => ({ data: null, error: null }),
        }),
        single: async () => ({ data: null, error: null }),
      }),
      update: () => ({
        eq: () => ({
          select: () => ({
            single: async () => ({ data: null, error: null }),
            maybeSingle: async () => ({ data: null, error: null }),
          }),
          single: async () => ({ data: null, error: null }),
        }),
        select: () => ({
          single: async () => ({ data: null, error: null }),
          maybeSingle: async () => ({ data: null, error: null }),
        }),
        single: async () => ({ data: null, error: null }),
      }),
      delete: () => ({
        eq: () => ({
          select: () => ({
            single: async () => ({ data: null, error: null }),
            maybeSingle: async () => ({ data: null, error: null }),
          }),
          single: async () => ({ data: null, error: null }),
        }),
        single: async () => ({ data: null, error: null }),
      }),
    }),
  } as unknown as SupabaseClient;
}

// Create client based on mock/dev mode
let supabaseInstance: SupabaseClient | null = null;

function getSupabase(): SupabaseClient {
  if (typeof window === 'undefined') {
    // Server-side: always use real client
    return createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
  }
  
  // Client-side: check mock mode only (not dev mode - dev mode uses real auth)
  if (isMockMode()) {
    if (!supabaseInstance) {
      supabaseInstance = createMockClient();
    }
    return supabaseInstance;
  }
  
  // Normal/dev mode: use real client (dev mode bypasses API auth, not Supabase auth)
  if (!supabaseInstance) {
    supabaseInstance = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
  }
  return supabaseInstance;
}

// Export as proxy to allow dynamic switching
export const supabase = new Proxy({} as SupabaseClient, {
  get(_, prop) {
    const client = getSupabase();
    const value = (client as any)[prop];
    if (typeof value === 'function') {
      return value.bind(client);
    }
    return value;
  },
});

// Factory function for cases where you need a fresh instance
export function createClient(): SupabaseClient {
  if (typeof window !== 'undefined' && isMockMode()) {
    return createMockClient();
  }
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}