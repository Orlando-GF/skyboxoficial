"use client";

import { ShoppingBag } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { motion, AnimatePresence } from "framer-motion";

export default function CartFab() {
    const { toggleCart, items } = useCartStore();
    const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);

    return (
        <motion.button
            whileHover={{
                scale: 1.1,
                rotate: 5,
                transition: { type: "spring", stiffness: 400, damping: 10 }
            }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleCart}
            className="fixed bottom-8 right-8 z-40 bg-primary text-black p-5 border-2 border-black shadow-[4px_4px_0px_#ffffff20] hover:shadow-[6px_6px_0px_#ffffff40] transition-all"
        >
            <ShoppingBag className="w-6 h-6" />
            <AnimatePresence>
                {itemCount > 0 && (
                    <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        className="absolute -top-3 -right-3 bg-white text-black text-[10px] font-black w-7 h-7 flex items-center justify-center border-2 border-black"
                    >
                        {itemCount}
                    </motion.span>
                )}
            </AnimatePresence>
        </motion.button>
    );
}
