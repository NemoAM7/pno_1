import type { Product } from '@/lib/schemas/product';

export type CatalogFilters = {
  q?: string;
  categoryId?: string;
  size?: string;
  color?: string;
  min?: string;
  max?: string;
  sort?: string;
};

export function filterAndSortProducts(products: Product[], filters: CatalogFilters): Product[] {
  const query = filters.q?.trim().toLowerCase();
  const min = Number(filters.min);
  const max = Number(filters.max);
  const filtered = products.filter((product) => {
    const matchesQuery = !query || `${product.name} ${product.description}`.toLowerCase().includes(query);
    const matchesCategory = !filters.categoryId || product.categoryId === filters.categoryId;
    const matchesSize = !filters.size || product.variants.some((variant) => variant.size === filters.size);
    const matchesColor = !filters.color || product.variants.some((variant) => variant.color === filters.color);
    const matchesMin = !filters.min || (Number.isFinite(min) && product.priceCents >= min * 100);
    const matchesMax = !filters.max || (Number.isFinite(max) && product.priceCents <= max * 100);
    return matchesQuery && matchesCategory && matchesSize && matchesColor && matchesMin && matchesMax;
  });

  return [...filtered].sort((a, b) => {
    if (filters.sort === 'price-asc') return a.priceCents - b.priceCents;
    if (filters.sort === 'price-desc') return b.priceCents - a.priceCents;
    if (filters.sort === 'name') return a.name.localeCompare(b.name);
    return Number(b.isFeatured) - Number(a.isFeatured);
  });
}

export function getFilterOptions(products: Product[]) {
  return {
    sizes: [...new Set(products.flatMap((product) => product.variants.map((variant) => variant.size)))],
    colors: [...new Set(products.flatMap((product) => product.variants.map((variant) => variant.color)))],
  };
}
