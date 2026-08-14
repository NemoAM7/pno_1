'use client';

import type { Variant } from '@/lib/schemas/product';

export function VariantPicker({ variants, selectedVariantId, onChange }: { variants: Variant[]; selectedVariantId: string; onChange: (id: string) => void }) {
  return (
    <fieldset>
      <legend className="mb-3 text-sm font-bold uppercase tracking-[0.14em]">Choose your fit</legend>
      <div className="flex flex-wrap gap-2">
        {variants.map((variant) => (
          <button key={variant.id} type="button" onClick={() => onChange(variant.id)} className={`rounded-full border px-4 py-2 text-sm font-bold transition-colors ${selectedVariantId === variant.id ? 'border-ink bg-ink text-paper' : 'border-line bg-paper hover:border-ink'}`}>
            {variant.size} / {variant.color}
          </button>
        ))}
      </div>
    </fieldset>
  );
}
