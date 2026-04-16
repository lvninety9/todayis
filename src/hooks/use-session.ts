'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { User, AuthSession } from '@/types/auth';

export interface Session {
  user: User | null;
  session: AuthSession | null;
  loading: boolean;
  error: string | null;
}

export function useSession() {
  const [session, setSession] = useState<Session>({
    user: null,
    session: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    // Get initial session
    const initializeSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        setSession({
          user: session?.user ?? null,
          session,
          loading: false,
          error: null,
        });

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (_event, session) => {
            setSession({
              user: session?.user ?? null,
              session,
              loading: false,
              error: null,
            });
          }
        );

        return () => subscription.unsubscribe();
      } catch (error) {
        setSession({
          user: null,
          session: null,
          loading: false,
          error: error instanceof Error ? error.message : '세션 초기화에 실패했습니다.',
        });
      }
    };

    initializeSession();
  }, []);

  return session;
}
