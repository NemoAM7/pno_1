import { CheckoutPageContent } from '@/components/checkout/CheckoutPageContent';
import { getShippingMethods } from '@/lib/api';

export const metadata = { title: 'Checkout', description: 'Complete your Grabin guest checkout.', robots: { index: false, follow: false } };

export default function Page() {
  return <CheckoutPageContent shippingMethods={getShippingMethods()} />;
}
