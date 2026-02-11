import { createClient } from "@/utils/supabase/server";
import CatalogClient from "@/components/CatalogClient";

export const revalidate = 0; // Force dynamic fetch to clear old cached image URLs

export default async function CatalogPage() {
    const supabase = await createClient();
    const { data: products } = await supabase.from("products").select("*").order('created_at', { ascending: false });

    return (
        <main className="min-h-screen pt-24 pb-20 relative bg-[#050510]">
            {/* Background */}
            <div className="fixed inset-0 z-0 bg-[url('https://images.unsplash.com/photo-1618331835717-801e976710b2?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-center opacity-10 pointer-events-none" />

            <div className="relative z-10">
                <CatalogClient initialProducts={products || []} />
            </div>
        </main>
    );
}
