"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, Link as LinkIcon, Copy, Check } from "lucide-react";
import { formatCNPJ, validateCNPJ } from "@/utils/format";

const DEFAULT_TERMS = `1. Aceitação dos Termos
Ao acessar e usar este site, você declara ter conhecimento e concordar com os estes termos. O acesso é estritamente proibido para menores de 18 anos. A Tabacaria Skybox se reserva o direito de solicitar comprovação de idade a qualquer momento.

2. Produtos Restritos
Todos os produtos comercializados neste site são destinados exclusivamente a adultos. É crime vender, fornecer, servir, ministrar ou entregar, ainda que gratuitamente, de qualquer forma, a criança ou a adolescente, produtos cujos componentes possam causar dependência física ou psíquica.

3. Política de Privacidade
Respeitamos sua privacidade. Seus dados pessoais serão utilizados apenas para processar seus pedidos e melhorar sua experiência no site. Não vendemos nem compartilhamos seus dados com terceiros para fins de marketing não autorizado.

4. Política de Entrega e Devolução
Prazos de entrega são estimados e podem variar. Em caso de arrependimento, o consumidor tem o prazo de 7 dias a contar do recebimento do produto para solicitar a devolução, conforme o Código de Defesa do Consumidor, desde que o produto esteja lacrado e sem uso.

5. Alterações
A Tabacaria Skybox reserva-se o direito de alterar estes termos a qualquer momento, sem aviso prévio. Recomendamos a revisão periódica desta página.`;

