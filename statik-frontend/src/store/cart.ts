import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  lineId: string;
  productId: string;
  slug: string;
  title: string;
  price: number;
  quantity: number;
  image: string;
  optionLabel?: string;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  toastVisible: boolean;
  lastAddedItem: CartItem | null;
  addItem: (item: CartItem) => void;
  updateQuantity: (lineId: string, quantity: number) => void;
  removeItem: (lineId: string) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  dismissToast: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      isOpen: false,
      toastVisible: false,
      lastAddedItem: null,
      addItem: (item) =>
        set((state) => {
          const existing = state.items.find((entry) => entry.lineId === item.lineId);

          if (existing) {
            return {
              items: state.items.map((entry) =>
                entry.lineId === item.lineId
                  ? { ...entry, quantity: entry.quantity + item.quantity }
                  : entry,
              ),
              isOpen: true,
              toastVisible: true,
              lastAddedItem: { ...item, quantity: (existing.quantity || 0) + item.quantity },
            };
          }

          return {
            items: [...state.items, item],
            isOpen: true,
            toastVisible: true,
            lastAddedItem: item,
          };
        }),
      updateQuantity: (lineId, quantity) =>
        set((state) => ({
          items:
            quantity <= 0
              ? state.items.filter((entry) => entry.lineId !== lineId)
              : state.items.map((entry) => (entry.lineId === lineId ? { ...entry, quantity } : entry)),
        })),
      removeItem: (lineId) =>
        set((state) => ({ items: state.items.filter((entry) => entry.lineId !== lineId) })),
      clearCart: () => set({ items: [], toastVisible: false, lastAddedItem: null }),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      dismissToast: () => set({ toastVisible: false }),
    }),
    {
      name: 'statik-cart',
      partialize: (state) => ({ items: state.items }),
    },
  ),
);

export const getCartCount = (items: CartItem[]) => items.reduce((total, item) => total + item.quantity, 0);
export const getCartSubtotal = (items: CartItem[]) => items.reduce((total, item) => total + item.price * item.quantity, 0);
