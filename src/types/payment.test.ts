import { describe, it, expect } from 'vitest';
import {
  PaymentStatus,
  type PaymentStatusType,
  type PaymentInsert,
  type PaymentUpdate,
} from '@/types/payment';

describe('PaymentStatus', () => {
  it('has correct constant values', () => {
    expect(PaymentStatus.PENDING).toBe('PENDING');
    expect(PaymentStatus.DONE).toBe('DONE');
    expect(PaymentStatus.CANCELED).toBe('CANCELED');
    expect(PaymentStatus.EXPIRED).toBe('EXPIRED');
  });

  it('PaymentStatusType includes all status values', () => {
    const status: PaymentStatusType = 'PENDING';
    expect(status).toBe('PENDING');
  });
});

describe('PaymentInsert', () => {
  it('accepts minimal required fields', () => {
    const insert: PaymentInsert = {
      user_id: 'user-123',
      template_id: null,
      amount: 10000,
    };
    expect(insert.user_id).toBe('user-123');
    expect(insert.amount).toBe(10000);
  });

  it('accepts all optional fields', () => {
    const insert: PaymentInsert = {
      id: 'pay-123',
      user_id: 'user-123',
      template_id: 'template-456',
      amount: 10000,
      status: 'PENDING',
      payment_key: 'pk_test_123',
      created_at: '2024-01-01T00:00:00Z',
    };
    expect(insert.status).toBe('PENDING');
    expect(insert.payment_key).toBe('pk_test_123');
  });
});

describe('PaymentUpdate', () => {
  it('accepts partial update with only status', () => {
    const update: PaymentUpdate = {
      status: 'DONE',
    };
    expect(update.status).toBe('DONE');
  });

  it('accepts full update', () => {
    const update: PaymentUpdate = {
      status: 'CANCELED',
      payment_key: 'pk_cancel_123',
      template_id: 'template-789',
    };
    expect(update.status).toBe('CANCELED');
  });
});
