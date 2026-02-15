"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

// This type is used to define the shape of our data.
export type Product = {
    id: string;
    name: string;
    price: number;
    original_price?: number;
    category: string;
    stock: boolean;
    image: string;
    flavor_tags: string[];
};

interface ColumnsProps {
    onEdit: (product: Product) => void;
    onDelete: (id: string) => void;
}

export const getColumns = ({ onEdit, onDelete }: ColumnsProps): ColumnDef<Product>[] => [
    {
        accessorKey: "image",
        header: () => <div className="text-[10px] uppercase font-bold tracking-[0.2em] text-primary text-center">IMG</div>,
        cell: ({ row }) => (
            <div className="flex justify-center">
                <div className="w-10 h-10 rounded-none border border-white/10 bg-black relative overflow-hidden">
                    <img
                        src={row.getValue("image") || "https://placehold.co/400"}
                        alt=""
                        className="w-full h-full object-cover"
                    />
                </div>
            </div>
        ),
    },
    {
        accessorKey: "name",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="text-primary font-display font-bold uppercase tracking-tighter hover:bg-primary/10 p-0 h-auto"
                >
                    Nome
                    <ArrowUpDown className="ml-2 h-3 w-3" />
                </Button>
            );
        },
        cell: ({ row }) => (
            <div className="uppercase font-bold tracking-tight text-white">
                {row.getValue("name")}
            </div>
        ),
    },
    {
        accessorKey: "category",
        header: () => <div className="text-[10px] uppercase font-bold tracking-[0.2em] text-primary">Classificação</div>,
        cell: ({ row }) => (
            <span className="px-3 py-1 bg-primary text-black border border-white/10 rounded-none text-[9px] uppercase font-black tracking-widest shadow-[2px_2px_0px_rgba(0,0,0,1)]">
                {row.getValue("category")}
            </span>
        )
    },
    {
        accessorKey: "flavor_tags",
        header: () => <div className="text-[10px] uppercase font-bold tracking-[0.2em] text-primary">Atributos</div>,
        cell: ({ row }) => {
            const tags = row.getValue("flavor_tags") as string[];
            if (!tags || tags.length === 0) return <div className="text-[10px] text-white/5 font-mono tracking-widest">—</div>;
            return (
                <div className="flex flex-wrap gap-1 max-w-[150px]">
                    {tags.map((tag, idx) => (
                        <span key={idx} className="bg-primary/5 border border-primary/20 text-primary text-[8px] font-black uppercase px-2 py-0.5 rounded-none tracking-widest shadow-[1px_1px_0px_rgba(0,0,0,1)]">
                            {tag}
                        </span>
                    ))}
                </div>
            )
        }
    },
    {
        accessorKey: "stock",
        header: () => <div className="text-[10px] uppercase font-bold tracking-[0.2em] text-primary text-center">Status</div>,
        cell: ({ row }) => {
            const isStock = row.getValue("stock");
            return (
                <div className="flex justify-center">
                    <div className={`flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.15em] ${isStock ? "text-primary" : "text-red-500"}`}>
                        <div className={`w-1.5 h-1.5 ${isStock ? "bg-primary" : "bg-red-500"} shadow-[0_0_8px_rgba(190,242,100,0.5)]`}></div>
                        {isStock ? "ESTOQUE_OK" : "CRITICAL_LOW"}
                    </div>
                </div>
            )
        }
    },
    {
        accessorKey: "price",
        header: () => <div className="text-right text-[10px] uppercase font-bold tracking-[0.2em] text-primary">Valor Unitário</div>,
        cell: ({ row }) => {
            const amount = parseFloat(row.getValue("price"));
            const originalPrice = row.original.original_price ? Number(row.original.original_price) : 0;
            const hasDiscount = originalPrice > amount;
            const discountPercentage = hasDiscount ? Math.round(((originalPrice - amount) / originalPrice) * 100) : 0;

            const formatted = new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
            }).format(amount);

            return (
                <div className="flex flex-col items-end gap-1">
                    <div className="flex items-center gap-2">
                        {hasDiscount && (
                            <span className="bg-primary text-black text-[9px] font-black px-1.5 py-0.5 animate-in fade-in zoom-in uppercase tracking-widest whitespace-nowrap">
                                {discountPercentage}% OFF
                            </span>
                        )}
                        <div className="text-right font-black text-primary tracking-tighter text-sm font-mono">{formatted}</div>
                    </div>
                </div>
            );
        },
    },
    {
        id: "actions",
        header: () => <div className="text-center text-[10px] uppercase font-bold tracking-[0.2em] text-primary">Ações</div>,
        cell: ({ row }) => {
            const product = row.original;

            return (
                <div className="flex justify-center gap-2">
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => onEdit(product)}
                        className="w-8 h-8 rounded-none border-2 border-white/10 bg-black hover:bg-primary hover:text-black hover:border-primary transition-all group"
                    >
                        <Pencil className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                    </Button>
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => onDelete(product.id)}
                        className="w-8 h-8 rounded-none border-2 border-white/10 bg-black hover:bg-red-600 hover:text-white hover:border-red-600 transition-all group"
                    >
                        <Trash2 className="w-4 h-4" />
                    </Button>
                </div>
            );
        },
    },
];
