import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const CART_STORAGE_KEY = 'grabin-cart';

export interface CartLine {
  productId: string;
  variantId: string;
  name: string;
  color?: string;
  size?: string;
  unitCents: number;
  quantity: number;
}

export interface CartState {
  lines: CartLine[];
  addItem: (line: CartLine) => void;
  removeItem: (variantId: string) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  clear: () => void;
}

export function getCartItemCount(lines: CartLine[]): number {
  return lines.reduce((total, line) => total + line.quantity, 0);
}

export function getCartSubtotalCents(lines: CartLine[]): number {
  return lines.reduce((total, line) => total + line.unitCents * line.quantity, 0);
}

function normalizeQuantity(quantity: number): number {
  return Number.isFinite(quantity) ? Math.floor(quantity) : 0;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      lines: [],
      addItem: (line) =>
        set((state) => {
          const quantity = normalizeQuantity(line.quantity);
          if (quantity < 1) return state;
          const existing = state.lines.find((item) => item.variantId === line.variantId);
          if (!existing) {
            return { lines: [...state.lines, { ...line, quantity }] };
          }
          return {
            lines: state.lines.map((l) =>
              l.variantId === line.variantId ? { ...l, quantity: l.quantity + quantity } : l,
            ),
          };
        }),
      removeItem: (variantId) =>
        set((state) => ({ lines: state.lines.filter((l) => l.variantId !== variantId) })),
      updateQuantity: (variantId, quantity) =>
        set((state) => ({
          lines: state.lines
            .map((l) => (l.variantId === variantId ? { ...l, quantity: normalizeQuantity(quantity) } : l))
            .filter((l) => l.quantity > 0),
        })),
      clear: () => set({ lines: [] }),
    }),
    { name: CART_STORAGE_KEY },
  ),
);
