import Link from 'next/link';
import { NewsletterForm } from './NewsletterForm';

export function Footer() {
  return (
    <footer className="mt-24 bg-ink px-6 py-12 text-paper lg:px-10">
      <div className="mx-auto grid max-w-7xl gap-12 md:grid-cols-[1fr_auto] md:items-end">
        <div>
          <p className="text-3xl font-black tracking-[-0.08em]">GRABIN<span className="text-lime">.</span></p>
          <p className="mt-3 max-w-xs text-sm leading-6 text-paper/65">Equipment for the everyday athlete. Built to move with you.</p>
          <p className="mt-8 text-sm font-bold uppercase tracking-[0.12em] text-lime">Stay in the loop</p>
          <NewsletterForm />
        </div>
        <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-sm font-bold uppercase tracking-[0.12em] text-paper/75">
          <Link href="/explore">Explore</Link>
          <Link href="/customize">Customize</Link>
          <Link href="/about">About</Link>
          <Link href="/contact">Contact</Link>
          <Link href="/policies#shipping">Shipping</Link>
          <Link href="/policies#returns">Returns</Link>
          <Link href="/policies#privacy">Privacy</Link>
          <Link href="/policies#terms">Terms</Link>
        </div>
      </div>
    </footer>
  );
}
