export function formatPrice(cents: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(cents / 100);
}

export function addCents(...values: number[]): number {
  return values.reduce((sum, value) => sum + value, 0);
}

export function multiplyCents(cents: number, quantity: number): number {
  return cents * quantity;
}
