"use client";

import { CartItem, Product } from "@/types";
import ProductCard from "@/components/ProductCard";
import Link from "next/link";

interface LandingPageProps {
    products: Product[];
}

export default function LandingPage({ products }: LandingPageProps) {
    // Map Supabase product to CartItem structure where needed
    const formattedProducts = products.map(p => ({
        ...p,
        price: Number(p.price) // Ensure price is number
    }));

    return (
        <main className="min-h-screen pb-24 relative overflow-x-hidden" suppressHydrationWarning>
            {/* Background Ambience */}
            {/* Background Ambience matches Catalog */}
            <div className="fixed inset-0 z-[-1] bg-background" />
            <div className="fixed inset-0 z-[-1] bg-[url('https://images.unsplash.com/photo-1543722530-d2c3201371e7?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-center opacity-10 pointer-events-none" />
            <div className="fixed top-0 left-0 w-full h-full z-[-1] bg-gradient-to-b from-transparent via-background/80 to-background" />

            {/* Hero Section */}
            <header className="pt-20 pb-10 px-6 text-center relative z-10">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-4xl bg-primary/10 blur-[120px] rounded-full z-[-1]" />

                <span className="inline-block py-1 px-3 rounded-full bg-white/5 border border-white/10 text-secondary text-xs font-bold tracking-widest mb-4">
                    TABACARIA PREMIUM
                </span>

                <h1 className="text-5xl md:text-7xl font-display font-bold text-white mb-6 tracking-tight leading-tight">
                    SESSÕES DE <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary animate-pulse">
                        OUTRO MUNDO
                    </span>
                </h1>

                <p className="text-slate-300 text-lg max-w-lg mx-auto mb-8 leading-relaxed">
                    Os melhores kits, essências e acessórios para o seu setup.
                    Entrega rápida e qualidade garantida.
                </p>

                <Link
                    href="/catalogo"
                    className="inline-block bg-primary hover:bg-primary/90 text-white font-bold py-4 px-8 rounded-full shadow-[0_0_30px_rgba(255,0,127,0.4)] transition-all hover:scale-105 active:scale-95"
                >
                    VER CATÁLOGO
                </Link>
            </header>

            {/* Bento Grid Layout */}
            <section className="container mx-auto px-4 mt-12">
                <h2 className="text-2xl font-display font-bold text-white mb-8 flex items-center gap-2">
                    <span className="w-2 h-8 bg-secondary rounded-full" />
                    Destaques
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10 auto-rows-[minmax(180px,auto)]" suppressHydrationWarning>

                    {/* Featured Item (Large) */}
                    {/* Featured Item (Large) */}
                    {(() => {
                        const featuredProduct = formattedProducts.find((p: Product) => p.featured) || formattedProducts[0]; // Fallback to first if none featured

                        if (!featuredProduct) return null;

                        return (
                            <div className="col-span-1 md:col-span-2 row-span-2 relative group overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 flex flex-col justify-end min-h-[400px]">
                                <div className="relative z-20">
                                    <span className="bg-primary text-white text-xs font-bold px-3 py-1 rounded-full mb-2 inline-block">
                                        DESTAQUE DA SEMANA
                                    </span>
                                    <h2 className="text-3xl font-bold text-white mb-2">{featuredProduct.name}</h2>
                                    <p className="text-gray-300 mb-4 max-w-sm line-clamp-2">
                                        {featuredProduct.description || "O melhor produto para o seu setup está aqui. Qualidade garantida Skybox."}
                                    </p>
                                    <Link href={`/catalogo?search=${featuredProduct.name}`} className="inline-block bg-white text-black font-bold py-3 px-6 rounded-xl hover:bg-gray-200 transition-colors">
                                        Ver Detalhes
                                    </Link>
                                </div>
                                {/* Featured Image */}
                                <div
                                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105 z-10 opacity-60 group-hover:opacity-100"
                                    style={{ backgroundImage: `url('${featuredProduct.image || "https://images.unsplash.com/photo-1618331835717-801e976710b2?auto=format&fit=crop&q=80&w=1000"}')` }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent z-10" />
                            </div>
                        );
                    })()}

                    {/* Product Cards */}
                    {formattedProducts
                        .filter((p: Product) => !p.featured) // Exclude featured product from grid
                        .map((product, index) => (
                            <ProductCard
                                key={product.id}
                                product={product}
                                priority={index < 2}
                                className={index === 0 || index === 3 ? "md:col-span-1 md:row-span-1" : ""}
                            />
                        ))}

                    {/* Category Prompt */}
                    <Link href="/catalogo" className="col-span-1 md:col-span-1 row-span-1 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center p-6 text-center hover:bg-white/10 hover:border-primary/50 transition-all cursor-pointer group">
                        <div>
                            <h3 className="text-white font-bold text-xl group-hover:scale-105 transition-transform flex items-center justify-center gap-2">
                                Ver Catálogo Completo
                                <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
                            </h3>
                        </div>
                    </Link>

                </div>
            </section>

        </main>
    );
}
