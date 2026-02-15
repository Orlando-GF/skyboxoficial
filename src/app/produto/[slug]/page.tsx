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
import ProductView from "@/components/ProductView";

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
                <ProductView product={product} kitItemsData={kitItemsData} />
            </div>
        </main>
    );
}
