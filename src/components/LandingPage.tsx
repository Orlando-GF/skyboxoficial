"use client";

import { Product } from "@/types";
import ProductCard from "@/components/ProductCard";
import Link from "next/link";
import { DEFAULT_IMAGES } from "@/constants";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

interface LandingPageProps {
    products: Product[];
}

export default function LandingPage({ products }: LandingPageProps) {
    // Map Supabase product to Product structure and identify featured
    const formattedProducts = products.map(p => ({
        ...p,
        price: Number(p.price)
    }));

    const searchParams = useSearchParams();
    const supabase = createClient();

    useEffect(() => {
        const utmSource = searchParams.get("utm_source");
        const utmCampaign = searchParams.get("utm_campaign");

        if (utmSource || utmCampaign) {
            // Record campaign visit event
            supabase.from("events").insert({
                type: "campaign_visit",
                metadata: {
                    source: utmSource || "direct",
                    campaign: utmCampaign || "unnamed",
                    url: window.location.href
                }
            }).then(({ error }) => {
                if (error) console.error("Erro ao registrar telemetria de marketing:", error);
            });
        }
    }, [searchParams, supabase]);

    const featuredProduct = formattedProducts.find(p => p.featured) || formattedProducts[0];
    const otherProducts = formattedProducts.filter(p => p.id !== featuredProduct?.id);

    return (
        <main className="min-h-screen pb-24 relative overflow-x-hidden" suppressHydrationWarning>
            {/* Background Ambience - Obsidian Deep Pure */}
            <div className="fixed inset-0 z-[-1] bg-background" />

            {/* Subtle Noise/Texture Overlay for Industrial Feel (Optional, using CSS instead of image for now) */}
            <div className="fixed inset-0 z-[-1] opacity-20 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

            {/* Hero Section - Radical Asymmetric */}
            <header className="pt-32 pb-20 px-6 relative z-10 container mx-auto flex flex-col items-start text-left">
                <div className="absolute top-0 right-0 w-1/2 h-full z-[-1] border-l border-white/5 overflow-hidden">
                    {/* Digital Smoke / Tech Atmosphere */}
                    <div className="absolute inset-0 bg-black" />
                    <div className="absolute inset-0 opacity-30 bg-primary/20 mix-blend-screen" />

                    {/* Animated Glows */}
                    <div
                        className="absolute inset-[-100%] opacity-20 pointer-events-none"
                        style={{
                            background: 'radial-gradient(circle at center, #bef264 0%, transparent 70%)',
                            filter: 'blur(80px)',
                            animation: 'pulse 8s infinite alternate'
                        }}
                    />

                    {/* Scanlines / Grid Detail */}
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%] pointer-events-none opacity-40" />

                    {/* Digital Noise Filter Overlay */}
                    <svg className="absolute inset-0 w-full h-full opacity-10 mix-blend-overlay">
                        <filter id="noise">
                            <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
                        </filter>
                        <rect width="100%" height="100%" filter="url(#noise)" />
                    </svg>
                </div>

                <span className="inline-block py-2 px-4 bg-primary text-black text-[10px] font-bold tracking-[0.3em] uppercase mb-8">
                    SKYBOX PROTOCOL v2.0
                </span>

                <h1 className="text-6xl md:text-9xl font-display font-bold text-white mb-8 tracking-tighter leading-[0.85] uppercase">
                    SESSÕES<br />
                    <span className="text-primary italic">DE OUTRO</span><br />
                    MUNDO
                </h1>

                <div className="flex flex-col md:flex-row gap-8 items-start mb-12">
                    <p className="text-slate-400 text-base max-w-md leading-relaxed border-l-2 border-primary pl-6">
                        Desafiando o convencional. Kits exclusivos, essências premium
                        e curadoria técnica para quem não aceita o básico.
                    </p>

                    <Link
                        href="/catalogo"
                        className="bg-white text-black font-bold py-5 px-10 border-2 border-white hover:bg-primary hover:border-primary hover:text-black transition-all uppercase tracking-widest text-sm"
                    >
                        EXPLORAR SISTEMA
                    </Link>
                </div>
            </header>

            {/* Bento Grid Layout */}
            <section className="container mx-auto px-4 mt-12">
                <h2 className="text-3xl font-display font-bold text-white mb-12 flex items-center gap-4 uppercase tracking-tighter">
                    <span className="text-primary">{"//"}</span>
                    Destaques Técnicos
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10 auto-rows-[minmax(180px,auto)]" suppressHydrationWarning>

                    {/* Featured Item (Brutalist) */}
                    {featuredProduct && (
                        <div className="col-span-1 md:col-span-2 row-span-2 relative group overflow-hidden border-2 border-white/10 bg-black p-10 flex flex-col justify-end min-h-[500px]">
                            <div className="relative z-20">
                                <span className="bg-primary text-black text-[10px] font-bold px-3 py-1 mb-4 inline-block uppercase tracking-wider">
                                    TOP SELECTION
                                </span>
                                <h2 className="text-5xl font-bold text-white mb-4 uppercase tracking-tighter leading-none">{featuredProduct.name}</h2>
                                <p className="text-slate-400 mb-8 max-w-sm line-clamp-3 text-sm">
                                    {featuredProduct.description || "Performance extrema e estética industrial. O supra-sumo da categoria Skybox."}
                                </p>
                                <Link href={`/catalogo?search=${featuredProduct.name}`} className="inline-block bg-primary text-black font-bold py-4 px-8 hover:bg-white transition-colors uppercase text-xs tracking-widest">
                                    DETALHAR PRODUTO
                                </Link>
                            </div>
                            <div
                                className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-110 z-10 opacity-40 group-hover:opacity-70 grayscale hover:grayscale-0"
                                style={{ backgroundImage: `url('${featuredProduct.image || DEFAULT_IMAGES.PRODUCT_PLACEHOLDER}')` }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent z-10" />
                        </div>
                    )}

                    {/* Product Cards */}
                    {otherProducts.map((product, index) => (
                        <ProductCard
                            key={product.id}
                            product={product}
                            priority={index < 2}
                            className={index === 0 || index === 3 ? "md:col-span-1 md:row-span-1" : ""}
                        />
                    ))}

                    {/* Category Prompt (Brutalist) */}
                    <Link href="/catalogo" className="col-span-1 md:col-span-1 row-span-1 bg-black border-2 border-white/5 flex items-center justify-center p-6 text-center hover:border-primary transition-all cursor-pointer group relative overflow-hidden">
                        <div className="absolute inset-0 bg-primary/5 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                        <div className="relative z-10">
                            <h3 className="text-white font-bold text-xl uppercase tracking-tighter group-hover:text-primary transition-colors flex items-center justify-center gap-3">
                                FULL SYSTEM
                                <span className="inline-block transition-transform group-hover:translate-x-2">[→]</span>
                            </h3>
                        </div>
                    </Link>

                </div>
            </section>

        </main>
    );
}
