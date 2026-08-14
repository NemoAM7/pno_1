'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { Product } from '@/lib/schemas/product';
import { AddToCartButton } from './AddToCartButton';
import { VariantPicker } from './VariantPicker';

export function ProductPurchase({ product }: { product: Product }) {
  const [selectedVariantId, setSelectedVariantId] = useState(product.variants[0]?.id ?? '');
  const selectedVariant = product.variants.find((variant) => variant.id === selectedVariantId) ?? product.variants[0];

  if (!selectedVariant) return <p className="text-sm text-ink/60">No variants are currently available.</p>;

  return (
    <div className="space-y-6">
      <VariantPicker variants={product.variants} selectedVariantId={selectedVariant.id} onChange={setSelectedVariantId} />
      <AddToCartButton product={product} variant={selectedVariant} />
      {product.isCustomizable && (
        <Link href={`/customize?requestType=existing-product&productId=${encodeURIComponent(product.id)}&variantId=${encodeURIComponent(selectedVariant.id)}&productName=${encodeURIComponent(product.name)}&variantLabel=${encodeURIComponent(`${selectedVariant.size} / ${selectedVariant.color}`)}`} className="block text-center text-sm font-bold uppercase tracking-[0.12em] text-moss hover:text-ink">
          Request customization
        </Link>
      )}
    </div>
  );
}
