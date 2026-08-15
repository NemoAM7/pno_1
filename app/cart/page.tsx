import { CartPageContent } from '@/components/cart/CartPageContent';
import { getShippingMethods } from '@/lib/api';

export const metadata = { title: 'Your cart', description: 'Review your Grabin items before checkout.', robots: { index: false, follow: false } };

export default function Page() {
  return <CartPageContent shippingMethods={getShippingMethods()} />;
}
