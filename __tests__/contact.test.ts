import { describe, expect, it } from 'vitest';
import { ContactMessageSchema } from '../lib/schemas/contact';

describe('ContactMessageSchema', () => {
  it('accepts a complete contact message', () => {
    expect(ContactMessageSchema.safeParse({ name: 'Ayaan', email: 'ayaan@example.com', subject: 'Sizing question', message: 'Could you help me choose a size?' }).success).toBe(true);
  });

  it('rejects invalid email and short messages', () => {
    expect(ContactMessageSchema.safeParse({ name: 'Ayaan', email: 'bad', subject: 'Hi', message: 'Short' }).success).toBe(false);
  });
});
