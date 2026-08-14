'use client';

import { useSearchParams } from 'next/navigation';
import { submitCustomizationRequest } from '@/lib/customization/client';
import { CustomizationRequestForm } from './CustomizationRequestForm';

export function CustomizationPage() {
  const searchParams = useSearchParams();
  const isExistingProduct = searchParams.get('requestType') === 'existing-product' && Boolean(searchParams.get('productId')) && Boolean(searchParams.get('variantId'));

  return <div className="mx-auto max-w-3xl px-6 pb-20 pt-16 lg:px-10"><p className="text-sm font-black uppercase tracking-[0.2em] text-moss">Custom work</p><h1 className="mt-5 text-6xl font-black leading-[0.85] tracking-[-0.08em]">Make it yours.</h1><p className="mt-6 max-w-xl text-lg leading-7 text-ink/65">Tell us what you have in mind. We will review the details and get back to you with what is possible.</p><div className="mt-12 rounded-[2rem] border border-line bg-white/35 p-6 sm:p-10"><CustomizationRequestForm requestType={isExistingProduct ? 'existing-product' : 'new-product'} productId={searchParams.get('productId') ?? undefined} variantId={searchParams.get('variantId') ?? undefined} productName={searchParams.get('productName') ?? undefined} variantLabel={searchParams.get('variantLabel') ?? undefined} onSubmitRequest={submitCustomizationRequest} /></div></div>;
}
