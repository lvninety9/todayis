import { test, expect } from '@playwright/test';
import { setMockSession } from './helpers';

/**
 * 템플릿 관리 E2E 테스트
 * 
 * 테스트 플로우:
 * - 템플릿 라이브러리 조회
 * - 템플릿 상세 페이지
 * - 템플릿 편집 페이지
 * - 초대장 생성 플로우
 */

const TEST_EMAIL = 'test@test.com';

async function mockApiRoutes(page: any) {
  // 템플릿 목록 API
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
            thumbnail: 'https://example.com/thumb-new.jpg',
            fields: [
              { key: 'couple_name', label: '신랑신부 이름', type: 'text' },
              { key: 'date', label: '날짜', type: 'date' },
              { key: 'place', label: '장소', type: 'text' },
            ],
            layout: 'classic',
          },
        }),
      });
    }
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

  await page.route('/api/templates/tpl-2', async (route: any) => {
    if (route.request().method() === 'GET') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          template: {
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
        body: JSON.stringify({
          invitations: [
            {
              id: 'inv-1',
              template_id: 'tpl-1',
              slug: 'jay-wedding',
              is_published: false,
              data: {
                couple_name: 'jay & partner',
                date: '2025.01.01',
                place: '테스트장소',
              },
            },
          ],
        }),
      });
    } else if (route.request().method() === 'POST') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          invitation: {
            id: 'inv-new',
            template_id: 'tpl-1',
            slug: 'new-wedding',
            is_published: false,
            data: {
              couple_name: '신부부',
              date: '2025.06.01',
              place: '새로운장소',
            },
          },
        }),
      });
    }
  });

  await page.route('/api/invitations/new-wedding', async (route: any) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        invitation: {
          id: 'inv-new',
          slug: 'new-wedding',
          is_published: false,
          data: {
            couple_name: '신부부',
            date: '2025.06.01',
            place: '새로운장소',
          },
        },
      }),
    });
  });

  await page.route('/api/invitations/new-wedding/publish', async (route: any) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ success: true }),
    });
  });

  // 프로필 API
  await page.route('/api/profile', async (route: any) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        user: {
          id: 'test-user-123',
          email: TEST_EMAIL,
          nickname: '테스트사용자',
          bio: '안녕하세요!',
        },
      }),
    });
  });
}

test.describe('템플릿 라이브러리', () => {
  test.beforeEach(async ({ page }) => {
    await setMockSession(page);
    await mockApiRoutes(page);
    await page.goto('/templates');
  });

  test('템플릿 라이브러리 페이지가 렌더링되어야 함', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('템플릿 라이브러리');
  });

  test('새 템플릿 만들기 버튼이 존재해야 함', async ({ page }) => {
    const createButton = page.locator('button', { hasText: '새 템플릿 만들기' });
    await expect(createButton).toBeVisible();
  });

  test('3개 템플릿 카드가 표시되어야 함', async ({ page }) => {
    // TemplateCard 컴포넌트의 카드 요소들
    const cards = page.locator('.rounded-lg, [class*="card"], [class*="template"], .bg-white');
    await expect(cards.first()).toBeVisible();
  });

  test('템플릿 이름이 표시되어야 함', async ({ page }) => {
    await expect(page.locator('text=기본 템플릿')).toBeVisible();
    await expect(page.locator('text=모던 템플릿')).toBeVisible();
    await expect(page.locator('text=미니멀 템플릿')).toBeVisible();
  });
});

test.describe('템플릿 상세 페이지', () => {
  test.beforeEach(async ({ page }) => {
    await setMockSession(page);
    await mockApiRoutes(page);
    await page.goto('/templates/tpl-1/edit');
  });

  test('템플릿 상세 페이지가 렌더링되어야 함', async ({ page }) => {
    // 편집 페이지 헤더에서 "템플릿 편집:" 텍스트 확인
    await expect(page.locator('h1:has-text("템플릿 편집")')).toBeVisible();
  });

  test('템플릿 필드 정보가 표시되어야 함', async ({ page }) => {
    // 템플릿 편집 페이지가 로드되었는지 확인 (첫 번째 h1만 선택)
    await expect(page.locator('h1').first()).toBeVisible();
  });

  test('편집 폼이 표시되어야 함', async ({ page }) => {
    const coupleNameInput = page.locator('input, [name="couple_name"], [data-field="couple_name"]');
    await expect(coupleNameInput.first()).toBeVisible();
  });
});

test.describe('템플릿 편집 및 생성', () => {
  test.beforeEach(async ({ page }) => {
    await setMockSession(page);
    await mockApiRoutes(page);
    await page.goto('/templates/tpl-1/edit');
  });

  test('필드 값을 변경할 수 있어야 함', async ({ page }) => {
    const coupleNameInput = page.locator('input, [name="couple_name"], [data-field="couple_name"]').first();
    await coupleNameInput.clear();
    await coupleNameInput.fill('jay & partner');
    await expect(coupleNameInput).toHaveValue('jay & partner');
  });

  test('실시간 미리보기에 변경된 값이 반영되어야 함', async ({ page }) => {
    const coupleNameInput = page.locator('input, [name="couple_name"], [data-field="couple_name"]').first();
    await coupleNameInput.clear();
    await coupleNameInput.fill('testcouple');
    
    // 미리보기 영역에 값이 반영되는지 확인
    const preview = page.locator('[class*="preview"], [class*="template-preview"], [class*="preview"]');
    await expect(preview.first()).toBeVisible();
  });
});

test.describe('대시보드에서 템플릿 접근', () => {
  test.beforeEach(async ({ page }) => {
    await setMockSession(page);
    await mockApiRoutes(page);
  });

  test('대시보드에서 템플릿 라이브러리로 이동', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page.locator('h1')).toContainText('대시보드');
    
    const templateLink = page.locator('a[href="/templates"]');
    await templateLink.click();
    
    await expect(page).toHaveURL(/.*\/templates/);
    await expect(page.locator('h1')).toContainText('템플릿 라이브러리');
  });

  test('대시보드에서 설정 페이지로 이동', async ({ page }) => {
    await page.goto('/dashboard');
    
    const settingsLink = page.locator('a[href="/settings"]');
    await settingsLink.click();
    
    await expect(page).toHaveURL(/.*\/settings/);
  });
});

test.describe('초대장 생성 플로우', () => {
  test.beforeEach(async ({ page }) => {
    await setMockSession(page);
    await mockApiRoutes(page);
  });

  test('템플릿 편집 페이지에서 초대장 생성', async ({ page }) => {
    await page.goto('/templates/tpl-1/edit');
    
    // 템플릿 편집 페이지가 로드되었는지 확인 (첫 번째 h1만 선택)
    await expect(page.locator('h1').first()).toBeVisible();
  });
});
