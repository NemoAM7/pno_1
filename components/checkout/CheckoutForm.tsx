'use client';

import { useState } from 'react';
import { z } from 'zod';
import { formatPrice } from '@/lib/money';
import { ShippingAddressSchema, type ShippingAddress, type ShippingMethod } from '@/lib/schemas/checkout';

type FormValues = ShippingAddress & { email: string };

const emptyValues: FormValues = { email: '', firstName: '', lastName: '', address1: '', address2: '', city: '', postalCode: '', country: '' };

export function CheckoutForm({ shippingMethods, onContinue }: { shippingMethods: ShippingMethod[]; onContinue?: (data: { email: string; shipping: ShippingAddress; shippingMethodId: string }) => void }) {
  const [values, setValues] = useState<FormValues>(emptyValues);
  const [shippingMethodId, setShippingMethodId] = useState(shippingMethods[0]?.id ?? '');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState(false);

  function updateValue(field: keyof FormValues, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: '' }));
    setSaved(false);
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const emailResult = z.email('Enter a valid email address').safeParse(values.email);
    const shippingResult = ShippingAddressSchema.safeParse({ ...values, address2: values.address2 || undefined });
    const nextErrors: Record<string, string> = {};
    if (!emailResult.success) nextErrors.email = emailResult.error.issues[0]?.message ?? 'Enter a valid email address';
    if (!shippingResult.success) {
      for (const issue of shippingResult.error.issues) nextErrors[String(issue.path[0] ?? 'shipping')] = issue.message;
    }
    if (!shippingMethodId) nextErrors.shippingMethodId = 'Choose a shipping method';
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }
    if (!shippingResult.success) return;
    setErrors({});
    setSaved(true);
    onContinue?.({ email: values.email, shipping: shippingResult.data, shippingMethodId });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8" noValidate>
      <section><h2 className="text-2xl font-black tracking-[-0.05em]">Contact</h2><div className="mt-5"><label htmlFor="checkout-email" className="mb-2 block text-sm font-bold">Email</label><input id="checkout-email" type="email" value={values.email} onChange={(event) => updateValue('email', event.target.value)} className="w-full rounded-xl border border-line bg-paper px-4 py-3 outline-none focus:border-ink" aria-invalid={Boolean(errors.email)} />{errors.email && <p className="mt-2 text-sm text-red-700">{errors.email}</p>}</div></section>
      <section><h2 className="text-2xl font-black tracking-[-0.05em]">Shipping address</h2><div className="mt-5 grid gap-5 sm:grid-cols-2"><div><label htmlFor="firstName" className="mb-2 block text-sm font-bold">First name</label><input id="firstName" value={values.firstName} onChange={(event) => updateValue('firstName', event.target.value)} className="w-full rounded-xl border border-line bg-paper px-4 py-3 outline-none focus:border-ink" aria-invalid={Boolean(errors.firstName)} />{errors.firstName && <p className="mt-2 text-sm text-red-700">{errors.firstName}</p>}</div><div><label htmlFor="lastName" className="mb-2 block text-sm font-bold">Last name</label><input id="lastName" value={values.lastName} onChange={(event) => updateValue('lastName', event.target.value)} className="w-full rounded-xl border border-line bg-paper px-4 py-3 outline-none focus:border-ink" aria-invalid={Boolean(errors.lastName)} />{errors.lastName && <p className="mt-2 text-sm text-red-700">{errors.lastName}</p>}</div></div><div className="mt-5"><label htmlFor="address1" className="mb-2 block text-sm font-bold">Address</label><input id="address1" value={values.address1} onChange={(event) => updateValue('address1', event.target.value)} className="w-full rounded-xl border border-line bg-paper px-4 py-3 outline-none focus:border-ink" aria-invalid={Boolean(errors.address1)} />{errors.address1 && <p className="mt-2 text-sm text-red-700">{errors.address1}</p>}</div><div className="mt-5"><label htmlFor="address2" className="mb-2 block text-sm font-bold">Apartment, suite, etc. <span className="font-normal text-ink/50">(optional)</span></label><input id="address2" value={values.address2 ?? ''} onChange={(event) => updateValue('address2', event.target.value)} className="w-full rounded-xl border border-line bg-paper px-4 py-3 outline-none focus:border-ink" /></div><div className="mt-5 grid gap-5 sm:grid-cols-3"><div><label htmlFor="city" className="mb-2 block text-sm font-bold">City</label><input id="city" value={values.city} onChange={(event) => updateValue('city', event.target.value)} className="w-full rounded-xl border border-line bg-paper px-4 py-3 outline-none focus:border-ink" aria-invalid={Boolean(errors.city)} />{errors.city && <p className="mt-2 text-sm text-red-700">{errors.city}</p>}</div><div><label htmlFor="postalCode" className="mb-2 block text-sm font-bold">Postal code</label><input id="postalCode" value={values.postalCode} onChange={(event) => updateValue('postalCode', event.target.value)} className="w-full rounded-xl border border-line bg-paper px-4 py-3 outline-none focus:border-ink" aria-invalid={Boolean(errors.postalCode)} />{errors.postalCode && <p className="mt-2 text-sm text-red-700">{errors.postalCode}</p>}</div><div><label htmlFor="country" className="mb-2 block text-sm font-bold">Country</label><input id="country" value={values.country} onChange={(event) => updateValue('country', event.target.value)} className="w-full rounded-xl border border-line bg-paper px-4 py-3 outline-none focus:border-ink" placeholder="GB" aria-invalid={Boolean(errors.country)} />{errors.country && <p className="mt-2 text-sm text-red-700">{errors.country}</p>}</div></div></section>
      <fieldset><legend className="text-2xl font-black tracking-[-0.05em]">Shipping method</legend><div className="mt-5 space-y-3">{shippingMethods.map((method) => <label key={method.id} className={`flex cursor-pointer items-center justify-between rounded-2xl border p-4 ${shippingMethodId === method.id ? 'border-ink bg-ink text-paper' : 'border-line hover:border-ink'}`}><span className="flex items-center gap-3"><input type="radio" name="shippingMethod" value={method.id} checked={shippingMethodId === method.id} onChange={() => { setShippingMethodId(method.id); setErrors((current) => ({ ...current, shippingMethodId: '' })); }} /> <span><span className="block font-bold">{method.label}</span><span className="block text-sm opacity-65">{method.etaDays}</span></span></span><span className="font-bold">{method.priceCents === 0 ? 'Free' : formatPrice(method.priceCents)}</span></label>)}</div>{errors.shippingMethodId && <p className="mt-2 text-sm text-red-700">{errors.shippingMethodId}</p>}</fieldset>
      {saved && <p className="rounded-xl bg-lime p-4 text-sm font-bold" role="status">Shipping details saved. Continue to payment.</p>}
      <button type="submit" className="w-full rounded-full bg-ink px-6 py-4 text-sm font-black uppercase tracking-[0.14em] text-paper">Continue to payment</button>
    </form>
  );
}
