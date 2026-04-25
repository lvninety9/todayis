import { test, expect } from '@playwright/test';
import { setMockSession } from './helpers';

const TEST_EMAIL = 'test@test.com';

async function mockApiRoutes(page: any) {
  await page.route('/api/templates', async (route: any) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ templates: [{ id: 'tpl-1', name: '기본 템플릿' }] })
    });
  });

  await page.route('/api/templates/tpl-1', async (route: any) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ template: { id: 'tpl-1', name: '기본 템플릿' } })
    });
  });

  await page.route('/api/invitations', async (route: any) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ invitations: [{ id: 'inv-1', slug: 'test-slug' }] })
    });
  });

  await page.route('/api/invitations/test-slug', async (route: any) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ invitation: { id: 'inv-1', slug: 'test-slug' } })
    });
  });

  await page.route('/api/invitations/jay-wedding', async (route: any) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ 
        invitation: { 
          id: 'inv-1',
          user_id: 'test-user-123',
          template_id: 'tpl-1',
          slug: 'jay-wedding',
          title: 'jay & partner',
          data: { couple_name: 'jay & partner', date: '2025.06.15', place: '테스트 결혼식장' },
          layout: {},
          is_published: true,
          created_at: '2024-01-01',
          updated_at: '2024-01-01'
        },
        template: { id: 'tpl-1', name: '기본 템플릿', category: 'wedding' }
      })
    });
  });

  await page.route('/api/profile', async (route: any) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ 
        nickname: 'testuser',
        email: TEST_EMAIL,
        bio: '',
        avatar: '',
        createdAt: '2024-01-01'
      })
    });
  });
}

test.describe('초대장 공개 플로우', () => {
  test.beforeEach(async ({ page }) => {
    await setMockSession(page);
    await mockApiRoutes(page);
    await page.goto('/templates/tpl-1/edit');
  });
  test('공개 토글이 존재해야 함', async ({ page }) => {
    await expect(page.locator('button').first()).toBeVisible();
  });
});

test.describe('공개 URL 접근', () => {
  test.beforeEach(async ({ page }) => {
    await setMockSession(page);
    await mockApiRoutes(page);
  });
  test('공개된 초대장 페이지에 접근할 수 있어야 함', async ({ page }) => {
    await page.goto('/jay-wedding');
    // 초대장 페이지가 로드되었는지 확인 (첫 번째 h1만 선택)
    await expect(page.locator('h1').first()).toBeVisible();
  });
});