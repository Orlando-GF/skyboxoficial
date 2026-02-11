"use client";

import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { Product } from "@/types";
import { formatBRL } from "@/utils/format";
import Image from "next/image";
import { toast } from "sonner";

interface ProductCardProps {
    product: Product;
    className?: string; // For bento grid spanning
    priority?: boolean;
}

export default function ProductCard({ product, className, priority }: ProductCardProps) {
    const addItem = useCartStore((state) => state.addItem);

    return (
        <motion.div
            whileHover={{ y: -5 }}
            className={`group relative overflow-hidden rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm p-4 hover:border-primary/50 transition-colors ${className}`}
        >
            <div className="relative aspect-square mb-4 rounded-xl overflow-hidden bg-black/20">
                {/* Using a placeholder since we don't have real images yet. 
             In a real app, use next/image with proper src. */}
                <div className="absolute inset-0 flex items-center justify-center text-muted/20">
                    <span className="text-4xl font-bold">SKY</span>
                </div>
                {product.image && (
                    <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        priority={priority}
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                )}
            </div>

            <div className="flex flex-col gap-2">
                <h3 className="font-bold text-lg text-white group-hover:text-primary transition-colors">
                    {product.name}
                </h3>
                <div className="flex items-center justify-between">
                    <span className="text-secondary font-mono text-lg">
                        {formatBRL(product.price)}
                    </span>
                    <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={() => {
                            addItem(product);
                            toast.success(`${product.name} adicionado ao carrinho!`);
                        }}
                        className="bg-white/10 hover:bg-primary text-white p-2 rounded-lg transition-colors"
                    >
                        <Plus className="w-5 h-5" />
                    </motion.button>
                </div>
            </div>
        </motion.div>
    );
}
