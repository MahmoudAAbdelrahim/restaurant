import { create } from "zustand";

type Item = {
  id: string;
  name: string;
  price: number;
  image?: string;
  quantity: number;
};

type CartState = {
  items: Item[];
  addToCart: (item: Item) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, delta: number) => void; // إضافة التعديل هنا
  clearCart: () => void;
};

export const useCart = create<CartState>((set) => ({
  items: [],
  addToCart: (item) =>
    set((state) => {
      const existing = state.items.find((i) => i.id === item.id);
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
          ),
        };
      }
      return { items: [...state.items, item] };
    }),
  updateQuantity: (id, delta) =>
    set((state) => ({
      items: state.items
        .map((i) => (i.id === id ? { ...i, quantity: Math.max(1, i.quantity + delta) } : i))
    })),
  removeFromCart: (id) =>
    set((state) => ({
      items: state.items.filter((i) => i.id !== id),
    })),
  clearCart: () => set({ items: [] }),
}));