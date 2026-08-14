import { formatPrice } from '@/lib/money';
import type { ShippingMethod } from '@/lib/schemas/checkout';
import type { CartLine } from '@/stores/cart';
import { getCartSubtotalCents } from '@/stores/cart';

export function OrderSummary({ lines, shippingMethod }: { lines: CartLine[]; shippingMethod: ShippingMethod }) {
  const subtotalCents = getCartSubtotalCents(lines);
  const totalCents = subtotalCents + shippingMethod.priceCents;

  return <aside className="h-fit rounded-[2rem] bg-ink p-7 text-paper"><h2 className="text-2xl font-black tracking-[-0.05em]">Order summary</h2><div className="mt-6 space-y-4 border-b border-paper/20 pb-5 text-sm">{lines.map((line) => <div key={line.variantId} className="flex justify-between gap-4"><span className="text-paper/65">{line.name} x {line.quantity}</span><span>{formatPrice(line.unitCents * line.quantity)}</span></div>)}</div><div className="mt-5 space-y-3 text-sm"><div className="flex justify-between"><span className="text-paper/60">Subtotal</span><span>{formatPrice(subtotalCents)}</span></div><div className="flex justify-between"><span className="text-paper/60">{shippingMethod.label}</span><span>{formatPrice(shippingMethod.priceCents)}</span></div><div className="border-t border-paper/20 pt-4 text-lg font-bold"><div className="flex justify-between"><span>Total</span><span>{formatPrice(totalCents)}</span></div></div></div></aside>;
}
