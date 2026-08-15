'use client';

import { useState } from 'react';
import { ContactMessageSchema } from '@/lib/schemas/contact';
import { submitContactMessage } from '@/lib/contact/client';

type FormValues = { name: string; email: string; subject: string; message: string };
const emptyValues: FormValues = { name: '', email: '', subject: '', message: '' };

export function ContactForm() {
  const [values, setValues] = useState<FormValues>(emptyValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState('');

  function updateValue(field: keyof FormValues, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: '' }));
    setSent(false);
    setSubmissionError('');
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const result = ContactMessageSchema.safeParse(values);
    if (!result.success) {
      const nextErrors: Record<string, string> = {};
      for (const issue of result.error.issues) nextErrors[String(issue.path[0] ?? 'form')] = issue.message;
      setErrors(nextErrors);
      return;
    }
    setErrors({});
    setSubmitting(true);
    setSubmissionError('');
    try {
      await submitContactMessage(result.data);
      setValues(emptyValues);
      setSent(true);
    } catch (error) {
      setSubmissionError(error instanceof Error ? error.message : 'The message could not be submitted.');
    } finally {
      setSubmitting(false);
    }
  }

  return <form onSubmit={handleSubmit} className="space-y-5" noValidate><div className="grid gap-5 sm:grid-cols-2"><div><label htmlFor="contact-name" className="mb-2 block text-sm font-bold">Name</label><input id="contact-name" value={values.name} onChange={(event) => updateValue('name', event.target.value)} className="w-full rounded-xl border border-line bg-paper px-4 py-3 outline-none focus:border-ink" aria-invalid={Boolean(errors.name)} />{errors.name && <p className="mt-2 text-sm text-red-700">{errors.name}</p>}</div><div><label htmlFor="contact-email" className="mb-2 block text-sm font-bold">Email</label><input id="contact-email" type="email" value={values.email} onChange={(event) => updateValue('email', event.target.value)} className="w-full rounded-xl border border-line bg-paper px-4 py-3 outline-none focus:border-ink" aria-invalid={Boolean(errors.email)} />{errors.email && <p className="mt-2 text-sm text-red-700">{errors.email}</p>}</div></div><div><label htmlFor="contact-subject" className="mb-2 block text-sm font-bold">Subject</label><input id="contact-subject" value={values.subject} onChange={(event) => updateValue('subject', event.target.value)} className="w-full rounded-xl border border-line bg-paper px-4 py-3 outline-none focus:border-ink" aria-invalid={Boolean(errors.subject)} />{errors.subject && <p className="mt-2 text-sm text-red-700">{errors.subject}</p>}</div><div><label htmlFor="contact-message" className="mb-2 block text-sm font-bold">Message</label><textarea id="contact-message" rows={6} value={values.message} onChange={(event) => updateValue('message', event.target.value)} className="w-full resize-y rounded-xl border border-line bg-paper px-4 py-3 outline-none focus:border-ink" aria-invalid={Boolean(errors.message)} />{errors.message && <p className="mt-2 text-sm text-red-700">{errors.message}</p>}</div>{sent && <p className="rounded-xl bg-lime p-4 text-sm font-bold" role="status">Thanks for reaching out. We will get back to you soon.</p>}{submissionError && <p className="rounded-xl bg-red-100 p-4 text-sm text-red-800" role="alert">{submissionError}</p>}<button type="submit" disabled={submitting} className="rounded-full bg-ink px-6 py-4 text-sm font-black uppercase tracking-[0.14em] text-paper disabled:cursor-wait disabled:opacity-60">{submitting ? 'Sending...' : 'Send message'}</button></form>;
}
