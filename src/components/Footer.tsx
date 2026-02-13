import Link from "next/link";
import { Instagram, Facebook, MapPin, Clock, Phone } from "lucide-react";
import { createClient } from "@/utils/supabase/server";

export default async function Footer() {
    const supabase = await createClient();
    const { data: config } = await supabase.from("store_settings").select("*").single();

    // Default fallbacks if DB is empty for some reason
    const store = {
        name: config?.store_name || "Tabacaria Skybox",
        address: config?.address || "Endereço não configurado",
        whatsapp: config?.whatsapp_number || "5511999999999",
        instagram: config?.instagram_url || "#",
        facebook: config?.facebook_url || "#",
        maps: config?.google_maps_url || "#",
        hours: {
            weekdays: { label: config?.label_weekdays || "Seg - Qui", time: config?.hours_weekdays || "10:00 - 22:00" },
            saturday: { label: config?.label_saturday || "Sex - Sáb", time: config?.hours_saturday || "10:00 - 00:00" },
            sunday: { label: config?.label_sunday || "Domingo", time: config?.hours_sunday || "14:00 - 20:00" }
        }
    };

    return (
        <footer className="bg-background/80 backdrop-blur-xl border-t border-white/10 pt-16 pb-8" suppressHydrationWarning>
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">

                    {/* Brand & Socials */}
                    <div className="flex flex-col items-center md:items-start text-center md:text-left">
                        <h2 className="text-3xl font-display font-bold text-white mb-4">{store.name}</h2>
                        <p className="text-slate-300 text-sm max-w-xs mb-6">
                            A melhor experiência em tabacaria da região.
                            Produtos premium e atendimento exclusivo.
                        </p>
                        <div className="flex gap-4">
                            <a href={store.instagram} target="_blank" rel="noopener noreferrer" className="bg-white/5 p-3 rounded-full hover:bg-gradient-to-br hover:from-[#833ab4] hover:via-[#fd1d1d] hover:to-[#fcb045] hover:text-white transition-colors text-slate-400">
                                <Instagram className="w-5 h-5" />
                            </a>
                            <a href={store.facebook} target="_blank" rel="noopener noreferrer" className="bg-white/5 p-3 rounded-full hover:bg-blue-600 hover:text-white transition-colors text-slate-400">
                                <Facebook className="w-5 h-5" />
                            </a>
                            <a href={`https://wa.me/${store.whatsapp}`} target="_blank" rel="noopener noreferrer" className="bg-white/5 p-3 rounded-full hover:bg-green-500 hover:text-white transition-colors text-slate-400">
                                <Phone className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    {/* Location */}
                    <div className="flex flex-col items-center text-center md:text-left">
                        <div className="md:w-auto">
                            <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2 justify-center md:justify-start">
                                <MapPin className="w-5 h-5 text-primary" />
                                Localização
                            </h3>
                            <p className="text-slate-300 text-sm mb-4 max-w-xs">
                                {store.address}
                            </p>
                            <a
                                href={store.maps}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary text-sm hover:underline"
                            >
                                Ver no Google Maps &rarr;
                            </a>
                        </div>
                    </div>

                    {/* Hours */}
                    <div className="flex flex-col items-center md:items-end text-center md:text-left">
                        <div className="md:w-auto">
                            <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2 justify-center md:justify-start">
                                <Clock className="w-5 h-5 text-primary" />
                                Horários
                            </h3>
                            <ul className="text-slate-300 text-sm space-y-2">
                                <li className="flex justify-between gap-12 min-w-[12rem]">
                                    <span>{store.hours.weekdays.label}</span>
                                    <span className="text-white">{store.hours.weekdays.time}</span>
                                </li>
                                <li className="flex justify-between gap-12 min-w-[12rem]">
                                    <span>{store.hours.saturday.label}</span>
                                    <span className="text-white">{store.hours.saturday.time}</span>
                                </li>
                                <li className="flex justify-between gap-12 min-w-[12rem]">
                                    <span>{store.hours.sunday.label}</span>
                                    <span className="text-white">{store.hours.sunday.time}</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                </div>

                <div className="border-t border-white/5 pt-8 text-center flex flex-col items-center gap-2">
                    <p className="text-xs text-slate-500">
                        © 2026 {store.name}. Todos os direitos reservados.
                        {config?.cnpj && <span className="block mt-1">CNPJ: {config.cnpj}</span>}
                    </p>
                    <div className="flex gap-4 justify-center">
                        <Link href="/termos" target="_blank" rel="noopener noreferrer" className="text-[10px] text-slate-700 hover:text-primary transition-colors">
                            Termos de Uso
                        </Link>
                        <Link href="/login" target="_blank" rel="noopener noreferrer" className="text-[10px] text-slate-700 hover:text-primary transition-colors">
                            Área Administrativa
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
