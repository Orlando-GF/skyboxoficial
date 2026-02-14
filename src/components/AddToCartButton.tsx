"use client";

import { useCartStore } from "@/store/cartStore";
import { Product } from "@/types";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

export default function AddToCartButton({ product }: { product: Product }) {
    const addItem = useCartStore((state) => state.addItem);

    return (
        <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={() => {
                addItem(product);
                toast.success("Adicionado ao carrinho!");
                // Open cart logic not exposed directly, but toast confirms.
            }}
            className="w-full bg-primary text-black font-black uppercase tracking-widest py-4 hover:bg-white transition-colors flex items-center justify-center gap-2"
        >
            <Plus className="w-5 h-5" />
            Adicionar ao Carrinho
        </motion.button>
    );
}
