import { create } from "zustand";
import { Product, CartItem } from "@/types";

interface CartStore {
    items: CartItem[];
    isOpen: boolean;
    addItem: (item: Product) => void;
    removeItem: (id: string) => void;
    updateQuantity: (id: string, quantity: number) => void;
    toggleCart: () => void;
    clearCart: () => void;
    total: () => number;
}

export const useCartStore = create<CartStore>((set, get) => ({
    items: [],
    isOpen: false,
    addItem: (item) =>
        set((state) => {
            const existingItem = state.items.find((i) => i.id === item.id);
            if (existingItem) {
                return {
                    items: state.items.map((i) =>
                        i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
                    ),
                    isOpen: true, // Open cart when adding item
                };
            }
            return { items: [...state.items, { ...item, quantity: 1 }], isOpen: true };
        }),
    removeItem: (id) =>
        set((state) => ({
            items: state.items.filter((i) => i.id !== id),
        })),
    updateQuantity: (id, quantity) =>
        set((state) => ({
            items: state.items.map((i) =>
                i.id === id ? { ...i, quantity: Math.max(0, quantity) } : i
            ),
        })),
    toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
    clearCart: () => set({ items: [] }),
    total: () => get().items.reduce((acc, item) => acc + item.price * item.quantity, 0),
}));
