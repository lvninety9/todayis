import { test, expect } from '@playwright/test';
import { setMockSession } from './helpers';

/**
 * 프로필/설정 E2E 테스트
 * 
 * 테스트 플로우:
 * - 설정 페이지 접근
 * - 프로필 정보 표시
 * - 닉네임/소개 수정
 */

const TEST_EMAIL = 'test@test.com';

async function mockApiRoutes(page: any) {
  await page.route('/api/templates', async (route: any) => {
    if (route.request().method() === 'GET') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          templates: [{ id: 'tpl-1', name: '기본 템플릿', category: 'wedding' }],
        }),
      });
    }
  });

  await page.route('/api/templates/tpl-1', async (route: any) => {
    if (route.request().method() === 'GET') {
      await route.fulfill({
        status: 200, contentType: 'application/json',
        body: JSON.stringify({ template: { id: 'tpl-1', name: '기본 템플릿' } }),
      });
    }
  });

  await page.route('/api/profile', async (route: any) => {
    if (route.request().method() === 'GET') {
      await route.fulfill({
        status: 200, contentType: 'application/json',
        // 실제 API 응답 형식: { nickname, bio, avatar, email, createdAt }
        body: JSON.stringify({ 
          nickname: '테스트', 
          bio: 'hi', 
          avatar: '', 
          email: TEST_EMAIL,
          createdAt: '2024-01-01'
        }),
      });
    } else if (route.request().method() === 'PATCH') {
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ success: true }) });
    }
  });

  await page.route('/api/profile/avatar', async (route: any) => {
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ url: 'https://example.com/avatar.jpg' }) });
  });

  await page.route('/api/invitations', async (route: any) => {
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ invitations: [] }) });
  });
}

test.describe('설정 페이지', () => {
  test.beforeEach(async ({ page }) => {
    await setMockSession(page);
    await mockApiRoutes(page);
    await page.goto('/settings');
  });

  test('설정 페이지가 렌더링되어야 함', async ({ page }) => {
    await expect(page.locator('h1:has-text("설정")')).toBeVisible();
  });

  test('이메일이 표시되어야 함', async ({ page }) => {
    await expect(page.locator('#email')).toHaveValue(TEST_EMAIL);
  });

  test('닉네임 입력 필드가 존재해야 함', async ({ page }) => {
    await expect(page.locator('#nickname')).toBeVisible();
  });

  test('소개 입력 필드가 존재해야 함', async ({ page }) => {
    await expect(page.locator('textarea, [name="bio"]').first()).toBeVisible();
  });

  test('저장 버튼이 존재해야 함', async ({ page }) => {
    await expect(page.locator('button', { hasText: /저장/ }).first()).toBeVisible();
  });
});

test.describe('프로필 수정', () => {
  test.beforeEach(async ({ page }) => {
    await setMockSession(page);
    await mockApiRoutes(page);
    await page.goto('/settings');
  });

  test('닉네임을 변경할 수 있어야 함', async ({ page }) => {
    const input = page.locator('#nickname');
    await input.clear();
    await input.fill('변경');
    await expect(input).toHaveValue('변경');
  });
});

test.describe('대시보드에서 설정 페이지 접근', () => {
  test.beforeEach(async ({ page }) => {
    await setMockSession(page);
    await mockApiRoutes(page);
  });

  test('대시보드에서 설정 페이지로 이동', async ({ page }) => {
    await page.goto('/dashboard');
    await page.locator('a[href="/settings"]').click();
    await expect(page).toHaveURL(/settings/);
  });
});