"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

export default function DashboardChart({ chartData }: { chartData: Array<{ hour: string; clicks: number }> }) {
    return (
        <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                    <XAxis
                        dataKey="hour"
                        stroke="#bef264"
                        strokeOpacity={0.2}
                        fontSize={10}
                        tickLine={false}
                        axisLine={false}
                    />
                    <YAxis
                        stroke="#bef264"
                        strokeOpacity={0.2}
                        fontSize={10}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(value) => `${value}`}
                    />
                    <Tooltip
                        cursor={{ fill: 'rgba(190,242,100,0.05)' }}
                        contentStyle={{ backgroundColor: '#000', border: '2px solid #bef264', color: '#fff', borderRadius: '0px' }}
                    />
                    <Bar dataKey="clicks" radius={[0, 0, 0, 0]}>
                        {chartData.map((entry, index: number) => (
                            <Cell key={`cell-${index}`} fill="#bef264" />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
