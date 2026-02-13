export const runtime = 'edge';
import { createClient } from "@/utils/supabase/server";
import CatalogClient from "@/components/CatalogClient";

export const revalidate = 0; // Force dynamic fetch to clear old cached image URLs

export default async function CatalogPage() {
    const supabase = await createClient();
    const { data: products } = await supabase.from("products").select("*").order('created_at', { ascending: false });

    return (
        <main className="min-h-screen pt-24 pb-20 relative bg-background">
            {/* Background - Obsidian Deep Pure */}
            <div className="fixed inset-0 z-0 bg-background pointer-events-none" />
            {/* Subtle Noise/Texture Overlay (Matches Home) */}
            <div className="fixed inset-0 z-0 opacity-20 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

            <div className="relative z-10">
                <CatalogClient initialProducts={products || []} />
            </div>
        </main>
    );
}
