'use client';

import { useState } from 'react';
import Link from 'next/link';

export function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button type="button" onClick={() => setOpen((current) => !current)} className="rounded-full border border-ink px-4 py-2 text-sm font-bold" aria-expanded={open} aria-controls="mobile-navigation">{open ? 'Close' : 'Menu'}</button>
      {open && <nav id="mobile-navigation" className="absolute inset-x-0 top-full border-b border-line bg-paper px-6 py-5 shadow-lg"><div className="mx-auto flex max-w-7xl flex-col gap-5 text-sm font-bold uppercase tracking-[0.14em]"><Link href="/explore" onClick={() => setOpen(false)}>Explore</Link><Link href="/customize" onClick={() => setOpen(false)}>Customize</Link><Link href="/about" onClick={() => setOpen(false)}>About</Link><Link href="/contact" onClick={() => setOpen(false)}>Contact</Link></div></nav>}
    </div>
  );
}
