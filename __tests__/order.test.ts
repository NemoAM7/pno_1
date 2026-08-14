import { describe, expect, it } from 'vitest';
import { buildMockOrder } from '../lib/checkout/order';

describe('buildMockOrder', () => {
  it('builds a paid order using integer-cent totals', () => {
    const order = buildMockOrder({
      items: [{ productId: 'run-racer-2', variantId: 'run-racer-2-uk10-black', quantity: 2 }],
      email: 'ayaan@example.com',
      shipping: { firstName: 'Ayaan', lastName: 'Khan', address1: '1 Main Street', city: 'Mumbai', postalCode: '400001', country: 'IN' },
      shippingMethodId: 'standard',
      payment: { token: 'mock_token' },
    }, [{ productId: 'run-racer-2', variantId: 'run-racer-2-uk10-black', name: 'Run Racer 2', quantity: 2, unitCents: 1079900 }], 9900);

    expect(order.status).toBe('paid');
    expect(order.subtotalCents).toBe(2159800);
    expect(order.totalCents).toBe(2169700);
    expect(order.orderNumber).toMatch(/^GRB-\d{4}-\d{6}$/);
  });
});
