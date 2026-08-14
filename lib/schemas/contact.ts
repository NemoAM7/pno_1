import { z } from 'zod';

export const ContactMessageSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  subject: z.string().min(1),
  message: z.string().min(1),
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
