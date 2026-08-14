'use client';

import { useState } from 'react';
import type { Product, Variant } from '@/lib/schemas/product';
import { useCartStore } from '@/stores/cart';

export function AddToCartButton({ product, variant }: { product: Product; variant: Variant }) {
  const addItem = useCartStore((state) => state.addItem);
  const [added, setAdded] = useState(false);

  function handleAdd() {
    addItem({ productId: product.id, variantId: variant.id, name: product.name, color: variant.color, size: variant.size, unitCents: product.priceCents, quantity: 1 });
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1800);
  }

  return (
    <button type="button" disabled={!product.isInStock} onClick={handleAdd} className="w-full rounded-full bg-lime px-6 py-4 text-sm font-black uppercase tracking-[0.14em] text-ink transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50">
      {added ? 'Added to cart' : product.isInStock ? 'Add to cart' : 'Sold out'}
    </button>
  );
}
