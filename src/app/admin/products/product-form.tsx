"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { productSchema, ProductFormValues } from "./schema";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { X, Upload, Loader2, Image as ImageIcon } from "lucide-react";

interface ProductFormProps {
    initialData?: Partial<ProductFormValues>;
    onSubmit: (data: ProductFormValues) => void;
    isLoading: boolean;
}

export function ProductForm({ initialData, onSubmit, isLoading }: ProductFormProps) {
    const form = useForm<ProductFormValues>({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        resolver: zodResolver(productSchema) as any,
        defaultValues: {
            name: initialData?.name || "",
            price: initialData?.price || 0,
            category: initialData?.category || "Essências",
            image: initialData?.image || "",
            stock: initialData?.stock !== undefined ? initialData.stock : true,
            flavor_tags: initialData?.flavor_tags || [],
            seo_title: initialData?.seo_title || "",
            seo_description: initialData?.seo_description || "",
            description: initialData?.description || "",
            is_kit: initialData?.is_kit !== undefined ? initialData.is_kit : false,
            featured: initialData?.featured !== undefined ? initialData.featured : false,
        },
    });

    const [tagInput, setTagInput] = useState("");
    const [allTags, setAllTags] = useState<string[]>([]);
    const [isUploading, setIsUploading] = useState(false);
    const supabase = createClient();

    useEffect(() => {
        const fetchTags = async () => {
            const { data } = await supabase.from("products").select("flavor_tags");
            if (data) {
                const uniqueTags = new Set<string>();
                data.forEach(p => {
                    p.flavor_tags?.forEach((tag: string) => uniqueTags.add(tag));
                });
                setAllTags(Array.from(uniqueTags).sort());
            }
        };
        fetchTags();
    }, [supabase]);

    const addTag = (tag: string) => {
        const currentTags = form.getValues("flavor_tags") || [];
        if (!currentTags.includes(tag.trim())) {
            form.setValue("flavor_tags", [...currentTags, tag.trim()]);
        }
    };

    const removeTag = (tag: string) => {
        const currentTags = form.getValues("flavor_tags") || [];
        form.setValue("flavor_tags", currentTags.filter((t) => t !== tag));
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && tagInput.trim()) {
            e.preventDefault();
            addTag(tagInput);
            setTagInput("");
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-[10px] uppercase font-bold tracking-[0.2em] text-slate-500">Nomenclatura do Produto</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="EX: ESSÊNCIA ZOMO STRONG MINT"
                                        {...field}
                                        className="bg-black border-2 border-white/10 text-white rounded-none h-12 focus:border-primary transition-all uppercase text-xs tracking-widest"
                                    />
                                </FormControl>
                                <FormMessage className="text-[10px] uppercase font-bold tracking-tighter" />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="price"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-[10px] uppercase font-bold tracking-[0.2em] text-slate-500">Valor de Crédito (R$)</FormLabel>
                                <FormControl>
                                    <Input
                                        className="bg-black border-2 border-white/10 text-white rounded-none h-12 focus:border-primary transition-all text-sm font-mono"
                                        placeholder="R$ 0,00"
                                        value={field.value ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(field.value) : ""}
                                        onChange={(e) => {
                                            const value = e.target.value.replace(/\D/g, "");
                                            const numberValue = Number(value) / 100;
                                            field.onChange(numberValue);
                                        }}
                                    />
                                </FormControl>
                                <FormMessage className="text-[10px] uppercase font-bold tracking-tighter" />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-[10px] uppercase font-bold tracking-[0.2em] text-slate-500">Resumo de Vitrine (Tática)</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="BREVE DESCRIÇÃO TÉCNICA..."
                                    {...field}
                                    className="bg-black border-2 border-white/10 text-white rounded-none h-12 focus:border-primary transition-all text-xs"
                                />
                            </FormControl>
                            <FormDescription className="text-[9px] uppercase font-bold tracking-widest text-white/20">
                                Visível abaixo do identificador na página principal.
                            </FormDescription>
                            <FormMessage className="text-[10px] uppercase font-bold tracking-tighter" />
                        </FormItem>
                    )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-[10px] uppercase font-bold tracking-[0.2em] text-slate-500">Classificação de Inventário</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger className="bg-black border-2 border-white/10 text-white rounded-none h-12 focus:border-primary transition-all text-xs uppercase tracking-widest">
                                            <SelectValue placeholder="SELECIONE..." />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent className="bg-black border-2 border-white/10 text-white rounded-none">
                                        <SelectItem value="Kits" className="hover:bg-primary hover:text-black transition-colors uppercase text-[10px] font-bold tracking-widest cursor-pointer">Kits</SelectItem>
                                        <SelectItem value="Essências" className="hover:bg-primary hover:text-black transition-colors uppercase text-[10px] font-bold tracking-widest cursor-pointer">Essências</SelectItem>
                                        <SelectItem value="Carvão" className="hover:bg-primary hover:text-black transition-colors uppercase text-[10px] font-bold tracking-widest cursor-pointer">Carvão</SelectItem>
                                        <SelectItem value="Acessórios" className="hover:bg-primary hover:text-black transition-colors uppercase text-[10px] font-bold tracking-widest cursor-pointer">Acessórios</SelectItem>
                                        <SelectItem value="Narguiles" className="hover:bg-primary hover:text-black transition-colors uppercase text-[10px] font-bold tracking-widest cursor-pointer">Narguiles</SelectItem>
                                        <SelectItem value="Pod Descartável" className="hover:bg-primary hover:text-black transition-colors uppercase text-[10px] font-bold tracking-widest cursor-pointer">Pod Descartável</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage className="text-[10px] uppercase font-bold tracking-tighter" />
                            </FormItem>
                        )}
                    />

                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                        control={form.control}
                        name="stock"
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-none border-2 border-white/5 p-6 bg-black group hover:border-primary/30 transition-all">
                                <div className="space-y-1">
                                    <FormLabel className="text-[10px] uppercase font-bold tracking-[0.2em] text-white">Disponibilidade</FormLabel>
                                    <FormDescription className="text-[9px] uppercase font-bold tracking-widest text-slate-500">
                                        Status de Estoque Imediato
                                    </FormDescription>
                                </div>
                                <FormControl>
                                    <Switch
                                        className="data-[state=checked]:bg-primary data-[state=unchecked]:bg-slate-800"
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="featured"
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-none border-2 border-primary/20 p-6 bg-primary/5 group hover:border-primary/50 transition-all">
                                <div className="space-y-1">
                                    <FormLabel className="text-[10px] uppercase font-bold tracking-[0.2em] text-primary">Protocolo Destaque ⚡</FormLabel>
                                    <FormDescription className="text-[9px] uppercase font-bold tracking-widest text-primary/40">
                                        Exposição Premium na Home
                                    </FormDescription>
                                </div>
                                <FormControl>
                                    <Switch
                                        className="data-[state=checked]:bg-primary data-[state=unchecked]:bg-primary/20"
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                </div>

                {/* Tags Section */}
                <div className="space-y-3">
                    <FormLabel className="text-[10px] uppercase font-bold tracking-[0.2em] text-slate-500">Atributos & Tags (Filtros)</FormLabel>
                    <Input
                        placeholder="DIGITE E APERTE ENTER (EX: MENTOLADO, DOCE)"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="bg-black border-2 border-white/10 text-white rounded-none h-12 focus:border-primary transition-all uppercase text-[10px] font-bold tracking-widest"
                    />

                    {/* Suggested Tags (Library) */}
                    {allTags.length > 0 && (
                        <div className="space-y-2 mt-4">
                            <span className="text-[8px] uppercase font-bold tracking-[0.3em] text-white/40">Vocabulário de Sabores Registrados:</span>
                            <div className="flex flex-wrap gap-1.5 opacity-60 hover:opacity-100 transition-opacity max-h-24 overflow-y-auto no-scrollbar border-l-2 border-white/5 pl-4 py-1">
                                {allTags.map((tag) => (
                                    <button
                                        key={tag}
                                        type="button"
                                        onClick={() => addTag(tag)}
                                        className="text-[9px] uppercase font-bold tracking-widest text-slate-400 border border-white/10 px-2 py-1 hover:border-primary hover:text-primary hover:bg-primary/5 transition-all"
                                    >
                                        + {tag}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="flex flex-wrap gap-2 mt-6">
                        {form.watch("flavor_tags")?.map((tag, index) => (
                            <div key={index} className="bg-primary text-black font-black px-4 py-2 rounded-none text-[9px] uppercase flex items-center gap-2 tracking-widest border border-white/10 shadow-[2px_2px_0px_#000]">
                                {tag}
                                <button type="button" onClick={() => removeTag(tag)} className="hover:text-red-600 transition-colors"><X size={10} strokeWidth={4} /></button>
                            </div>
                        ))}
                    </div>
                </div>

                <FormField
                    control={form.control}
                    name="image"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-[10px] uppercase font-bold tracking-[0.2em] text-slate-500">Documentação Visual (PNG/JPG)</FormLabel>
                            <FormControl>
                                <div className="space-y-4">
                                    {field.value ? (
                                        <div className="relative aspect-video w-full rounded-none overflow-hidden border-2 border-white/10 bg-black group">
                                            <img
                                                src={field.value}
                                                alt="Preview"
                                                className="w-full h-full object-cover grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700 ease-in-out"
                                            />
                                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                                                <Button
                                                    type="button"
                                                    variant="destructive"
                                                    size="sm"
                                                    className="rounded-none border-2 border-white/20 bg-black hover:bg-red-600 text-white transition-all uppercase text-[10px] font-black h-12 px-8 tracking-[0.2em]"
                                                    onClick={() => field.onChange("")}
                                                >
                                                    <X className="w-5 h-5 mr-3" />
                                                    DELETAR_ARQUIVO
                                                </Button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-center w-full">
                                            <label
                                                htmlFor="image-upload"
                                                className={`flex flex-col items-center justify-center w-full h-56 border-2 border-dashed rounded-none cursor-pointer transition-all
                                                ${isUploading ? "border-primary bg-primary/5 animate-pulse" : "border-white/10 bg-black hover:bg-primary/5 hover:border-primary/50"}
                                                `}
                                            >
                                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                    {isUploading ? (
                                                        <>
                                                            <Loader2 className="w-10 h-10 mb-4 text-primary animate-spin" />
                                                            <p className="text-[10px] uppercase font-bold tracking-widest text-primary">UPLOAD_IN_PROGRESS...</p>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <div className="bg-white/5 p-4 rounded-none mb-4 border border-white/5">
                                                                <Upload className="w-8 h-8 text-white/40" />
                                                            </div>
                                                            <p className="text-[10px] uppercase font-bold tracking-widest text-slate-400 mb-2">
                                                                <span className="text-primary underline decoration-2 underline-offset-4">LINK_DADOS</span> OU ARRASTE
                                                            </p>
                                                            <p className="text-[9px] uppercase font-bold tracking-[0.2em] text-slate-600 text-center leading-relaxed">
                                                                TARGET: 800x800px // FORMAT: PNG/WEBP<br />
                                                                CAPACITY_LIMIT: 5.0MB
                                                            </p>
                                                        </>
                                                    )}
                                                </div>
                                                <Input id="image-upload" type="file" accept="image/*" className="hidden" disabled={isUploading} onChange={async (e) => {
                                                    const file = e.target.files?.[0];
                                                    if (!file) return;
                                                    setIsUploading(true);
                                                    try {
                                                        const fileExt = file.name.split('.').pop();
                                                        const fileName = `${Math.random()}.${fileExt}`;
                                                        const { error: uploadError } = await supabase.storage.from('products').upload(fileName, file);
                                                        if (uploadError) throw uploadError;
                                                        const { data: { publicUrl } } = supabase.storage.from('products').getPublicUrl(fileName);
                                                        field.onChange(publicUrl);
                                                    } catch (error) {
                                                        console.error(error);
                                                        alert("CRITICAL_UPLOAD_FAILURE");
                                                    } finally {
                                                        setIsUploading(false);
                                                    }
                                                }} />
                                            </label>
                                        </div>
                                    )}
                                </div>
                            </FormControl>
                            <FormMessage className="text-[10px] uppercase font-bold tracking-tighter" />
                        </FormItem>
                    )}
                />

                <div className="border-t-2 border-white/5 pt-10 mt-16 bg-primary/5 -mx-8 px-8 pb-10">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="h-0.5 w-12 bg-primary"></div>
                        <h3 className="text-2xl font-display font-bold text-primary uppercase tracking-tighter">SEO & Metadados G.O. (Central de Dados)</h3>
                    </div>
                    <div className="grid grid-cols-1 gap-6">
                        <FormField
                            control={form.control}
                            name="seo_title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-[10px] uppercase font-bold tracking-[0.2em] text-slate-500">Target: Meta_Title (Google_Sync)</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="TÍTULO OTIMIZADO PARA INDEXAÇÃO..."
                                            {...field}
                                            className="bg-black border-2 border-white/10 text-white rounded-none h-12 focus:border-primary transition-all text-xs uppercase"
                                        />
                                    </FormControl>
                                    <FormMessage className="text-[10px] uppercase font-bold tracking-tighter" />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="seo_description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-[10px] uppercase font-bold tracking-[0.2em] text-slate-500">Target: Meta_Description (Snippet_Context)</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="DESCRIÇÃO ESTRATÉGICA PARA ALGORITMOS..."
                                            {...field}
                                            className="bg-black border-2 border-white/10 text-white rounded-none h-12 focus:border-primary transition-all text-xs uppercase"
                                        />
                                    </FormControl>
                                    <FormMessage className="text-[10px] uppercase font-bold tracking-tighter" />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>

                <Button type="submit" disabled={isLoading} className="w-full h-14 rounded-none bg-primary text-black font-bold hover:bg-white transition-all uppercase tracking-[0.2em] text-sm">
                    {isLoading ? "Processando..." : "Sincronizar Produto"}
                </Button>
            </form>
        </Form>
    );
}
