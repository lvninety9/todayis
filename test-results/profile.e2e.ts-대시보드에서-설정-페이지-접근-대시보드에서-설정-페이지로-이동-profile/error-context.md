# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: profile.e2e.ts >> 대시보드에서 설정 페이지 접근 >> 대시보드에서 설정 페이지로 이동
- Location: src/test/e2e/profile.e2e.ts:113:7

# Error details

```
Error: locator.click: Error: strict mode violation: locator('a[href="/settings"]') resolved to 2 elements:
    1) <a href="/settings">…</a> aka getByRole('link', { name: 'test' })
    2) <a class="block" href="/settings">…</a> aka getByRole('link', { name: '설정 계정 및 프로필 설정' })

Call log:
  - waiting for locator('a[href="/settings"]')

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e2]:
    - banner [ref=e3]:
      - generic [ref=e5]:
        - link "Todayis" [ref=e6] [cursor=pointer]:
          - /url: /
          - generic [ref=e7]: Todayis
        - navigation [ref=e8]:
          - link "대시보드" [ref=e9] [cursor=pointer]:
            - /url: /dashboard
          - link "템플릿" [ref=e10] [cursor=pointer]:
            - /url: /templates
          - link "가격" [ref=e11] [cursor=pointer]:
            - /url: /pricing
          - link "주문안내" [ref=e12] [cursor=pointer]:
            - /url: /order-guide
        - generic [ref=e14]:
          - link "test" [ref=e15] [cursor=pointer]:
            - /url: /settings
            - button "test" [ref=e16]
          - button "로그아웃" [ref=e17] [cursor=pointer]
    - main [ref=e18]:
      - generic [ref=e20]:
        - generic [ref=e21]:
          - heading "대시보드" [level=1] [ref=e22]
          - paragraph [ref=e23]: 환영합니다, test@test.com님!
        - generic [ref=e24]:
          - generic [ref=e26]:
            - img [ref=e28]
            - generic [ref=e30]:
              - paragraph [ref=e31]: 템플릿
              - paragraph [ref=e32]: "1"
          - generic [ref=e34]:
            - img [ref=e36]
            - generic [ref=e38]:
              - paragraph [ref=e39]: 초대장
              - paragraph [ref=e40]: "0"
          - generic [ref=e42]:
            - img [ref=e44]
            - generic [ref=e46]:
              - paragraph [ref=e47]: 구매
              - paragraph [ref=e48]: "0"
        - generic [ref=e49]:
          - link "템플릿 라이브러리 템플릿 관리 및 제작" [ref=e50] [cursor=pointer]:
            - /url: /templates
            - generic [ref=e52]:
              - img [ref=e54]
              - generic [ref=e56]:
                - heading "템플릿 라이브러리" [level=3] [ref=e57]
                - paragraph [ref=e58]: 템플릿 관리 및 제작
          - link "새 초대장 만들기 새로운 템플릿 생성" [ref=e59] [cursor=pointer]:
            - /url: /templates?create=true
            - generic [ref=e61]:
              - img [ref=e63]
              - generic [ref=e65]:
                - heading "새 초대장 만들기" [level=3] [ref=e66]
                - paragraph [ref=e67]: 새로운 템플릿 생성
          - link "설정 계정 및 프로필 설정" [ref=e68] [cursor=pointer]:
            - /url: /settings
            - generic [ref=e70]:
              - img [ref=e72]
              - generic [ref=e75]:
                - heading "설정" [level=3] [ref=e76]
                - paragraph [ref=e77]: 계정 및 프로필 설정
        - generic [ref=e78]:
          - heading "최근 템플릿" [level=2] [ref=e80]
          - link "기본 템플릿 wedding" [ref=e82] [cursor=pointer]:
            - /url: /templates/tpl-1/edit
            - generic [ref=e83]:
              - generic [ref=e84]:
                - img [ref=e86]
                - generic [ref=e88]:
                  - heading "기본 템플릿" [level=3] [ref=e89]
                  - paragraph [ref=e90]: wedding
              - img [ref=e91]
    - contentinfo [ref=e93]:
      - generic [ref=e95]:
        - paragraph [ref=e96]: © 2026 Todayis. All rights reserved.
        - generic [ref=e97]:
          - link "회사 소개" [ref=e98] [cursor=pointer]:
            - /url: /landing
          - link "이용 안내" [ref=e99] [cursor=pointer]:
            - /url: /order-guide
          - link "가격" [ref=e100] [cursor=pointer]:
            - /url: /pricing
  - region "Notifications alt+T"
  - alert [ref=e101]
```

