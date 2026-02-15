import { create } from "zustand";
import { Product, CartItem } from "@/types";

interface CartStore {
    items: CartItem[];
    isOpen: boolean;
    addItem: (item: Product, variant?: { id: string; name: string; value: string }) => void;
    removeItem: (cartId: string) => void;
    updateQuantity: (cartId: string, quantity: number) => void;
    toggleCart: () => void;
    clearCart: () => void;
    total: () => number;
}

export const useCartStore = create<CartStore>((set, get) => ({
    items: [],
    isOpen: false,
    addItem: (item, variant) =>
        set((state) => {
            const cartId = variant ? `${item.id}-${variant.id}` : item.id;
            const existingItem = state.items.find((i) => i.cartId === cartId);

            if (existingItem) {
                return {
                    items: state.items.map((i) =>
                        i.cartId === cartId ? { ...i, quantity: i.quantity + 1 } : i
                    ),
                };
            }

            return {
                items: [
                    ...state.items,
                    {
                        ...item,
                        quantity: 1,
                        selectedVariant: variant,
                        cartId: cartId,
                    },
                ],
            };
        }),
    removeItem: (cartId) =>
        set((state) => ({
            items: state.items.filter((i) => i.cartId !== cartId),
        })),
    updateQuantity: (cartId, quantity) =>
        set((state) => ({
            items: state.items.map((i) =>
                i.cartId === cartId ? { ...i, quantity: Math.max(0, quantity) } : i
            ),
        })),
    toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
    clearCart: () => set({ items: [] }),
    total: () =>
        get().items.reduce((acc, item) => acc + item.price * item.quantity, 0),
}));
