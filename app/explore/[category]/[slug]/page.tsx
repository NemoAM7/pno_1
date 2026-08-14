import { notFound } from 'next/navigation';
import { ProductGallery } from '@/components/product/ProductGallery';
import { ProductPurchase } from '@/components/product/ProductPurchase';
import { getProducts } from '@/lib/api';
import { formatPrice } from '@/lib/money';

export function generateStaticParams() {
  return getProducts().map((p) => ({ category: p.categoryId, slug: p.slug }));
}

export default async function Page({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}) {
  const { slug } = await params;
  const products = getProducts();
  const product = products.find((p) => p.slug === slug);
  if (!product) notFound();
  return (
    <div className="mx-auto max-w-7xl px-6 pb-20 pt-16 lg:px-10">
      <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
        <ProductGallery name={product.name} images={product.images} />
        <div className="flex flex-col justify-center">
          <p className="text-sm font-black uppercase tracking-[0.2em] text-moss">{product.categoryId} / {product.isInStock ? 'Available now' : 'Unavailable'}</p>
          <h1 className="mt-5 text-6xl font-black leading-[0.84] tracking-[-0.08em]">{product.name}</h1>
          <p className="mt-6 text-2xl font-bold">{formatPrice(product.priceCents, product.currency)}</p>
          <p className="mt-6 max-w-lg text-lg leading-7 text-ink/65">{product.description}.</p>
          <div className="my-8 border-y border-line py-6"><ProductPurchase product={product} /></div>
          <div className="grid gap-6 border-t border-line pt-6 sm:grid-cols-2"><div><p className="text-xs font-black uppercase tracking-[0.14em] text-moss">Materials</p><p className="mt-2 text-sm text-ink/65">{product.materials.join(' / ')}</p></div><div><p className="text-xs font-black uppercase tracking-[0.14em] text-moss">Details</p><p className="mt-2 text-sm text-ink/65">Designed for daily movement, built to go the distance.</p></div></div>
        </div>
      </div>
    </div>
  );
}
