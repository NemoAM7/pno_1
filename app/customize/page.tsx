import { Suspense } from 'react';
import { CustomizationPage } from '@/components/customization/CustomizationPage';

export default function Page() {
  return <Suspense fallback={<div className="mx-auto max-w-3xl px-6 py-24">Loading customization form...</div>}><CustomizationPage /></Suspense>;
}
