"use client";

import { useState, useEffect } from "react";
import ProductCard from "@/components/ProductCard";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import { Product } from "@/types";
import { CATEGORIES, ITEMS_PER_PAGE } from "@/constants";

interface CatalogClientProps {
    initialProducts: any[];
}

export default function CatalogClient({ initialProducts }: CatalogClientProps) {
    const [selectedCategory, setSelectedCategory] = useState("Todos");
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    // Reset to page 1 when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [selectedCategory, searchQuery, setCurrentPage]);

    // Map products to ensure correct type types
    const products: Product[] = initialProducts.map(p => ({
        ...p,
        price: Number(p.price)
    }));

    const filteredProducts = products.filter(product => {
        const matchesCategory = selectedCategory === "Todos" || product.category === selectedCategory;
        const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    // Pagination Logic
    const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const paginatedProducts = filteredProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    return (
        <div className="container mx-auto px-4 py-8" suppressHydrationWarning>
            {/* Header & Controls */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12">
                <h1 className="text-4xl font-display font-bold text-white">
                    <span className="text-primary">CATÁLOGO</span> SKYBOX
                </h1>

                <div className="relative w-full md:w-96">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Buscar produtos..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-full py-3 pl-12 pr-6 text-white outline-none focus:border-primary transition-colors"
                    />
                </div>
            </div>

            {/* Category Tabs */}
            <div className="flex flex-wrap justify-center gap-4 mb-12">
                {CATEGORIES.map(category => (
                    <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={`px-6 py-2 rounded-full font-bold transition-all ${selectedCategory === category
                            ? "bg-primary text-white shadow-[0_0_15px_rgba(255,0,127,0.5)]"
                            : "bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white"
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
                                className="p-2 rounded-lg bg-white/5 border border-white/10 text-slate-400 hover:bg-white/10 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                            >
                                <ChevronLeft size={20} />
                            </button>

                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                <button
                                    key={page}
                                    onClick={() => setCurrentPage(page)}
                                    className={`w-10 h-10 rounded-lg font-bold border transition-all ${currentPage === page
                                        ? "bg-primary border-primary text-white shadow-[0_0_15px_rgba(255,0,127,0.4)]"
                                        : "bg-white/5 border-white/10 text-slate-400 hover:bg-white/10 hover:text-white"
                                        }`}
                                >
                                    {page}
                                </button>
                            ))}

                            <button
                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages}
                                className="p-2 rounded-lg bg-white/5 border border-white/10 text-slate-400 hover:bg-white/10 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                            >
                                <ChevronRight size={20} />
                            </button>
                        </div>
                    )}
                </>
            ) : (
                <div className="text-center py-20">
                    <p className="text-slate-500 text-lg">Nenhum produto encontrado.</p>
                </div>
            )}
        </div>
    );
}
