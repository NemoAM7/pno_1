import { OrderConfirmation } from '@/components/checkout/OrderConfirmation';

export const metadata = { title: 'Order confirmed', description: 'Your Grabin order confirmation.', robots: { index: false, follow: false } };

export default function Page() {
  return <OrderConfirmation />;
}
