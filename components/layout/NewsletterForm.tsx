'use client';

import { useState } from 'react';
import { NewsletterSignupSchema } from '@/lib/schemas/newsletter';

export function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const result = NewsletterSignupSchema.safeParse({ email });
    if (!result.success) {
      setMessage(result.error.issues[0]?.message ?? 'Enter a valid email address');
      return;
    }
    setEmail('');
    setMessage('You are on the list.');
  }

  return <form onSubmit={handleSubmit} className="mt-5 flex max-w-md flex-col gap-3 sm:flex-row"><label htmlFor="newsletter-email" className="sr-only">Email address</label><input id="newsletter-email" type="email" value={email} onChange={(event) => { setEmail(event.target.value); setMessage(''); }} placeholder="Your email address" className="min-w-0 flex-1 rounded-full border border-paper/20 bg-paper/10 px-5 py-3 text-sm text-paper outline-none placeholder:text-paper/45 focus:border-lime" aria-describedby="newsletter-message" /><button type="submit" className="rounded-full bg-lime px-5 py-3 text-sm font-black text-ink">Sign up</button>{message && <p id="newsletter-message" className="text-xs text-paper/65 sm:absolute sm:mt-14">{message}</p>}</form>;
}
