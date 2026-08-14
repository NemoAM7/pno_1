import { z } from 'zod';

export const VariantSchema = z.object({
  id: z.string(),
  color: z.string(),
  size: z.string(),
  sku: z.string(),
});

export type Variant = z.infer<typeof VariantSchema>;

export const ProductSchema = z.object({
  id: z.string(),
  slug: z.string(),
  name: z.string(),
  categoryId: z.string(),
  description: z.string(),
  priceCents: z.number().int().nonnegative(),
  compareAtPriceCents: z.number().int().nonnegative().optional(),
  currency: z.string().length(3).default('USD'),
  images: z.array(z.string()),
  materials: z.array(z.string()),
  isFeatured: z.boolean(),
  isInStock: z.boolean(),
  variants: z.array(VariantSchema),
});

export type Product = z.infer<typeof ProductSchema>;

export const ProductsFileSchema = z.object({
  products: z.array(ProductSchema),
});

export const CategorySchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  description: z.string(),
});

export type Category = z.infer<typeof CategorySchema>;

export const CategoriesFileSchema = z.object({
  categories: z.array(CategorySchema),
});
