"use client";

import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useCartStore } from "@/store/cartStore";
import { Product } from "@/types";
import { formatBRL } from "@/utils/format";
import Image from "next/image";
import Link from "next/link";
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
            className={`group relative flex flex-col overflow-hidden bg-black border-2 border-white/20 p-4 hover:border-primary transition-all duration-300 ${className}`}
        >
            <Link href={`/produto/${product.id}`} className="block relative aspect-square mb-4 bg-slate-900 border border-white/5 overflow-hidden cursor-pointer">
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

                {/* Discount Badge */}
                {product.original_price && product.original_price > product.price ? (
                    <div className="absolute top-2 right-2 z-10">
                        <Badge variant="default" className="bg-primary text-black font-black text-[10px] uppercase tracking-widest px-2 py-1 rounded-none shadow-[2px_2px_0px_#000]">
                            {Math.round(((product.original_price - product.price) / product.original_price) * 100)}% OFF
                        </Badge>
                    </div>
                ) : null}
            </Link>

            <div className="flex flex-col flex-1 gap-2"> {/* Made flex-1 to push footer down */}
                <div className="min-h-[22px] mb-1"> {/* Fixed slot for tags */}
                    {product.flavor_tags && product.flavor_tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                            {product.flavor_tags.slice(0, 3).map((tag, idx) => (
                                <Badge
                                    key={idx}
                                    variant="default" // Primary (Acid Green)
                                    className="text-[8px] font-black uppercase tracking-[0.2em] bg-primary text-black px-2 py-0.5 rounded-none shadow-[1px_1px_0px_#000] hover:bg-primary/90 pointer-events-none"
                                >
                                    {tag}
                                </Badge>
                            ))}
                        </div>
                    )}
                </div>

                <Link href={`/produto/${product.id}`} className="block">
                    <h3 className="font-bold text-lg text-white group-hover:text-primary transition-colors leading-tight line-clamp-2 uppercase tracking-tighter cursor-pointer">
                        {product.name}
                    </h3>
                </Link>

                {/* Specs / Short Description Line */}
                <div className="min-h-[20px]">
                    {product.seo_description ? (
                        <p className="text-[10px] text-white/50 uppercase tracking-widest truncate font-medium">
                            {product.seo_description}
                        </p>
                    ) : (
                        <p className="text-[10px] text-white/20 uppercase tracking-widest truncate font-medium">
                            {product.category}
                        </p>
                    )}
                </div>

                <div className="flex items-center justify-between mt-auto pt-4"> {/* mt-auto pushes to bottom */}
                    <div className="flex items-baseline gap-2">
                        <span className="text-primary font-bold font-mono text-lg tracking-tight">
                            {formatBRL(product.price)}
                        </span>
                        {product.original_price && product.original_price > product.price ? (
                            <span className="text-slate-400 text-xs line-through font-mono">
                                {formatBRL(product.original_price)}
                            </span>
                        ) : null}
                    </div>
                    <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={() => {
                            addItem(product);
                            toast.success(`${product.name} adicionado ao carrinho!`);
                        }}
                        className="bg-white/10 hover:bg-primary hover:text-black text-white p-2 rounded-none transition-colors border border-white/10 hover:border-primary cursor-pointer"
                    >
                        <Plus className="w-5 h-5" />
                    </motion.button>
                </div>
            </div>
        </motion.div>
    );
}
