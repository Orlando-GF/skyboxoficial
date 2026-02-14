import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { formatBRL } from "@/utils/format";
import AddToCartButton from "@/components/AddToCartButton";
import { Badge } from "@/components/ui/badge";
import { Plus, ArrowLeft } from "lucide-react";
import { Metadata } from "next";
import Background from "@/components/Background";

export const runtime = 'edge';

interface ProductPageProps {
    params: Promise<{ slug: string }>;
}

async function getProduct(id: string) {
    const supabase = await createClient();
    const { data: product } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .single();

    return product;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
    const { slug } = await params;
    const product = await getProduct(slug);

    if (!product) return {};

    const cityName = "São Paulo"; // Default city or geo logic placeholder

    return {
        title: `${product.name} | Skybox Tabacaria`,
        description: product.seo_description || `Compre ${product.name} na Skybox Tabacaria. Entregamos Narguile, Essência e Acessórios.`,
        openGraph: {
            title: `${product.name} | Skybox Tabacaria`,
            description: product.seo_description || `Confira ${product.name} e outros produtos premium.`,
            images: [product.image],
        },
    };
}

export default async function ProductPage({ params }: ProductPageProps) {
    const { slug } = await params;
    const product = await getProduct(slug);

    if (!product) {
        notFound();
    }

    let kitItemsData: { id: string; name: string; price: number }[] = [];
    if (product.is_kit && product.kit_items && product.kit_items.length > 0) {
        const supabase = await createClient();
        // kit_items is text[] of IDs based on my insert
        const { data: items } = await supabase
            .from("products")
            .select("id, name, price")
            .in("id", product.kit_items);
        kitItemsData = items || [];
    }

    // Calculate "De" price for Kits
    const kitOriginalPrice = kitItemsData.reduce((acc, item) => acc + Number(item.price), 0);
    const isKitCheck = product.is_kit && kitItemsData.length > 0;

    // "De" price for individual products
    const individualOriginalPrice = Number(product.original_price) || 0;
    const isIndividualDiscount = !isKitCheck && individualOriginalPrice > Number(product.price);

    const finalOriginalPrice = isKitCheck ? kitOriginalPrice : individualOriginalPrice;
    const hasDiscount = isKitCheck || isIndividualDiscount;

    return (
        <main className="min-h-screen pt-32 pb-20 bg-transparent relative overflow-hidden">
            <Background />

            <div className="container mx-auto px-4 z-10 relative">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-white">
                    {/* Image Section */}
                    <div className="relative aspect-square border-2 border-white/10 bg-white/5 group">
                        {product.image ? (
                            <Image
                                src={product.image}
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

                            {/* Tactical Description (Short) */}
                            {product.seo_description && (
                                <p className="text-sm text-slate-400 leading-relaxed max-w-md border-l-2 border-primary/50 pl-4 py-1 italic">
                                    "{product.seo_description}"
                                </p>
                            )}
                        </div>

                        {/* Price Section */}
                        <div className="border-y-2 border-white/10 py-6">
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
                            <p className={`text-4xl font-mono font-bold ${hasDiscount ? 'text-primary' : 'text-primary'}`}>
                                {hasDiscount && "POR: "} {formatBRL(product.price)}
                            </p>
                        </div>

                        {/* Kit Items List */}
                        {isKitCheck && (
                            <div className="bg-white/5 p-6 border border-white/10">
                                <h3 className="text-sm font-bold uppercase tracking-widest mb-4 text-primary">O que vem no kit:</h3>
                                <ul className="space-y-3">
                                    {kitItemsData.map((item, index) => (
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

                        {/* Actions moved up */}
                        <div className="mt-4">
                            <AddToCartButton product={product} />
                        </div>

                        {/* Description */}
                        {/* Full Description */}
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
            </div>
        </main>
    );
}
