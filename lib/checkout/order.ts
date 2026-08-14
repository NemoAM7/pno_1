import type { CheckoutRequest } from '@/lib/schemas/checkout';
import type { Order, OrderLine } from '@/lib/schemas/order';

export function buildMockOrder(request: CheckoutRequest, lines: OrderLine[], shippingCents: number): Order {
  const subtotalCents = lines.reduce((total, line) => total + line.unitCents * line.quantity, 0);
  const now = new Date();
  const timestamp = Date.now();

  return {
    id: `order_${timestamp}`,
    orderNumber: `GRB-${now.getFullYear()}-${String(timestamp).slice(-6)}`,
    status: 'paid',
    subtotalCents,
    shippingCents,
    taxCents: 0,
    totalCents: subtotalCents + shippingCents,
    currency: 'USD',
    email: request.email,
    shipping: request.shipping,
    placedAt: now.toISOString(),
  };
}
