'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { formatPrice } from '@/lib/money';
import { OrderSchema, type Order } from '@/lib/schemas/order';

export function OrderConfirmation() {
  const [order, setOrder] = useState<Order>();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      const storedOrder = sessionStorage.getItem('grabin-last-order');
      if (storedOrder) {
        try {
          const result = OrderSchema.safeParse(JSON.parse(storedOrder));
          if (result.success) setOrder(result.data);
        } catch {
          sessionStorage.removeItem('grabin-last-order');
        }
      }
      setLoaded(true);
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  if (!loaded) return <div className="mx-auto max-w-2xl px-6 py-24">Loading confirmation...</div>;
  if (!order) return <div className="mx-auto max-w-2xl px-6 py-24 text-center"><h1 className="text-4xl font-black">No recent order found.</h1><Link href="/explore" className="mt-6 inline-flex rounded-full bg-ink px-6 py-3 text-sm font-bold text-paper">Continue shopping</Link></div>;

  return <div className="mx-auto max-w-2xl px-6 pb-24 pt-20 text-center lg:px-10"><p className="text-sm font-black uppercase tracking-[0.2em] text-moss">Order confirmed</p><h1 className="mt-5 text-6xl font-black leading-[0.85] tracking-[-0.08em]">You are good to go.</h1><p className="mt-6 text-lg leading-7 text-ink/65">A confirmation for order <strong className="text-ink">{order.orderNumber}</strong> will be sent to {order.email}.</p><div className="mx-auto mt-10 max-w-sm rounded-[2rem] bg-ink p-7 text-left text-paper"><div className="flex justify-between border-b border-paper/20 pb-4"><span className="text-paper/60">Order total</span><strong>{formatPrice(order.totalCents, order.currency)}</strong></div><div className="mt-4 flex justify-between text-sm"><span className="text-paper/60">Delivery</span><span>{order.shipping.city}, {order.shipping.country}</span></div></div><Link href="/explore" className="mt-10 inline-flex rounded-full bg-lime px-7 py-4 text-sm font-black uppercase tracking-[0.14em] text-ink">Continue shopping</Link></div>;
}
