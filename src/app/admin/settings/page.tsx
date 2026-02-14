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
import { Switch } from "@/components/ui/switch";

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
        terms_content: "",
        payment_discount_percentage: 5.0,
        cash_discount_percentage: 5.0
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
                    : DEFAULT_TERMS,
                payment_discount_percentage: data.payment_discount_percentage ?? 5.0,
                cash_discount_percentage: data.cash_discount_percentage ?? 5.0
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
                terms_content: config.terms_content,
                payment_discount_percentage: config.payment_discount_percentage,
                cash_discount_percentage: config.cash_discount_percentage
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
        <div className="space-y-8 w-full max-w-full">
            <div>
                <h2 className="text-4xl font-display font-bold tracking-tighter text-white uppercase mt-2">Configurações Base</h2>
                <p className="text-[10px] uppercase font-bold tracking-[0.2em] text-primary/60 mt-2">Parâmetros de Telemetria e Identidade</p>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Left Column: General Info & Legal */}
                <div className="xl:col-span-2 space-y-8">
                    <Card className="bg-black border-2 border-white/5 rounded-none group">
                        <CardHeader className="p-6 border-b-2 border-white/5 bg-primary/5">
                            <CardTitle className="text-primary font-display uppercase tracking-tighter text-xl">Identidade & Contato</CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-bold uppercase tracking-widest text-primary">Nome Oficial</Label>
                                    <Input
                                        value={config.store_name}
                                        onChange={(e) => setConfig({ ...config, store_name: e.target.value })}
                                        className="bg-black border-2 border-white/10 text-white rounded-none h-10 focus:border-primary transition-all text-xs"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-bold uppercase tracking-widest text-primary">WhatsApp</Label>
                                    <Input
                                        value={config.whatsapp_number}
                                        onChange={(e) => setConfig({ ...config, whatsapp_number: e.target.value })}
                                        className="bg-black border-2 border-white/10 text-white rounded-none h-10 focus:border-primary transition-all text-xs"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-bold uppercase tracking-widest text-primary">Instagram URL</Label>
                                    <Input
                                        value={config.instagram_url}
                                        onChange={(e) => setConfig({ ...config, instagram_url: e.target.value })}
                                        className="bg-black border-2 border-white/10 text-white rounded-none h-10 focus:border-primary transition-all text-xs"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-bold uppercase tracking-widest text-primary">Facebook URL</Label>
                                    <Input
                                        value={config.facebook_url}
                                        onChange={(e) => setConfig({ ...config, facebook_url: e.target.value })}
                                        className="bg-black border-2 border-white/10 text-white rounded-none h-10 focus:border-primary transition-all text-xs"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-[10px] font-bold uppercase tracking-widest text-primary">Endereço Completo</Label>
                                <Input
                                    value={config.address}
                                    onChange={(e) => setConfig({ ...config, address: e.target.value })}
                                    className="bg-black border-2 border-white/10 text-white rounded-none h-10 focus:border-primary transition-all text-xs"
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-black border-2 border-white/5 rounded-none group">
                        <CardHeader className="p-6 border-b-2 border-white/5 bg-primary/5">
                            <CardTitle className="text-primary font-display uppercase tracking-tighter text-xl">Protocolos Jurídicos</CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 space-y-6">
                            <div className="space-y-2">
                                <Label className="text-[10px] font-bold uppercase tracking-widest text-primary">CNPJ Industrial</Label>
                                <Input
                                    value={config.cnpj || ""}
                                    onChange={(e) => setConfig({ ...config, cnpj: formatCNPJ(e.target.value) })}
                                    className="bg-black border-2 border-white/10 text-white rounded-none h-10 focus:border-primary transition-all text-xs font-mono max-w-sm"
                                    placeholder="00.000.000/0001-00"
                                    maxLength={18}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[10px] font-bold uppercase tracking-widest text-primary">Termos de Uso (RAW_HTML)</Label>
                                <textarea
                                    value={config.terms_content || ""}
                                    onChange={(e) => setConfig({ ...config, terms_content: e.target.value })}
                                    className="w-full h-64 bg-black border-2 border-white/10 text-white rounded-none p-4 text-xs font-mono focus:border-primary transition-all no-scrollbar resize-y"
                                    placeholder="Digite aqui os termos de uso..."
                                />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column: Hours & Save */}
                <div className="space-y-6">
                    <Card className="bg-black border-2 border-white/5 rounded-none group h-fit">
                        <CardHeader className="p-6 border-b-2 border-white/5 bg-primary/5">
                            <CardTitle className="text-primary font-display uppercase tracking-tighter text-xl">Operação</CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 space-y-6">
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <Label className="text-[10px] font-bold uppercase tracking-widest text-primary block">Desconto à Vista</Label>
                                    <Switch
                                        checked={config.payment_discount_percentage > 0}
                                        onCheckedChange={(checked) => {
                                            setConfig({
                                                ...config,
                                                payment_discount_percentage: checked ? 5.0 : 0
                                            });
                                        }}
                                        className="data-[state=checked]:bg-primary"
                                    />
                                </div>

                                {config.payment_discount_percentage > 0 && (
                                    <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                                        <Label className="text-[10px] uppercase font-bold text-zinc-400">Porcentagem (%)</Label>
                                        <div className="relative">
                                            <Input
                                                type="number"
                                                value={config.payment_discount_percentage}
                                                onChange={(e) => setConfig({ ...config, payment_discount_percentage: parseFloat(e.target.value) || 0 })}
                                                className="bg-black border-2 border-white/10 text-white rounded-none h-10 focus:border-primary transition-all text-xs font-mono [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                                placeholder="5.0"
                                                step="0.1"
                                                min="0.1"
                                                max="100"
                                            />
                                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-white/40 font-bold">%</span>
                                        </div>
                                        <p className="text-[9px] text-zinc-500">
                                            Aplicado em PIX e Dinheiro.
                                        </p>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-4 pt-4 border-t border-white/10">
                                <div className="flex items-center justify-between">
                                    <Label className="text-[10px] font-bold uppercase tracking-widest text-primary block">Desconto Dinheiro/Entrega</Label>
                                    <Switch
                                        checked={config.cash_discount_percentage > 0}
                                        onCheckedChange={(checked) => {
                                            setConfig({
                                                ...config,
                                                cash_discount_percentage: checked ? 5.0 : 0
                                            });
                                        }}
                                        className="data-[state=checked]:bg-primary"
                                    />
                                </div>

                                {config.cash_discount_percentage > 0 && (
                                    <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                                        <Label className="text-[10px] uppercase font-bold text-zinc-400">Porcentagem (%)</Label>
                                        <div className="relative">
                                            <Input
                                                type="number"
                                                value={config.cash_discount_percentage}
                                                onChange={(e) => setConfig({ ...config, cash_discount_percentage: parseFloat(e.target.value) || 0 })}
                                                className="bg-black border-2 border-white/10 text-white rounded-none h-10 focus:border-primary transition-all text-xs font-mono [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                                placeholder="5.0"
                                                step="0.1"
                                                min="0.1"
                                                max="100"
                                            />
                                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-white/40 font-bold">%</span>
                                        </div>
                                        <p className="text-[9px] text-zinc-500">
                                            Aplicado apenas para pagamentos na entrega (Dinheiro/Cartão).
                                        </p>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-4 pt-4 border-t border-white/10">
                                <Label className="text-[10px] font-bold uppercase tracking-widest text-primary mb-2 block">Grade de Horários</Label>
                                <div className="border border-white/10">
                                    {[
                                        { id: 'weekdays', label: config.label_weekdays, hours: config.hours_weekdays },
                                        { id: 'saturday', label: config.label_saturday, hours: config.hours_saturday },
                                        { id: 'sunday', label: config.label_sunday, hours: config.hours_sunday }
                                    ].map((row, idx) => (
                                        <div key={row.id} className={`grid grid-cols-1 gap-2 p-3 ${idx !== 2 ? 'border-b border-white/10' : ''} hover:bg-white/5 transition-colors`}>
                                            <Input
                                                value={row.label || ""}
                                                onChange={(e) => setConfig({ ...config, [`label_${row.id}`]: e.target.value })}
                                                className="bg-transparent border-none text-primary font-bold uppercase tracking-widest text-[10px] p-0 h-auto focus-visible:ring-0 placeholder:text-primary/30"
                                                placeholder="RÓTULO"
                                            />
                                            <Input
                                                value={row.hours || ""}
                                                onChange={(e) => setConfig({ ...config, [`hours_${row.id}`]: e.target.value })}
                                                className="bg-transparent border-none text-white font-mono text-xs p-0 h-auto focus-visible:ring-0 placeholder:text-white/30"
                                                placeholder="00:00 - 00:00"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <Button onClick={handleSave} disabled={saving} className="w-full bg-primary hover:bg-white text-black font-black py-6 rounded-none uppercase tracking-[0.2em] text-xs transition-all shadow-[0_0_20px_-5px_rgba(190,242,100,0.3)]">
                                {saving ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : "Sincronizar"}
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
