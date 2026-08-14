import { beforeEach, describe, expect, it } from 'vitest';
import { getCartItemCount, getCartSubtotalCents, useCartStore, type CartLine } from '../stores/cart';

const shoe: CartLine = {
  productId: 'run-racer-2',
  variantId: 'run-racer-2-us10-black',
  name: 'Run Racer 2',
  color: 'Black',
  size: 'US 10',
  unitCents: 12900,
  quantity: 1,
};

describe('cart store', () => {
  beforeEach(() => {
    useCartStore.getState().clear();
  });

  it('adds items and merges the same variant', () => {
    useCartStore.getState().addItem(shoe);
    useCartStore.getState().addItem({ ...shoe, quantity: 2 });

    expect(useCartStore.getState().lines).toHaveLength(1);
    expect(useCartStore.getState().lines[0].quantity).toBe(3);
  });

  it('updates quantities and removes zero quantities', () => {
    useCartStore.getState().addItem(shoe);
    useCartStore.getState().updateQuantity(shoe.variantId, 3.8);
    expect(useCartStore.getState().lines[0].quantity).toBe(3);

    useCartStore.getState().updateQuantity(shoe.variantId, 0);
    expect(useCartStore.getState().lines).toEqual([]);
  });

  it('derives item count and subtotal in integer cents', () => {
    const lines = [shoe, { ...shoe, variantId: 'second', unitCents: 5500, quantity: 2 }];

    expect(getCartItemCount(lines)).toBe(3);
    expect(getCartSubtotalCents(lines)).toBe(23900);
  });
});
