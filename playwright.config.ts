import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright 설정 파일
 * 
 * 핵심 사용자 플로우 E2E 테스트 구성
 * - 로그인/회원가입 플로우
 * - 템플릿 관리 플로우
 * - 초대장 공개 플로우
 * - 프로필/설정 플로우
 */
export default defineConfig({
  testDir: './src/test/e2e',
  testMatch: '**/*.e2e.ts',
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
    actionTimeout: 10000,
    navigationTimeout: 30000,
  },
  projects: [
    {
      name: 'setup',
      testMatch: /global\.setup\.ts/,
    },
    {
      name: 'login',
      dependencies: ['setup'],
      testMatch: /login\.e2e\.ts/,
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'template',
      dependencies: ['setup'],
      testMatch: /template\.e2e\.ts/,
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'publish',
      dependencies: ['setup'],
      testMatch: /publish\.e2e\.ts/,
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'profile',
      dependencies: ['setup'],
      testMatch: /profile\.e2e\.ts/,
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'debug',
      dependencies: ['setup'],
      testMatch: /debug\.e2e\.ts/,
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: 'npm run dev',
    port: 3000,
    reuseExistingServer: true,
    stdout: 'pipe',
    env: {
      NEXT_PUBLIC_SUPABASE_URL: 'http://localhost:54321',
    },
  },
});
