# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: template.e2e.ts >> 템플릿 라이브러리 >> 템플릿이 표시되어야 함
- Location: src/test/e2e/template.e2e.ts:242:7

# Error details

```
Error: expect(received).toBeGreaterThan(expected)

Expected: > 0
Received:   0
```

# Page snapshot

```yaml
- dialog "Unhandled Runtime Error" [ref=e3]:
  - generic [ref=e4]:
    - generic [ref=e5]:
      - generic [ref=e6]:
        - navigation [ref=e7]:
          - button "previous" [disabled] [ref=e8]:
            - img "previous" [ref=e9]
          - button "next" [disabled] [ref=e11]:
            - img "next" [ref=e12]
          - generic [ref=e14]: 1 of 1 error
          - generic [ref=e15]:
            - text: Next.js (14.2.18) is outdated
            - link "(learn more)" [ref=e17] [cursor=pointer]:
              - /url: https://nextjs.org/docs/messages/version-staleness
        - button "Close" [ref=e18] [cursor=pointer]:
          - img [ref=e20]
      - heading "Unhandled Runtime Error" [level=1] [ref=e23]
      - paragraph [ref=e24]:
        - text: "Error: Invalid src prop (https://example.com/thumb3.jpg) on `next/image`, hostname \"example.com\" is not configured under images in your `next.config.js` See more info:"
        - link "https://nextjs.org/docs/messages/next-image-unconfigured-host" [ref=e25] [cursor=pointer]:
          - /url: https://nextjs.org/docs/messages/next-image-unconfigured-host
    - generic [ref=e26]:
      - heading "Call Stack" [level=2] [ref=e27]
      - generic [ref=e28]:
        - heading "defaultLoader" [level=3] [ref=e29]
        - generic [ref=e31]: webpack:/src/shared/lib/image-loader.ts
      - generic [ref=e32]:
        - heading "loader" [level=3] [ref=e33]
        - generic [ref=e35]: webpack:/src/shared/lib/get-img-props.ts
      - generic [ref=e36]:
        - heading "Array.map" [level=3] [ref=e37]
        - generic [ref=e39]: <anonymous>
      - generic [ref=e40]:
        - heading "map" [level=3] [ref=e41]
        - generic [ref=e43]: webpack:/src/shared/lib/get-img-props.ts
      - generic [ref=e44]:
        - heading "generateImgAttrs" [level=3] [ref=e45]
        - generic [ref=e47]: webpack:/src/shared/lib/get-img-props.ts
      - generic [ref=e48]:
        - heading "props" [level=3] [ref=e49]
        - generic [ref=e51]: webpack:/src/client/image-component.tsx
      - group [ref=e52]:
        - generic "React" [ref=e53] [cursor=pointer]:
          - img [ref=e54]
          - img [ref=e56]
          - text: React
```

# Test source

```ts
  148 |               id: 'inv-1',
  149 |               template_id: 'tpl-1',
  150 |               slug: 'jay-wedding',
  151 |               is_published: false,
  152 |               data: {
  153 |                 couple_name: 'jay & partner',
  154 |                 date: '2025.01.01',
  155 |                 place: '테스트장소',
  156 |               },
  157 |             },
  158 |           ],
  159 |         }),
  160 |       });
  161 |     } else if (route.request().method() === 'POST') {
  162 |       await route.fulfill({
  163 |         status: 200,
  164 |         contentType: 'application/json',
  165 |         body: JSON.stringify({
  166 |           invitation: {
  167 |             id: 'inv-new',
  168 |             template_id: 'tpl-1',
  169 |             slug: 'new-wedding',
  170 |             is_published: false,
  171 |             data: {
  172 |               couple_name: '신부부',
  173 |               date: '2025.06.01',
  174 |               place: '새로운장소',
  175 |             },
  176 |           },
  177 |         }),
  178 |       });
  179 |     }
  180 |   });
  181 | 
  182 |   await page.route('/api/invitations/new-wedding', async (route: any) => {
  183 |     await route.fulfill({
  184 |       status: 200,
  185 |       contentType: 'application/json',
  186 |       body: JSON.stringify({
  187 |         invitation: {
  188 |           id: 'inv-new',
  189 |           slug: 'new-wedding',
  190 |           is_published: false,
  191 |           data: {
  192 |             couple_name: '신부부',
  193 |             date: '2025.06.01',
  194 |             place: '새로운장소',
  195 |           },
  196 |         },
  197 |       }),
  198 |     });
  199 |   });
  200 | 
  201 |   await page.route('/api/invitations/new-wedding/publish', async (route: any) => {
  202 |     await route.fulfill({
  203 |       status: 200,
  204 |       contentType: 'application/json',
  205 |       body: JSON.stringify({ success: true }),
  206 |     });
  207 |   });
  208 | 
  209 |   // 프로필 API
  210 |   await page.route('/api/profile', async (route: any) => {
  211 |     await route.fulfill({
  212 |       status: 200,
  213 |       contentType: 'application/json',
  214 |       body: JSON.stringify({
  215 |         user: {
  216 |           id: 'test-user-123',
  217 |           email: TEST_EMAIL,
  218 |           nickname: '테스트사용자',
  219 |           bio: '안녕하세요!',
  220 |         },
  221 |       }),
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
> 248 |     expect(count).toBeGreaterThan(0);
      |                   ^ Error: expect(received).toBeGreaterThan(expected)
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
  322 |     await settingsLink.click();
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