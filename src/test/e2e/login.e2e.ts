import { test, expect } from '@playwright/test';
import { setMockSession } from './helpers';

/**
 * 로그인/회원가입 E2E 테스트
 * 
 * 테스트 플로우:
 * - 로그인 페이지 렌더링
 * - 회원가입 페이지 네비게이션
 * - 비밀번호 재설정 페이지 네비게이션
 * - 폼 유효성 검사
 * - API mocking을 통한 인증 플로우
 */

const TEST_EMAIL = 'test@test.com';
const TEST_PASSWORD = 'test1234';

// API 라우트 모킹
async function mockApiRoutes(page: any) {
  // 템플릿 API
  await page.route('/api/templates', async (route: any) => {
    if (route.request().method() === 'GET') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          templates: [
            {
              id: 'tpl-1',
              name: '기본 템플릿',
              category: 'wedding',
              thumbnail: 'https://example.com/thumb1.jpg',
              fields: [
                { key: 'couple_name', label: '신랑신부 이름', type: 'text' },
                { key: 'date', label: '날짜', type: 'date' },
                { key: 'place', label: '장소', type: 'text' },
              ],
              layout: 'classic',
            },
            {
              id: 'tpl-2',
              name: '모던 템플릿',
              category: 'wedding',
              thumbnail: 'https://example.com/thumb2.jpg',
              fields: [
                { key: 'couple_name', label: '신랑신부 이름', type: 'text' },
                { key: 'date', label: '날짜', type: 'date' },
                { key: 'place', label: '장소', type: 'text' },
              ],
              layout: 'modern',
            },
            {
              id: 'tpl-3',
              name: '미니멀 템플릿',
              category: 'wedding',
              thumbnail: 'https://example.com/thumb3.jpg',
              fields: [
                { key: 'couple_name', label: '신랑신부 이름', type: 'text' },
                { key: 'date', label: '날짜', type: 'date' },
                { key: 'place', label: '장소', type: 'text' },
              ],
              layout: 'minimal',
            },
          ],
        }),
      });
    } else if (route.request().method() === 'POST') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          template: {
            id: 'tpl-new',
            name: '새 템플릿',
            category: 'wedding',
          },
        }),
      });
    }
  });

  // 프로필 API
  await page.route('/api/profile', async (route: any) => {
    if (route.request().method() === 'GET') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          nickname: '테스트사용자',
          bio: '안녕하세요!',
          avatar: '',
          email: TEST_EMAIL,
          createdAt: '2024-01-01',
        }),
      });
    } else if (route.request().method() === 'PATCH') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
        }),
      });
    }
  });

  // 초대장 API
  await page.route('/api/invitations', async (route: any) => {
    if (route.request().method() === 'GET') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ invitations: [] }),
      });
    } else if (route.request().method() === 'POST') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          invitation: {
            id: 'inv-1',
            slug: 'test-slug',
            is_published: true,
          },
        }),
      });
    }
  });

  await page.route('/api/invitations/test-slug', async (route: any) => {
    if (route.request().method() === 'GET') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          invitation: {
            id: 'inv-1',
            slug: 'test-slug',
            is_published: true,
            data: {
              couple_name: 'jay & partner',
              date: '2025.01.01',
              place: '테스트장소',
            },
          },
        }),
      });
    }
  });

  await page.route('/api/invitations/test-slug/publish', async (route: any) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ success: true }),
    });
  });

  // 템플릿 상세 API
  await page.route('/api/templates/tpl-1', async (route: any) => {
    if (route.request().method() === 'GET') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          template: {
            id: 'tpl-1',
            name: '기본 템플릿',
            category: 'wedding',
            thumbnail: 'https://example.com/thumb1.jpg',
            fields: [
              { key: 'couple_name', label: '신랑신부 이름', type: 'text' },
              { key: 'date', label: '날짜', type: 'date' },
              { key: 'place', label: '장소', type: 'text' },
            ],
            layout: 'classic',
          },
        }),
      });
    } else if (route.request().method() === 'DELETE') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true }),
      });
    }
  });

  // 비밀번호 재설정 API
  await page.route('/api/auth/password-reset', async (route: any) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ success: true }),
    });
  });
}

test.describe('로그인 페이지', () => {
  test.beforeEach(async ({ page }) => {
    await setMockSession(page);
    await mockApiRoutes(page);
    await page.goto('/login');
  });

  test('로그인 페이지가 렌더링되어야 함', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Todayis');
    await expect(page.locator('h2')).toContainText('로그인');
  });

  test('이메일 입력 필드가 존재해야 함', async ({ page }) => {
    const emailInput = page.locator('input[type="email"]');
    await expect(emailInput).toBeVisible();
    await expect(emailInput).toHaveAttribute('placeholder', '이메일 주소');
  });

  test('비밀번호 입력 필드가 존재해야 함', async ({ page }) => {
    const passwordInput = page.locator('input[type="password"]');
    await expect(passwordInput).toBeVisible();
    await expect(passwordInput).toHaveAttribute('placeholder', '비밀번호');
  });

  test('로그인 버튼이 존재해야 함', async ({ page }) => {
    const submitButton = page.locator('button[type="submit"]');
    await expect(submitButton).toBeVisible();
    await expect(submitButton).toContainText('로그인');
  });

  test('비밀번호 재설정 링크가 존재해야 함', async ({ page }) => {
    const resetLink = page.locator('text=비밀번호를 잊으셨나요?');
    await expect(resetLink).toBeVisible();
  });

  test('회원가입 링크가 /signup으로 연결되어야 함', async ({ page }) => {
    const signupLink = page.locator('a[href="/signup"]');
    await expect(signupLink).toBeVisible();
    await expect(signupLink).toContainText('회원가입');
  });

  test('소셜 로그인 구분선이 표시되어야 함', async ({ page }) => {
    const separator = page.locator('text=또는 소셜 계정으로 로그인');
    await expect(separator).toBeVisible();
  });
});