export default function SettingsPage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [config, setConfig] = useState({
        id: "",
        store_name: "",
        whatsapp_number: "",
        instagram_url: "",
        facebook_url: "",
        address: "",
        google_maps_url: "",
        hours_weekdays: "",
        hours_saturday: "",
        hours_sunday: "",
        label_weekdays: "",
        label_saturday: "",
        label_sunday: "",
        cnpj: "",
        terms_content: ""
    });
    const supabase = createClient();


    const fetchConfig = useCallback(async () => {
        const { data, error } = await supabase.from("store_settings").select("*").single();
        if (error) {
            console.error(error);
            toast.error("Erro ao carregar configurações.");
        } else {
            // If terms_content is empty, pre-fill with default for editing
            const updatedData = {
                ...data,
                terms_content: (data.terms_content && data.terms_content.trim().length > 0)
                    ? data.terms_content
                    : DEFAULT_TERMS
            };
            setConfig(updatedData);
        }
        setLoading(false);
    }, [supabase]);

    useEffect(() => {
        let isMounted = true;
        const load = async () => {
            if (isMounted) await fetchConfig();
        };
        load();
        return () => { isMounted = false; };
    }, [fetchConfig]);

    const handleSave = async () => {
        if (config.cnpj && !validateCNPJ(config.cnpj)) {
            toast.error("CNPJ inválido. Por favor, verifique.");
            return;
        }

        setSaving(true);
        const { error } = await supabase
            .from("store_settings")
            .update({
                store_name: config.store_name,
                whatsapp_number: config.whatsapp_number,
                instagram_url: config.instagram_url,
                facebook_url: config.facebook_url,
                address: config.address,
                google_maps_url: config.google_maps_url,
                hours_weekdays: config.hours_weekdays,
                hours_saturday: config.hours_saturday,
                hours_sunday: config.hours_sunday,
                label_weekdays: config.label_weekdays,
                label_saturday: config.label_saturday,
                label_sunday: config.label_sunday,
                cnpj: config.cnpj,
                terms_content: config.terms_content
            })
            .eq("id", config.id);

        if (error) {
            toast.error("Erro ao salvar.");
        } else {
            toast.success("Configurações atualizadas com sucesso!");
        }
        setSaving(false);
    };

    if (loading) return <div className="flex justify-center p-12"><Loader2 className="animate-spin text-primary" /></div>;

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-4xl font-display font-bold tracking-tighter text-white uppercase mt-2">Configurações Base</h2>
                <p className="text-[10px] uppercase font-bold tracking-[0.2em] text-primary/60 mt-2">Parâmetros de Telemetria e Identidade</p>
            </div>

            <Card className="bg-black border-2 border-white/5 rounded-none max-w-3xl group">
                <CardHeader className="p-8 border-b-2 border-white/5 bg-primary/5">
                    <CardTitle className="text-primary font-display uppercase tracking-tighter text-xl">Integração & Rodapé</CardTitle>
                    <CardDescription className="text-[10px] uppercase font-bold tracking-widest text-primary/40 pt-1">
                        Sincronização global de metadados da loja.
                    </CardDescription>
                </CardHeader>
                <CardContent className="p-8 space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                            <Label className="text-[10px] font-bold uppercase tracking-widest text-primary">Nome Oficial</Label>
                            <Input
                                value={config.store_name}
                                onChange={(e) => setConfig({ ...config, store_name: e.target.value })}
                                className="bg-black border-2 border-white/10 text-white rounded-none h-12 focus:border-primary transition-all text-sm"
                            />
                        </div>
                        <div className="space-y-3">
                            <Label className="text-[10px] font-bold uppercase tracking-widest text-primary">Identificador WhatsApp</Label>
                            <Input
                                value={config.whatsapp_number}
                                onChange={(e) => setConfig({ ...config, whatsapp_number: e.target.value })}
                                className="bg-black border-2 border-white/10 text-white rounded-none h-12 focus:border-primary transition-all text-sm"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                            <Label className="text-[10px] font-bold uppercase tracking-widest text-primary">Fluxo Instagram</Label>
                            <Input
                                value={config.instagram_url}
                                onChange={(e) => setConfig({ ...config, instagram_url: e.target.value })}
                                className="bg-black border-2 border-white/10 text-white rounded-none h-12 focus:border-primary transition-all text-sm"
                            />
                        </div>
                        <div className="space-y-3">
                            <Label className="text-[10px] font-bold uppercase tracking-widest text-primary">Fluxo Facebook</Label>
                            <Input
                                value={config.facebook_url}
                                onChange={(e) => setConfig({ ...config, facebook_url: e.target.value })}
                                className="bg-black border-2 border-white/10 text-white rounded-none h-12 focus:border-primary transition-all text-sm"
                            />
                        </div>
                    </div>

                    <div className="space-y-3">
                        <Label className="text-[10px] font-bold uppercase tracking-widest text-primary">Coordenadas de Logística (Endereço)</Label>
                        <Input
                            value={config.address}
                            onChange={(e) => setConfig({ ...config, address: e.target.value })}
                            className="bg-black border-2 border-white/10 text-white rounded-none h-12 focus:border-primary transition-all text-sm"
                        />
                    </div>

                    <div className="space-y-6 pt-8 border-t-2 border-white/5">
                        <Label className="text-primary font-display uppercase tracking-widest text-lg">Protocolos Jurídicos</Label>
                        <div className="space-y-3">
                            <Label className="text-[10px] font-bold uppercase tracking-widest text-primary">CNPJ Industrial</Label>
                            <Input
                                value={config.cnpj || ""}
                                onChange={(e) => setConfig({ ...config, cnpj: formatCNPJ(e.target.value) })}
                                className="bg-black border-2 border-white/10 text-white rounded-none h-12 focus:border-primary transition-all text-sm font-mono"
                                placeholder="00.000.000/0001-00"
                                maxLength={18}
                            />
                        </div>
                        <div className="space-y-3">
                            <Label className="text-[10px] font-bold uppercase tracking-widest text-primary">Termos de Uso (RAW_HTML)</Label>
                            <textarea
                                value={config.terms_content || ""}
                                onChange={(e) => setConfig({ ...config, terms_content: e.target.value })}
                                className="w-full h-48 bg-black border-2 border-white/10 text-white rounded-none p-4 text-xs font-mono focus:border-primary transition-all no-scrollbar"
                                placeholder="Digite aqui os termos de uso..."
                            />
                        </div>
                    </div>

                    <div className="space-y-6 pt-8 border-t-2 border-white/5">
                        <Label className="text-primary font-display uppercase tracking-widest text-lg">Horários de Operação</Label>
                        <div className="grid grid-cols-1 gap-4">
                            {[
                                { id: 'weekdays', label: config.label_weekdays, hours: config.hours_weekdays },
                                { id: 'saturday', label: config.label_saturday, hours: config.hours_saturday },
                                { id: 'sunday', label: config.label_sunday, hours: config.hours_sunday }
                            ].map((row) => (
                                <div key={row.id} className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white/5 p-6 border-l-4 border-primary/20 hover:border-primary transition-colors">
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-bold uppercase tracking-widest text-primary">Rótulo Operacional</Label>
                                        <Input
                                            value={row.label || ""}
                                            onChange={(e) => setConfig({ ...config, [`label_${row.id}`]: e.target.value })}
                                            className="bg-black border-2 border-white/10 text-white rounded-none h-11 focus:border-primary transition-all text-xs"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-bold uppercase tracking-widest text-primary">Janela de Tempo</Label>
                                        <Input
                                            value={row.hours || ""}
                                            onChange={(e) => setConfig({ ...config, [`hours_${row.id}`]: e.target.value })}
                                            className="bg-black border-2 border-white/10 text-white rounded-none h-11 focus:border-primary transition-all text-xs"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <Button onClick={handleSave} disabled={saving} className="w-full bg-primary hover:bg-white text-black font-black py-8 rounded-none uppercase tracking-[0.2em] text-xs transition-all mt-6 shadow-[0_0_30px_-10px_rgba(190,242,100,0.2)]">
                        {saving ? <Loader2 className="animate-spin mr-2" /> : "Sincronizar Configurações"}
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
