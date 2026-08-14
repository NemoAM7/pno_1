import categoriesData from '../data/categories.json';
import faqsData from '../data/faqs.json';
import productsData from '../data/products.json';
import shippingMethodsData from '../data/shipping-methods.json';
import { FaqsFileSchema } from './schemas/contact';
import type { Faq } from './schemas/contact';
import { ShippingMethodsFileSchema } from './schemas/checkout';
import type { ShippingMethod } from './schemas/checkout';
import { CategoriesFileSchema, ProductsFileSchema } from './schemas/product';
import type { Category, Product } from './schemas/product';

const products = ProductsFileSchema.parse(productsData).products;
const categories = CategoriesFileSchema.parse(categoriesData).categories;
const shippingMethods = ShippingMethodsFileSchema.parse(shippingMethodsData).shippingMethods;
const faqs = FaqsFileSchema.parse(faqsData).faqs;

export function getProducts(): Product[] {
  return products;
}

export function getProductsByCategory(categoryId: string): Product[] {
  return products.filter((product) => product.categoryId === categoryId);
}

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((product) => product.slug === slug);
}

export function getCategories(): Category[] {
  return categories;
}

export function getShippingMethods(): ShippingMethod[] {
  return shippingMethods;
}

export function getFaqs(): Faq[] {
  return faqs;
}
