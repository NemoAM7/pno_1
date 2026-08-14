'use client';

import { useState } from 'react';

export function PaymentSection({ onPay }: { onPay: (token: string) => Promise<void> }) {
  const [cardholder, setCardholder] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const digits = cardNumber.replace(/\D/g, '');
    if (!cardholder.trim() || digits.length < 12 || !/^\d{2}\/\d{2}$/.test(expiry) || !/^\d{3,4}$/.test(cvc)) {
      setError('Enter the mock card details in the requested formats.');
      return;
    }
    setError('');
    setSubmitting(true);
    try {
      await onPay(`mock_card_${digits.slice(-4)}`);
    } catch (paymentError) {
      setError(paymentError instanceof Error ? paymentError.message : 'Payment could not be completed.');
      setSubmitting(false);
    }
  }

  return <form onSubmit={handleSubmit} className="space-y-5" noValidate><div><label htmlFor="cardholder" className="mb-2 block text-sm font-bold">Name on card</label><input id="cardholder" value={cardholder} onChange={(event) => setCardholder(event.target.value)} className="w-full rounded-xl border border-line bg-paper px-4 py-3 outline-none focus:border-ink" /></div><div><label htmlFor="cardNumber" className="mb-2 block text-sm font-bold">Card number</label><input id="cardNumber" inputMode="numeric" value={cardNumber} onChange={(event) => setCardNumber(event.target.value)} className="w-full rounded-xl border border-line bg-paper px-4 py-3 outline-none focus:border-ink" placeholder="4242 4242 4242 4242" /></div><div className="grid gap-5 sm:grid-cols-2"><div><label htmlFor="expiry" className="mb-2 block text-sm font-bold">Expiry</label><input id="expiry" inputMode="numeric" value={expiry} onChange={(event) => setExpiry(event.target.value)} className="w-full rounded-xl border border-line bg-paper px-4 py-3 outline-none focus:border-ink" placeholder="MM/YY" /></div><div><label htmlFor="cvc" className="mb-2 block text-sm font-bold">CVC</label><input id="cvc" inputMode="numeric" value={cvc} onChange={(event) => setCvc(event.target.value)} className="w-full rounded-xl border border-line bg-paper px-4 py-3 outline-none focus:border-ink" placeholder="123" /></div></div><p className="text-xs leading-5 text-ink/50">Development checkout only. Card details are used to create a mock token and are not stored.</p>{error && <p className="rounded-xl bg-red-100 p-4 text-sm text-red-800" role="alert">{error}</p>}<button type="submit" disabled={submitting} className="w-full rounded-full bg-lime px-6 py-4 text-sm font-black uppercase tracking-[0.14em] text-ink disabled:cursor-wait disabled:opacity-60">{submitting ? 'Processing payment...' : 'Place order'}</button></form>;
}
