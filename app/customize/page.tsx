import { Suspense } from 'react';
import { CustomizationPage } from '@/components/customization/CustomizationPage';

export const metadata = { title: 'Request a custom product', description: 'Tell Grabin about an existing product customization or a new product idea.' };

export default function Page() {
  return <Suspense fallback={<div className="mx-auto max-w-3xl px-6 py-24">Loading customization form...</div>}><CustomizationPage /></Suspense>;
}
