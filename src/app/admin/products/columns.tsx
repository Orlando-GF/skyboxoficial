"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, ArrowUpDown, Pencil, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// This type is used to define the shape of our data.
export type Product = {
    id: string;
    name: string;
    price: number;
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
        header: "Img",
        cell: ({ row }) => (
            <div className="w-10 h-10 rounded-md overflow-hidden bg-slate-800 relative">
                <img
                    src={row.getValue("image") || "https://placehold.co/400"}
                    alt=""
                    className="w-full h-full object-cover"
                />
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
                >
                    Nome
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
    },
    {
        accessorKey: "category",
        header: "Categoria",
        cell: ({ row }) => (
            <span className="px-2 py-1 bg-slate-800 rounded text-xs text-slate-300">
                {row.getValue("category")}
            </span>
        )
    },
    {
        accessorKey: "price",
        header: () => <div className="text-right">Preço</div>,
        cell: ({ row }) => {
            const amount = parseFloat(row.getValue("price"));
            const formatted = new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
            }).format(amount);

            return <div className="text-right font-medium text-emerald-400">{formatted}</div>;
        },
    },
    {
        accessorKey: "stock",
        header: "Estoque",
        cell: ({ row }) => {
            const isStock = row.getValue("stock");
            return (
                <div className={`flex items-center gap-2 ${isStock ? "text-green-500" : "text-red-500"}`}>
                    <span className={`w-2 h-2 rounded-full ${isStock ? "bg-green-500" : "bg-red-500"}`}></span>
                    {isStock ? "Sim" : "Não"}
                </div>
            )
        }
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const product = row.original;

            return (
                <div className="flex justify-end">
                    <Button variant="ghost" size="icon" onClick={() => onEdit(product)}>
                        <Pencil className="w-4 h-4 text-slate-400 hover:text-white" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => onDelete(product.id)}>
                        <Trash className="w-4 h-4 text-red-500/50 hover:text-red-500" />
                    </Button>
                </div>
            );
        },
    },
];
