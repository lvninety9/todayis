/**
 * /api/fonts API Route Tests
 * 
 * POST /api/fonts — 커스텀 폰트 업로드
 * DELETE /api/fonts — 커스텀 폰트 삭제
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import { POST, DELETE } from './route';

// Mock Supabase
const mockStorageRemove = vi.fn();
const mockStorageGetPublicUrl = vi.fn();
const mockStorageUpload = vi.fn();
const mockStorageFrom = vi.fn().mockReturnValue({
  upload: mockStorageUpload,
  getPublicUrl: mockStorageGetPublicUrl,
  remove: mockStorageRemove,
});

const mockStorageCreateBucket = vi.fn();
const mockStorageListBuckets = vi.fn();

const mockSupabase = {
  storage: {
    listBuckets: mockStorageListBuckets,
    createBucket: mockStorageCreateBucket,
    from: mockStorageFrom,
  },
};

vi.mock('@supabase/supabase-js', () => ({
  createClient: () => mockSupabase,
}));

// Mock auth module
const mockGetUserFromRequest = vi.fn();
vi.mock('@/lib/auth', () => ({
  getUserFromRequest: () => mockGetUserFromRequest(),
}));

// Mock process.env
process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co';
process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-key';

beforeEach(() => {
  vi.clearAllMocks();
  mockGetUserFromRequest.mockReset();
  mockStorageListBuckets.mockReset();
  mockStorageCreateBucket.mockReset();
  mockStorageUpload.mockReset();
  mockStorageGetPublicUrl.mockReset();
  mockStorageRemove.mockReset();
});

// ============================================================
// POST Tests
// ============================================================

describe('POST /api/fonts', () => {
  it('should return 401 when not authenticated', async () => {
    mockGetUserFromRequest.mockResolvedValue(null);

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
    mockGetUserFromRequest.mockResolvedValue({ id: 'user-123' });

    const formData = new FormData();
    // No file appended
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
    mockGetUserFromRequest.mockResolvedValue({ id: 'user-123' });

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

  it('should return 400 when file exceeds 5MB', async () => {
    mockGetUserFromRequest.mockResolvedValue({ id: 'user-123' });

    const formData = new FormData();
    const largeData = new ArrayBuffer(6 * 1024 * 1024);
    const largeFile = new File([largeData], 'large-font.ttf', { type: 'font/ttf' });
    formData.append('file', largeFile);
    formData.append('templateId', 'tmpl-123');

    const request = new NextRequest(new URL('http://localhost:3000/api/fonts'), {
      method: 'POST',
      body: formData,
    });

    const response = await POST(request);
    expect(response.status).toBe(400);
    const body = await response.json();
    expect(body.error).toBe('최대 5MB까지 업로드 가능합니다.');
  });

  it('should return 200 with font data when file is valid', async () => {
    mockGetUserFromRequest.mockResolvedValue({ id: 'user-123' });
    mockStorageListBuckets.mockResolvedValue({ data: [], error: null });
    mockStorageCreateBucket.mockResolvedValue({ data: null, error: null });
    mockStorageUpload.mockResolvedValue({ data: { path: 'user-123/tmpl-123/font-id.ttf' }, error: null });
    mockStorageGetPublicUrl.mockReturnValue({ data: { publicUrl: 'https://cdn.example.com/font.ttf' }, error: null });

    const formData = new FormData();
    const validFile = new File(['dummy font data'], 'my-wedding-font.ttf', { type: 'font/ttf' });
    formData.append('file', validFile);
    formData.append('templateId', 'tmpl-123');

    const request = new NextRequest(new URL('http://localhost:3000/api/fonts'), {
      method: 'POST',
      body: formData,
    });

    const response = await POST(request);
    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.success).toBe(true);
    expect(body.fontUrl).toBe('https://cdn.example.com/font.ttf');
    expect(body.fontFamily).toBe('My Wedding Font');
    expect(body.fontId).toBeDefined();
  });

  it('should use fontName override when provided', async () => {
    mockGetUserFromRequest.mockResolvedValue({ id: 'user-123' });
    mockStorageListBuckets.mockResolvedValue({ data: [], error: null });
    mockStorageCreateBucket.mockResolvedValue({ data: null, error: null });
    mockStorageUpload.mockResolvedValue({ data: { path: 'user-123/tmpl-123/font-id.ttf' }, error: null });
    mockStorageGetPublicUrl.mockReturnValue({ data: { publicUrl: 'https://cdn.example.com/font.ttf' }, error: null });

    const formData = new FormData();
    const validFile = new File(['dummy'], 'my-wedding-font.ttf', { type: 'font/ttf' });
    formData.append('file', validFile);
    formData.append('templateId', 'tmpl-123');
    formData.append('fontName', 'Custom Wedding Font');

    const request = new NextRequest(new URL('http://localhost:3000/api/fonts'), {
      method: 'POST',
      body: formData,
    });

    const response = await POST(request);
    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.fontFamily).toBe('Custom Wedding Font');
  });
});

// ============================================================
// DELETE Tests
// ============================================================

describe('DELETE /api/fonts', () => {
  it('should return 401 when not authenticated', async () => {
    mockGetUserFromRequest.mockResolvedValue(null);

    const request = new NextRequest(new URL('http://localhost:3000/api/fonts?url=test'), {
      method: 'DELETE',
    });

    const response = await DELETE(request);
    expect(response.status).toBe(401);
    const body = await response.json();
    expect(body.error).toBe('인증이 필요합니다.');
  });

  it('should return 400 when url param is missing', async () => {
    mockGetUserFromRequest.mockResolvedValue({ id: 'user-123' });

    const request = new NextRequest(new URL('http://localhost:3000/api/fonts'), {
      method: 'DELETE',
    });

    const response = await DELETE(request);
    expect(response.status).toBe(400);
    const body = await response.json();
    expect(body.error).toBe('url 파라미터가 필요합니다.');
  });

  it('should return 400 when url format is invalid', async () => {
    mockGetUserFromRequest.mockResolvedValue({ id: 'user-123' });

    const request = new NextRequest(new URL('http://localhost:3000/api/fonts?url=invalid-url'), {
      method: 'DELETE',
    });

    const response = await DELETE(request);
    expect(response.status).toBe(400);
    const body = await response.json();
    expect(body.error).toBe('잘못된 URL 형식입니다.');
  });

  it('should return 200 when deletion succeeds', async () => {
    mockGetUserFromRequest.mockResolvedValue({ id: 'user-123' });
    mockStorageRemove.mockResolvedValue({ error: null });

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
