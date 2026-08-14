'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { CheckoutRequestSchema, type ShippingAddress, type ShippingMethod } from '@/lib/schemas/checkout';
import type { OrderLine } from '@/lib/schemas/order';
import { buildMockOrder } from '@/lib/checkout/order';
import { paymentProvider } from '@/lib/checkout/payment';
import { useCartStore } from '@/stores/cart';
import { CheckoutForm } from './CheckoutForm';
import { OrderSummary } from './OrderSummary';
import { PaymentSection } from './PaymentSection';

export function CheckoutPageContent({ shippingMethods }: { shippingMethods: ShippingMethod[] }) {
  const router = useRouter();
  const lines = useCartStore((state) => state.lines);
  const [shippingData, setShippingData] = useState<{ email: string; shipping: ShippingAddress; shippingMethodId: string }>();
  const [paymentError, setPaymentError] = useState('');
  const selectedShipping = shippingMethods.find((method) => method.id === shippingData?.shippingMethodId) ?? shippingMethods[0];

  if (lines.length === 0) {
    return <div className="mx-auto max-w-2xl px-6 py-24 text-center lg:px-10"><p className="text-2xl font-black">Your cart is empty.</p><Link href="/explore" className="mt-6 inline-flex rounded-full bg-ink px-6 py-3 text-sm font-bold text-paper">Return to Explore</Link></div>;
  }

  async function handlePayment(token: string) {
    if (!shippingData || !selectedShipping) return;
    setPaymentError('');
    const request = CheckoutRequestSchema.parse({ items: lines.map((line) => ({ productId: line.productId, variantId: line.variantId, quantity: line.quantity })), email: shippingData.email, shipping: shippingData.shipping, shippingMethodId: selectedShipping.id, payment: { token } });
    const payment = await paymentProvider.checkout(request);
    if (payment.status !== 'succeeded') throw new Error(payment.reason ?? 'Payment could not be completed.');
    const orderLines: OrderLine[] = lines.map((line) => ({ productId: line.productId, variantId: line.variantId, name: line.name, color: line.color, size: line.size, quantity: line.quantity, unitCents: line.unitCents }));
    const order = buildMockOrder(request, orderLines, selectedShipping.priceCents);
    sessionStorage.setItem('grabin-last-order', JSON.stringify(order));
    useCartStore.getState().clear();
    router.push('/checkout/success');
  }

  return <div className="mx-auto max-w-7xl px-6 pb-20 pt-16 lg:px-10"><p className="text-sm font-black uppercase tracking-[0.2em] text-moss">Checkout / {shippingData ? '02' : '01'}</p><h1 className="mt-5 text-6xl font-black leading-[0.85] tracking-[-0.08em]">{shippingData ? 'Secure your order.' : 'Where should we send it?'}</h1><p className="mt-6 text-lg text-ink/60">Guest checkout. No account required.</p><div className="mt-12 grid gap-12 lg:grid-cols-[1fr_24rem]">{shippingData && selectedShipping ? <section className="rounded-[2rem] border border-line bg-white/35 p-6 sm:p-10"><h2 className="mb-6 text-2xl font-black tracking-[-0.05em]">Payment</h2><PaymentSection onPay={handlePayment} />{paymentError && <p className="mt-4 text-sm text-red-700">{paymentError}</p>}</section> : <section className="rounded-[2rem] border border-line bg-white/35 p-6 sm:p-10"><CheckoutForm shippingMethods={shippingMethods} onContinue={setShippingData} /></section>}{selectedShipping ? <OrderSummary lines={lines} shippingMethod={selectedShipping} /> : null}</div></div>;
}
