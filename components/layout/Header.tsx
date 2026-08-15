'use client';

import { useState } from 'react';
import Link from 'next/link';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { getCartItemCount, useCartStore } from '@/stores/cart';
import { MobileNav } from './MobileNav';

export function Header() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const itemCount = useCartStore((state) => getCartItemCount(state.lines));
  const hasHydrated = useCartStore((state) => state.hasHydrated);

  return (
    <>
      <header className="relative border-b border-line bg-paper">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-10">
        <Link href="/" className="text-xl font-black tracking-[-0.08em]">
          GRABIN<span className="text-moss">.</span>
        </Link>
        <nav className="hidden items-center gap-8 text-sm font-bold uppercase tracking-[0.14em] md:flex">
          <Link href="/explore" className="transition-colors hover:text-moss">Explore</Link>
          <Link href="/customize" className="transition-colors hover:text-moss">Customize</Link>
          <Link href="/about" className="transition-colors hover:text-moss">About</Link>
          <Link href="/contact" className="transition-colors hover:text-moss">Contact</Link>
        </nav>
        <div className="flex items-center gap-2"><MobileNav /><button type="button" onClick={() => setDrawerOpen(true)} className="rounded-full border border-ink px-4 py-2 text-sm font-bold transition-colors hover:bg-ink hover:text-paper">Cart{hasHydrated && itemCount > 0 ? ` (${itemCount})` : ''}</button></div>
      </div>
      </header>
      <CartDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  );
}
