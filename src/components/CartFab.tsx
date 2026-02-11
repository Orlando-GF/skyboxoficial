"use client";

import { ShoppingBag } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { motion, AnimatePresence } from "framer-motion";

export default function CartFab() {
    const { toggleCart, items } = useCartStore();
    const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);

    return (
        <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleCart}
            className="fixed bottom-6 right-6 z-40 bg-primary hover:bg-primary/90 text-white p-4 rounded-full shadow-[0_0_20px_rgba(255,0,127,0.4)] transition-colors"
        >
            <ShoppingBag className="w-6 h-6" />
            <AnimatePresence>
                {itemCount > 0 && (
                    <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        className="absolute -top-2 -right-2 bg-secondary text-black text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full border-2 border-background"
                    >
                        {itemCount}
                    </motion.span>
                )}
            </AnimatePresence>
        </motion.button>
    );
}
