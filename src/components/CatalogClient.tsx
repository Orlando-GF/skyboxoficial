"use client";

import { useState, useEffect } from "react";
import ProductCard from "@/components/ProductCard";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import { Product } from "@/types";
import { CATEGORIES, ITEMS_PER_PAGE } from "@/constants";

interface CatalogClientProps {
    initialProducts: Product[];
}

export default function CatalogClient({ initialProducts }: CatalogClientProps) {
    const [selectedCategory, setSelectedCategory] = useState("Todos");
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);


    // Map products to ensure correct type types
    const products: Product[] = initialProducts.map(p => ({
        ...p,
        price: Number(p.price)
    }));

    const filteredProducts = products.filter(product => {
        const matchesCategory = selectedCategory === "Todos" || product.category === selectedCategory;
        const searchTerm = searchQuery.toLowerCase();
        const matchesName = product.name.toLowerCase().includes(searchTerm);
        const matchesTags = product.flavor_tags?.some(tag => tag.toLowerCase().includes(searchTerm)) || false;

        return matchesCategory && (matchesName || matchesTags);
    });

    // Pagination Logic
    const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const paginatedProducts = filteredProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    return (
        <div className="container mx-auto px-4 py-8" suppressHydrationWarning>
            {/* Header & Controls */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12">
                <h1 className="text-6xl font-display font-bold text-white uppercase tracking-tighter leading-none">
                    SKYBOX<br />
                    <span className="text-primary italic">SYSTEM_STORE</span>
                </h1>

                <div className="relative w-full md:w-96">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary" />
                    <input
                        type="text"
                        placeholder="BUSCAR PROTOCOLO..."
                        value={searchQuery}
                        onChange={(e) => {
                            setSearchQuery(e.target.value);
                            setCurrentPage(1);
                        }}
                        className="w-full bg-black border-2 border-white/10 py-4 pl-12 pr-6 text-white outline-none focus:border-primary transition-all uppercase text-xs tracking-widest"
                    />
                </div>
            </div>

            {/* Category Tabs - Horizontal Scroll on Mobile, Wrapped on Desktop */}
            <div className="flex flex-nowrap overflow-x-auto pb-4 mb-12 gap-4 no-scrollbar md:flex-wrap md:justify-center md:pb-0 md:overflow-visible">
                <style jsx>{`
                    .no-scrollbar::-webkit-scrollbar { display: none; }
                    .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
                `}</style>
                {CATEGORIES.map(category => (
                    <button
                        key={category}
                        onClick={() => {
                            setSelectedCategory(category);
                            setCurrentPage(1);
                        }}
                        className={`px-8 py-3 font-bold border-2 transition-all uppercase tracking-widest text-[10px] ${selectedCategory === category
                            ? "bg-primary border-primary text-black"
                            : "bg-transparent border-white/10 text-primary/60 hover:border-white hover:text-white"
                            }`}
                    >
                        {category}
                    </button>
                ))}
            </div>

            {/* Product Grid */}
            {paginatedProducts.length > 0 ? (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 min-h-[600px] content-start">
                        {paginatedProducts.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>

                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                        <div className="flex justify-center items-center gap-2 mt-16 pb-12">
                            <button
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                                className="p-3 bg-black border-2 border-white/10 text-primary/40 hover:border-primary hover:text-primary disabled:opacity-20 disabled:cursor-not-allowed transition-all"
                            >
                                <ChevronLeft size={20} />
                            </button>

                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                <button
                                    key={page}
                                    onClick={() => setCurrentPage(page)}
                                    className={`w-12 h-12 font-bold border-2 transition-all text-xs ${currentPage === page
                                        ? "bg-primary border-primary text-black"
                                        : "bg-black border-white/10 text-primary/40 hover:border-white hover:text-white"
                                        }`}
                                >
                                    {page.toString().padStart(2, '0')}
                                </button>
                            ))}

                            <button
                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages}
                                className="p-3 bg-black border-2 border-white/10 text-primary/40 hover:border-primary hover:text-primary disabled:opacity-20 disabled:cursor-not-allowed transition-all"
                            >
                                <ChevronRight size={20} />
                            </button>
                        </div>
                    )}
                </>
            ) : (
                <div className="text-center py-20">
                    <p className="text-primary/40 text-[10px] font-bold uppercase tracking-widest">Nenhum protocolo encontrado.</p>
                </div>
            )}
        </div>
    );
}
