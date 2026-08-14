import type { CustomizationRequest } from '@/lib/schemas/customization';

export async function submitCustomizationRequest(request: CustomizationRequest): Promise<void> {
  const endpoint = process.env.NEXT_PUBLIC_CUSTOMIZATION_ENDPOINT;
  if (!endpoint) {
    throw new Error('Customization service is not configured.');
  }

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    throw new Error('Customization request could not be submitted.');
  }
}
