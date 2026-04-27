# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: template.e2e.ts >> 대시보드에서 템플릿 접근 >> 대시보드에서 설정 페이지로 이동
- Location: src/test/e2e/template.e2e.ts:318:7

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
              - paragraph [ref=e32]: "3"
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
          - generic [ref=e81]:
            - link "기본 템플릿 기본 템플릿 wedding" [ref=e82] [cursor=pointer]:
              - /url: /templates/tpl-1/edit
              - generic [ref=e83]:
                - generic [ref=e84]:
                  - img "기본 템플릿" [ref=e85]
                  - generic [ref=e86]:
                    - heading "기본 템플릿" [level=3] [ref=e87]
                    - paragraph [ref=e88]: wedding
                - img [ref=e89]
            - link "모던 템플릿 모던 템플릿 wedding" [ref=e91] [cursor=pointer]:
              - /url: /templates/tpl-2/edit
              - generic [ref=e92]:
                - generic [ref=e93]:
                  - img "모던 템플릿" [ref=e94]
                  - generic [ref=e95]:
                    - heading "모던 템플릿" [level=3] [ref=e96]
                    - paragraph [ref=e97]: wedding
                - img [ref=e98]
            - link "미니멀 템플릿 미니멀 템플릿 wedding" [ref=e100] [cursor=pointer]:
              - /url: /templates/tpl-3/edit
              - generic [ref=e101]:
                - generic [ref=e102]:
                  - img "미니멀 템플릿" [ref=e103]
                  - generic [ref=e104]:
                    - heading "미니멀 템플릿" [level=3] [ref=e105]
                    - paragraph [ref=e106]: wedding
                - img [ref=e107]
    - contentinfo [ref=e109]:
      - generic [ref=e111]:
        - paragraph [ref=e112]: © 2026 Todayis. All rights reserved.
        - generic [ref=e113]:
          - link "회사 소개" [ref=e114] [cursor=pointer]:
            - /url: /landing
          - link "이용 안내" [ref=e115] [cursor=pointer]:
            - /url: /order-guide
          - link "가격" [ref=e116] [cursor=pointer]:
            - /url: /pricing
  - region "Notifications alt+T"
  - alert [ref=e117]
