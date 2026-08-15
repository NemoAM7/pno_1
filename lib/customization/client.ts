import type { CustomizationRequest } from '@/lib/schemas/customization';

export async function submitCustomizationRequest(request: CustomizationRequest): Promise<void> {
  const endpoint = process.env.NEXT_PUBLIC_CUSTOMIZATION_ENDPOINT ?? 'https://api.web3forms.com/submit';
  const accessKey = process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY;
  if (!accessKey) {
    throw new Error('Web3Forms is not configured.');
  }

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      access_key: accessKey,
      subject: `Grabin customization request: ${request.requestType}`,
      from_name: request.name,
      ...request,
    }),
  });

  if (!response.ok) {
    throw new Error('Customization request could not be submitted.');
  }
}
