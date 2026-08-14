import Link from 'next/link';

export function Footer() {
  return (
    <footer className="mt-24 bg-ink px-6 py-12 text-paper lg:px-10">
      <div className="mx-auto flex max-w-7xl flex-col gap-10 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-3xl font-black tracking-[-0.08em]">GRABIN<span className="text-lime">.</span></p>
          <p className="mt-3 max-w-xs text-sm leading-6 text-paper/65">Equipment for the everyday athlete. Built to move with you.</p>
        </div>
        <div className="flex gap-6 text-sm font-bold uppercase tracking-[0.12em] text-paper/75">
          <Link href="/explore">Explore</Link>
          <Link href="/about">About</Link>
          <Link href="/contact">Contact</Link>
        </div>
      </div>
    </footer>
  );
}
