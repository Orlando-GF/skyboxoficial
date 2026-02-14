
import { Product } from "@/types";

/**
 * Normalizes product data, ensuring price is a number.
 * Useful for handling data from Supabase which might return strings or different formats.
 */
export const normalizeProduct = (p: Product): Product => ({
    ...p,
    price: Number(p.price)
});

/**
 * Normalizes a list of products.
 */
export const normalizeProducts = (products: Product[]): Product[] => {
    return products.map(normalizeProduct);
};