# Test source

```ts
  15  | async function mockApiRoutes(page: any) {
  16  |   await page.route('/api/templates', async (route: any) => {
  17  |     if (route.request().method() === 'GET') {
  18  |       await route.fulfill({
  19  |         status: 200,
  20  |         contentType: 'application/json',
  21  |         body: JSON.stringify({
  22  |           templates: [{ id: 'tpl-1', name: '기본 템플릿', category: 'wedding' }],
  23  |         }),
  24  |       });
  25  |     }
  26  |   });
  27  | 
  28  |   await page.route('/api/templates/tpl-1', async (route: any) => {
  29  |     if (route.request().method() === 'GET') {
  30  |       await route.fulfill({
  31  |         status: 200, contentType: 'application/json',
  32  |         body: JSON.stringify({ template: { id: 'tpl-1', name: '기본 템플릿' } }),
  33  |       });
  34  |     }
  35  |   });
  36  | 
  37  |   await page.route('/api/profile', async (route: any) => {
  38  |     if (route.request().method() === 'GET') {
  39  |       await route.fulfill({
  40  |         status: 200, contentType: 'application/json',
  41  |         // 실제 API 응답 형식: { nickname, bio, avatar, email, createdAt }
  42  |         body: JSON.stringify({ 
  43  |           nickname: '테스트', 
  44  |           bio: 'hi', 
  45  |           avatar: '', 
  46  |           email: TEST_EMAIL,
  47  |           createdAt: '2024-01-01'
  48  |         }),
  49  |       });
  50  |     } else if (route.request().method() === 'PATCH') {
  51  |       await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ success: true }) });
  52  |     }
  53  |   });
  54  | 
  55  |   await page.route('/api/profile/avatar', async (route: any) => {
  56  |     await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ url: 'https://example.com/avatar.jpg' }) });
  57  |   });
  58  | 
  59  |   await page.route('/api/invitations', async (route: any) => {
  60  |     await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ invitations: [] }) });
  61  |   });
  62  | }
  63  | 
  64  | test.describe('설정 페이지', () => {
  65  |   test.beforeEach(async ({ page }) => {
  66  |     await setMockSession(page);
  67  |     await mockApiRoutes(page);
  68  |     await page.goto('/settings');
  69  |   });
  70  | 
  71  |   test('설정 페이지가 렌더링되어야 함', async ({ page }) => {
  72  |     await expect(page.locator('h1:has-text("설정")')).toBeVisible();
  73  |   });
  74  | 
  75  |   test('이메일이 표시되어야 함', async ({ page }) => {
  76  |     await expect(page.locator('#email')).toHaveValue(TEST_EMAIL);
  77  |   });
  78  | 
  79  |   test('닉네임 입력 필드가 존재해야 함', async ({ page }) => {
  80  |     await expect(page.locator('#nickname')).toBeVisible();
  81  |   });
  82  | 
  83  |   test('소개 입력 필드가 존재해야 함', async ({ page }) => {
  84  |     await expect(page.locator('textarea, [name="bio"]').first()).toBeVisible();
  85  |   });
  86  | 
  87  |   test('저장 버튼이 존재해야 함', async ({ page }) => {
  88  |     await expect(page.locator('button', { hasText: /저장/ }).first()).toBeVisible();
  89  |   });
  90  | });
  91  | 
  92  | test.describe('프로필 수정', () => {
  93  |   test.beforeEach(async ({ page }) => {
  94  |     await setMockSession(page);
  95  |     await mockApiRoutes(page);
  96  |     await page.goto('/settings');
  97  |   });
  98  | 
  99  |   test('닉네임을 변경할 수 있어야 함', async ({ page }) => {
  100 |     const input = page.locator('#nickname');
  101 |     await input.clear();
  102 |     await input.fill('변경');
  103 |     await expect(input).toHaveValue('변경');
  104 |   });
  105 | });
  106 | 
  107 | test.describe('대시보드에서 설정 페이지 접근', () => {
  108 |   test.beforeEach(async ({ page }) => {
  109 |     await setMockSession(page);
  110 |     await mockApiRoutes(page);
  111 |   });
  112 | 
  113 |   test('대시보드에서 설정 페이지로 이동', async ({ page }) => {
  114 |     await page.goto('/dashboard');
> 115 |     await page.locator('a[href="/settings"]').click();
      |                                               ^ Error: locator.click: Error: strict mode violation: locator('a[href="/settings"]') resolved to 2 elements:
  116 |     await expect(page).toHaveURL(/settings/);
  117 |   });
  118 | });
```