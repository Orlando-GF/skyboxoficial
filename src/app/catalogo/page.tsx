export const runtime = 'edge';
import { createClient } from "@/utils/supabase/server";
import CatalogClient from "@/components/CatalogClient";
import Background from "@/components/Background";

export const revalidate = 0; // Force dynamic fetch to clear old cached image URLs

export default async function CatalogPage() {
    const supabase = await createClient();

    // Fetch products and categories in parallel
    const [productsResponse, categoriesResponse] = await Promise.all([
        supabase.from("products").select("*").order('created_at', { ascending: false }),
        supabase.from("categories").select("name").order('name', { ascending: true })
    ]);

    const { data: products } = productsResponse;
    const { data: categoriesData } = categoriesResponse;

    // Extract names and ensure "Todos" logic is handled in the client
    const dynamicCategories = categoriesData?.map(c => c.name) || [];

    return (
        <main className="min-h-screen pt-24 pb-20 relative">
            <Background />

            <div className="relative z-10">
                <CatalogClient
                    initialProducts={products || []}
                    categories={dynamicCategories}
                />
            </div>
        </main>
    );
}
