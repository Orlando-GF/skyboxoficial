"use client";

import Link from "next/link";
import { useState } from "react";
import ProductCard from "@/components/ProductCard";
import { Search, ChevronLeft, ChevronRight, ArrowLeft } from "lucide-react";
import { Product } from "@/types";
import { ITEMS_PER_PAGE } from "@/constants";

import { normalizeProducts } from "@/utils/productUtils";

interface CatalogClientProps {
    initialProducts: Product[];
    categories: string[];
}

export default function CatalogClient({ initialProducts, categories }: CatalogClientProps) {
    const [selectedCategory, setSelectedCategory] = useState("Todos");

    // Combine "Todos" with categories from database
    const allCategories = ["Todos", ...categories];
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);


    // Map products using utility
    const products = normalizeProducts(initialProducts);

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
            {/* Back to Home */}
            <div className="mb-8">
                <Link href="/" className="inline-flex items-center gap-2 text-primary/60 hover:text-primary transition-colors uppercase text-[10px] font-bold tracking-widest group">
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Voltar para o Início
                </Link>
            </div>

            {/* Header & Controls */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12">
                <h1 className="text-4xl md:text-6xl font-display font-bold text-white uppercase tracking-tighter leading-none text-center md:text-left">
                    SKYBOX<br />
                    <span className="text-primary italic text-2xl md:text-6xl break-all">TABACARIA_STORE</span>
                </h1>

                <div className="relative w-full md:w-96">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary" />
                    <input
                        type="text"
                        placeholder="BUSCAR PRODUTOS..."
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
                {allCategories.map(category => (
                    <button
                        key={category}
                        onClick={() => {
                            setSelectedCategory(category);
                            setCurrentPage(1);
                        }}
                        aria-label={`Filtrar por ${category}`}
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
                        {paginatedProducts.map((product, index) => (
                            <ProductCard key={product.id} product={product} priority={index < 4} />
                        ))}
                    </div>

                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                        <div className="flex justify-center items-center gap-2 mt-16 pb-12">
                            <button
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                                aria-label="Página anterior"
                                className="p-3 bg-black border-2 border-white/10 text-primary/40 hover:border-primary hover:text-primary disabled:opacity-20 disabled:cursor-not-allowed transition-all"
                            >
                                <ChevronLeft size={20} />
                            </button>

                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                <button
                                    key={page}
                                    onClick={() => setCurrentPage(page)}
                                    aria-label={`Ir para a página ${page}`}
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
                                aria-label="Próxima página"
                                className="p-3 bg-black border-2 border-white/10 text-primary/40 hover:border-primary hover:text-primary disabled:opacity-20 disabled:cursor-not-allowed transition-all"
                            >
                                <ChevronRight size={20} />
                            </button>
                        </div>
                    )}
                </>
            ) : (
                <div className="text-center py-20">
                    <p className="text-primary/40 text-[10px] font-bold uppercase tracking-widest">Nenhum produto encontrado.</p>
                </div>
            )}
        </div>
    );
}
