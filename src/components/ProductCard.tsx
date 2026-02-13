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
            whileHover={{
                y: -10,
                transition: { type: "spring", stiffness: 400, damping: 10 }
            }}
            className={`group relative overflow-hidden bg-black border-2 border-white/20 p-4 hover:border-primary transition-all duration-300 ${className}`}
        >
            <div className="relative aspect-square mb-4 bg-slate-900 border border-white/5 overflow-hidden">
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
                <div className="min-h-[22px] mb-1"> {/* Fixed slot for tags */}
                    {product.flavor_tags && product.flavor_tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                            {product.flavor_tags.slice(0, 3).map((tag, idx) => (
                                <span
                                    key={idx}
                                    className="text-[8px] font-black uppercase tracking-[0.2em] bg-primary text-black px-2 py-0.5 rounded-none shadow-[1px_1px_0px_#000]"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
                <h3 className="font-bold text-lg text-white group-hover:text-primary transition-colors leading-tight min-h-[44px] line-clamp-2 uppercase tracking-tighter">
                    {product.name}
                </h3>
                <div className="flex items-center justify-between">
                    <span className="text-primary font-bold font-mono text-lg tracking-tight">
                        {formatBRL(product.price)}
                    </span>
                    <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={() => {
                            addItem(product);
                            toast.success(`${product.name} adicionado ao carrinho!`);
                        }}
                        className="bg-white/10 hover:bg-primary hover:text-black text-white p-2 rounded-none transition-colors border border-white/10 hover:border-primary"
                    >
                        <Plus className="w-5 h-5" />
                    </motion.button>
                </div>
            </div>
        </motion.div>
    );
}
