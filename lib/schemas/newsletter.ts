import { z } from 'zod';

export const NewsletterSignupSchema = z.object({
  email: z.email('Enter a valid email address'),
});

export type NewsletterSignup = z.infer<typeof NewsletterSignupSchema>;
