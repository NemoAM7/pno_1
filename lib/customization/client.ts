import type { CustomizationRequest } from '@/lib/schemas/customization';
import { submitToWeb3Forms } from '../web3forms/client';

export async function submitCustomizationRequest(request: CustomizationRequest): Promise<void> {
  await submitToWeb3Forms(request, `Grabin customization request: ${request.requestType}`, request.name, process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY);
}
