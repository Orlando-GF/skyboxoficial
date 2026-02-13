"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/utils/supabase/client";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import Link from 'next/link';
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
        setLoading(true);
        try {
            const query = editingProduct
                ? supabase.from("products").update(values).eq("id", editingProduct.id)
                : supabase.from("products").insert([values]);

            const { error } = await query;
            if (error) throw error;

            toast.success(`Produto ${editingProduct ? "atualizado" : "criado"} com sucesso!`);
            setIsDialogOpen(false);
            setEditingProduct(null);
            fetchProducts();
        } catch (error) {
            console.error(error);
            toast.error("Erro ao salvar produto. Verifique os dados.");
        } finally {
            setLoading(false);
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
                    <h2 className="text-4xl font-display font-bold tracking-tighter text-white uppercase">Sincronizador de Produtos</h2>
                    <p className="text-[10px] uppercase font-bold tracking-[0.2em] text-primary/60 mt-2">Protocolo de Inventário v2.0</p>
                </div>

                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button onClick={() => setEditingProduct(null)} className="rounded-none bg-primary text-black font-bold hover:bg-white transition-all uppercase text-[10px] tracking-widest h-12 px-8">
                            <Plus size={16} className="mr-2" />
                            ADICIONAR ITEM
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl bg-black border-2 border-white/5 rounded-none text-white shadow-[0_0_50px_-12px_rgba(190,242,100,0.1)] max-h-[90vh] overflow-y-auto p-0">
                        <DialogHeader className="p-8 border-b-2 border-white/5 bg-primary/5">
                            <DialogTitle className="text-3xl font-display font-black uppercase tracking-tighter text-primary">
                                {editingProduct ? "EDITAR_REGISTRO" : "NOVO_REGISTRO"}
                            </DialogTitle>
                            <DialogDescription className="text-[10px] uppercase font-bold tracking-[0.3em] text-primary/40 mt-1">
                                PROTOCOLO DE INVENTÁRIO // METADADOS TÉCNICOS
                            </DialogDescription>
                        </DialogHeader>

                        <div className="p-8">

                            <ProductForm
                                initialData={editingProduct || undefined}
                                onSubmit={handleFormSubmit}
                                isLoading={loading}
                            />
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            <DataTable columns={columns} data={products} />
        </div>
    );
}
