import { CatalogExplorer } from '@/components/product/CatalogExplorer';
import { getCategories, getProducts } from '@/lib/api';

export const metadata = { title: 'Explore the collection', description: 'Shop Grabin footwear, apparel, cycling gear, and accessories.' };

export default function Page() {
  const products = getProducts();
  const categories = getCategories();

  return (
    <div className="mx-auto max-w-7xl px-6 pb-20 pt-16 lg:px-10">
      <div className="max-w-2xl"><p className="text-sm font-black uppercase tracking-[0.2em] text-moss">The collection</p><h1 className="mt-5 text-6xl font-black leading-[0.85] tracking-[-0.08em]">Good gear, no gimmicks.</h1></div>
      <CatalogExplorer products={products} categories={categories} />
    </div>
  );
}
