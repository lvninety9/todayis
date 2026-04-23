'use client';

import { useEffect, useState, useRef } from 'react';
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
  const hasInitialized = useRef(false);
  const lastSessionJson = useRef<string | null>(null);

  useEffect(() => {
    const initializeSession = async () => {
      try {
        const { data: { session: currentSession }, error } = await supabase.auth.getSession();

        if (error) {
          setSession({
            user: null,
            session: null,
            loading: false,
            error: error.message,
          });
          return;
        }

        const sessionJson = currentSession ? JSON.stringify(currentSession) : null;
        lastSessionJson.current = sessionJson;

        setSession({
          user: currentSession?.user ?? null,
          session: currentSession,
          loading: false,
          error: null,
        });

        hasInitialized.current = true;

        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          (_event, newSession) => {
            const newSessionJson = newSession ? JSON.stringify(newSession) : null;

            if (newSessionJson === lastSessionJson.current) {
              return;
            }

            lastSessionJson.current = newSessionJson;

            setSession({
              user: newSession?.user ?? null,
              session: newSession,
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

    if (!hasInitialized.current) {
      initializeSession();
    }
  }, []);

  return session;
}
