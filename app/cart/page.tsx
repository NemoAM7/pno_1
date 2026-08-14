import { CartPageContent } from '@/components/cart/CartPageContent';
import { getShippingMethods } from '@/lib/api';

export default function Page() {
  return <CartPageContent shippingMethods={getShippingMethods()} />;
}
