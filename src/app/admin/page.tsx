import { createClient } from "@/utils/supabase/server";
import DashboardClient from "./dashboard/DashboardClient";

export const revalidate = 60; // Revalidate every minute

export default async function DashboardPage() {
    const supabase = await createClient();

    // 1. Get WhatsApp Clicks (Total Events)
    const { count: whatsappClicks } = await supabase
        .from("events")
        .select("*", { count: "exact", head: true })
        .eq("type", "whatsapp_click");

    // 2. Get Out of Stock Products
    const { count: outOfStock } = await supabase
        .from("products")
        .select("*", { count: "exact", head: true })
        .eq("stock", false);

    // 3. Get Most Desired Product (Mock logic for now, or aggregate if possible)
    // In a real scenario, use an RPC function or group by query.
    // For now, let's just get the most recent clicked product name
    const { data: recentEvents } = await supabase
        .from("events")
        .select("products(name)")
        .eq("type", "whatsapp_click")
        .order("created_at", { ascending: false })
        .limit(1);

    const productData = recentEvents?.[0]?.products as any;
    const mostDesired = Array.isArray(productData) ? productData[0]?.name : productData?.name || "Nenhum ainda";

    // 4. Chart Data: Mock for now, or aggregate by hour
    // To do this properly in Supabase without RPC is hard. Mocking the chart structure first.
    const chartData = [
        { hour: "08h", clicks: 2 },
        { hour: "10h", clicks: 5 },
        { hour: "12h", clicks: 8 }, // Lunch time
        { hour: "14h", clicks: 3 },
        { hour: "16h", clicks: 6 },
        { hour: "18h", clicks: 12 }, // After work
        { hour: "20h", clicks: 15 }, // Night session
        { hour: "22h", clicks: 9 },
    ];

    return (
        <DashboardClient
            metrics={{
                whatsappClicks: whatsappClicks || 0,
                outOfStock: outOfStock || 0,
                mostDesired: String(mostDesired)
            }}
            chartData={chartData}
        />
    );
}