```

# Test source

```ts
  222 |     });
  223 |   });
  224 | }
  225 | 
  226 | test.describe('템플릿 라이브러리', () => {
  227 |   test.beforeEach(async ({ page }) => {
  228 |     await setMockSession(page);
  229 |     await mockApiRoutes(page);
  230 |     await page.goto('/templates');
  231 |   });
  232 | 
  233 |   test('템플릿 라이브러리 페이지가 렌더링되어야 함', async ({ page }) => {
  234 |     await expect(page.locator('h1')).toContainText('템플릿 라이브러리');
  235 |   });
  236 | 
  237 |   test('새 템플릿 만들기 버튼이 존재해야 함', async ({ page }) => {
  238 |     const createButton = page.locator('button:has-text("새 템플릿")');
  239 |     await expect(createButton).toBeVisible();
  240 |   });
  241 | 
  242 |   test('템플릿이 표시되어야 함', async ({ page }) => {
  243 |     // 템플릿이 로드될 때까지 기다림
  244 |     await page.waitForTimeout(1000);
  245 |     // 템플릿이 렌더링되는지 확인
  246 |     const templateText = page.locator('text=기본 템플릿');
  247 |     const count = await templateText.count();
  248 |     expect(count).toBeGreaterThan(0);
  249 |   });
  250 | });
  251 | 
  252 | test.describe('템플릿 상세 페이지', () => {
  253 |   test.beforeEach(async ({ page }) => {
  254 |     await setMockSession(page);
  255 |     await mockApiRoutes(page);
  256 |     await page.goto('/templates/tpl-1/edit');
  257 |   });
  258 | 
  259 |   test('템플릿 상세 페이지가 렌더링되어야 함', async ({ page }) => {
  260 |     // 편집 페이지 헤더에서 "템플릿 편집:" 텍스트 확인
  261 |     await expect(page.locator('h1:has-text("템플릿 편집")')).toBeVisible();
  262 |   });
  263 | 
  264 |   test('템플릿 필드 정보가 표시되어야 함', async ({ page }) => {
  265 |     // 템플릿 편집 페이지가 로드되었는지 확인 (첫 번째 h1만 선택)
  266 |     await expect(page.locator('h1').first()).toBeVisible();
  267 |   });
  268 | 
  269 |   test('편집 폼이 표시되어야 함', async ({ page }) => {
  270 |     const coupleNameInput = page.locator('input, [name="couple_name"], [data-field="couple_name"]');
  271 |     await expect(coupleNameInput.first()).toBeVisible();
  272 |   });
  273 | });
  274 | 
  275 | test.describe('템플릿 편집 및 생성', () => {
  276 |   test.beforeEach(async ({ page }) => {
  277 |     await setMockSession(page);
  278 |     await mockApiRoutes(page);
  279 |     await page.goto('/templates/tpl-1/edit');
  280 |   });
  281 | 
  282 |   test('필드 값을 변경할 수 있어야 함', async ({ page }) => {
  283 |     const coupleNameInput = page.locator('input, [name="couple_name"], [data-field="couple_name"]').first();
  284 |     await coupleNameInput.clear();
  285 |     await coupleNameInput.fill('jay & partner');
  286 |     await expect(coupleNameInput).toHaveValue('jay & partner');
  287 |   });
  288 | 
  289 |   test('실시간 미리보기에 변경된 값이 반영되어야 함', async ({ page }) => {
  290 |     const coupleNameInput = page.locator('input, [name="couple_name"], [data-field="couple_name"]').first();
  291 |     await coupleNameInput.clear();
  292 |     await coupleNameInput.fill('testcouple');
  293 |     
  294 |     // 미리보기 영역에 값이 반영되는지 확인
  295 |     const preview = page.locator('[class*="preview"], [class*="template-preview"], [class*="preview"]');
  296 |     await expect(preview.first()).toBeVisible();
  297 |   });
  298 | });
  299 | 
  300 | test.describe('대시보드에서 템플릿 접근', () => {
  301 |   test.beforeEach(async ({ page }) => {
  302 |     await setMockSession(page);
  303 |     await mockApiRoutes(page);
  304 |   });
  305 | 
  306 |   test('대시보드에서 템플릿 라이브러리로 이동', async ({ page }) => {
  307 |     await page.goto('/dashboard');
  308 |     await expect(page.locator('h1')).toContainText('대시보드');
  309 |     
  310 |     // dashboard main 영역 내의 링크만 선택
  311 |     const templateLink = page.locator('main a[href="/templates"]').first();
  312 |     await templateLink.click();
  313 |     
  314 |     await expect(page).toHaveURL(/.*\/templates/);
  315 |     await expect(page.locator('h1')).toContainText('템플릿 라이브러리');
  316 |   });
  317 | 
  318 |   test('대시보드에서 설정 페이지로 이동', async ({ page }) => {
  319 |     await page.goto('/dashboard');
  320 |     
  321 |     const settingsLink = page.locator('a[href="/settings"]');
> 322 |     await settingsLink.click();
      |                        ^ Error: locator.click: Error: strict mode violation: locator('a[href="/settings"]') resolved to 2 elements:
  323 |     
  324 |     await expect(page).toHaveURL(/.*\/settings/);
  325 |   });
  326 | });
  327 | 
  328 | test.describe('초대장 생성 플로우', () => {
  329 |   test.beforeEach(async ({ page }) => {
  330 |     await setMockSession(page);
  331 |     await mockApiRoutes(page);
  332 |   });
  333 | 
  334 |   test('템플릿 편집 페이지에서 초대장 생성', async ({ page }) => {
  335 |     await page.goto('/templates/tpl-1/edit');
  336 |     
  337 |     // 템플릿 편집 페이지가 로드되었는지 확인 (첫 번째 h1만 선택)
  338 |     await expect(page.locator('h1').first()).toBeVisible();
  339 |   });
  340 | });
  341 | 
```