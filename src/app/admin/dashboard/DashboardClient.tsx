"use client";

import dynamic from "next/dynamic";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircle, PackageX, TrendingUp, Target } from "lucide-react";

// Dynamically import Recharts to keep it out of the Edge Function bundle
const BarChartComponent = dynamic(() => import("./DashboardChart"), {
    ssr: false,
    loading: () => <div className="h-[300px] w-full bg-black border-2 border-white/5 animate-pulse flex items-center justify-center text-slate-500 uppercase text-[10px] tracking-widest">Carregando telemetria...</div>
});

interface DashboardProps {
    metrics: {
        whatsappClicks: number;
        outOfStock: number;
        mostDesired: string;
        campaignLeads: number;
        conversionRate: number;
    };
    chartData: Array<{ hour: string; clicks: number }>;
}

interface MetricCardProps {
    title: string;
    value: string | number;
    description: string;
    icon: React.ReactNode;
}

function MetricCard({ title, value, description, icon }: MetricCardProps) {
    return (
        <Card className="bg-black border-2 border-white/5 rounded-none group hover:border-primary/50 transition-colors">
            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                <CardTitle className="text-[10px] font-bold text-primary uppercase tracking-[0.2em] leading-tight min-h-[30px] pr-4">
                    {title}
                </CardTitle>
                <div className="shrink-0">{icon}</div>
            </CardHeader>
            <CardContent>
                <div className="text-3xl font-bold text-white tracking-tighter truncate" title={String(value)}>
                    {value}
                </div>
                <p className="text-[10px] text-primary font-bold uppercase tracking-widest mt-2 border-l border-primary pl-2 h-[10px] flex items-center">
                    {description}
                </p>
            </CardContent>
        </Card>
    );
}

export default function DashboardClient({ metrics, chartData }: DashboardProps) {
    return (
        <div className="space-y-8">
            <h2 className="text-4xl font-display font-bold tracking-tighter text-white mb-8 mt-2 uppercase">
                Cockpit de Telemetria
            </h2>

            {/* Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <MetricCard
                    title="Intenções de Compra (Zap)"
                    value={metrics.whatsappClicks}
                    description="Baseado em eventos reais"
                    icon={<MessageCircle className="h-4 w-4 text-primary group-hover:scale-110 transition-transform" />}
                />
                <MetricCard
                    title="Produtos Sem Estoque"
                    value={metrics.outOfStock}
                    description="Requer atenção imediata"
                    icon={<PackageX className="h-4 w-4 text-primary group-hover:scale-110 transition-transform" />}
                />
                <MetricCard
                    title="Destaque de Cliques"
                    value={metrics.mostDesired || "Nenhum ainda"}
                    description="Produto mais clicado"
                    icon={<TrendingUp className="h-4 w-4 text-primary group-hover:scale-110 transition-transform" />}
                />
                <MetricCard
                    title="Leads de Campanha"
                    value={metrics.campaignLeads}
                    description="Acessos via Links Rastreados"
                    icon={<Target className="h-4 w-4 text-primary group-hover:scale-110 transition-transform" />}
                />
                <MetricCard
                    title="Taxa de Conversão"
                    value={`${metrics.conversionRate}%`}
                    description="Cliques / Visitantes"
                    icon={<TrendingUp className="h-4 w-4 text-primary group-hover:scale-110 transition-transform" />}
                />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
                <Card className="bg-black border-2 border-white/5 rounded-none">
                    <CardHeader className="border-b border-white/5 mb-6">
                        <CardTitle className="text-white font-display uppercase tracking-tighter text-lg">Telemetria de Intenção x Hora</CardTitle>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <BarChartComponent chartData={chartData} />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
