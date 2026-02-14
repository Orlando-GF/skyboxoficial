"use client";

import * as React from "react";
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    getFilteredRowModel,
    useReactTable,
    SortingState,
    ColumnFiltersState,
} from "@tanstack/react-table";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
}

export function DataTable<TData, TValue>({
    columns,
    data,
}: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        state: {
            sorting,
            columnFilters,
        },
    });

    return (
        <div className="bg-black border-2 border-white/5 rounded-none overflow-hidden">
            <div className="p-4 border-b-2 border-white/5 bg-black">
                <Input
                    placeholder="FILTRAR POR NOME..."
                    value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
                    onChange={(event) =>
                        table.getColumn("name")?.setFilterValue(event.target.value)
                    }
                    className="max-w-sm bg-black border-2 border-white/10 rounded-none h-12 focus:border-primary transition-all text-[10px] uppercase font-bold tracking-[0.2em]"
                />
            </div>

            <div className="overflow-x-auto bg-black">
                <Table className="border-collapse">
                    <TableHeader className="bg-primary/5 border-b-2 border-white/5">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id} className="border-white/5 hover:bg-white/5 transition-colors">
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id} className="text-primary font-display font-bold uppercase tracking-tighter py-6">
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                    className="border-white/5 hover:bg-primary/5 transition-colors group"
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id} className="py-4">
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center text-slate-500 font-mono text-xs">
                                    NENHUM_RESULTADO_ENCONTRADO
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            <div className="flex items-center justify-between p-4 border-t-2 border-white/5 bg-black">
                <div className="flex items-center gap-4">
                    <div className="text-[10px] uppercase font-bold tracking-[0.2em] text-white/20">
                        Protocolo_Paginação: {table.getState().pagination.pageIndex + 1} / {table.getPageCount()}
                    </div>
                </div>
                <div className="flex items-center space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                        className="border-2 border-white/10 bg-black text-white hover:bg-primary hover:text-black rounded-none uppercase text-[10px] font-black tracking-widest transition-all h-10 px-6"
                    >
                        ANTERIOR
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                        className="border-2 border-white/10 bg-black text-white hover:bg-primary hover:text-black rounded-none uppercase text-[10px] font-black tracking-widest transition-all h-10 px-6"
                    >
                        PRÓXIMO
                    </Button>
                </div>
            </div>
        </div>
    );
}
