import { CheckoutPageContent } from '@/components/checkout/CheckoutPageContent';
import { getShippingMethods } from '@/lib/api';

export default function Page() {
  return <CheckoutPageContent shippingMethods={getShippingMethods()} />;
}
