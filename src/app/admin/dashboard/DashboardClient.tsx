"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { MessageCircle, PackageX, TrendingUp } from "lucide-react";

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
                            +12% em relação à semana passada
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
                            Produto Mais Desejado
                        </CardTitle>
                        <TrendingUp className="h-4 w-4 text-purple-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-xl font-bold text-white truncate text-ellipsis overflow-hidden whitespace-nowrap" title={metrics.mostDesired}>
                            {metrics.mostDesired || "N/A"}
                        </div>
                        <p className="text-xs text-slate-500 mt-1">
                            Baseado em cliques
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
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={chartData}>
                                    <XAxis
                                        dataKey="hour"
                                        stroke="#888888"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                    />
                                    <YAxis
                                        stroke="#888888"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                        tickFormatter={(value) => `${value}`}
                                    />
                                    <Tooltip
                                        cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                        contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', color: '#fff' }}
                                    />
                                    <Bar dataKey="clicks" radius={[4, 4, 0, 0]}>
                                        {chartData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.clicks > 5 ? "#10b981" : "#3b82f6"} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
