import { z } from 'zod';

export const ShippingAddressSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  address1: z.string().min(1),
  address2: z.string().optional(),
  city: z.string().min(1),
  postalCode: z.string().min(1),
  country: z.string().min(2),
});

export type ShippingAddress = z.infer<typeof ShippingAddressSchema>;

export const ShippingMethodSchema = z.object({
  id: z.string(),
  label: z.string(),
  priceCents: z.number().int().nonnegative(),
  etaDays: z.string(),
});

export type ShippingMethod = z.infer<typeof ShippingMethodSchema>;

export const ShippingMethodsFileSchema = z.object({
  shippingMethods: z.array(ShippingMethodSchema),
});

export const CheckoutLineItemSchema = z.object({
  productId: z.string(),
  variantId: z.string(),
  quantity: z.number().int().positive(),
});

export type CheckoutLineItem = z.infer<typeof CheckoutLineItemSchema>;

export const PaymentInputSchema = z.object({
  token: z.string(),
});

export type PaymentInput = z.infer<typeof PaymentInputSchema>;

export const CheckoutRequestSchema = z.object({
  items: z.array(CheckoutLineItemSchema).min(1),
  shipping: ShippingAddressSchema,
  shippingMethodId: z.string(),
  payment: PaymentInputSchema,
});

export type CheckoutRequest = z.infer<typeof CheckoutRequestSchema>;
