import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Mock at module level
vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(),
}));

const { createClient } = await import('@supabase/supabase-js');
const { getUserFromRequest, requireAdmin } = await import('@/lib/auth');

describe('getUserFromRequest', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns null when no authorization header', async () => {
    const request = { headers: new Headers() };
    const result = await getUserFromRequest(request as any);
    expect(result).toBeNull();
  });

  it('returns null when authorization header does not start with Bearer', async () => {
    const headers = new Headers();
    headers.set('authorization', 'Basic dGVzdDp0ZXN0');
    const request = { headers };
    const result = await getUserFromRequest(request as any);
    expect(result).toBeNull();
  });

  it('returns user when valid Bearer token is provided', async () => {
    const mockUser = { id: 'user-123', email: 'test@example.com' };
    (createClient as ReturnType<typeof vi.fn>).mockReturnValue({
      auth: {
        getUser: vi.fn().mockResolvedValue({ data: { user: mockUser }, error: null }),
      },
    });

    const headers = new Headers();
    headers.set('authorization', 'Bearer fake-jwt-token');
    const request = { headers };
    const result = await getUserFromRequest(request as any);
    expect(result).toEqual(mockUser);
  });

  it('returns null when Supabase getUser returns error', async () => {
    (createClient as ReturnType<typeof vi.fn>).mockReturnValue({
      auth: {
        getUser: vi.fn().mockResolvedValue({ data: { user: null }, error: new Error('invalid token') }),
      },
    });

    const headers = new Headers();
    headers.set('authorization', 'Bearer invalid-token');
    const request = { headers };
    const result = await getUserFromRequest(request as any);
    expect(result).toBeNull();
  });
});

describe('requireAdmin', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns 401 when no authenticated user', async () => {
    (createClient as ReturnType<typeof vi.fn>).mockReturnValue({
      auth: {
        getUser: vi.fn().mockResolvedValue({ data: { user: null }, error: null }),
      },
    });

    const headers = new Headers();
    headers.set('authorization', 'Bearer no-user-token');
    const request = { headers };
    const result = await requireAdmin(request as any);
    expect(result.user).toBeNull();
    expect(result.response).toBeDefined();
    if (result.response) {
      expect(result.response.status).toBe(401);
    }
  });

  it('returns 403 when user is not admin', async () => {
    const mockUser = {
      id: 'user-123',
      email: 'user@example.com',
      user_metadata: { role: 'user' },
    };

    (createClient as ReturnType<typeof vi.fn>).mockReturnValue({
      auth: {
        getUser: vi.fn().mockResolvedValue({ data: { user: mockUser }, error: null }),
      },
    });

    const headers = new Headers();
    headers.set('authorization', 'Bearer user-token');
    const request = { headers };
    const result = await requireAdmin(request as any);
    expect(result.user).toEqual(mockUser);
    expect(result.response).toBeDefined();
    if (result.response) {
      expect(result.response.status).toBe(403);
    }
  });

  it('returns user when role is admin', async () => {
    const mockUser = {
      id: 'admin-123',
      email: 'admin@example.com',
      user_metadata: { role: 'admin' },
    };

    (createClient as ReturnType<typeof vi.fn>).mockReturnValue({
      auth: {
        getUser: vi.fn().mockResolvedValue({ data: { user: mockUser }, error: null }),
      },
    });

    const headers = new Headers();
    headers.set('authorization', 'Bearer admin-token');
    const request = { headers };
    const result = await requireAdmin(request as any);
    expect(result.user).toEqual(mockUser);
    expect(result.response).toBeNull();
  });
});
