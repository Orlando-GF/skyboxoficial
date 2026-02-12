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

    useEffect(() => {
        fetchConfig();
    }, []);

    const fetchConfig = async () => {
        const { data, error } = await supabase.from("store_settings").select("*").single();
        if (error) {
            console.error(error);
            toast.error("Erro ao carregar configurações.");
        } else {
            setConfig(data);
        }
        setLoading(false);
    };

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
                <h2 className="text-3xl font-bold font-display tracking-tight text-white">Configurações</h2>
                <p className="text-slate-400">Gerencie as informações da loja visíveis no site.</p>
            </div>

            <Card className="bg-slate-900 border-slate-800 max-w-3xl">
                <CardHeader>
                    <CardTitle className="text-white">Dados da Loja & Rodapé</CardTitle>
                    <CardDescription>Estes dados atualizarão automaticamente o rodapé do site.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label className="text-slate-300">Nome da Loja</Label>
                            <Input
                                value={config.store_name}
                                onChange={(e) => setConfig({ ...config, store_name: e.target.value })}
                                className="bg-slate-800 border-slate-700 text-white"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-slate-300">WhatsApp (Apenas números)</Label>
                            <Input
                                value={config.whatsapp_number}
                                onChange={(e) => setConfig({ ...config, whatsapp_number: e.target.value })}
                                className="bg-slate-800 border-slate-700 text-white"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label className="text-slate-300">Instagram URL</Label>
                            <Input
                                value={config.instagram_url}
                                onChange={(e) => setConfig({ ...config, instagram_url: e.target.value })}
                                className="bg-slate-800 border-slate-700 text-white"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-slate-300">Facebook URL</Label>
                            <Input
                                value={config.facebook_url}
                                onChange={(e) => setConfig({ ...config, facebook_url: e.target.value })}
                                className="bg-slate-800 border-slate-700 text-white"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-slate-300">Endereço Completo</Label>
                        <Input
                            value={config.address}
                            onChange={(e) => setConfig({ ...config, address: e.target.value })}
                            className="bg-slate-800 border-slate-700 text-white"
                        />
                    </div>

                    <div className="space-y-4 pt-4 border-t border-slate-800">
                        <Label className="text-slate-300 text-lg">Informações Legais</Label>
                        <div className="space-y-2">
                            <Label className="text-slate-300">CNPJ</Label>
                            <Input
                                value={config.cnpj || ""}
                                onChange={(e) => setConfig({ ...config, cnpj: formatCNPJ(e.target.value) })}
                                className="bg-slate-800 border-slate-700 text-white"
                                placeholder="00.000.000/0001-00"
                                maxLength={18}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-slate-300">Conteúdo dos Termos de Uso e Política de Privacidade</Label>
                            <p className="text-xs text-slate-500 mb-2">Este texto aparecerá na página /termos. Aceita HTML simples ou texto corrido.</p>
                            <textarea
                                value={config.terms_content || ""}
                                onChange={(e) => setConfig({ ...config, terms_content: e.target.value })}
                                className="w-full h-64 bg-slate-800 border-slate-700 text-white rounded-md p-3 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary"
                                placeholder="Digite aqui os termos de uso..."
                            />
                        </div>
                    </div>

                    <div className="space-y-4 pt-4 border-t border-slate-800">
                        <Label className="text-slate-300 text-lg">Horários de Funcionamento</Label>
                        <div className="grid grid-cols-1 gap-6">

                            {/* Weekdays */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white/5 p-4 rounded-lg">
                                <div className="space-y-2">
                                    <Label className="text-slate-400 text-xs uppercase">Rótulo (Ex: Seg - Qui)</Label>
                                    <Input
                                        value={config.label_weekdays || ""}
                                        onChange={(e) => setConfig({ ...config, label_weekdays: e.target.value })}
                                        className="bg-slate-800 border-slate-700 text-white"
                                        placeholder="Seg - Qui"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-slate-400 text-xs uppercase">Horário</Label>
                                    <Input
                                        value={config.hours_weekdays || ""}
                                        onChange={(e) => setConfig({ ...config, hours_weekdays: e.target.value })}
                                        placeholder="Ex: 10:00 - 22:00"
                                        className="bg-slate-800 border-slate-700 text-white"
                                    />
                                </div>
                            </div>

                            {/* Saturday */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white/5 p-4 rounded-lg">
                                <div className="space-y-2">
                                    <Label className="text-slate-400 text-xs uppercase">Rótulo (Ex: Sex - Sáb)</Label>
                                    <Input
                                        value={config.label_saturday || ""}
                                        onChange={(e) => setConfig({ ...config, label_saturday: e.target.value })}
                                        className="bg-slate-800 border-slate-700 text-white"
                                        placeholder="Sex - Sáb"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-slate-400 text-xs uppercase">Horário</Label>
                                    <Input
                                        value={config.hours_saturday || ""}
                                        onChange={(e) => setConfig({ ...config, hours_saturday: e.target.value })}
                                        placeholder="Ex: 10:00 - 00:00"
                                        className="bg-slate-800 border-slate-700 text-white"
                                    />
                                </div>
                            </div>

                            {/* Sunday */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white/5 p-4 rounded-lg">
                                <div className="space-y-2">
                                    <Label className="text-slate-400 text-xs uppercase">Rótulo (Ex: Domingo)</Label>
                                    <Input
                                        value={config.label_sunday || ""}
                                        onChange={(e) => setConfig({ ...config, label_sunday: e.target.value })}
                                        className="bg-slate-800 border-slate-700 text-white"
                                        placeholder="Domingo"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-slate-400 text-xs uppercase">Horário</Label>
                                    <Input
                                        value={config.hours_sunday || ""}
                                        onChange={(e) => setConfig({ ...config, hours_sunday: e.target.value })}
                                        placeholder="Ex: 14:00 - 20:00"
                                        className="bg-slate-800 border-slate-700 text-white"
                                    />
                                </div>
                            </div>

                        </div>
                    </div>

                    <Button onClick={handleSave} disabled={saving} className="w-full bg-primary hover:bg-primary/90 text-white font-bold mt-4">
                        {saving ? <Loader2 className="animate-spin mr-2" /> : null}
                        Salvar Alterações
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
