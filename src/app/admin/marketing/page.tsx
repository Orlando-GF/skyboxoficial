"use client";
export const runtime = 'edge';

import { Link as LinkIcon, Copy, Check } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

export default function MarketingPage() {
    const [campaign, setCampaign] = useState("");
    const [generatedLink, setGeneratedLink] = useState("");
    const [copied, setCopied] = useState(false);
    const [source, setSource] = useState("instagram");

    const getBaseUrl = () => {
        if (typeof window !== "undefined") {
            return window.location.origin;
        }
        return "https://tabacariaskybox.com.br";
    };

    const generateLink = () => {
        if (!campaign) {
            toast.error("Digite o nome da campanha.");
            return;
        }
        // Example: ?utm_source=instagram&utm_campaign=verao2026
        const baseUrl = getBaseUrl();
        const link = `${baseUrl}?utm_source=${source}&utm_campaign=${campaign.toLowerCase().replace(/\s+/g, '-')}`;
        setGeneratedLink(link);
        toast.success("Link gerado!");
    };

    const copyToClipboard = () => {
        if (!generatedLink) return;
        navigator.clipboard.writeText(generatedLink);
        setCopied(true);
        toast.success("Copiado para a área de transferência!");
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-4xl font-display font-bold tracking-tighter text-white uppercase mt-2">Marketing & Leads</h2>
                <p className="text-[10px] uppercase font-bold tracking-[0.2em] text-primary/60 mt-2">Geração de Tráfego Rastreado</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-black border-2 border-white/5 rounded-none group hover:border-primary/50 transition-colors">
                    <CardHeader className="p-8 border-b-2 border-white/5">
                        <CardTitle className="flex items-center gap-4 text-primary font-display uppercase tracking-tighter text-xl">
                            <LinkIcon className="w-6 h-6 text-primary group-hover:scale-110 transition-transform" />
                            Gerador de Links
                        </CardTitle>
                        <CardDescription className="text-[10px] uppercase font-bold tracking-widest text-primary/40 pt-2">
                            PROTOCOL_DARK_MARKETING: Rastreamento de Conversão.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-4">
                            <Label className="text-[10px] font-bold uppercase tracking-widest text-primary">Canal de Tráfego</Label>
                            <div className="flex flex-wrap gap-2">
                                {["instagram", "whatsapp", "google", "tiktok", "facebook"].map((s) => (
                                    <button
                                        key={s}
                                        onClick={() => setSource(s)}
                                        className={`px-4 py-2 text-[9px] font-black uppercase tracking-widest border-2 transition-all ${source === s ? "bg-primary text-black border-primary" : "bg-black text-white/40 border-white/10 hover:border-primary/50"}`}
                                    >
                                        {s}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-4 pt-2">
                            <Label className="text-[10px] font-bold uppercase tracking-widest text-primary">Codinome da Campanha</Label>
                            <Input
                                placeholder="EX: PROMO-VERAO"
                                value={campaign}
                                onChange={(e) => setCampaign(e.target.value)}
                                className="bg-black border-2 border-white/10 text-white rounded-none h-14 focus:border-primary transition-all uppercase text-xs tracking-widest"
                            />
                        </div>
                        <Button onClick={generateLink} className="w-full bg-primary hover:bg-white text-black font-black py-8 rounded-none uppercase tracking-[0.2em] text-xs transition-all">
                            Sincronizar Campanha
                        </Button>

                        {generatedLink && (
                            <div className="p-4 bg-primary/5 rounded-none border-2 border-primary/20 flex items-center justify-between mt-6">
                                <code className="text-xs text-primary font-mono tracking-tighter break-all">{generatedLink}</code>
                                <Button size="icon" variant="ghost" onClick={copyToClipboard} className="hover:bg-primary hover:text-black transition-all rounded-none ml-2 shrink-0">
                                    {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Future: Banner Generator or CRM integration */}
                <Card className="bg-black border-2 border-white/5 border-dashed flex items-center justify-center p-6 rounded-none">
                    <p className="text-white/10 text-[10px] uppercase font-bold tracking-[0.3em] text-center italic">
                        PROTOCOL_RESERVED: Módulos Adicionais em Breve...
                    </p>
                </Card>
            </div>
        </div>
    );
}
