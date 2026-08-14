import { describe, expect, it } from 'vitest';
import { filterAndSortProducts } from '../lib/catalog';
import type { Product } from '../lib/schemas/product';

const products: Product[] = [
  {
    id: 'one', slug: 'one', name: 'Alpha Runner', categoryId: 'footwear', description: 'Light shoe', priceCents: 10000,
    currency: 'USD', images: [], materials: ['mesh'], isFeatured: true, isInStock: true,
    variants: [{ id: 'one-black-9', color: 'Black', size: 'US 9', sku: 'ONE-9' }],
  },
  {
    id: 'two', slug: 'two', name: 'Beta Trainer', categoryId: 'footwear', description: 'Stable shoe', priceCents: 15000,
    currency: 'USD', images: [], materials: ['rubber'], isFeatured: false, isInStock: true,
    variants: [{ id: 'two-white-10', color: 'White', size: 'US 10', sku: 'TWO-10' }],
  },
];

describe('filterAndSortProducts', () => {
  it('filters by search text and variant attributes', () => {
    expect(filterAndSortProducts(products, { q: 'stable', color: 'White' }).map((product) => product.id)).toEqual(['two']);
  });

  it('filters by price in dollars while retaining cents internally', () => {
    expect(filterAndSortProducts(products, { min: '120', max: '160' }).map((product) => product.id)).toEqual(['two']);
  });

  it('sorts by price', () => {
    expect(filterAndSortProducts(products, { sort: 'price-desc' }).map((product) => product.id)).toEqual(['two', 'one']);
  });

  it('narrows a global search by category', () => {
    expect(filterAndSortProducts(products, { q: 'shoe', categoryId: 'footwear' }).map((product) => product.id)).toEqual(['one', 'two']);
    expect(filterAndSortProducts(products, { q: 'shoe', categoryId: 'apparel' })).toEqual([]);
  });
});
