import { z } from 'zod';

const CustomerFields = {
  name: z.string().trim().min(1, 'Enter your name'),
  email: z.email('Enter a valid email address'),
  phone: z.string().trim().regex(/^(?:\+91[\s-]?)?[6-9]\d{4}[\s-]?\d{5}$/, 'Enter a valid Indian phone number'),
  request: z.string().trim().min(10, 'Tell us a little more about your request'),
  consent: z.literal(true, 'Consent is required to follow up'),
};

export const ExistingProductCustomizationRequestSchema = z.object({
  ...CustomerFields,
  requestType: z.literal('existing-product'),
  productId: z.string().min(1),
  variantId: z.string().min(1),
});

export const NewProductCustomizationRequestSchema = z.object({
  ...CustomerFields,
  requestType: z.literal('new-product'),
  productType: z.string().trim().min(1, 'Describe the product you want'),
  preferredSize: z.string().trim().optional(),
  preferredColor: z.string().trim().optional(),
});

export const CustomizationRequestSchema = z.discriminatedUnion('requestType', [
  ExistingProductCustomizationRequestSchema,
  NewProductCustomizationRequestSchema,
]);

export type ExistingProductCustomizationRequest = z.infer<typeof ExistingProductCustomizationRequestSchema>;
export type NewProductCustomizationRequest = z.infer<typeof NewProductCustomizationRequestSchema>;
export type CustomizationRequest = z.infer<typeof CustomizationRequestSchema>;
