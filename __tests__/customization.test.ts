import { describe, expect, it } from 'vitest';
import { CustomizationRequestSchema } from '../lib/schemas/customization';

const customerFields = {
  name: 'Ayaan Khan',
  email: 'ayaan@example.com',
  phone: '+91 98765 43210',
  request: 'Add initials AK on the left chest',
  consent: true as const,
};

describe('CustomizationRequestSchema', () => {
  it('accepts an existing product request with catalog context', () => {
    const result = CustomizationRequestSchema.safeParse({
      ...customerFields,
      requestType: 'existing-product',
      productId: 'aero-racer-jersey',
      variantId: 'aero-racer-jersey-medium-blue',
    });

    expect(result.success).toBe(true);
  });

  it('accepts a new product request without catalog IDs', () => {
    const result = CustomizationRequestSchema.safeParse({
      ...customerFields,
      requestType: 'new-product',
      productType: 'Cycling jersey',
      preferredSize: 'L',
      preferredColor: 'Green',
    });

    expect(result.success).toBe(true);
  });

  it('rejects incomplete requests and missing consent', () => {
    const result = CustomizationRequestSchema.safeParse({
      ...customerFields,
      consent: false,
      requestType: 'new-product',
    });

    expect(result.success).toBe(false);
  });
});
