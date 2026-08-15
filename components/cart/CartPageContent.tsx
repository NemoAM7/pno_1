'use client';

import Link from 'next/link';
import { formatPrice } from '@/lib/money';
import type { ShippingMethod } from '@/lib/schemas/checkout';
import { getCartSubtotalCents, useCartStore } from '@/stores/cart';
import { CartLineItem } from './CartLineItem';

export function CartPageContent({ shippingMethods }: { shippingMethods: ShippingMethod[] }) {
  const lines = useCartStore((state) => state.lines);
  const hasHydrated = useCartStore((state) => state.hasHydrated);
  const subtotalCents = getCartSubtotalCents(lines);
  const shipping = shippingMethods[0];
  const shippingCents = lines.length > 0 ? (shipping?.priceCents ?? 0) : 0;
  const totalCents = subtotalCents + shippingCents;

  if (!hasHydrated) {
    return <div className="mx-auto max-w-3xl px-6 py-24 text-center lg:px-10"><p className="text-sm font-black uppercase tracking-[0.2em] text-moss">Your cart</p><p className="mt-5 text-lg text-ink/60">Loading cart...</p></div>;
  }

  if (lines.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-24 text-center lg:px-10"><p className="text-sm font-black uppercase tracking-[0.2em] text-moss">Your cart</p><h1 className="mt-5 text-6xl font-black leading-[0.85] tracking-[-0.08em]">Nothing here yet.</h1><p className="mx-auto mt-6 max-w-md text-lg text-ink/60">Find something that keeps you moving, then come back here to review it.</p><Link href="/explore" className="mt-8 inline-flex rounded-full bg-ink px-7 py-4 text-sm font-black uppercase tracking-[0.14em] text-paper">Explore products</Link></div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-6 pb-20 pt-16 lg:px-10"><div className="flex items-end justify-between border-b border-line pb-6"><div><p className="text-sm font-black uppercase tracking-[0.2em] text-moss">Review your gear</p><h1 className="mt-4 text-6xl font-black leading-[0.85] tracking-[-0.08em]">Your cart</h1></div><p className="text-sm text-ink/55">{lines.length} {lines.length === 1 ? 'line' : 'lines'}</p></div><div className="grid gap-12 pt-8 lg:grid-cols-[1fr_24rem]"><section>{lines.map((line) => <CartLineItem key={line.variantId} line={line} />)}</section><aside className="h-fit rounded-[2rem] bg-ink p-7 text-paper"><h2 className="text-2xl font-black tracking-[-0.05em]">Summary</h2><div className="mt-8 space-y-4 text-sm"><div className="flex justify-between"><span className="text-paper/60">Subtotal</span><span>{formatPrice(subtotalCents)}</span></div><div className="flex justify-between"><span className="text-paper/60">{shipping?.label ?? 'Shipping'}</span><span>{formatPrice(shippingCents)}</span></div><div className="border-t border-paper/20 pt-4 text-lg font-bold"><div className="flex justify-between"><span>Total</span><span>{formatPrice(totalCents)}</span></div></div></div><Link href="/checkout" className="mt-8 block rounded-full bg-lime px-5 py-4 text-center text-sm font-black uppercase tracking-[0.12em] text-ink">Continue to checkout</Link><p className="mt-4 text-center text-xs leading-5 text-paper/50">Shipping estimates are calculated using the standard method.</p></aside></div></div>
  );
}
