export interface User {
  id: string;
  email: string;
  phone?: string;
  confirmed_at?: string;
  created_at?: string;
  updated_at?: string;
}

export interface AuthSession {
  user: User;
  access_token: string;
  refresh_token: string;
  expires_at: number;
  token_type: string;
}

export type AuthProvider = 'google' | 'github' | 'email' | null;

export interface AuthState {
  user: User | null;
  session: AuthSession | null;
  provider: AuthProvider;
  loading: boolean;
  error: string | null;
}

export interface SignUpParams {
  email: string;
  password: string;
  options?: {
    emailRedirectTo?: string;
  };
}

export interface SignInParams {
  email: string;
  password: string;
}

export interface SignInWithOAuthParams {
  provider: 'google' | 'github';
  options?: {
    redirectTo?: string;
    scopes?: string;
  };
}

export interface AuthResponse {
  data: {
    user: User | null;
    session: AuthSession | null;
  };
  error: Error | null;
}
