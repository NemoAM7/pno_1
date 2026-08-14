import { z } from 'zod';

export const ContactMessageSchema = z.object({
  name: z.string().trim().min(1, 'Enter your name'),
  email: z.email('Enter a valid email address'),
  subject: z.string().trim().min(1, 'Enter a subject'),
  message: z.string().trim().min(10, 'Tell us a little more about how we can help'),
});

export type ContactMessage = z.infer<typeof ContactMessageSchema>;

export const FaqSchema = z.object({
  question: z.string(),
  answer: z.string(),
});

export type Faq = z.infer<typeof FaqSchema>;

export const FaqsFileSchema = z.object({
  faqs: z.array(FaqSchema),
});
