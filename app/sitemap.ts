import type { MetadataRoute } from 'next';
import { getCategories, getProducts } from '@/lib/api';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';
  const staticRoutes = ['', '/explore', '/about', '/contact', '/customize', '/policies'];
  const categoryRoutes = getCategories().map((category) => `/explore/${category.slug}`);
  const productRoutes = getProducts().map((product) => `/explore/${product.categoryId}/${product.slug}`);
  return [...staticRoutes, ...categoryRoutes, ...productRoutes].map((path) => ({ url: `${siteUrl}${path}`, lastModified: new Date() }));
}
