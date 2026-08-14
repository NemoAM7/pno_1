import { z } from 'zod';

export const ShippingAddressSchema = z.object({
  firstName: z.string().trim().min(1, 'Enter your first name'),
  lastName: z.string().trim().min(1, 'Enter your last name'),
  address1: z.string().trim().min(1, 'Enter your address'),
  address2: z.string().optional(),
  city: z.string().trim().min(1, 'Enter your city'),
  postalCode: z.string().trim().min(1, 'Enter your postal code'),
  country: z.string().trim().min(2, 'Enter your country'),
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
  token: z.string().min(1),
});

export type PaymentInput = z.infer<typeof PaymentInputSchema>;

export const CheckoutRequestSchema = z.object({
  items: z.array(CheckoutLineItemSchema).min(1),
  email: z.email('Enter a valid email address'),
  shipping: ShippingAddressSchema,
  shippingMethodId: z.string(),
  payment: PaymentInputSchema,
});

export type CheckoutRequest = z.infer<typeof CheckoutRequestSchema>;
