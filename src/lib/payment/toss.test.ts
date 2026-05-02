import { describe, it, expect, vi, beforeEach, beforeAll, afterAll } from 'vitest';

// Mock fetch globally
const mockFetch = vi.fn();
beforeAll(() => {
  (globalThis as any).fetch = mockFetch;
});
afterAll(() => {
  delete (globalThis as any).fetch;
});

describe('TossPaymentsClient', () => {
  let TossPaymentsClient: typeof import('@/lib/payment/toss').TossPaymentsClient;

  beforeEach(async () => {
    vi.resetModules();
    vi.clearAllMocks();
    // Set env before module loads
    process.env.TOSS_PAYMENTS_SECRET_KEY = 'test-secret-key';
    const mod = await import('@/lib/payment/toss');
    TossPaymentsClient = mod.TossPaymentsClient;
  });

  describe('constructor', () => {
    it('throws error when no secret key provided', async () => {
      vi.resetModules();
      delete process.env.TOSS_PAYMENTS_SECRET_KEY;
      const mod = await import('@/lib/payment/toss');
      const Client = mod.TossPaymentsClient;
      expect(() => new Client()).toThrow('TOSS_PAYMENTS_SECRET_KEY');
    });

    it('accepts secret key via constructor', () => {
      const client = new TossPaymentsClient('test-secret-key');
      expect(client).toBeInstanceOf(TossPaymentsClient);
    });

    it('uses environment variable as default', () => {
      const client = new TossPaymentsClient();
      expect(client).toBeInstanceOf(TossPaymentsClient);
    });
  });

  describe('createCheckoutOrder', () => {
    it('generates order with order_ prefix', () => {
      const client = new TossPaymentsClient('test-key');
      const order = client.createCheckoutOrder();
      expect(order.orderId).toMatch(/^order_/);
      expect(order.amount).toBe(0);
    });

    it('generates unique order IDs', () => {
      const client = new TossPaymentsClient('test-key');
      const order1 = client.createCheckoutOrder();
      const order2 = client.createCheckoutOrder();
      expect(order1.orderId).not.toBe(order2.orderId);
    });
  });
});

describe('getTossClient', () => {
  let getTossClient: typeof import('@/lib/payment/toss').getTossClient;

  beforeEach(async () => {
    vi.resetModules();
    process.env.TOSS_PAYMENTS_SECRET_KEY = 'test-secret-key';
    const mod = await import('@/lib/payment/toss');
    getTossClient = mod.getTossClient;
  });

  it('creates new instance on first call', () => {
    const client1 = getTossClient();
    expect(client1).toBeDefined();
  });

  it('returns cached instance on second call (singleton)', () => {
    const client1 = getTossClient();
    const client2 = getTossClient();
    expect(client1).toBe(client2);
  });
});
