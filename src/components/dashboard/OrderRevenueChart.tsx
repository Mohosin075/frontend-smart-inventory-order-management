"use client";

import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from "recharts";

const data = [
    { name: "Mon", orders: 40, revenue: 2400 },
    { name: "Tue", orders: 30, revenue: 1398 },
    { name: "Wed", orders: 20, revenue: 9800 },
    { name: "Thu", orders: 27, revenue: 3908 },
    { name: "Fri", orders: 18, revenue: 4800 },
    { name: "Sat", orders: 23, revenue: 3800 },
    { name: "Sun", orders: 34, revenue: 4300 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-slate-900/90 backdrop-blur-md p-4 border border-white/10 shadow-2xl rounded-xl">
                <p className="font-bold text-white mb-2">{label}</p>
                <div className="space-y-1">
                    <p className="text-sm text-indigo-400 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-indigo-500" />
                        Orders: {payload[0].value}
                    </p>
                    <p className="text-sm text-emerald-400 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                        Revenue: ${payload[1].value.toLocaleString()}
                    </p>
                </div>
            </div>
        );
    }
    return null;
};

export default function OrderRevenueChart() {
    return (
        <ResponsiveContainer width="100%" height="100%">
            <AreaChart
                data={data}
                margin={{
                    top: 10,
                    right: 10,
                    left: -20,
                    bottom: 0,
                }}
            >
                <defs>
                    <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" opacity={0.5} />
                <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }}
                    dy={10}
                />
                <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#6366f1', strokeWidth: 1, strokeDasharray: '4 4' }} />
                <Legend 
                    verticalAlign="top" 
                    align="right" 
                    iconType="circle"
                    content={({ payload }: any) => (
                        <div className="flex justify-end gap-6 mb-8">
                            {payload.map((entry: any, index: number) => (
                                <div key={`item-${index}`} className="flex items-center gap-2 group cursor-pointer transition-opacity hover:opacity-80">
                                    <div className="w-2.5 h-2.5 rounded-full shadow-sm" style={{ backgroundColor: entry.color }} />
                                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">
                                        {entry.value}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                />
                <Area
                    type="monotone"
                    dataKey="orders"
                    stroke="#6366f1"
                    strokeWidth={4}
                    fillOpacity={1}
                    fill="url(#colorOrders)"
                    animationDuration={2000}
                />
                <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#10b981"
                    strokeWidth={4}
                    fillOpacity={1}
                    fill="url(#colorRevenue)"
                    animationDuration={2500}
                />
            </AreaChart>
        </ResponsiveContainer>
    );
}

