'use client';

export function QuantityStepper({ quantity, onChange }: { quantity: number; onChange: (quantity: number) => void }) {
  return (
    <div className="inline-flex items-center rounded-full border border-line bg-paper" aria-label="Quantity">
      <button type="button" onClick={() => onChange(quantity - 1)} className="flex h-9 w-9 items-center justify-center text-lg font-bold hover:text-moss" aria-label="Decrease quantity">-</button>
      <span className="w-7 text-center text-sm font-bold" aria-live="polite">{quantity}</span>
      <button type="button" onClick={() => onChange(quantity + 1)} className="flex h-9 w-9 items-center justify-center text-lg font-bold hover:text-moss" aria-label="Increase quantity">+</button>
    </div>
  );
}
