import { afterEach, describe, expect, it, vi } from 'vitest';
import { submitCustomizationRequest } from '../lib/customization/client';

const request = {
  requestType: 'new-product' as const,
  productType: 'Cycling jersey',
  name: 'Ayaan Khan',
  email: 'ayaan@example.com',
  phone: '+44 7000 000000',
  request: 'Add initials AK on the left chest',
  consent: true as const,
};

describe('submitCustomizationRequest', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it('posts the request to the configured endpoint', async () => {
    vi.stubEnv('NEXT_PUBLIC_CUSTOMIZATION_ENDPOINT', 'https://forms.example.test/requests');
    const fetchMock = vi.fn().mockResolvedValue({ ok: true });
    vi.stubGlobal('fetch', fetchMock);

    await submitCustomizationRequest(request);

    expect(fetchMock).toHaveBeenCalledWith('https://forms.example.test/requests', expect.objectContaining({ method: 'POST', body: JSON.stringify(request) }));
  });

  it('fails clearly when the provider is not configured or rejects the request', async () => {
    await expect(submitCustomizationRequest(request)).rejects.toThrow('Customization service is not configured.');

    vi.stubEnv('NEXT_PUBLIC_CUSTOMIZATION_ENDPOINT', 'https://forms.example.test/requests');
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false }));
    await expect(submitCustomizationRequest(request)).rejects.toThrow('Customization request could not be submitted.');
  });
});
