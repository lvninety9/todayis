/**
 * /api/fonts API Route Tests
 * 
 * POST /api/fonts — 커스텀 폰트 업로드
 * DELETE /api/fonts — 커스텀 폰트 삭제
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';

// ============================================================
// Mock Supabase
// ============================================================

const mockUpload = vi.fn();
const mockGetPublicUrl = vi.fn();
const mockRemove = vi.fn();
const mockFrom = vi.fn(() => ({
  upload: mockUpload,
  getPublicUrl: mockGetPublicUrl,
  remove: mockRemove,
}));

const mockStorage = {
  listBuckets: vi.fn(),
  createBucket: vi.fn(),
  from: mockFrom,
};

vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(() => ({
    storage: mockStorage,
  })),
}));

vi.mock('@/lib/auth', () => ({
  getUserFromRequest: vi.fn(),
}));

process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co';
process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-key';

// ============================================================
// Import AFTER mocks
// ============================================================

const { getUserFromRequest } = await import('@/lib/auth');
const { POST, DELETE } = await import('./route');

// ============================================================
// Setup
// ============================================================

beforeEach(() => {
  vi.clearAllMocks();
  mockStorage.listBuckets.mockResolvedValue({ data: [], error: null });
  mockStorage.createBucket.mockResolvedValue({ data: null, error: null });
  mockFrom.mockImplementation(() => ({
    upload: mockUpload,
    getPublicUrl: mockGetPublicUrl,
    remove: mockRemove,
  }));
  mockUpload.mockResolvedValue({ data: { path: 'test/font.ttf' }, error: null });
  mockGetPublicUrl.mockReturnValue({ data: { publicUrl: 'https://cdn.example.com/font.ttf' }, error: null });
  mockRemove.mockResolvedValue({ error: null });
});

// ============================================================
// POST Tests — Validation Only
// ============================================================

describe('POST /api/fonts', () => {
  it('should return 401 when not authenticated', async () => {
    (getUserFromRequest as ReturnType<typeof vi.fn>).mockResolvedValue(null);

    const formData = new FormData();
    const request = new NextRequest(new URL('http://localhost:3000/api/fonts'), {
      method: 'POST',
      body: formData,
    });

    const response = await POST(request);
    expect(response.status).toBe(401);
    const body = await response.json();
    expect(body.error).toBe('인증이 필요합니다.');
  });

  it('should return 400 when no file provided', async () => {
    (getUserFromRequest as ReturnType<typeof vi.fn>).mockResolvedValue({ id: 'user-123' });

    const formData = new FormData();
    const request = new NextRequest(new URL('http://localhost:3000/api/fonts'), {
      method: 'POST',
      body: formData,
    });

    const response = await POST(request);
    expect(response.status).toBe(400);
    const body = await response.json();
    expect(body.error).toBe('폰트 파일이 필요합니다.');
  });

  it('should return 400 when file type is invalid', async () => {
    (getUserFromRequest as ReturnType<typeof vi.fn>).mockResolvedValue({ id: 'user-123' });

    const formData = new FormData();
    const invalidFile = new File(['dummy'], 'font.exe', { type: 'application/octet-stream' });
    formData.append('file', invalidFile);
    formData.append('templateId', 'tmpl-123');

    const request = new NextRequest(new URL('http://localhost:3000/api/fonts'), {
      method: 'POST',
      body: formData,
    });

    const response = await POST(request);
    expect(response.status).toBe(400);
    const body = await response.json();
    expect(body.error).toBe('.ttf, .otf, .woff, .woff2 파일만 지원됩니다.');
  });

  it('should return 400 when file type is invalid even if large', async () => {
    (getUserFromRequest as ReturnType<typeof vi.fn>).mockResolvedValue({ id: 'user-123' });

    const formData = new FormData();
    const largeData = new ArrayBuffer(6 * 1024 * 1024);
    const largeFile = new File([largeData], 'large-font.exe', { type: 'application/octet-stream' });
    formData.append('file', largeFile);
    formData.append('templateId', 'tmpl-123');

    const request = new NextRequest(new URL('http://localhost:3000/api/fonts'), {
      method: 'POST',
      body: formData,
    });

    const response = await POST(request);
    expect(response.status).toBe(400);
    const body = await response.json();
    expect(body.error).toBe('.ttf, .otf, .woff, .woff2 파일만 지원됩니다.');
  });
});

// ============================================================
// DELETE Tests
// ============================================================

describe('DELETE /api/fonts', () => {
  it('should return 401 when not authenticated', async () => {
    (getUserFromRequest as ReturnType<typeof vi.fn>).mockResolvedValue(null);

    const request = new NextRequest(new URL('http://localhost:3000/api/fonts?url=test'), {
      method: 'DELETE',
    });

    const response = await DELETE(request);
    expect(response.status).toBe(401);
    const body = await response.json();
    expect(body.error).toBe('인증이 필요합니다.');
  });

  it('should return 400 when url param is missing', async () => {
    (getUserFromRequest as ReturnType<typeof vi.fn>).mockResolvedValue({ id: 'user-123' });

    const request = new NextRequest(new URL('http://localhost:3000/api/fonts'), {
      method: 'DELETE',
    });

    const response = await DELETE(request);
    expect(response.status).toBe(400);
    const body = await response.json();
    expect(body.error).toBe('url 파라미터가 필요합니다.');
  });

  it('should return 400 when url format is invalid', async () => {
    (getUserFromRequest as ReturnType<typeof vi.fn>).mockResolvedValue({ id: 'user-123' });

    const request = new NextRequest(new URL('http://localhost:3000/api/fonts?url=invalid-url'), {
      method: 'DELETE',
    });

    const response = await DELETE(request);
    expect(response.status).toBe(400);
    const body = await response.json();
    expect(body.error).toBe('잘못된 URL 형식입니다.');
  });

  it('should return 200 when deletion succeeds', async () => {
    (getUserFromRequest as ReturnType<typeof vi.fn>).mockResolvedValue({ id: 'user-123' });

    const request = new NextRequest(
      new URL('http://localhost:3000/api/fonts?url=https://cdn.example.com/storage/v1/object/public/custom-fonts/user-123/tmpl-123/font-id.ttf'),
      { method: 'DELETE' }
    );

    const response = await DELETE(request);
    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.success).toBe(true);
  });
});