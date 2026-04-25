import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { usePayment, type PaymentState } from '@/hooks/use-payment';

const mockFetch = vi.fn();
global.fetch = mockFetch;

beforeEach(() => {
  vi.clearAllMocks();
  localStorage.clear();
  localStorage.setItem('sb-auth-token', 'test-token');
});

describe('usePayment', () => {
  const wrapper = ({ children }: { children: React.ReactNode }) => <div>{children}</div>;

  it('initializes with default state', () => {
    const { result } = renderHook(() => usePayment(), { wrapper });

    expect(result.current.state).toEqual({
      paymentKey: null,
      orderId: null,
      amount: null,
      loading: false,
      error: null,
      completed: false,
    });
  });

  it('requestPayment sets loading to true then false on success', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ orderId: 'order-123', amount: 50000 }),
    });

    const { result } = renderHook(() => usePayment(), { wrapper });

    await act(async () => {
      await result.current.requestPayment('template-123', 50000);
    });

    expect(result.current.state.loading).toBe(false);
    expect(result.current.state.orderId).toBe('order-123');
    expect(result.current.state.amount).toBe(50000);
    expect(result.current.state.error).toBeNull();
    expect(result.current.state.completed).toBe(false);
  });

  it('requestPayment sets error on API failure', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: () => Promise.resolve({ error: '결제 실패' }),
    });

    const { result } = renderHook(() => usePayment(), { wrapper });

    await act(async () => {
      await expect(
        result.current.requestPayment('template-123', 50000)
      ).rejects.toThrow();
    });

    expect(result.current.state.loading).toBe(false);
    expect(result.current.state.error).toBe('결제 실패');
  });

  it('requestPayment handles non-Error exceptions', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network error'));

    const { result } = renderHook(() => usePayment(), { wrapper });

    await act(async () => {
      await expect(
        result.current.requestPayment('template-123', 50000)
      ).rejects.toThrow('Network error');
    });

    expect(result.current.state.loading).toBe(false);
    expect(result.current.state.error).toBe('Network error');
  });

  it('checkPurchase returns true when API returns is_purchased: true', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ is_purchased: true }),
    });

    const { result } = renderHook(() => usePayment(), { wrapper });

    const purchased = await act(async () => {
      return result.current.checkPurchase('template-123');
    });

    expect(purchased).toBe(true);
  });

  it('checkPurchase returns false when API returns is_purchased: false', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ is_purchased: false }),
    });

    const { result } = renderHook(() => usePayment(), { wrapper });

    const purchased = await act(async () => {
      return result.current.checkPurchase('template-123');
    });

    expect(purchased).toBe(false);
  });

  it('checkPurchase returns false on API error', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: () => Promise.resolve({}),
    });

    const { result } = renderHook(() => usePayment(), { wrapper });

    const purchased = await act(async () => {
      return result.current.checkPurchase('template-123');
    });

    expect(purchased).toBe(false);
  });

  it('checkPurchase returns false on network error', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network error'));

    const { result } = renderHook(() => usePayment(), { wrapper });

    const purchased = await act(async () => {
      return result.current.checkPurchase('template-123');
    });

    expect(purchased).toBe(false);
  });

  it('verifyPayment sets completed to true on success', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ success: true }),
    });

    const { result } = renderHook(() => usePayment(), { wrapper });

    // First set orderId and amount via requestPayment
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ orderId: 'order-123', amount: 50000 }),
    });

    await act(async () => {
      await result.current.requestPayment('template-123', 50000);
    });

    await act(async () => {
      await result.current.verifyPayment('payment-key-123');
    });

    expect(result.current.state.loading).toBe(false);
    expect(result.current.state.paymentKey).toBe('payment-key-123');
    expect(result.current.state.completed).toBe(true);
    expect(result.current.state.error).toBeNull();
  });

  it('verifyPayment sets error on failure', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ orderId: 'order-123', amount: 50000 }),
    });

    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: () => Promise.resolve({ error: '검증 실패' }),
    });

    const { result } = renderHook(() => usePayment(), { wrapper });

    await act(async () => {
      await result.current.requestPayment('template-123', 50000);
    });

    await act(async () => {
      await expect(
        result.current.verifyPayment('invalid-key')
      ).rejects.toThrow();
    });

    expect(result.current.state.loading).toBe(false);
    expect(result.current.state.error).toBe('검증 실패');
    expect(result.current.state.completed).toBe(false);
  });

  it('reset returns state to initial values', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ orderId: 'order-123', amount: 50000 }),
    });

    const { result } = renderHook(() => usePayment(), { wrapper });

    await act(async () => {
      await result.current.requestPayment('template-123', 50000);
    });

    expect(result.current.state.orderId).toBe('order-123');

    act(() => {
      result.current.reset();
    });

    expect(result.current.state).toEqual({
      paymentKey: null,
      orderId: null,
      amount: null,
      loading: false,
      error: null,
      completed: false,
    });
  });

  it('requestPayment sends correct API payload', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ orderId: 'order-123', amount: 30000 }),
    });

    const { result } = renderHook(() => usePayment(), { wrapper });

    await act(async () => {
      await result.current.requestPayment('template-456', 30000);
    });

    expect(mockFetch).toHaveBeenCalledWith(
      '/api/payment/request',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          'Content-Type': 'application/json',
        }),
        body: JSON.stringify({ templateId: 'template-456', amount: 30000 }),
      })
    );
  });

  it('checkPurchase sends correct API URL', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ is_purchased: true }),
    });

    const { result } = renderHook(() => usePayment(), { wrapper });

    await act(async () => {
      return result.current.checkPurchase('template-789');
    });

    expect(mockFetch).toHaveBeenCalledWith(
      '/api/payment/check?templateId=template-789',
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: 'Bearer test-token',
        }),
      })
    );
  });

  it('verifyPayment sends correct API payload with orderId and amount', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ orderId: 'order-999', amount: 20000 }),
    });

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ success: true }),
    });

    const { result } = renderHook(() => usePayment(), { wrapper });

    await act(async () => {
      await result.current.requestPayment('template-123', 20000);
    });

    await act(async () => {
      await result.current.verifyPayment('pk_test');
    });

    const verifyCall = mockFetch.mock.calls.find(
      (call) => call[0] === '/api/payment/verify'
    );
    expect(verifyCall).toBeDefined();
    expect(verifyCall![1]).toEqual(
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({
          paymentKey: 'pk_test',
          orderId: 'order-999',
          amount: 20000,
        }),
      })
    );
  });

  it('returns all expected methods', () => {
    const { result } = renderHook(() => usePayment(), { wrapper });

    expect(result.current).toHaveProperty('state');
    expect(result.current).toHaveProperty('requestPayment');
    expect(result.current).toHaveProperty('checkPurchase');
    expect(result.current).toHaveProperty('verifyPayment');
    expect(result.current).toHaveProperty('reset');
  });

  it('state is a PaymentState object', () => {
    const { result } = renderHook(() => usePayment(), { wrapper });

    const state = result.current.state;
    expect(state).toHaveProperty('paymentKey');
    expect(state).toHaveProperty('orderId');
    expect(state).toHaveProperty('amount');
    expect(state).toHaveProperty('loading');
    expect(state).toHaveProperty('error');
    expect(state).toHaveProperty('completed');
  });
});
