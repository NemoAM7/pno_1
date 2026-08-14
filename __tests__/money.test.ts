import { describe, it, expect } from 'vitest';
import { formatPrice, addCents, multiplyCents } from '../lib/money';

describe('lib/money', () => {
  it('formatPrice returns formatted currency string', () => {
    expect(formatPrice(12900)).toBe('$129.00');
    expect(formatPrice(0)).toBe('$0.00');
    expect(formatPrice(150, 'EUR')).toBe('€1.50');
  });

  it('addCents sums values', () => {
    expect(addCents(100, 200, 300)).toBe(600);
    expect(addCents()).toBe(0);
  });

  it('multiplyCents computes quantity * unit', () => {
    expect(multiplyCents(12900, 2)).toBe(25800);
  });
});
