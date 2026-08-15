import type { ContactMessage } from '@/lib/schemas/contact';
import { submitToWeb3Forms } from '../web3forms/client';

export async function submitContactMessage(message: ContactMessage): Promise<void> {
  await submitToWeb3Forms(message, `Grabin contact: ${message.subject}`, message.name, process.env.NEXT_PUBLIC_CONTACT_WEB3FORMS_ACCESS_KEY);
}
