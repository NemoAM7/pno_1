import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { ProductCard } from '@/components/product/ProductCard';
import { getCategories, getProductsByCategory } from '@/lib/api';

export function generateStaticParams() {
  return getCategories().map((cat) => ({ category: cat.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }): Promise<Metadata> {
  const { category } = await params;
  const categoryData = getCategories().find((item) => item.slug === category);
  return { title: categoryData ? `${categoryData.name} collection` : 'Category', description: categoryData?.description ?? 'Explore the Grabin collection.' };
}

export default async function Page({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const categoryData = getCategories().find((item) => item.slug === category);
  const products = getProductsByCategory(categoryData?.id ?? category);
  if (products.length === 0) notFound();
  return <div className="mx-auto max-w-7xl px-6 pb-20 pt-16 lg:px-10"><p className="text-sm font-black uppercase tracking-[0.2em] text-moss">Category / {categoryData?.name ?? category}</p><div className="mt-5 flex flex-col justify-between gap-6 border-b border-line pb-10 md:flex-row md:items-end"><h1 className="text-6xl font-black leading-[0.85] tracking-[-0.08em]">{categoryData?.name ?? category}</h1><p className="max-w-sm text-ink/70">{categoryData?.description}. Designed to keep up and stay out of the way.</p></div><div className="mt-12 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">{products.map((product) => <ProductCard key={product.id} product={product} />)}</div></div>;
}
