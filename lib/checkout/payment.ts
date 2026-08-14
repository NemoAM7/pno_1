import type { CheckoutRequest } from '../schemas/checkout';

export type PaymentStatus = 'succeeded' | 'failed' | 'pending';

export interface PaymentResult {
  status: PaymentStatus;
  transactionId?: string;
  reason?: string;
}

export interface PaymentProvider {
  readonly name: string;
  checkout(request: CheckoutRequest): Promise<PaymentResult>;
}

export abstract class AbstractPaymentProvider implements PaymentProvider {
  abstract readonly name: string;

  async checkout(request: CheckoutRequest): Promise<PaymentResult> {
    if (request.items.length === 0) {
      return { status: 'failed', reason: 'empty_cart' };
    }
    return this.pay(request);
  }

  protected abstract pay(request: CheckoutRequest): Promise<PaymentResult>;
}

export class MockPaymentProvider extends AbstractPaymentProvider {
  readonly name = 'mock';

  protected async pay(request: CheckoutRequest): Promise<PaymentResult> {
    await new Promise((resolve) => setTimeout(resolve, 400));
    return {
      status: 'succeeded',
      transactionId: `mock_${request.payment.token}_${Date.now()}`,
    };
  }
}

export const paymentProvider: PaymentProvider = new MockPaymentProvider();
