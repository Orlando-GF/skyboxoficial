import { createClient } from "@/utils/supabase/server";
import LandingPage from "@/components/LandingPage";

export const revalidate = 0; // Force dynamic fetch to clear old cached image URLs

export default async function Home() {
  const supabase = await createClient();
  const { data: products } = await supabase.from("products").select("*").order('price', { ascending: false });

  return <LandingPage products={products || []} />;
}
