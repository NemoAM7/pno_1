'use client';

import Link from 'next/link';
import { formatPrice } from '@/lib/money';
import { getCartSubtotalCents, useCartStore } from '@/stores/cart';
import { CartLineItem } from './CartLineItem';

export function CartDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const lines = useCartStore((state) => state.lines);
  const hasHydrated = useCartStore((state) => state.hasHydrated);
  const subtotalCents = getCartSubtotalCents(lines);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end" role="dialog" aria-modal="true" aria-label="Shopping cart">
      <button type="button" className="absolute inset-0 bg-ink/30" onClick={onClose} aria-label="Close cart" />
      <aside className="relative flex h-full w-full max-w-md flex-col bg-paper px-6 py-6 shadow-2xl">
        <div className="flex items-center justify-between border-b border-line pb-5"><h2 className="text-2xl font-black tracking-[-0.05em]">Your cart</h2><button type="button" onClick={onClose} className="text-sm font-bold uppercase tracking-[0.1em] text-ink/70">Close</button></div>
        {!hasHydrated ? <div className="flex flex-1 items-center justify-center text-sm text-ink/70">Loading cart...</div> : lines.length === 0 ? <div className="flex flex-1 flex-col items-center justify-center text-center"><p className="text-xl font-black">Your cart is empty.</p><Link href="/explore" onClick={onClose} className="mt-5 rounded-full bg-ink px-5 py-3 text-sm font-bold text-paper">Explore products</Link></div> : <><div className="flex-1 overflow-y-auto">{lines.map((line) => <CartLineItem key={line.variantId} line={line} />)}</div><div className="border-t border-line pt-5"><div className="flex justify-between text-lg font-bold"><span>Subtotal</span><span>{formatPrice(subtotalCents)}</span></div><Link href="/cart" onClick={onClose} className="mt-5 block rounded-full bg-ink px-5 py-4 text-center text-sm font-black uppercase tracking-[0.12em] text-paper">View cart</Link></div></>}
      </aside>
    </div>
  );
}
