export async function submitToWeb3Forms(payload: Record<string, unknown>, subject: string, fromName: string, accessKey: string | undefined): Promise<void> {
  const endpoint = process.env.NEXT_PUBLIC_CUSTOMIZATION_ENDPOINT ?? 'https://api.web3forms.com/submit';
  if (!accessKey) throw new Error('Web3Forms is not configured.');

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ access_key: accessKey, subject, from_name: fromName, ...payload }),
  });

  if (!response.ok) throw new Error('The form could not be submitted.');
}
