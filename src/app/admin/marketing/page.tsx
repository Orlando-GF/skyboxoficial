"use client";
export const runtime = 'edge';

import { Link as LinkIcon, Copy, Check, History, QrCode, Trash } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

type LinkHistory = {
    campaign: string;
    source: string;
    url: string;
    date: string;
};

export default function MarketingPage() {
    const [campaign, setCampaign] = useState("");
    const [generatedLink, setGeneratedLink] = useState("");
    const [copied, setCopied] = useState(false);
    const [source, setSource] = useState("instagram");
    const [history, setHistory] = useState<LinkHistory[]>([]);

    useEffect(() => {
        const saved = localStorage.getItem("skybox_link_history");
        if (saved) {
            setHistory(JSON.parse(saved));
        }
    }, []);

    const saveToHistory = (newLink: LinkHistory) => {
        const updated = [newLink, ...history].slice(0, 5);
        setHistory(updated);
        localStorage.setItem("skybox_link_history", JSON.stringify(updated));
    };

    const deleteFromHistory = (index: number) => {
        const updated = history.filter((_, i) => i !== index);
        setHistory(updated);
        localStorage.setItem("skybox_link_history", JSON.stringify(updated));
        toast.success("Item removido do histórico.");
    };

    const loadFromHistory = (item: LinkHistory) => {
        setCampaign(item.campaign);
        setSource(item.source);
        setGeneratedLink(item.url);
        toast.success("Campanha carregada!");
    };

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

        saveToHistory({
            campaign: campaign,
            source: source,
            url: link,
            date: new Date().toLocaleDateString('pt-BR')
        });

        toast.success("Link gerado e salvo!");
    };

    const copyToClipboard = (text: string) => {
        if (!text) return;
        navigator.clipboard.writeText(text);
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
                                <Button size="icon" variant="ghost" onClick={() => copyToClipboard(generatedLink)} className="hover:bg-primary hover:text-black transition-all rounded-none ml-2 shrink-0">
                                    {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Right Column: History & QR Code */}
                <div className="space-y-6">
                    {/* QR Code Section - Shows only when link is generated */}
                    {generatedLink ? (
                        <Card className="bg-black border-2 border-primary/20 rounded-none animate-in fade-in slide-in-from-right-4">
                            <CardHeader className="p-6 border-b-2 border-primary/10">
                                <CardTitle className="flex items-center gap-4 text-primary font-display uppercase tracking-tighter text-lg">
                                    <QrCode className="w-5 h-5" />
                                    QR Code Gerado
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="flex flex-col items-center justify-center p-8 gap-6">
                                <div className="bg-white p-4 rounded-none">
                                    <img
                                        src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(generatedLink)}`}
                                        alt="QR Code da Campanha"
                                        className="w-40 h-40 mix-blend-multiply"
                                    />
                                </div>
                                <p className="text-[10px] uppercase font-bold tracking-widest text-white/40 text-center">
                                    Escaneie para testar o rastreamento
                                </p>
                            </CardContent>
                        </Card>
                    ) : (
                        <Card className="bg-black border-2 border-white/5 border-dashed flex items-center justify-center p-6 rounded-none h-[300px]">
                            <p className="text-white/10 text-[10px] uppercase font-bold tracking-[0.3em] text-center italic">
                                Gere um link para ver o QR Code...
                            </p>
                        </Card>
                    )}

                    {/* History Section */}
                    {history.length > 0 && (
                        <Card className="bg-black border-2 border-white/5 rounded-none">
                            <CardHeader className="p-6 border-b-2 border-white/5">
                                <CardTitle className="flex items-center gap-4 text-white font-display uppercase tracking-tighter text-lg">
                                    <History className="w-5 h-5 text-slate-500" />
                                    Últimos Links
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-0">
                                {history.map((item, i) => (
                                    <div
                                        key={i}
                                        onClick={() => loadFromHistory(item)}
                                        className="flex items-center justify-between p-4 border-b border-white/5 hover:bg-white/5 transition-colors group cursor-pointer"
                                    >
                                        <div className="flex flex-col gap-2 overflow-hidden w-full mr-4">
                                            <div className="flex items-center justify-between w-full">
                                                <div className="flex items-center gap-2">
                                                    <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 rounded-none text-[9px] font-black uppercase tracking-widest px-1.5 py-0.5 h-auto">
                                                        {item.source}
                                                    </Badge>
                                                    <span className="text-[9px] font-bold uppercase tracking-widest text-slate-500">{item.date}</span>
                                                </div>
                                            </div>

                                            <div className="flex flex-col gap-1">
                                                <span className="text-xs font-bold text-white uppercase tracking-wider truncate">{item.campaign}</span>
                                                <code className="text-[10px] text-primary font-mono truncate bg-primary/5 px-1 py-0.5 rounded-none border border-primary/10 block w-full">
                                                    {item.url}
                                                </code>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                onClick={(e) => { e.stopPropagation(); copyToClipboard(item.url); }}
                                                className="hover:bg-primary hover:text-black rounded-none w-8 h-8"
                                            >
                                                <Copy className="w-4 h-4" />
                                            </Button>
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                onClick={(e) => { e.stopPropagation(); deleteFromHistory(i); }}
                                                className="hover:bg-red-600 hover:text-white text-white/20 rounded-none w-8 h-8"
                                            >
                                                <Trash className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
}
