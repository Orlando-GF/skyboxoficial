export const runtime = 'edge';
"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/utils/supabase/client";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { DataTable } from "./data-table";
import { Product, getColumns } from "./columns";
import { ProductForm } from "./product-form";
import { ProductFormValues } from "./schema";

export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const supabase = createClient();

    const fetchProducts = useCallback(async () => {
        setLoading(true);
        const { data, error } = await supabase.from("products").select("*").order("created_at", { ascending: false });
        if (error) {
            toast.error("Erro ao carregar produtos.");
        } else {
            // Map supabase data to Product type if needed, but it should match mostly
            setProducts(data || []);
        }
        setLoading(false);
    }, [supabase]);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    const handleDelete = async (id: string) => {
        if (!confirm("Tem certeza?")) return;

        const { error } = await supabase.from("products").delete().eq("id", id);
        if (error) {
            toast.error("Erro ao excluir.");
        } else {
            toast.success("Produto excluído!");
            fetchProducts();
        }
    };

    const handleEdit = (product: Product) => {
        setEditingProduct(product);
        setIsDialogOpen(true);
    };

    const handleFormSubmit = async (values: ProductFormValues) => {
        try {
            if (editingProduct) {
                const { error } = await supabase
                    .from("products")
                    .update(values)
                    .eq("id", editingProduct.id);

                if (error) throw error;
                toast.success("Produto atualizado com sucesso!");
            } else {
                const { error } = await supabase
                    .from("products")
                    .insert([values]);

                if (error) throw error;
                toast.success("Produto criado com sucesso!");
            }

            setIsDialogOpen(false);
            setEditingProduct(null);
            fetchProducts();
        } catch (error) {
            console.error(error);
            toast.error("Erro ao salvar produto.");
        }
    };

    // Prepare columns with handlers
    const columns = getColumns({
        onEdit: handleEdit,
        onDelete: handleDelete
    });

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold font-display tracking-tight text-white">Produtos</h2>
                    <p className="text-slate-400">Gerencie seu catálogo completo.</p>
                </div>

                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button onClick={() => setEditingProduct(null)} className="gap-2">
                            <Plus size={18} />
                            Novo Produto
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl bg-card border-border text-white shadow-[0_0_50px_-12px_rgba(236,72,153,0.3)] max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>{editingProduct ? "Editar Produto" : "Criar Novo Produto"}</DialogTitle>
                            <DialogDescription>
                                Preencha os detalhes do produto abaixo. SEO e Tags são importantes.
                            </DialogDescription>
                        </DialogHeader>

                        <ProductForm
                            initialData={editingProduct || undefined}
                            onSubmit={handleFormSubmit}
                            isLoading={loading} // Reusing loading state for submission lock loosely
                        />
                    </DialogContent>
                </Dialog>
            </div>

            <div className="bg-slate-900/50 p-1 rounded-xl border border-slate-800/50">
                <DataTable columns={columns} data={products} />
            </div>
        </div>
    );
}
