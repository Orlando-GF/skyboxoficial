import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
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

    const title = product.seo_title || `${product.name} | Skybox Tabacaria`;

    return {
        title: title,
        description: product.seo_description || `Compre ${product.name} na Skybox Tabacaria. Entregamos Narguile, Essência e Acessórios.`,
        openGraph: {
            title: title,
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

    return (
        <main className="min-h-screen pt-32 pb-20 bg-transparent relative overflow-hidden">
            <Background />

            <div className="container mx-auto px-4 z-10 relative">
                <ProductView product={product} kitItemsData={kitItemsData} />
            </div>
        </main>
    );
}
