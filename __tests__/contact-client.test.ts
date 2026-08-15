import { afterEach, describe, expect, it, vi } from 'vitest';
import { submitContactMessage } from '../lib/contact/client';

describe('submitContactMessage', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it('submits contact details through Web3Forms', async () => {
    vi.stubEnv('NEXT_PUBLIC_CONTACT_WEB3FORMS_ACCESS_KEY', 'test-contact-access-key');
    const fetchMock = vi.fn().mockResolvedValue({ ok: true });
    vi.stubGlobal('fetch', fetchMock);
    const message = { name: 'Ayaan', email: 'ayaan@example.com', subject: 'Sizing question', message: 'Could you help me choose a size?' };

    await submitContactMessage(message);

    expect(fetchMock).toHaveBeenCalledWith('https://api.web3forms.com/submit', expect.objectContaining({ method: 'POST' }));
  });
});
