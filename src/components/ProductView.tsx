"use client";

import { useState } from "react";
import { Product } from "@/types";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, ArrowLeft, Search as SearchIcon } from "lucide-react";
import { formatBRL } from "@/utils/format";
import { useCartStore } from "@/store/cartStore";
import { toast } from "sonner";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface ProductViewProps {
    product: Product;
    kitItemsData: { id: string; name: string; price: number }[];
}

export default function ProductView({ product, kitItemsData }: ProductViewProps) {
    const [selectedImage, setSelectedImage] = useState(product.image);
    const [selectedVariant, setSelectedVariant] = useState<{ id: string; name: string; value: string; stock: boolean } | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const addItem = useCartStore((state) => state.addItem);

    // Calculate Prices
    const kitOriginalPrice = kitItemsData.reduce((acc, item) => acc + Number(item.price), 0);
    const isKitCheck = product.is_kit && kitItemsData.length > 0;
    const individualOriginalPrice = Number(product.original_price) || 0;
    const isIndividualDiscount = !isKitCheck && individualOriginalPrice > Number(product.price);
    const finalOriginalPrice = isKitCheck ? kitOriginalPrice : individualOriginalPrice;
    const hasDiscount = isKitCheck || isIndividualDiscount;

    // Gallery Logic
    const gallery = product.gallery || [];
    const allImages = [product.image, ...gallery].filter(Boolean);

    const handleAddToCart = () => {
        if (product.variants && product.variants.length > 0 && !selectedVariant) {
            toast.error("Por favor, selecione uma opção.");
            return;
        }

        if (selectedVariant && !selectedVariant.stock) {
            toast.error("Variação fora de estoque.");
            return;
        }

        addItem(product, selectedVariant || undefined);
        toast.success("Adicionado ao carrinho!");
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-white">
            {/* Image Section */}
            <div className="space-y-4">
                <div className="relative aspect-square border-2 border-white/10 bg-white/5 group overflow-hidden">
                    {selectedImage ? (
                        <Image
                            src={selectedImage}
                            alt={product.name}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                            priority
                        />
                    ) : (
                        <div className="w-full h-full bg-white/5 flex items-center justify-center">
                            <span className="text-white/20 text-xs uppercase font-bold tracking-widest">Sem Imagem</span>
                        </div>
                    )}
                    {isKitCheck && (
                        <div className="absolute top-4 left-4 bg-primary text-black font-black uppercase tracking-widest text-xs px-4 py-2">
                            Smart Kit
                        </div>
                    )}
                </div>

                {/* Thumbnails */}
                {allImages.length > 1 && (
                    <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
                        {allImages.map((img, idx) => (
                            <button
                                key={idx}
                                onClick={() => setSelectedImage(img)}
                                aria-label={`Ver imagem ${idx + 1}`}
                                className={cn(
                                    "relative w-20 h-20 border-2 transition-all flex-shrink-0 bg-black",
                                    selectedImage === img ? "border-primary" : "border-white/10 hover:border-white/30"
                                )}
                            >
                                <Image src={img} alt={`${product.name} - Vista ${idx + 1}`} fill className="object-cover" />
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Details Section */}
            <div className="flex flex-col gap-6">
                <div>
                    <Link href="/catalogo" className="inline-flex items-center gap-2 text-primary/60 hover:text-primary transition-colors uppercase text-[10px] font-bold tracking-widest mb-4 group">
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Continuar Comprando
                    </Link>

                    <h1 className="text-4xl md:text-5xl font-display font-bold uppercase tracking-tighter leading-none mb-2">
                        {product.name}
                    </h1>
                    <div className="flex flex-wrap gap-2 mb-4">
                        {product.flavor_tags?.map((tag: string) => (
                            <Badge
                                key={tag}
                                variant="default"
                                className="text-[10px] uppercase font-bold tracking-[0.2em] bg-primary text-black px-2 py-0.5 rounded-none shadow-[1px_1px_0px_#000] hover:bg-primary/90 pointer-events-none"
                            >
                                {tag}
                            </Badge>
                        ))}
                    </div>

                    {product.seo_description && (
                        <p className="text-sm text-slate-400 font-medium uppercase tracking-widest mb-4">
                            {product.seo_description}
                        </p>
                    )}
                </div>

                {/* Variants Selector */}
                {product.variants && product.variants.length > 0 && (() => {
                    const variants = product.variants;
                    const filteredVariants = variants.filter(v => v.name.toLowerCase().includes(searchTerm.toLowerCase()));

                    return (
                        <div className="space-y-4 border-y border-white/5 py-6">
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-slate-500">
                                    {variants.length > 6 ? "Escolha o Sabor:" : "Escolha uma opção:"}
                                </span>
                                {variants.length > 10 && (
                                    <div className="relative group">
                                        <SearchIcon className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-500 group-focus-within:text-primary transition-colors" />
                                        <input
                                            type="text"
                                            placeholder="BUSCAR SABOR..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="bg-black border border-white/10 text-[9px] font-bold uppercase tracking-widest pl-7 pr-2 py-1 w-32 focus:w-48 focus:border-primary transition-all outline-none"
                                        />
                                    </div>
                                )}
                            </div>

                            <div className={cn(
                                "flex flex-wrap gap-2",
                                variants.length > 6 ? "max-h-[300px] overflow-y-auto pr-2 no-scrollbar" : ""
                            )}>
                                {filteredVariants.map((variant) => (
                                    <button
                                        key={variant.id}
                                        onClick={() => variant.stock && setSelectedVariant(variant)}
                                        disabled={!variant.stock}
                                        aria-label={`Selecionar ${variant.name}${!variant.stock ? ' (Indisponível)' : ''}`}
                                        className={cn(
                                            "group flex items-center transition-all border-2",
                                            variants.length > 6
                                                ? "gap-2 px-3 py-1.5 min-w-[100px] flex-1 md:flex-none" // Compact mode
                                                : "gap-3 px-4 py-2 min-w-[140px]", // Regular mode
                                            selectedVariant?.id === variant.id
                                                ? "border-primary bg-primary/10 shadow-[2px_2px_0px_#bef264]"
                                                : "border-white/10 bg-black hover:border-white/30",
                                            !variant.stock && "opacity-50 cursor-not-allowed grayscale border-white/5"
                                        )}
                                    >
                                        {(!variant.type || variant.type === 'color') && (
                                            <div
                                                className={cn(
                                                    "rounded-full border border-white/20 shadow-sm shrink-0",
                                                    variants.length > 6 ? "w-3 h-3" : "w-4 h-4"
                                                )}
                                                style={{ backgroundColor: variant.value }}
                                            />
                                        )}
                                        <div className="flex flex-col items-start overflow-hidden">
                                            <span className={cn(
                                                "font-bold uppercase tracking-wider truncate w-full text-left",
                                                variants.length > 6 ? "text-[10px]" : "text-xs",
                                                selectedVariant?.id === variant.id ? "text-primary" : "text-white"
                                            )}>
                                                {variant.name}
                                            </span>
                                            {!variant.stock && (
                                                <span className="text-[7px] text-red-500 font-black uppercase tracking-widest -mt-0.5">
                                                    Esgotado
                                                </span>
                                            )}
                                        </div>
                                    </button>
                                ))}
                                {filteredVariants.length === 0 && (
                                    <div className="w-full py-4 text-center border-2 border-dashed border-white/5">
                                        <span className="text-[10px] uppercase font-bold text-slate-600 tracking-widest">Sabor não encontrado</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })()}

                {/* Price Section */}
                <div className="py-2">
                    {hasDiscount && (
                        <div className="flex items-center gap-3 mb-1">
                            <p className="text-slate-400 line-through font-mono text-lg">
                                DE: {formatBRL(finalOriginalPrice)}
                            </p>
                            <Badge variant="default" className="bg-primary text-black font-black uppercase tracking-widest text-[10px] rounded-none px-2 py-0.5 animate-pulse">
                                {Math.round(((finalOriginalPrice - product.price) / finalOriginalPrice) * 100)}% OFF
                            </Badge>
                        </div>
                    )}
                    <p className="text-4xl font-mono font-bold text-primary">
                        {hasDiscount && "POR: "} {formatBRL(product.price)}
                    </p>
                </div>

                {/* Add to Cart */}
                <Button
                    onClick={handleAddToCart}
                    disabled={!product.stock || (product.variants && product.variants.length > 0 && !selectedVariant)}
                    aria-label={product.stock ? "Adicionar este produto ao carrinho" : "Produto indisponível"}
                    className="w-full bg-primary text-black font-black uppercase tracking-widest py-8 text-base hover:bg-white transition-colors flex items-center justify-center gap-2 rounded-none disabled:bg-zinc-800 disabled:text-zinc-500 disabled:opacity-100 disabled:cursor-not-allowed"
                >
                    <Plus className="w-5 h-5" />
                    {product.stock ? "Adicionar ao Carrinho" : "Produto Indisponível"}
                </Button>

                {/* Kit Items List */}
                {isKitCheck && (
                    <div className="bg-white/5 p-6 border border-white/10 mt-4">
                        <h3 className="text-sm font-bold uppercase tracking-widest mb-4 text-primary">O que vem no kit:</h3>
                        <ul className="space-y-3">
                            {kitItemsData.map((item) => (
                                <li key={item.id} className="flex items-center gap-3 text-sm">
                                    <span className="text-primary font-bold"><Plus size={14} /></span>
                                    <span className="flex-1 border-b border-dashed border-white/20 pb-1 uppercase tracking-wider text-xs font-medium text-slate-300">
                                        {item.name}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Description */}
                {product.description && (
                    <div className="border-t-2 border-white/10 pt-8 mt-4">
                        <h3 className="text-sm font-bold uppercase tracking-widest text-white mb-4">Detalhes do Produto</h3>
                        <div className="prose prose-invert max-w-none text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">
                            {product.description}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
