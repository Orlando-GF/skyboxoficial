"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Trash2, Pencil } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface Category {
    id: string;
    name: string;
    slug: string;
    created_at: string;
}

export default function CategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [formData, setFormData] = useState({ name: "", slug: "" });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const supabase = createClient();

    const fetchCategories = useCallback(async () => {
        const { data, error } = await supabase
            .from("categories")
            .select("*")
            .order("name");

        if (error) {
            toast.error("Erro ao carregar categorias");
        } else {
            setCategories(data || []);
        }
    }, [supabase]);

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            if (editingCategory) {
                // Update
                const { error } = await supabase
                    .from("categories")
                    .update({ name: formData.name, slug: formData.slug })
                    .eq("id", editingCategory.id);

                if (error) throw error;
                toast.success("Categoria atualizada com sucesso.");
            } else {
                // Create
                const { error } = await supabase
                    .from("categories")
                    .insert([{ name: formData.name, slug: formData.slug }]);

                if (error) throw error;
                toast.success("Categoria criada com sucesso.");
            }

            setIsDialogOpen(false);
            setEditingCategory(null);
            setFormData({ name: "", slug: "" });
            fetchCategories();
        } catch (error) {
            console.error("Erro ao salvar categoria:", error);
            toast.error("Erro ao salvar categoria.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        // Sonner doesn't block, so we use browser confirm for now
        if (!confirm("Tem certeza que deseja excluir esta categoria?")) return;

        const { error } = await supabase.from("categories").delete().eq("id", id);
        if (error) {
            console.error("Erro ao excluir categoria:", error);
            toast.error("Erro ao excluir categoria.");
        } else {
            toast.success("Categoria excluída com sucesso.");
            fetchCategories();
        }
    };

    const openEditDialog = (category: Category) => {
        setEditingCategory(category);
        setFormData({ name: category.name, slug: category.slug });
        setIsDialogOpen(true);
    };

    const openCreateDialog = () => {
        setEditingCategory(null);
        setFormData({ name: "", slug: "" });
        setIsDialogOpen(true);
    };

    const generateSlug = (name: string) => {
        return name
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)+/g, "");
    };

    const filteredCategories = categories.filter(cat =>
        cat.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-display font-bold text-white uppercase tracking-tighter">
                        Gerenciar <span className="text-primary">Categorias</span>
                    </h2>
                    <p className="text-slate-400 text-sm mt-1">
                        Adicione, edite ou remova categorias de produtos.
                    </p>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button
                            onClick={openCreateDialog}
                            className="bg-primary text-black font-bold uppercase tracking-widest hover:bg-white transition-all rounded-none gap-2"
                        >
                            <Plus size={16} /> Nova Categoria
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-black border-2 border-white/10 text-white rounded-none max-w-md">
                        <DialogHeader>
                            <DialogTitle className="text-xl font-bold uppercase tracking-widest text-primary">
                                {editingCategory ? "Editar Categoria" : "Nova Categoria"}
                            </DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSave} className="space-y-6 mt-4">
                            <div className="space-y-2">
                                <Label htmlFor="name" className="text-[10px] uppercase font-bold tracking-[0.2em] text-slate-500">
                                    Nome da Categoria
                                </Label>
                                <Input
                                    id="name"
                                    value={formData.name}
                                    onChange={(e) => {
                                        const name = e.target.value;
                                        setFormData({
                                            name,
                                            slug: generateSlug(name)
                                        });
                                    }}
                                    className="bg-black border-2 border-white/10 text-white rounded-none h-12 focus:border-primary transition-all uppercase text-xs tracking-widest"
                                    placeholder="EX: NOVOS PRODUTOS"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="slug" className="text-[10px] uppercase font-bold tracking-[0.2em] text-slate-500">
                                    Slug (URL Amigável)
                                </Label>
                                <Input
                                    id="slug"
                                    value={formData.slug}
                                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                    className="bg-black/50 border border-white/5 text-slate-400 rounded-none h-10 focus:border-white/20 transition-all text-xs font-mono"
                                    placeholder="ex: novos-produtos"
                                    required
                                />
                            </div>
                            <div className="flex justify-end gap-2 pt-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setIsDialogOpen(false)}
                                    className="border-white/10 text-slate-400 hover:text-white hover:bg-white/5 rounded-none uppercase text-[10px] font-bold tracking-widest"
                                >
                                    Cancelar
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="bg-primary text-black hover:bg-white transition-all rounded-none uppercase text-[10px] font-bold tracking-widest"
                                >
                                    {isSubmitting ? "Salvando..." : "Salvar"}
                                </Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Search & Filter */}
            <div className="flex items-center gap-4 bg-black/50 p-4 border border-white/5">
                <Search className="text-white/20 w-5 h-5" />
                <Input
                    placeholder="BUSCAR CATEGORIA..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-transparent border-none text-white placeholder:text-white/20 uppercase text-xs tracking-widest focus-visible:ring-0"
                />
            </div>

            {/* Categories List */}
            {loading ? (
                <div className="text-center py-12 text-slate-500 uppercase tracking-widest text-xs animate-pulse">
                    Carregando dados...
                </div>
            ) : filteredCategories.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed border-white/10 text-slate-600 uppercase tracking-widest text-xs">
                    Nenhuma categoria encontrada
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredCategories.map((category) => (
                        <div
                            key={category.id}
                            className="group bg-black border border-white/10 p-6 hover:border-primary/50 transition-all relative overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 transition-colors duration-500" />
                            <div className="relative z-10 flex justify-between items-start">
                                <div>
                                    <h3 className="text-lg font-bold text-white uppercase tracking-tight group-hover:text-primary transition-colors">
                                        {category.name}
                                    </h3>
                                    <p className="text-[10px] text-slate-500 font-mono mt-1">
                                        /{category.slug}
                                    </p>
                                </div>
                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        onClick={() => openEditDialog(category)}
                                        className="h-8 w-8 hover:bg-white/10 hover:text-white text-slate-500"
                                    >
                                        <Pencil size={14} />
                                    </Button>
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        onClick={() => handleDelete(category.id)}
                                        className="h-8 w-8 hover:bg-red-500/20 hover:text-red-500 text-slate-500"
                                    >
                                        <Trash2 size={14} />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
