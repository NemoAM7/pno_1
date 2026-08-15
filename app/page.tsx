import Link from 'next/link';
import { ProductCard } from '@/components/product/ProductCard';
import { getCategories, getProducts } from '@/lib/api';

export const metadata = { title: 'Sportswear and gear for the long way', description: 'Explore Grabin footwear, apparel, cycling gear, and accessories built for everyday movement.' };

export default function Page() {
  const products = getProducts();
  const categories = getCategories();
  const featured = products.filter((product) => product.isFeatured);

  return (
    <div>
      <section className="mx-auto grid max-w-7xl gap-10 px-6 pb-20 pt-16 lg:grid-cols-[1.1fr_0.9fr] lg:px-10 lg:pt-24">
        <div className="flex flex-col justify-between"><p className="text-sm font-black uppercase tracking-[0.2em] text-moss">Move with intent / 001</p><div className="mt-16 lg:mt-28"><h1 className="max-w-3xl text-7xl font-black leading-[0.82] tracking-[-0.09em] sm:text-8xl">Built for the long way.</h1><p className="mt-8 max-w-md text-lg leading-7 text-ink/65">Performance essentials with a point of view. Gear that earns its place in your everyday rotation.</p><Link href="/explore" className="mt-8 inline-flex rounded-full bg-ink px-7 py-4 text-sm font-black uppercase tracking-[0.14em] text-paper transition-transform hover:-translate-y-0.5">Shop the collection</Link></div></div>
        <div className="flex min-h-[28rem] items-end rounded-[2rem] bg-lime p-8 lg:min-h-[38rem]"><div><p className="text-sm font-black uppercase tracking-[0.18em]">Field note 01</p><p className="mt-4 max-w-sm text-5xl font-black leading-[0.88] tracking-[-0.07em]">Less noise. More miles.</p></div></div>
      </section>
      <section className="mx-auto max-w-7xl px-6 lg:px-10"><div className="mb-8 flex items-end justify-between border-b border-line pb-4"><h2 className="text-3xl font-black tracking-[-0.06em]">Featured now</h2><Link href="/explore" className="text-sm font-bold uppercase tracking-[0.12em] text-moss">View all</Link></div><div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">{featured.map((product) => <ProductCard key={product.id} product={product} />)}</div></section>
      <section className="mx-auto mt-24 max-w-7xl px-6 lg:px-10"><p className="text-sm font-black uppercase tracking-[0.2em] text-moss">Find your pace</p><div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{categories.map((category) => <Link key={category.id} href={`/explore/${category.slug}`} className="group rounded-[2rem] border border-line bg-white/35 p-7 transition-colors hover:bg-lime"><p className="text-4xl font-black tracking-[-0.07em]">{category.name}</p><p className="mt-12 text-sm text-ink/60">{category.description}</p><p className="mt-6 text-sm font-black uppercase tracking-[0.14em]">Explore <span className="inline-block transition-transform group-hover:translate-x-2">-&gt;</span></p></Link>)}</div></section>
    </div>
  );
}