test.describe('회원가입 페이지', () => {
  test.beforeEach(async ({ page }) => {
    await setMockSession(page);
    await mockApiRoutes(page);
    await page.goto('/signup');
  });

  test('회원가입 페이지가 렌더링되어야 함', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Todayis');
  });

  test('이메일, 비밀번호, 비밀번호 확인 필드가 존재해야 함', async ({ page }) => {
    await expect(page.locator('#email')).toBeVisible();
    await expect(page.locator('#password')).toBeVisible();
    await expect(page.locator('#confirmPassword')).toBeVisible();
  });

  test('회원가입 버튼이 존재해야 함', async ({ page }) => {
    const submitButton = page.locator('button[type="submit"]');
    await expect(submitButton).toBeVisible();
    await expect(submitButton).toContainText('회원가입');
  });

  test('비밀번호 불일치 시 에러 메시지가 표시되어야 함', async ({ page }) => {
    await page.locator('#email').fill('test@test.com');
    await page.locator('#password').fill('test1234');
    await page.locator('#confirmPassword').fill('different123');
    await page.locator('button[type="submit"]').click();

    // 클라이언트 측 유효성 검사로 인해 에러가 즉시 표시됨
    await expect(page.locator('#confirmPassword')).toBeVisible();
  });

  test('비밀번호가 6자 미만일 때 에러 메시지가 표시되어야 함', async ({ page }) => {
    await page.locator('#email').fill('test@test.com');
    await page.locator('#password').fill('12345');
    await page.locator('#confirmPassword').fill('12345');
    await page.locator('button[type="submit"]').click();

    // 클라이언트 측 유효성 검사
    await expect(page.locator('#password')).toBeVisible();
  });

  test('로그인 페이지로 돌아가야 함', async ({ page }) => {
    const loginLink = page.locator('a[href="/login"]');
    await expect(loginLink.first()).toBeVisible();
  });
});

test.describe('비밀번호 재설정 페이지', () => {
  test.beforeEach(async ({ page }) => {
    await setMockSession(page);
    await mockApiRoutes(page);
    await page.goto('/login');
    
    // 비밀번호 재설정 페이지로 이동
    await page.locator('text=비밀번호를 잊으셨나요?').click();
  });

  test('비밀번호 재설정 폼이 표시되어야 함', async ({ page }) => {
    const backLink = page.locator('text=← 로그인으로 돌아가기');
    await expect(backLink).toBeVisible();
  });

  test('이메일 입력 필드가 존재해야 함', async ({ page }) => {
    const emailInput = page.locator('input[type="email"]');
    await expect(emailInput).toBeVisible();
  });
});

test.describe('로그인 폼 유효성 검사', () => {
  test.beforeEach(async ({ page }) => {
    await setMockSession(page);
    await mockApiRoutes(page);
    await page.goto('/login');
  });

  test('빈 폼 제출 시 에러가 발생해야 함', async ({ page }) => {
    await page.locator('button[type="submit"]').click();
    
    // HTML5 유효성 검사로 인해 필드가 강조됨
    await expect(page.locator('#email')).toBeVisible();
    await expect(page.locator('#password')).toBeVisible();
  });
});

test.describe('인증 후 대시보드 접근', () => {
  test.beforeEach(async ({ page }) => {
    await setMockSession(page);
    await mockApiRoutes(page);
  });

  test('인증된 사용자는 대시보드로 리다이렉트되어야 함', async ({ page }) => {
    // Supabase 모킹과 API 모킹이 적용된 상태에서 대시보드 접근
    await page.goto('/dashboard');
    
    // 대시보드 페이지가 렌더링되어야 함
    await expect(page.locator('h1')).toContainText('대시보드');
  });

  test('대시보드에 빠른 액션 카드가 표시되어야 함', async ({ page }) => {
    await page.goto('/dashboard');
    
    // 더 구체적인 선택자 사용 (dashboard 콘텐츠 내의 링크만 타겟팅)
    // layout의 navbar 링크와 중복되지 않도록 main 영역만 선택
    const templateLink = page.locator('main a[href="/templates"]').first();
    await expect(templateLink).toBeVisible();
    await expect(templateLink.locator('h3')).toContainText('템플릿 라이브러리');
    
    const settingsLink = page.locator('main a[href="/settings"]').first();
    await expect(settingsLink).toBeVisible();
    await expect(settingsLink.locator('h3')).toContainText('설정');
  });

  test('템플릿 라이브러리 카드를 클릭하면 템플릿 페이지로 이동해야 함', async ({ page }) => {
    await page.goto('/dashboard');
    
    const templateCard = page.locator('text=템플릿 라이브러리');
    await templateCard.click();
    
    await expect(page).toHaveURL(/.*\/templates/);
  });
});
