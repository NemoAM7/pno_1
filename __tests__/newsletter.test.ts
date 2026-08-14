import { describe, expect, it } from 'vitest';
import { NewsletterSignupSchema } from '../lib/schemas/newsletter';

describe('NewsletterSignupSchema', () => {
  it('accepts a valid email', () => {
    expect(NewsletterSignupSchema.safeParse({ email: 'ayaan@example.com' }).success).toBe(true);
  });

  it('rejects an invalid email', () => {
    expect(NewsletterSignupSchema.safeParse({ email: 'not-an-email' }).success).toBe(false);
  });
});
