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
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { X, Upload, Loader2, Image as ImageIcon } from "lucide-react";

interface ProductFormProps {
    initialData?: Partial<ProductFormValues>;
    onSubmit: (data: ProductFormValues) => void;
    isLoading: boolean;
}

export function ProductForm({ initialData, onSubmit, isLoading }: ProductFormProps) {
    const form = useForm<ProductFormValues>({
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
    const [isUploading, setIsUploading] = useState(false);
    const supabase = createClient();

    const addTag = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && tagInput.trim()) {
            e.preventDefault();
            const currentTags = form.getValues("flavor_tags") || [];
            if (!currentTags.includes(tagInput.trim())) {
                form.setValue("flavor_tags", [...currentTags, tagInput.trim()]);
            }
            setTagInput("");
        }
    };

    const removeTag = (tag: string) => {
        const currentTags = form.getValues("flavor_tags") || [];
        form.setValue("flavor_tags", currentTags.filter((t) => t !== tag));
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
                                <FormLabel>Nome do Produto</FormLabel>
                                <FormControl>
                                    <Input placeholder="Ex: Essência Zomo Strong Mint" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="price"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Preço (R$)</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="R$ 0,00"
                                        value={field.value ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(field.value) : ""}
                                        onChange={(e) => {
                                            const value = e.target.value.replace(/\D/g, "");
                                            const numberValue = Number(value) / 100;
                                            field.onChange(numberValue);
                                        }}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Descrição Curta (Aparece no Destaque)</FormLabel>
                            <FormControl>
                                <Input placeholder="Descreva brevemente o produto para a vitrine..." {...field} />
                            </FormControl>
                            <FormDescription>
                                Esse texto aparece logo abaixo do nome no card grande da página inicial.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Categoria</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Selecione..." />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="Kits">Kits</SelectItem>
                                        <SelectItem value="Essências">Essências</SelectItem>
                                        <SelectItem value="Carvão">Carvão</SelectItem>
                                        <SelectItem value="Acessórios">Acessórios</SelectItem>
                                        <SelectItem value="Narguiles">Narguiles</SelectItem>
                                        <SelectItem value="Pod Descartável">Pod Descartável</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                        control={form.control}
                        name="stock"
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border border-slate-800 p-3 bg-slate-900/50">
                                <div className="space-y-0.5">
                                    <FormLabel>Em Estoque</FormLabel>
                                    <FormDescription>
                                        Disponível para venda imediata
                                    </FormDescription>
                                </div>
                                <FormControl>
                                    <Switch
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
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border border-yellow-500/20 p-3 bg-yellow-500/5">
                                <div className="space-y-0.5">
                                    <FormLabel className="text-yellow-400 font-bold">Destaque na Capa 🌟</FormLabel>
                                    <FormDescription className="text-yellow-200/50">
                                        Aparecerá grandão na página inicial
                                    </FormDescription>
                                </div>
                                <FormControl>
                                    <Switch
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                </div>

                {/* Tags Section */}
                <div className="space-y-2">
                    <FormLabel>Tags de Sabor / Características</FormLabel>
                    <Input
                        placeholder="Digite e aperte Enter (ex: Mentolado, Doce)"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={addTag}
                    />
                    <div className="flex flex-wrap gap-2 mt-2">
                        {form.watch("flavor_tags")?.map((tag, index) => (
                            <div key={index} className="bg-primary/20 text-primary px-3 py-1 rounded-full text-sm flex items-center gap-1">
                                {tag}
                                <button type="button" onClick={() => removeTag(tag)} className="hover:text-white"><X size={14} /></button>
                            </div>
                        ))}
                    </div>
                </div>

                <FormField
                    control={form.control}
                    name="image"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Imagem do Produto</FormLabel>
                            <FormControl>
                                <div className="space-y-4">
                                    {/* Image Preview */}
                                    {field.value ? (
                                        <div className="relative aspect-video w-full rounded-lg overflow-hidden border border-slate-700 bg-slate-900 group">
                                            <img
                                                src={field.value}
                                                alt="Preview"
                                                className="w-full h-full object-cover"
                                            />
                                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <Button
                                                    type="button"
                                                    variant="destructive"
                                                    size="sm"
                                                    onClick={() => field.onChange("")}
                                                >
                                                    <X className="w-4 h-4 mr-2" />
                                                    Remover
                                                </Button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-center w-full">
                                            <label
                                                htmlFor="image-upload"
                                                className={`flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer transition-colors
                                                ${isUploading ? "border-slate-600 bg-slate-800/50" : "border-slate-700 bg-slate-900/50 hover:bg-slate-800 hover:border-primary/50"}
                                                `}
                                            >
                                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                    {isUploading ? (
                                                        <>
                                                            <Loader2 className="w-8 h-8 mb-2 text-primary animate-spin" />
                                                            <p className="text-sm text-slate-400">Enviando...</p>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Upload className="w-8 h-8 mb-2 text-slate-400" />
                                                            <p className="text-sm text-slate-400 mb-1"><span className="font-semibold text-primary">Clique para enviar</span> ou arraste</p>
                                                            <p className="text-xs text-slate-500 text-center px-4">
                                                                Recomendado: 800x800px (Quadrado)<br />
                                                                Formatos: PNG, JPG ou WEBP<br />
                                                                Tamanho Máximo: 5MB
                                                            </p>
                                                        </>
                                                    )}
                                                </div>
                                                <Input
                                                    id="image-upload"
                                                    type="file"
                                                    accept="image/*"
                                                    className="hidden"
                                                    disabled={isUploading}
                                                    onChange={async (e) => {
                                                        const file = e.target.files?.[0];
                                                        if (!file) return;

                                                        setIsUploading(true);
                                                        try {
                                                            const fileExt = file.name.split('.').pop();
                                                            const fileName = `${Math.random()}.${fileExt}`;
                                                            const filePath = `${fileName}`;

                                                            const { error: uploadError } = await supabase.storage
                                                                .from('products')
                                                                .upload(filePath, file);

                                                            if (uploadError) {
                                                                throw uploadError;
                                                            }

                                                            const { data: { publicUrl } } = supabase.storage
                                                                .from('products')
                                                                .getPublicUrl(filePath);

                                                            field.onChange(publicUrl);
                                                        } catch (error) {
                                                            console.error("Error uploading image:", error);
                                                            alert("Erro ao enviar imagem. Tente novamente.");
                                                        } finally {
                                                            setIsUploading(false);
                                                        }
                                                    }}
                                                />
                                            </label>
                                        </div>
                                    )}
                                </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* SEO Section (Collapsible ideally, but plain for now) */}
                <div className="border-t border-slate-800 pt-6 mt-6">
                    <h3 className="text-lg font-bold mb-4 text-emerald-500">SEO & Busca</h3>
                    <FormField
                        control={form.control}
                        name="seo_title"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Meta Title (Google)</FormLabel>
                                <FormControl>
                                    <Input placeholder="Titulo otimizado para busca" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="seo_description"
                        render={({ field }) => (
                            <FormItem className="mt-4">
                                <FormLabel>Meta Description</FormLabel>
                                <FormControl>
                                    <Input placeholder="Descrição curta para aparecer no Google" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <Button type="submit" disabled={isLoading} className="w-full">
                    {isLoading ? "Salvando..." : "Salvar Produto"}
                </Button>
            </form>
        </Form>
    );
}
