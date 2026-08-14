import Link from 'next/link';
import type { Product } from '@/lib/schemas/product';
import { formatPrice } from '@/lib/money';

export function ProductCard({ product }: { product: Product }) {
  return (
    <article className="group">
      <Link href={`/explore/${product.categoryId}/${product.slug}`}>
        <div className="relative flex aspect-[4/5] items-end overflow-hidden rounded-[2rem] bg-moss p-6 text-paper transition-transform duration-300 group-hover:-translate-y-1">
          <div className="absolute right-5 top-5 rounded-full bg-lime px-3 py-1 text-xs font-black uppercase tracking-wider text-ink">{product.isInStock ? 'In stock' : 'Sold out'}</div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-paper/60">{product.categoryId}</p>
            <p className="mt-2 max-w-[12rem] text-3xl font-black leading-[0.9] tracking-[-0.06em]">{product.name}</p>
          </div>
        </div>
        <div className="flex items-start justify-between gap-4 py-4">
          <div>
            <h3 className="font-bold">{product.name}</h3>
            <p className="mt-1 text-sm text-ink/55">{product.description}</p>
          </div>
          <p className="shrink-0 font-bold">{formatPrice(product.priceCents, product.currency)}</p>
        </div>
      </Link>
    </article>
  );
}
