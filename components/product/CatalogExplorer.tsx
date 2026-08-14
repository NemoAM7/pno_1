'use client';

import { useState } from 'react';
import type { Product } from '@/lib/schemas/product';
import type { Category } from '@/lib/schemas/product';
import { filterAndSortProducts, getFilterOptions, type CatalogFilters } from '@/lib/catalog';
import { ProductCard } from './ProductCard';

export function CatalogExplorer({ products, categories }: { products: Product[]; categories: Category[] }) {
  const [filters, setFilters] = useState<CatalogFilters>({});
  const facetProducts = filterAndSortProducts(products, { q: filters.q, categoryId: filters.categoryId });
  const options = getFilterOptions(facetProducts);
  const visibleProducts = filterAndSortProducts(products, filters);

  function updateFilter(key: keyof CatalogFilters, value: string) {
    setFilters((current) => ({ ...current, [key]: value || undefined }));
  }

  return (
    <>
      <div className="mt-12 grid gap-3 rounded-2xl border border-line bg-white/35 p-4 sm:grid-cols-2 lg:grid-cols-6">
        <input value={filters.q ?? ''} onChange={(event) => updateFilter('q', event.target.value)} placeholder="Search products" className="rounded-xl border border-line bg-paper px-4 py-3 text-sm outline-none placeholder:text-ink/45 focus:border-ink lg:col-span-2" />
        <select value={filters.categoryId ?? ''} onChange={(event) => updateFilter('categoryId', event.target.value)} className="rounded-xl border border-line bg-paper px-4 py-3 text-sm outline-none"><option value="">All categories</option>{categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</select>
        <select value={filters.size ?? ''} onChange={(event) => updateFilter('size', event.target.value)} className="rounded-xl border border-line bg-paper px-4 py-3 text-sm outline-none"><option value="">All sizes</option>{options.sizes.map((size) => <option key={size}>{size}</option>)}</select>
        <select value={filters.color ?? ''} onChange={(event) => updateFilter('color', event.target.value)} className="rounded-xl border border-line bg-paper px-4 py-3 text-sm outline-none"><option value="">All colors</option>{options.colors.map((color) => <option key={color}>{color}</option>)}</select>
        <select value={filters.sort ?? ''} onChange={(event) => updateFilter('sort', event.target.value)} className="rounded-xl border border-line bg-paper px-4 py-3 text-sm outline-none"><option value="">Featured</option><option value="price-asc">Price: low to high</option><option value="price-desc">Price: high to low</option><option value="name">Name</option></select>
      </div>
      <div className="mb-6 mt-12 flex items-center justify-between"><p className="text-sm text-ink/55">{visibleProducts.length} {visibleProducts.length === 1 ? 'piece' : 'pieces'}</p></div>
      {visibleProducts.length > 0 ? <div className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">{visibleProducts.map((product) => <ProductCard key={product.id} product={product} />)}</div> : <div className="rounded-[2rem] border border-dashed border-line px-6 py-20 text-center"><p className="text-2xl font-black tracking-[-0.04em]">Nothing matches that search.</p><p className="mt-2 text-ink/55">Try widening your filters.</p></div>}
    </>
  );
}
