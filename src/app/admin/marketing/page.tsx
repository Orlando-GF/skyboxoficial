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
    const [baseUrl, setBaseUrl] = useState("https://tabacariaskybox.com.br"); // In prod use real env
    const [campaign, setCampaign] = useState("");
    const [generatedLink, setGeneratedLink] = useState("");
    const [copied, setCopied] = useState(false);

    const generateLink = () => {
        if (!campaign) {
            toast.error("Digite o nome da campanha.");
            return;
        }
        // Example: ?utm_source=instagram&utm_campaign=verao2026
        const link = `${baseUrl}?utm_source=instagram&utm_campaign=${campaign.toLowerCase().replace(/\s+/g, '-')}`;
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
                <h2 className="text-3xl font-bold font-display tracking-tight text-white">Marketing</h2>
                <p className="text-slate-400">Ferramentas para impulsionar suas vendas.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-slate-900 border-slate-800">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-white">
                            <LinkIcon className="w-5 h-5 text-primary" />
                            Gerador de Links (Dark Marketing)
                        </CardTitle>
                        <CardDescription>
                            Crie links rastreáveis para campanhas no Instagram/WhatsApp.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label className="text-slate-300">Nome da Campanha</Label>
                            <Input
                                placeholder="Ex: Promoção Verão"
                                value={campaign}
                                onChange={(e) => setCampaign(e.target.value)}
                                className="bg-slate-800 border-slate-700 text-white"
                            />
                        </div>
                        <Button onClick={generateLink} className="w-full bg-primary hover:bg-primary/90 text-white font-bold">
                            Gerar Link
                        </Button>

                        {generatedLink && (
                            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-between mt-4">
                                <code className="text-xs text-secondary break-all">{generatedLink}</code>
                                <Button size="icon" variant="ghost" onClick={copyToClipboard} className="hover:bg-slate-800">
                                    {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 text-slate-400" />}
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Future: Banner Generator or CRM integration */}
                <Card className="bg-slate-900/50 border-slate-800 border-dashed flex items-center justify-center p-6">
                    <p className="text-slate-500 text-sm text-center">
                        Mais ferramentas de marketing em breve...
                    </p>
                </Card>
            </div>
        </div>
    );
}
