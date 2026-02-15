"use client";

import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { useState } from "react";
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
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const gallery = product.gallery || [];
    const allImages = [product.image, ...gallery].filter(Boolean);

    const nextImage = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
    };

    const prevImage = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
    };

    return (
        <motion.div
            suppressHydrationWarning
            whileHover={{
                y: -10,
                transition: { type: "spring", stiffness: 400, damping: 10 }
            }}
            className={`group relative flex flex-col overflow-hidden bg-black border-2 border-white/10 p-4 hover:border-primary transition-all duration-300 ${className}`}
        >
            <div className="relative aspect-square mb-4 bg-black border border-white/5 overflow-hidden">
                <Link href={`/produto/${product.id}`} className="block w-full h-full relative cursor-pointer">
                    {/* Placeholder */}
                    <div className="absolute inset-0 flex items-center justify-center text-muted/20">
                        <span className="text-4xl font-bold">SKY</span>
                    </div>

                    {allImages.length > 0 && (
                        <motion.div
                            key={currentImageIndex}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.3 }}
                            className="absolute inset-0"
                        >
                            <Image
                                src={allImages[currentImageIndex]}
                                alt={product.name}
                                fill
                                priority={priority && currentImageIndex === 0}
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                                className="object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                        </motion.div>
                    )}
                </Link>

                {/* Navigation Arrows */}
                {allImages.length > 1 && (
                    <>
                        <button
                            onClick={prevImage}
                            aria-label="Imagem anterior"
                            className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-primary hover:text-black z-20"
                        >
                            <ChevronLeft size={16} />
                        </button>
                        <button
                            onClick={nextImage}
                            aria-label="Próxima imagem"
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-primary hover:text-black z-20"
                        >
                            <ChevronRight size={16} />
                        </button>

                        {/* Pagination Dots */}
                        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
                            {allImages.map((_, idx) => (
                                <div
                                    key={idx}
                                    className={`w-1.5 h-1.5 rounded-full transition-all ${currentImageIndex === idx ? "bg-primary w-3" : "bg-white/30"
                                        }`}
                                />
                            ))}
                        </div>
                    </>
                )}

                {/* Discount Badge */}
                {product.original_price && product.original_price > product.price ? (
                    <div className="absolute top-2 right-2 z-10">
                        <Badge variant="default" className="bg-primary text-black font-black text-[10px] uppercase tracking-widest px-2 py-1 rounded-none shadow-[2px_2px_0px_#000]">
                            {Math.round(((product.original_price - product.price) / product.original_price) * 100)}% OFF
                        </Badge>
                    </div>
                ) : null}
            </div>

            <div className="flex flex-col flex-1 gap-2">
                <div className="min-h-[22px] mb-1">
                    {product.flavor_tags && product.flavor_tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                            {product.flavor_tags.slice(0, 3).map((tag, idx) => (
                                <Badge
                                    key={idx}
                                    variant="default"
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

                {/* Variant Previews (Colors vs Flavors) */}
                {product.variants && product.variants.length > 0 && (
                    <div className="flex gap-1.5 items-center my-1 select-none">
                        {product.variants.some(v => v.type === 'flavor') ? (
                            <span className="text-[10px] font-black uppercase tracking-[0.15em] text-primary/80 group-hover:text-primary transition-colors">
                                VEJA TODOS {product.variants.filter(v => v.type === 'flavor').length} SABORES
                            </span>
                        ) : (
                            <>
                                {product.variants.filter(v => v.type === 'color' || !v.type).slice(0, 5).map((variant) => (
                                    <div
                                        key={variant.id}
                                        className={`w-3 h-3 rounded-full border border-white/10 shadow-[1px_1px_0px_#000] ${!variant.stock ? "opacity-30 grayscale" : ""}`}
                                        style={{ backgroundColor: variant.value }}
                                        title={`${variant.name}${!variant.stock ? ' (Sem estoque)' : ''}`}
                                    />
                                ))}
                                {product.variants.filter(v => v.type === 'color' || !v.type).length > 5 && (
                                    <span className="text-[8px] text-white/40 font-bold">+{product.variants.filter(v => v.type === 'color' || !v.type).length - 5}</span>
                                )}
                            </>
                        )}
                    </div>
                )}

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

                <div className="flex items-center justify-between mt-auto pt-4">
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
                        aria-label={`Adicionar ${product.name} ao carrinho`}
                        onClick={() => {
                            addItem(product);
                            toast.success(`${product.name} adicionado ao carrinho!`);
                        }}
                        className="bg-white/5 hover:bg-primary hover:text-black text-white p-2.5 rounded-none transition-colors border border-white/10 hover:border-primary cursor-pointer"
                    >
                        <Plus className="w-5 h-5" />
                    </motion.button>
                </div>
            </div>
        </motion.div>
    );
}
