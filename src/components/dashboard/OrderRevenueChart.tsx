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
            <div className="bg-white p-4 border border-gray-100 shadow-lg rounded-lg">
                <p className="font-bold text-gray-900 mb-2">{label}</p>
                <p className="text-sm text-blue-600">Orders: {payload[0].value}</p>
                <p className="text-sm text-green-600">Revenue: ${payload[1].value.toLocaleString()}</p>
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
                    right: 30,
                    left: 0,
                    bottom: 0,
                }}
            >
                <defs>
                    <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                    </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#9CA3AF', fontSize: 12 }}
                    dy={10}
                />
                <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#9CA3AF', fontSize: 12 }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                    verticalAlign="top" 
                    align="right" 
                    iconType="circle"
                    content={({ payload }: any) => (
                        <div className="flex justify-end gap-6 mb-4">
                            {payload.map((entry: any, index: number) => (
                                <div key={`item-${index}`} className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
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
                    stroke="#3B82F6"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorOrders)"
                />
                <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#10B981"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorRevenue)"
                />
            </AreaChart>
        </ResponsiveContainer>
    );
}
