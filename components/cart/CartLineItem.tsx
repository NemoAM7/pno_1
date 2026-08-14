'use client';

import { formatPrice } from '@/lib/money';
import { useCartStore, type CartLine } from '@/stores/cart';
import { QuantityStepper } from './QuantityStepper';

export function CartLineItem({ line }: { line: CartLine }) {
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);

  return (
    <article className="flex gap-4 border-b border-line py-5">
      <div className="flex h-24 w-20 shrink-0 items-end rounded-2xl bg-moss p-3 text-paper"><span className="text-xs font-black uppercase leading-[0.9]">{line.name}</span></div>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3"><div><h3 className="font-bold">{line.name}</h3><p className="mt-1 text-sm text-ink/55">{[line.color, line.size].filter(Boolean).join(' / ')}</p></div><p className="font-bold">{formatPrice(line.unitCents * line.quantity)}</p></div>
        <div className="mt-4 flex items-center justify-between"><QuantityStepper quantity={line.quantity} onChange={(quantity) => updateQuantity(line.variantId, quantity)} /><button type="button" onClick={() => removeItem(line.variantId)} className="text-xs font-bold uppercase tracking-[0.1em] text-ink/50 hover:text-red-700">Remove</button></div>
      </div>
    </article>
  );
}
