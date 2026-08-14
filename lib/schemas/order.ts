import { z } from 'zod';
import { ShippingAddressSchema } from './checkout';

export const OrderStatusSchema = z.enum(['placed', 'paid', 'shipped', 'delivered', 'cancelled']);

export type OrderStatus = z.infer<typeof OrderStatusSchema>;

export const OrderLineSchema = z.object({
  productId: z.string(),
  variantId: z.string(),
  name: z.string(),
  color: z.string().optional(),
  size: z.string().optional(),
  quantity: z.number().int().positive(),
  unitCents: z.number().int().nonnegative(),
});

export type OrderLine = z.infer<typeof OrderLineSchema>;

export const OrderSchema = z.object({
  id: z.string(),
  orderNumber: z.string(),
  status: OrderStatusSchema,
  subtotalCents: z.number().int().nonnegative(),
  shippingCents: z.number().int().nonnegative(),
  taxCents: z.number().int().nonnegative(),
  totalCents: z.number().int().nonnegative(),
  currency: z.string().length(3).default('USD'),
  email: z.email(),
  shipping: ShippingAddressSchema,
  placedAt: z.string(),
});

export type Order = z.infer<typeof OrderSchema>;

export const OrderLineArraySchema = z.array(OrderLineSchema);
