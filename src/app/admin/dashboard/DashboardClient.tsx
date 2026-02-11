"use client";

import dynamic from "next/dynamic";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircle, PackageX, TrendingUp } from "lucide-react";

// Dynamically import Recharts to keep it out of the Edge Function bundle
const BarChartComponent = dynamic(() => import("./DashboardChart"), {
    ssr: false,
    loading: () => <div className="h-[300px] w-full bg-slate-800/20 animate-pulse rounded-lg flex items-center justify-center text-slate-500">Carregando gráfico...</div>
});

interface DashboardProps {
    metrics: {
        whatsappClicks: number;
        outOfStock: number;
        mostDesired: string;
    };
    chartData: any[];
}

export default function DashboardClient({ metrics, chartData }: DashboardProps) {
    return (
        <div className="space-y-8">
            <h2 className="text-3xl font-bold font-display tracking-tight text-white mb-6">
                Visão Geral
            </h2>

            {/* Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-slate-900 border-slate-800">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-400">
                            Intenções de Compra (Zap)
                        </CardTitle>
                        <MessageCircle className="h-4 w-4 text-emerald-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-white">{metrics.whatsappClicks}</div>
                        <p className="text-xs text-emerald-500/80 mt-1">
                            Baseado em eventos reais
                        </p>
                    </CardContent>
                </Card>

                <Card className="bg-slate-900 border-slate-800">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-400">
                            Produtos Sem Estoque
                        </CardTitle>
                        <PackageX className="h-4 w-4 text-orange-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-white">{metrics.outOfStock}</div>
                        <p className="text-xs text-orange-500/80 mt-1">
                            Requer atenção imediata
                        </p>
                    </CardContent>
                </Card>

                <Card className="bg-slate-900 border-slate-800">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-400">
                            Destaque de Cliques
                        </CardTitle>
                        <TrendingUp className="h-4 w-4 text-purple-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-xl font-bold text-white truncate text-ellipsis overflow-hidden whitespace-nowrap" title={metrics.mostDesired}>
                            {metrics.mostDesired || "Nenhum ainda"}
                        </div>
                        <p className="text-xs text-slate-500 mt-1">
                            Produto mais clicado
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
                <Card className="bg-slate-900 border-slate-800">
                    <CardHeader>
                        <CardTitle className="text-white">Intenção de Compra x Hora do Dia</CardTitle>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <BarChartComponent chartData={chartData} />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
