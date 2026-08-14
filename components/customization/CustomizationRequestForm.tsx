'use client';

import { useState } from 'react';
import { CustomizationRequestSchema, type CustomizationRequest } from '@/lib/schemas/customization';

type RequestType = 'existing-product' | 'new-product';

type FormValues = {
  name: string;
  email: string;
  phone: string;
  request: string;
  productType: string;
  preferredSize: string;
  preferredColor: string;
  consent: boolean;
};

const emptyValues: FormValues = { name: '', email: '', phone: '', request: '', productType: '', preferredSize: '', preferredColor: '', consent: false };

export function CustomizationRequestForm({ requestType: initialRequestType, productId, variantId, productName, variantLabel, onSubmitRequest }: { requestType: RequestType; productId?: string; variantId?: string; productName?: string; variantLabel?: string; onSubmitRequest: (request: CustomizationRequest) => Promise<void> }) {
  const [requestType, setRequestType] = useState<RequestType>(initialRequestType);
  const [values, setValues] = useState<FormValues>(emptyValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [website, setWebsite] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [submissionError, setSubmissionError] = useState('');

  function updateValue(field: keyof FormValues, value: string | boolean) {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: '' }));
    setStatus('idle');
    setSubmissionError('');
  }

  function changeRequestType(nextType: RequestType) {
    setRequestType(nextType);
    setErrors({});
    setStatus('idle');
    setSubmissionError('');
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (website) return;
    setStatus('idle');
    setSubmissionError('');
    const common = { name: values.name, email: values.email, phone: values.phone, request: values.request, consent: values.consent };
    const raw: Record<string, unknown> = requestType === 'existing-product'
      ? { ...common, requestType, productId, variantId }
      : { ...common, requestType, productType: values.productType, preferredSize: values.preferredSize || undefined, preferredColor: values.preferredColor || undefined };
    const result = CustomizationRequestSchema.safeParse(raw);

    if (!result.success) {
      const nextErrors: Record<string, string> = {};
      for (const issue of result.error.issues) {
        const field = String(issue.path[0] ?? 'form');
        nextErrors[field] = issue.message;
      }
      setErrors(nextErrors);
      return;
    }

    setErrors({});
    setStatus('submitting');
    try {
      await onSubmitRequest(result.data);
      setStatus('success');
    } catch (error) {
      setStatus('error');
      setSubmissionError(error instanceof Error ? error.message : 'Something went wrong. Please try again.');
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-7" noValidate>
      <fieldset><legend className="mb-3 text-sm font-black uppercase tracking-[0.14em]">What do you need?</legend><div className="grid gap-3 sm:grid-cols-2"><button type="button" onClick={() => changeRequestType('existing-product')} className={`rounded-2xl border p-4 text-left ${requestType === 'existing-product' ? 'border-ink bg-ink text-paper' : 'border-line hover:border-ink'}`}><span className="block font-bold">Customize a product</span><span className="mt-1 block text-sm opacity-65">Start from a jersey in our catalog.</span></button><button type="button" onClick={() => changeRequestType('new-product')} className={`rounded-2xl border p-4 text-left ${requestType === 'new-product' ? 'border-ink bg-ink text-paper' : 'border-line hover:border-ink'}`}><span className="block font-bold">Request a new product</span><span className="mt-1 block text-sm opacity-65">Tell us what you want us to make.</span></button></div></fieldset>
      {requestType === 'existing-product' ? <div className="rounded-2xl bg-moss p-5 text-paper"><p className="text-xs font-black uppercase tracking-[0.14em] text-paper/60">Selected product</p><p className="mt-2 text-xl font-black">{productName ?? 'Catalog jersey'}</p><p className="mt-1 text-sm text-paper/65">{variantLabel ?? 'Choose a variant on the product page first.'}</p></div> : <div><label htmlFor="productType" className="mb-2 block text-sm font-bold">What product would you like?</label><input id="productType" value={values.productType} onChange={(event) => updateValue('productType', event.target.value)} className="w-full rounded-xl border border-line bg-paper px-4 py-3 outline-none focus:border-ink" placeholder="e.g. Long-sleeve cycling jersey" aria-invalid={Boolean(errors.productType)} />{errors.productType && <p className="mt-2 text-sm text-red-700">{errors.productType}</p>}</div>}
      {requestType === 'new-product' && <div className="grid gap-5 sm:grid-cols-2"><div><label htmlFor="preferredSize" className="mb-2 block text-sm font-bold">Preferred size <span className="font-normal text-ink/50">(optional)</span></label><input id="preferredSize" value={values.preferredSize} onChange={(event) => updateValue('preferredSize', event.target.value)} className="w-full rounded-xl border border-line bg-paper px-4 py-3 outline-none focus:border-ink" placeholder="e.g. L" /></div><div><label htmlFor="preferredColor" className="mb-2 block text-sm font-bold">Preferred color <span className="font-normal text-ink/50">(optional)</span></label><input id="preferredColor" value={values.preferredColor} onChange={(event) => updateValue('preferredColor', event.target.value)} className="w-full rounded-xl border border-line bg-paper px-4 py-3 outline-none focus:border-ink" placeholder="e.g. Forest green" /></div></div>}
      <div className="grid gap-5 sm:grid-cols-2"><div><label htmlFor="name" className="mb-2 block text-sm font-bold">Name</label><input id="name" value={values.name} onChange={(event) => updateValue('name', event.target.value)} className="w-full rounded-xl border border-line bg-paper px-4 py-3 outline-none focus:border-ink" aria-invalid={Boolean(errors.name)} />{errors.name && <p className="mt-2 text-sm text-red-700">{errors.name}</p>}</div><div><label htmlFor="email" className="mb-2 block text-sm font-bold">Email</label><input id="email" type="email" value={values.email} onChange={(event) => updateValue('email', event.target.value)} className="w-full rounded-xl border border-line bg-paper px-4 py-3 outline-none focus:border-ink" aria-invalid={Boolean(errors.email)} />{errors.email && <p className="mt-2 text-sm text-red-700">{errors.email}</p>}</div></div>
      <div><label htmlFor="phone" className="mb-2 block text-sm font-bold">Phone number</label><input id="phone" type="tel" value={values.phone} onChange={(event) => updateValue('phone', event.target.value)} className="w-full rounded-xl border border-line bg-paper px-4 py-3 outline-none focus:border-ink" placeholder="+91 98765 43210" aria-invalid={Boolean(errors.phone)} />{errors.phone && <p className="mt-2 text-sm text-red-700">{errors.phone}</p>}</div>
      <div><label htmlFor="request" className="mb-2 block text-sm font-bold">What would you like customized?</label><textarea id="request" value={values.request} onChange={(event) => updateValue('request', event.target.value)} rows={5} className="w-full resize-y rounded-xl border border-line bg-paper px-4 py-3 outline-none focus:border-ink" placeholder="Tell us about names, colors, graphics, or other details." aria-invalid={Boolean(errors.request)} />{errors.request && <p className="mt-2 text-sm text-red-700">{errors.request}</p>}</div>
      <label className="flex items-start gap-3 text-sm text-ink/70"><input type="checkbox" checked={values.consent} onChange={(event) => updateValue('consent', event.target.checked)} className="mt-1 h-4 w-4 accent-ink" />I agree that Grabin may contact me about this request.{errors.consent && <span className="text-red-700">{errors.consent}</span>}</label>
      <div className="absolute left-[-9999px]" aria-hidden="true"><label htmlFor="website">Website</label><input id="website" value={website} onChange={(event) => setWebsite(event.target.value)} tabIndex={-1} autoComplete="off" /></div>
      {status === 'success' && <p className="rounded-xl bg-lime p-4 text-sm font-bold" role="status">Your request has been sent. We will be in touch soon.</p>}
      {status === 'error' && <p className="rounded-xl bg-red-100 p-4 text-sm text-red-800" role="alert">{submissionError}</p>}
      <button type="submit" disabled={status === 'submitting'} className="w-full rounded-full bg-ink px-6 py-4 text-sm font-black uppercase tracking-[0.14em] text-paper disabled:cursor-wait disabled:opacity-60">{status === 'submitting' ? 'Sending request...' : status === 'success' ? 'Send another request' : 'Send request'}</button>
    </form>
  );
}
