import { describe, expect, it } from 'vitest';
import { CheckoutRequestSchema } from '../lib/schemas/checkout';
import { OrderSchema } from '../lib/schemas/order';

const validRequest = {
  items: [{ productId: 'run-racer-2', variantId: 'run-racer-2-us10-black', quantity: 1 }],
  email: 'ayaan@example.com',
  shipping: {
    firstName: 'Ayaan',
    lastName: 'Khan',
    address1: '1 Main Street',
    city: 'London',
    postalCode: 'SW1A 1AA',
    country: 'GB',
  },
  shippingMethodId: 'express',
  payment: { token: 'mock_token' },
};

describe('checkout contracts', () => {
  it('accepts a valid guest checkout request', () => {
    expect(CheckoutRequestSchema.safeParse(validRequest).success).toBe(true);
  });

  it('rejects checkout without an email or items', () => {
    expect(CheckoutRequestSchema.safeParse({ ...validRequest, email: 'not-an-email' }).success).toBe(false);
    expect(CheckoutRequestSchema.safeParse({ ...validRequest, items: [] }).success).toBe(false);
  });

  it('accepts a paid order result with confirmation details', () => {
    expect(OrderSchema.safeParse({
      id: 'order_123',
      orderNumber: 'GRB-2026-0001',
      status: 'paid',
      subtotalCents: 12900,
      shippingCents: 1500,
      taxCents: 0,
      totalCents: 14400,
      currency: 'USD',
      email: 'ayaan@example.com',
      shipping: validRequest.shipping,
      placedAt: new Date().toISOString(),
    }).success).toBe(true);
  });
});
