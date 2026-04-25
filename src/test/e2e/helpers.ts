import { type Page } from '@playwright/test';

/**
 * Mock 세션 데이터
 */
export const MOCK_SESSION = {
  access_token: 'test-jwt-token',
  refresh_token: 'test-refresh-token',
  expires_at: Math.floor(Date.now() / 1000) + 3600,
  expires_in: 3600,
  token_type: 'bearer' as const,
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
 * Supabase project ref
 */
export const SUPABASE_PROJECT_REF = 'jiesomglvobttxujsakz';

/**
 * Supabase auth token localStorage key
 */
export const AUTH_TOKEN_KEY = `sb-${SUPABASE_PROJECT_REF}-auth-token`;

/**
 * 페이지에 Mock 세션 설정
 * 
 * 1. localStorage에 Mock session 저장
 * 2. __SUPABASE_MOCK_MODE__ 플래그 설정 (client.ts가 mock client 사용하도록 함)
 */
export async function setMockSession(page: Page) {
  // localStorage에 Mock session 및 mock mode 플래그 저장
  await page.addInitScript(() => {
    const mockSession = {
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
    
    // Mock session 저장
    localStorage.setItem(`sb-jiesomglvobttxujsakz-auth-token`, JSON.stringify(mockSession));
    
    // Mock mode 플래그 설정 (client.ts가 이 플래그를 감지하여 mock client 사용)
    localStorage.setItem('__SUPABASE_MOCK_MODE__', 'true');
  });
}