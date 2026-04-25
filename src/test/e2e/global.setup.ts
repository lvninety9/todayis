import { type Page } from '@playwright/test';
import { setMockSession } from './helpers';

/**
 * 페이지에 Mock 세션 설정 (global.setup.ts에서도 사용)
 * 
 * localStorage에 Supabase auth token을 사전 설정하여
 * supabase.auth.getSession()이 실제 서버 호출 없이 세션을 복원하도록 함
 * 
 * IMPORTANT: page.goto() 전에 호출 MUST
 */
export { setMockSession };

/**
 * Mock Supabase Auth Server
 * 
 * E2E 테스트용 로컬 Mock Supabase 서버.
 * 브라우저의 Supabase 클라이언트가 localhost:54321로 요청을 보내면
 * Mock session을 반환하여 인증을 성공시킴.
 */
class MockSupabaseServer {
  private server: any = null;
  private port = 54321;

  async start() {
    const http = await import('http');
    
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

    return new Promise<void>((resolve, reject) => {
      this.server = http.createServer((req: any, res: any) => {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type, apikey');
        res.setHeader('Access-Control-Allow-Credentials', 'true');

        if (req.method === 'OPTIONS') {
          res.writeHead(200);
          res.end();
          return;
        }

        const url = new URL(req.url, `http://localhost:${this.port}`);
        
        // Auth endpoints
        if (url.pathname === '/auth/v1/token' || url.pathname.includes('/token')) {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({
            access_token: mockSession.access_token,
            refresh_token: mockSession.refresh_token,
            expires_in: mockSession.expires_in,
            expires_at: mockSession.expires_at,
            token_type: mockSession.token_type,
          }));
          return;
        }

        if (url.pathname === '/auth/v1/session') {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(mockSession));
          return;
        }

        if (url.pathname === '/auth/v1/user') {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(mockSession.user));
          return;
        }

        // Database endpoints
        if (url.pathname.startsWith('/rest/v1/')) {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify([]));
          return;
        }

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({}));
      });

      this.server.on('error', (err: any) => {
        if (err.code === 'EADDRINUSE') {
          console.log('Mock Supabase server already running on port', this.port);
          resolve();
        } else {
          reject(err);
        }
      });

      this.server.listen(this.port, () => {
        console.log('Mock Supabase server started on port', this.port);
        resolve();
      });
    });
  }

  async stop() {
    if (this.server) {
      await new Promise<void>((resolve) => {
        this.server.close(() => resolve());
      });
    }
  }

  getUrl() {
    return `http://localhost:${this.port}`;
  }
}

let mockServer: MockSupabaseServer | null = null;

export async function startMockSupabaseServer() {
  if (!mockServer) {
    mockServer = new MockSupabaseServer();
    await mockServer.start();
  }
  return mockServer.getUrl();
}

export async function stopMockSupabaseServer() {
  if (mockServer) {
    await mockServer.stop();
    mockServer = null;
  }
}

export default async function globalSetup() {
  // Mock Supabase 서버 시작
  await startMockSupabaseServer();

  // Next.js 서버가 준비될 때까지 대기
  const baseURL = 'http://localhost:3000';

  const deadline = Date.now() + 60000;
  while (Date.now() < deadline) {
    try {
      const response = await fetch(`${baseURL}/login`, { method: 'HEAD' });
      if (response.ok) {
        return;
      }
    } catch {
      // 서버가 아직 시작되지 않음
    }
    await new Promise((r) => setTimeout(r, 1000));
  }
}

export { };