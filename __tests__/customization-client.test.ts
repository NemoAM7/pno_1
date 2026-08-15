import { afterEach, describe, expect, it, vi } from 'vitest';
import { submitCustomizationRequest } from '../lib/customization/client';

const request = {
  requestType: 'new-product' as const,
  productType: 'Cycling jersey',
  name: 'Ayaan Khan',
  email: 'ayaan@example.com',
  phone: '+91 98765 43210',
  request: 'Add initials AK on the left chest',
  consent: true as const,
};

describe('submitCustomizationRequest', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it('posts the request to the configured endpoint', async () => {
    vi.stubEnv('NEXT_PUBLIC_CUSTOMIZATION_ENDPOINT', 'https://api.web3forms.com/submit');
    vi.stubEnv('NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY', 'test-access-key');
    const fetchMock = vi.fn().mockResolvedValue({ ok: true });
    vi.stubGlobal('fetch', fetchMock);

    await submitCustomizationRequest(request);

    expect(fetchMock).toHaveBeenCalledWith('https://api.web3forms.com/submit', expect.objectContaining({ method: 'POST', body: JSON.stringify({ access_key: 'test-access-key', subject: 'Grabin customization request: new-product', from_name: 'Ayaan Khan', ...request }) }));
  });

  it('fails clearly when the provider is not configured or rejects the request', async () => {
    await expect(submitCustomizationRequest(request)).rejects.toThrow('Web3Forms is not configured.');

    vi.stubEnv('NEXT_PUBLIC_CUSTOMIZATION_ENDPOINT', 'https://api.web3forms.com/submit');
    vi.stubEnv('NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY', 'test-access-key');
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false }));
    await expect(submitCustomizationRequest(request)).rejects.toThrow('Customization request could not be submitted.');
  });
});
