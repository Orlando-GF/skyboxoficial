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
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useState, useEffect } from "react";
import { TagInput } from "@/components/ui/tag-input";
import { X, Upload, Loader2, Image as ImageIcon, Search, Plus } from "lucide-react";
import { toTitleCase } from "@/lib/utils";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import { Trash2 } from "lucide-react";

interface ProductFormProps {
    initialData?: Partial<ProductFormValues> & {
        id?: string;
        gallery?: string[];
        variants?: { id: string; name: string; value: string; stock: boolean }[]
    };
    onSubmit?: (data: ProductFormValues) => void;
    isLoading?: boolean;
}

export function ProductForm({ initialData, onSubmit: parentOnSubmit, isLoading: parentIsLoading }: ProductFormProps) {
    const form = useForm<ProductFormValues>({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        resolver: zodResolver(productSchema) as any,
        defaultValues: {
            name: initialData?.name || "",
            price: initialData?.price || 0,
            original_price: initialData?.original_price || 0,
            category: initialData?.category || "Essências",
            image: initialData?.image || "",
            stock: initialData?.stock !== undefined ? initialData.stock : true,
            flavor_tags: initialData?.flavor_tags || [],
            seo_title: initialData?.seo_title || "",
            seo_description: initialData?.seo_description || "",
            description: initialData?.description || "",
            is_kit: initialData?.is_kit !== undefined ? initialData.is_kit : false,
            kit_items: initialData?.kit_items || [],
            featured: initialData?.featured !== undefined ? initialData.featured : false,
        },
    });

    const router = useRouter();
    const product = initialData;
    const [isLoading, setIsLoading] = useState(false);
    const [availableProducts, setAvailableProducts] = useState<{ id: string; name: string; price: number }[]>([]);
    const [allTags, setAllTags] = useState<string[]>([]);
    const [itemSearch, setItemSearch] = useState("");
    const [isUploading, setIsUploading] = useState(false);
    const supabase = createClient();

    const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);

    // Gallery State
    const [gallery, setGallery] = useState<string[]>([]);
    const [isUploadingGallery, setIsUploadingGallery] = useState(false);

    // Variants State
    const [variants, setVariants] = useState<{ id: string; name: string; value: string; stock: boolean }[]>([]);
    const [newVariant, setNewVariant] = useState({ name: "", value: "#000000", stock: true });

    // Discount State
    const [showDiscount, setShowDiscount] = useState(false);

    useEffect(() => {
        if (product) {
            form.reset({
                name: product.name,
                description: product.description || "",
                price: product.price,
                original_price: product.original_price || undefined,
                category: product.category,
                image: product.image,
                stock: product.stock,
                featured: product.featured || false,
                flavor_tags: product.flavor_tags || [],
                seo_title: product.seo_title || "",
                seo_description: product.seo_description || "",
                is_kit: product.is_kit || false,
                kit_items: product.kit_items || []
            });
            if (product.gallery) setGallery(product.gallery);
            if (product.variants) setVariants(product.variants);
            if (product.original_price && product.price !== undefined && product.original_price > product.price) {
                setShowDiscount(true);
            }
        }
    }, [product]); // Removed form from deps to avoid loop if form object reference changes (though useForm ensures stability usually)

    const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        setIsUploadingGallery(true);
        try {
            const newUrls: string[] = [];
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                const fileExt = file.name.split('.').pop();
                const fileName = `${Math.random()}.${fileExt}`;
                const { error: uploadError } = await supabase.storage.from('products').upload(fileName, file);
                if (uploadError) throw uploadError;
                const { data: { publicUrl } } = supabase.storage.from('products').getPublicUrl(fileName);
                newUrls.push(publicUrl);
            }
            setGallery([...gallery, ...newUrls]);
        } catch (error) {
            console.error(error);
            toast.error("Erro ao fazer upload das imagens.");
        } finally {
            setIsUploadingGallery(false);
        }
    };

    const removeGalleryImage = (index: number) => {
        const newGallery = [...gallery];
        newGallery.splice(index, 1);
        setGallery(newGallery);
    };

    const addVariant = () => {
        if (!newVariant.name) return;
        setVariants([...variants, { ...newVariant, id: crypto.randomUUID() }]);
        setNewVariant({ name: "", value: "#000000", stock: true });
    };

    const removeVariant = (index: number) => {
        const newVariants = [...variants];
        newVariants.splice(index, 1);
        setVariants(newVariants);
    };

    const toggleVariantStock = (index: number) => {
        const newVariants = [...variants];
        newVariants[index].stock = !newVariants[index].stock;
        setVariants(newVariants);
    };

    async function onSubmit(values: z.infer<typeof productSchema>) {
        // onFormSubmit(values); // REMOVED: conflicting logic
        setIsLoading(true);
        try {
            const productData = {
                ...values,
                gallery,
                variants,
                // Ensure flavor_tags is array
                flavor_tags: values.flavor_tags || [],
                // Ensure kit_items is stored as JSONB if needed, or text[]
                kit_items: values.is_kit ? values.kit_items : [],
                // Handle discount logic
                original_price: showDiscount ? values.original_price : null
            };

            if (product) {
                const { error } = await supabase
                    .from("products")
                    .update(productData)
                    .eq("id", product.id);

                if (error) throw error;
                toast.success("Produto atualizado com sucesso!");
            } else {
                const { error } = await supabase
                    .from("products")
                    .insert([productData]);

                if (error) throw error;
                toast.success("Produto criado com sucesso!");
                form.reset();
                setGallery([]);
                setVariants([]);
            }
            router.push("/admin/products");
            router.refresh();
        } catch (error) {
            console.error(error);
            toast.error("Erro ao salvar produto.");
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            // Fetch Categories
            const { data: categoriesData } = await supabase.from("categories").select("id, name").order("name");
            if (categoriesData) {
                setCategories(categoriesData);
            }

            // Fetch Tags for Autocomplete
            const { data: tagsData } = await supabase.from("products").select("flavor_tags");
            if (tagsData) {
                const uniqueTags = new Set<string>();
                tagsData.forEach(p => {
                    p.flavor_tags?.forEach((tag: string) => uniqueTags.add(tag));
                });
                setAllTags(Array.from(uniqueTags).sort());
            }

            // Fetch Products for Kit Composition
            const { data: productsData } = await supabase.from("products").select("id, name, price").order('name');
            if (productsData) {
                setAvailableProducts(productsData);
            }
        };
        fetchData();
    }, [supabase]);

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-12 gap-8 h-full">
                {/* Left Sidebar - Meta & Status (Cols 4) */}
                <div className="col-span-12 md:col-span-4 space-y-6 border-r-2 border-white/5 pr-8 h-full">

                    {/* Image Upload - Prominent */}
                    <FormField
                        control={form.control}
                        name="image"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-[10px] uppercase font-bold tracking-[0.2em] text-slate-500">Imagem de Capa</FormLabel>
                                <FormControl>
                                    <div className="space-y-4">
                                        {field.value ? (
                                            <div className="relative aspect-square w-full rounded-none overflow-hidden border-2 border-white/10 bg-black group">
                                                <img
                                                    src={field.value}
                                                    alt="Preview"
                                                    className="w-full h-full object-cover transition-all duration-700 ease-in-out"
                                                />
                                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                                                    <Button
                                                        type="button"
                                                        variant="destructive"
                                                        size="sm"
                                                        className="rounded-none border-2 border-white/20 bg-black hover:bg-red-600 text-white transition-all uppercase text-[10px] font-black h-10 px-4 tracking-[0.2em]"
                                                        onClick={() => field.onChange("")}
                                                    >
                                                        <X className="w-4 h-4 mr-2" />
                                                        REMOVER
                                                    </Button>
                                                </div>
                                            </div>
                                        ) : (
                                            <label
                                                htmlFor="image-upload"
                                                className={`flex flex-col items-center justify-center w-full aspect-square border-2 border-dashed rounded-none cursor-pointer transition-all
                                                ${isUploading ? "border-primary bg-primary/5 animate-pulse" : "border-white/10 bg-black hover:bg-primary/5 hover:border-primary/50"}
                                                `}
                                            >
                                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                    {isUploading ? (
                                                        <Loader2 className="w-8 h-8 mb-2 text-primary animate-spin" />
                                                    ) : (
                                                        <Upload className="w-8 h-8 text-white/40 mb-2" />
                                                    )}
                                                    <p className="text-[9px] uppercase font-bold tracking-widest text-slate-500">
                                                        UPLOAD CAPA
                                                    </p>
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
                                                        toast.error("Erro no upload.");
                                                    } finally {
                                                        setIsUploading(false);
                                                    }
                                                }} />
                                            </label>
                                        )}
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Gallery Section */}
                    <div className="space-y-2 pt-4 border-t border-white/5">
                        <Label className="text-[10px] uppercase font-bold tracking-[0.2em] text-slate-500">Galeria de Imagens</Label>
                        <div className="grid grid-cols-4 gap-2">
                            {gallery.map((url, idx) => (
                                <div key={idx} className="relative aspect-square border border-white/10 bg-black group">
                                    <img src={url} className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity" />
                                    <button
                                        type="button"
                                        onClick={() => removeGalleryImage(idx)}
                                        className="absolute top-0 right-0 bg-red-600 text-white p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <X size={12} />
                                    </button>
                                </div>
                            ))}
                            <label className={`flex flex-col items-center justify-center aspect-square border-2 border-dashed border-white/10 hover:border-primary/50 cursor-pointer bg-white/5 hover:bg-white/10 transition-all ${isUploadingGallery ? 'opacity-50 cursor-not-allowed' : ''}`}>
                                <Plus size={20} className="text-slate-400" />
                                <Input type="file" multiple accept="image/*" className="hidden" onChange={handleGalleryUpload} disabled={isUploadingGallery} />
                            </label>
                        </div>
                    </div>

                    {/* Variants Section */}
                    <div className="space-y-4 pt-4 border-t border-white/5">
                        <Label className="text-[10px] uppercase font-bold tracking-[0.2em] text-slate-500">Variações / Cores</Label>

                        <div className="flex gap-2 items-end bg-white/5 p-2 border border-white/10">
                            <div className="space-y-1 flex-1">
                                <Label className="text-[9px] uppercase font-bold text-slate-500">Nome (Ex: Azul)</Label>
                                <Input
                                    value={newVariant.name}
                                    onChange={(e) => setNewVariant({ ...newVariant, name: e.target.value })}
                                    className="h-8 text-xs bg-black border-white/10 rounded-none uppercase"
                                />
                            </div>
                            <div className="space-y-1 w-20">
                                <Label className="text-[9px] uppercase font-bold text-slate-500">Cor</Label>
                                <div className="flex h-8 w-full border border-white/10 overflow-hidden relative">
                                    <Input
                                        type="color"
                                        value={newVariant.value}
                                        onChange={(e) => setNewVariant({ ...newVariant, value: e.target.value })}
                                        className="h-10 w-[150%] -translate-x-[25%] -translate-y-[10%] p-0 bg-transparent border-none cursor-pointer"
                                    />
                                </div>
                            </div>
                            <Button type="button" onClick={addVariant} className="h-8 w-8 p-0 rounded-none bg-primary text-black hover:bg-white">
                                <Plus size={16} />
                            </Button>
                        </div>

                        <div className="space-y-2">
                            {variants.map((variant, idx) => (
                                <div key={idx} className="flex items-center gap-3 bg-black border border-white/10 p-2 group">
                                    <div className="w-4 h-4 border border-white/20" style={{ backgroundColor: variant.value }}></div>
                                    <span className="flex-1 text-xs uppercase font-bold text-slate-300">{variant.name}</span>

                                    <button
                                        type="button"
                                        onClick={() => toggleVariantStock(idx)}
                                        className={`text-[9px] font-black uppercase tracking-wider px-2 py-1 transition-colors ${variant.stock ? 'text-primary' : 'text-red-500'}`}
                                    >
                                        {variant.stock ? 'EM ESTOQUE' : 'SEM ESTOQUE'}
                                    </button>

                                    <button type="button" onClick={() => removeVariant(idx)} className="text-slate-500 hover:text-red-500 transition-colors">
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Status Toggles */}
                    <div className="space-y-4 pt-4 border-t border-white/5">
                        <FormField
                            control={form.control}
                            name="stock"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between rounded-none border border-white/10 p-4 bg-black/50">
                                    <div className="space-y-0.5">
                                        <FormLabel className="text-[9px] uppercase font-bold tracking-[0.2em] text-white">Em Estoque</FormLabel>
                                    </div>
                                    <FormControl>
                                        <Switch checked={field.value} onCheckedChange={field.onChange} className="data-[state=checked]:bg-primary" />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="featured"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between rounded-none border border-primary/20 p-4 bg-primary/5">
                                    <div className="space-y-0.5">
                                        <FormLabel className="text-[9px] uppercase font-bold tracking-[0.2em] text-primary">Destaque ⚡</FormLabel>
                                    </div>
                                    <FormControl>
                                        <Switch checked={field.value} onCheckedChange={field.onChange} className="data-[state=checked]:bg-primary" />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                    </div>

                    <Button type="submit" disabled={isLoading || parentIsLoading} className="w-full h-14 rounded-none bg-primary text-black font-bold hover:bg-white transition-all uppercase tracking-[0.2em] text-xs mt-auto">
                        {isLoading || parentIsLoading ? "Salvando..." : "Confirmar Alterações"}
                    </Button>
                </div>

                {/* Main Content - Fields & Config (Cols 8) */}
                <div className="col-span-12 md:col-span-8 space-y-8 pb-8">

                    {/* Header Info */}

                    {/* Category Selection moved to top for better flow */}
                    <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-[10px] uppercase font-bold tracking-[0.2em] text-primary">1. Tipo de Produto</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger className="bg-black border-2 border-primary/20 text-white rounded-none h-12 focus:border-primary transition-all text-xs uppercase tracking-widest">
                                            <SelectValue placeholder="SELECIONE..." />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent className="bg-black border-2 border-white/10 text-white rounded-none">
                                        {categories.map((cat) => (
                                            <SelectItem key={cat.id} value={cat.name}>
                                                {cat.name.toUpperCase()}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* NON-KITS FLOW */}
                    {form.watch("category") !== "Kits" && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-[10px] uppercase font-bold tracking-[0.2em] text-slate-500">Nome do Produto</FormLabel>
                                        <FormControl>
                                            <Input {...field} className="bg-black border-2 border-white/10 text-white rounded-none h-12 focus:border-primary transition-all uppercase text-xs tracking-widest" placeholder="EX: ZOMO STRONG" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="space-y-4">
                                <div className="flex items-center gap-4 border p-4 border-white/10 bg-white/5">
                                    <Switch
                                        checked={showDiscount}
                                        onCheckedChange={(checked) => {
                                            setShowDiscount(checked);
                                            if (!checked) {
                                                form.setValue("original_price", 0);
                                            }
                                        }}
                                        id="discount-mode"
                                    />
                                    <Label htmlFor="discount-mode" className="text-xs uppercase font-bold tracking-widest text-white cursor-pointer select-none">
                                        Aplicar Desconto / Promoção?
                                    </Label>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                                    {showDiscount && (
                                        <FormField
                                            control={form.control}
                                            name="original_price"
                                            render={({ field }) => (
                                                <FormItem className="space-y-2 animate-in slide-in-from-left-4 fade-in duration-300">
                                                    <FormLabel className="text-[10px] uppercase font-bold tracking-[0.2em] text-slate-500 h-4 block">
                                                        Preço Original (De)
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            className="bg-black border-2 border-white/10 text-white rounded-none h-12 focus:border-primary transition-all text-sm font-mono placeholder:text-slate-700"
                                                            placeholder="R$ 0,00"
                                                            value={typeof field.value === 'number' ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(field.value) : ""}
                                                            onChange={(e) => {
                                                                const value = e.target.value.replace(/\D/g, "");
                                                                const numberValue = Number(value) / 100;
                                                                field.onChange(numberValue);
                                                            }}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                    <p className="text-[9px] text-slate-500 uppercase tracking-widest mt-2 leading-relaxed h-[36px]">
                                                        * Preço "cheio" anterior.
                                                    </p>
                                                    {(field.value || 0) > 0 && (field.value || 0) <= (form.watch("price") || 0) && (
                                                        <p className="text-[10px] text-yellow-500 font-bold uppercase tracking-widest mt-1 animate-pulse">
                                                            ⚠ Erro: O preço original deve ser maior que o promocional.
                                                        </p>
                                                    )}
                                                </FormItem>
                                            )}
                                        />
                                    )}

                                    <FormField
                                        control={form.control}
                                        name="price"
                                        render={({ field }) => {
                                            const originalPrice = form.watch("original_price") || 0;
                                            const currentPrice = field.value || 0;
                                            const discount = showDiscount && originalPrice > currentPrice
                                                ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
                                                : 0;

                                            return (
                                                <FormItem className="space-y-2">
                                                    <div className="flex justify-between items-center h-4">
                                                        <FormLabel className="text-[10px] uppercase font-bold tracking-[0.2em] text-primary block">
                                                            {showDiscount ? "Preço Promocional (Por)" : "Preço do Produto"}
                                                        </FormLabel>
                                                        {discount > 0 && (
                                                            <span className="bg-primary text-black text-[9px] font-black px-1.5 py-0.5 animate-in fade-in zoom-in">
                                                                {discount}% OFF
                                                            </span>
                                                        )}
                                                    </div>
                                                    <FormControl>
                                                        <Input
                                                            className="bg-black border-2 border-white/10 text-white rounded-none h-12 focus:border-primary transition-all text-sm font-mono placeholder:text-slate-700"
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
                                            );
                                        }}
                                    />
                                </div>
                            </div>

                            <FormField
                                control={form.control}
                                name="seo_description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-[10px] uppercase font-bold tracking-[0.2em] text-slate-500">Descrição Tática (Curta/SEO)</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                className="bg-black border-2 border-white/10 text-white rounded-none h-12 focus:border-primary transition-all text-xs"
                                                placeholder="Resumo para cards e SEO..."
                                                value={field.value || ""}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-[10px] uppercase font-bold tracking-[0.2em] text-slate-500">Descrição Completa</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                {...field}
                                                className="bg-black border-2 border-white/10 text-white rounded-none min-h-[100px] focus:border-primary transition-all text-xs resize-y"
                                                placeholder="Detalhes completos do produto..."
                                                value={field.value || ""}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="grid grid-cols-1 gap-6 items-start">
                                <FormField
                                    control={form.control}
                                    name="flavor_tags"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-[10px] uppercase font-bold tracking-[0.2em] text-slate-500">Tags Rápidas</FormLabel>
                                            <FormControl>
                                                <TagInput
                                                    tags={field.value || []}
                                                    setTags={field.onChange}
                                                    suggestions={allTags}
                                                    placeholder="TAG + ENTER"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>
                    )}

                    {/* KITS FLOW */}
                    {form.watch("category") === "Kits" && (
                        <div className="space-y-8 animate-in fade-in zoom-in-95 duration-300">

                            {/* 2. Kit Configuration (Selection) - COMES FIRST */}
                            <div className="border-2 border-primary/20 bg-primary/5 p-6 space-y-6">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="text-primary font-bold uppercase tracking-widest text-xs">2. Configuração do Smart Kit</span>
                                    <div className="h-[1px] flex-1 bg-primary/20"></div>
                                </div>

                                <FormField
                                    control={form.control}
                                    name="is_kit"
                                    render={() => (
                                        <div className="hidden">
                                            {/* Force true if kit */}
                                            <Switch checked={true} onCheckedChange={() => { }} />
                                        </div>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="kit_items"
                                    render={({ field }) => {
                                        // Derived state for filtering
                                        const currentKitItems = field.value || [];
                                        const available = availableProducts.filter(p => !currentKitItems.includes(p.id) && p.name.toLowerCase().includes(itemSearch.toLowerCase()));
                                        const selected = availableProducts.filter(p => currentKitItems.includes(p.id));

                                        // Calculate Totals
                                        const kitPrice = form.watch("price") || 0;
                                        const originalTotal = selected.reduce((acc, item) => acc + (item.price || 0), 0);
                                        const savings = originalTotal > 0 ? originalTotal - kitPrice : 0;
                                        const savingsPercent = originalTotal > 0 ? ((savings / originalTotal) * 100).toFixed(0) : 0;

                                        return (
                                            <FormItem>
                                                {/* Search Input */}
                                                <div className="relative mb-4">
                                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                                                    <Input
                                                        placeholder="BUSCAR ITEM NO ESTOQUE..."
                                                        value={itemSearch}
                                                        onChange={(e) => setItemSearch(e.target.value)}
                                                        className="pl-10 bg-black border-white/10 text-xs uppercase tracking-widest h-10 rounded-none focus:border-primary"
                                                    />
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    {/* Available Items List */}
                                                    <div className="border border-white/10 bg-black/50 p-2">
                                                        <div className="text-[8px] uppercase font-bold tracking-[0.2em] text-slate-500 mb-2">Disponíveis</div>
                                                        <div className="grid grid-cols-1 gap-1 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                                                            {available.length === 0 ? (
                                                                <div className="text-center py-4 text-[9px] text-white/30 uppercase tracking-widest">Nenhum item</div>
                                                            ) : (
                                                                available.map((product) => (
                                                                    <div
                                                                        key={product.id}
                                                                        onClick={() => field.onChange([...currentKitItems, product.id])}
                                                                        className="flex justify-between items-center p-2 hover:bg-white/10 transition-colors cursor-pointer group border border-transparent hover:border-white/10"
                                                                    >
                                                                        <span className="text-[9px] text-slate-400 group-hover:text-white uppercase truncate font-medium">{product.name}</span>
                                                                        <Plus size={10} className="text-primary opacity-0 group-hover:opacity-100" />
                                                                    </div>
                                                                ))
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* Selected Items List */}
                                                    <div className="border border-primary/20 bg-primary/5 p-2">
                                                        <div className="text-[8px] uppercase font-bold tracking-[0.2em] text-primary/80 mb-2">Selecionados ({selected.length})</div>
                                                        <div className="grid grid-cols-1 gap-1 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                                                            {selected.map(product => (
                                                                <div key={product.id} className="flex justify-between items-center bg-primary/10 border border-primary/30 p-2 group hover:bg-primary/20 transition-colors">
                                                                    <span className="text-[9px] uppercase font-bold text-primary truncate mr-2">{product.name}</span>
                                                                    <button type="button" onClick={() => field.onChange(currentKitItems.filter(id => id !== product.id))}>
                                                                        <X size={12} className="text-primary hover:text-white" />
                                                                    </button>
                                                                </div>
                                                            ))}
                                                        </div>
                                                        {/* Live Sum */}
                                                        <div className="mt-2 pt-2 border-t border-primary/20 flex justify-between items-center">
                                                            <span className="text-[9px] uppercase font-bold tracking-widest text-primary/60">Soma Original</span>
                                                            <span className="text-xs font-mono font-bold text-primary">
                                                                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(originalTotal)}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* PRICING DASHBOARD inside Kit Config */}
                                                <div className="mt-6 bg-black/60 border border-white/10 p-4 relative overflow-hidden">
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">

                                                        {/* Price Input */}
                                                        <FormField
                                                            control={form.control}
                                                            name="price"
                                                            render={({ field: priceField }) => (
                                                                <FormItem className="flex-1">
                                                                    <FormLabel className="text-[10px] uppercase font-bold tracking-[0.2em] text-primary">3. Preço Final do Kit</FormLabel>
                                                                    <FormControl>
                                                                        <Input
                                                                            className="bg-black border-2 border-primary/30 text-white rounded-none h-12 focus:border-primary transition-all text-lg font-mono font-bold text-right"
                                                                            placeholder="R$ 0,00"
                                                                            value={priceField.value ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(priceField.value) : ""}
                                                                            onChange={(e) => {
                                                                                const value = e.target.value.replace(/\D/g, "");
                                                                                const numberValue = Number(value) / 100;
                                                                                priceField.onChange(numberValue);
                                                                            }}
                                                                        />
                                                                    </FormControl>
                                                                </FormItem>
                                                            )}
                                                        />


                                                        {/* Savings Display */}
                                                        <div className="text-right pb-2">
                                                            <div className="text-[9px] uppercase font-bold tracking-widest text-slate-500 mb-1">Economia Gerada</div>
                                                            <div className="text-2xl font-black text-green-500 flex items-center justify-end gap-2">
                                                                <span>-{savingsPercent}%</span>
                                                                <span className="text-sm font-mono font-normal text-white/50">({new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(savings)})</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <FormMessage />
                                            </FormItem>
                                        );
                                    }}
                                />
                            </div>

                            {/* 4. Identity (Name & Desc) */}
                            <div className="grid grid-cols-1 gap-6">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-[10px] uppercase font-bold tracking-[0.2em] text-slate-500">4. Nome do Kit</FormLabel>
                                            <FormControl>
                                                <Input {...field} className="bg-black border-2 border-white/10 text-white rounded-none h-12 focus:border-primary transition-all uppercase text-xs tracking-widest" placeholder="EX: KIT ZOMO START" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="seo_description"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-[10px] uppercase font-bold tracking-[0.2em] text-slate-500">Descrição Tática (Curta)</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    className="bg-black border-2 border-white/10 text-white rounded-none h-12 focus:border-primary transition-all text-xs"
                                                    placeholder="Resumo para cards e SEO..."
                                                    value={field.value || ""}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="grid grid-cols-1 gap-6">
                                <FormField
                                    control={form.control}
                                    name="description"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-[10px] uppercase font-bold tracking-[0.2em] text-slate-500">Descrição Completa</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    {...field}
                                                    className="bg-black border-2 border-white/10 text-white rounded-none min-h-[100px] focus:border-primary transition-all text-xs resize-y"
                                                    placeholder="Detalhes completos do produto..."
                                                    value={field.value || ""}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* Tags for Kits */}
                            <div className="space-y-2">
                                <FormField
                                    control={form.control}
                                    name="flavor_tags"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-[10px] uppercase font-bold tracking-[0.2em] text-slate-500">Tags Rápidas</FormLabel>
                                            <FormControl>
                                                <TagInput
                                                    tags={field.value || []}
                                                    setTags={field.onChange}
                                                    suggestions={allTags}
                                                    placeholder="TAG + ENTER"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>
                    )}

                    {/* SEO Section (Collapsible or just bottom) */}
                    <div className="pt-8 border-t border-white/5 opacity-50 hover:opacity-100 transition-opacity">
                        <h4 className="text-[10px] uppercase font-bold tracking-[0.2em] text-slate-600 mb-4">Metadata SEO</h4>
                        <div className="grid grid-cols-1 gap-4">
                            <FormField
                                control={form.control}
                                name="seo_title"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-[10px] uppercase font-bold tracking-[0.2em] text-slate-500">
                                            Meta Title: [Nome do Produto] + [O que é] + [Cidade]
                                        </FormLabel>
                                        <FormControl>
                                            <Input {...field} className="bg-black/50 border border-white/5 text-xs h-10" placeholder="Ex: Vaso MD Hookah (Jarro) | Peças para Narguile em Barreiras, BA - Skybox" />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />

                        </div>
                    </div>

                </div>
            </form>
        </Form >
    );
}
