import Link from "next/link";
import { Instagram, Facebook, MapPin, Clock, Phone } from "lucide-react";
import { createClient } from "@/utils/supabase/server";
import { LINKS } from "@/constants";

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
        <footer className="relative z-50 bg-black border-t-2 border-primary/20 pt-20 pb-12" suppressHydrationWarning>
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">

                    {/* Brand & Socials */}
                    <div className="flex flex-col items-center md:items-start text-center md:text-left">
                        <h2 className="text-2xl font-display font-bold text-white mb-4 uppercase tracking-tight">{store.name}</h2>
                        <p className="text-primary/40 text-[10px] font-bold uppercase tracking-[0.2em] max-w-xs mb-6 leading-relaxed">
                            A melhor experiência em tabacaria da região.
                            Produtos premium e atendimento exclusivo.
                        </p>
                        <div className="flex gap-2">
                            <a href={store.instagram} target="_blank" rel="noopener noreferrer" aria-label="Acessar nosso Instagram" className="bg-black border border-white/10 hover:bg-primary hover:text-black transition-all text-primary/40 hover:border-primary p-4">
                                <Instagram className="w-5 h-5" />
                            </a>
                            <a href={store.facebook} target="_blank" rel="noopener noreferrer" aria-label="Acessar nosso Facebook" className="bg-black border border-white/10 hover:bg-primary hover:text-black transition-all text-primary/40 hover:border-primary p-4">
                                <Facebook className="w-5 h-5" />
                            </a>
                            <a href={`${LINKS.WHATSAPP_BASE}${store.whatsapp}`} target="_blank" rel="noopener noreferrer" aria-label="Falar conosco via WhatsApp" className="bg-black border border-white/10 hover:bg-primary hover:text-black transition-all text-primary/40 hover:border-primary p-4">
                                <Phone className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    {/* Location */}
                    <div className="flex flex-col items-center md:items-start text-center md:text-left">
                        <div className="md:w-auto">
                            <h3 className="text-xl font-display font-bold text-white mb-4 flex items-center gap-2 justify-center md:justify-start uppercase tracking-tight">
                                <MapPin className="w-5 h-5 text-primary" />
                                Localização
                            </h3>
                            <p className="text-primary/60 text-[10px] mb-4 max-w-xs font-bold uppercase tracking-[0.2em] leading-relaxed">
                                {store.address}
                            </p>
                            <a
                                href={store.maps}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary text-[10px] hover:underline font-bold uppercase tracking-widest"
                            >
                                Ver no Google Maps &rarr;
                            </a>
                        </div>
                    </div>

                    {/* Hours */}
                    <div className="flex flex-col items-center md:items-start text-center md:text-left">
                        <div className="md:w-auto">
                            <h3 className="text-xl font-display font-bold text-white mb-4 flex items-center gap-2 justify-center md:justify-start uppercase tracking-tight">
                                <Clock className="w-5 h-5 text-primary" />
                                Horários
                            </h3>
                            <ul className="text-primary/60 text-[10px] space-y-2 font-bold uppercase tracking-[0.2em] leading-relaxed">
                                <li className="flex justify-between gap-8 min-w-[12rem]">
                                    <span>{store.hours.weekdays.label}</span>
                                    <span className="text-white">{store.hours.weekdays.time}</span>
                                </li>
                                <li className="flex justify-between gap-8 min-w-[12rem]">
                                    <span>{store.hours.saturday.label}</span>
                                    <span className="text-white">{store.hours.saturday.time}</span>
                                </li>
                                <li className="flex justify-between gap-8 min-w-[12rem]">
                                    <span>{store.hours.sunday.label}</span>
                                    <span className="text-white">{store.hours.sunday.time}</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                </div>

                <div className="border-t border-white/5 pt-8 text-center flex flex-col items-center gap-2">
                    <p className="text-xs text-primary/40 font-bold uppercase tracking-wider">
                        © 2026 {store.name}. Todos os direitos reservados.
                        {config?.cnpj && <span className="block mt-1">CNPJ: {config.cnpj}</span>}
                    </p>
                    <div className="flex gap-4 justify-center">
                        <Link href="/termos" target="_blank" rel="noopener noreferrer" className="text-[10px] text-primary/40 hover:text-primary transition-colors uppercase tracking-wider font-bold">
                            Termos de Uso
                        </Link>
                        <Link href="/login" target="_blank" rel="noopener noreferrer" className="text-[10px] text-primary/40 hover:text-primary transition-colors uppercase tracking-wider font-bold">
                            Área Administrativa
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
