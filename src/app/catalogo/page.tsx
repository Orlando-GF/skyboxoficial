export const runtime = 'edge';
import { createClient } from "@/utils/supabase/server";
import CatalogClient from "@/components/CatalogClient";
import Background from "@/components/Background";

export const revalidate = 0; // Force dynamic fetch to clear old cached image URLs

export default async function CatalogPage() {
    const supabase = await createClient();
    const { data: products } = await supabase.from("products").select("*").order('created_at', { ascending: false });

    return (
        <main className="min-h-screen pt-24 pb-20 relative">
            <Background />

            <div className="relative z-10">
                <CatalogClient initialProducts={products || []} />
            </div>
        </main>
    );
}
