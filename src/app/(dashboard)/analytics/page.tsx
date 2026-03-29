"use client";

import { useGetDashboardInsightsQuery } from "@/redux/features/dashboard/dashboardApi";
import { Skeleton } from "@/components/ui/skeleton";
import { 
    Activity, 
    BarChart3, 
    TrendingUp, 
    ShoppingCart, 
    Package, 
    ShieldAlert, 
    CheckCircle2, 
    DollarSign,
    Zap,
    ArrowUpRight,
    ArrowDownRight,
    Globe
} from "lucide-react";
import { 
    BarChart, 
    Bar, 
    XAxis, 
    YAxis, 
    Tooltip, 
    ResponsiveContainer, 
    AreaChart, 
    Area,
    PieChart,
    Pie,
    Cell
} from "recharts";
import { motion } from "framer-motion";

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
};

const MOCK_HISTORICAL_DATA = [
    { name: "Mon", revenue: 4500, orders: 12 },
    { name: "Tue", revenue: 5200, orders: 19 },
    { name: "Wed", revenue: 3800, orders: 8 },
    { name: "Thu", revenue: 6100, orders: 24 },
    { name: "Fri", revenue: 5800, orders: 21 },
    { name: "Sat", revenue: 4200, orders: 15 },
    { name: "Sun", revenue: 4900, orders: 17 },
];

const COLORS = ["#6366f1", "#10b981", "#f59e0b", "#ef4444"];

export default function AnalyticsPage() {
    const { data: insightsResponse, isLoading, isError } = useGetDashboardInsightsQuery(undefined);

    if (isLoading) {
        return (
            <div className="space-y-10 p-2">
                <Skeleton className="h-12 w-64 rounded-2xl" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {[1, 2, 3, 4].map((i) => (
                        <Skeleton key={i} className="h-32 w-full rounded-[2.5rem]" />
                    ))}
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <Skeleton className="h-[400px] w-full rounded-[2.5rem]" />
                    <Skeleton className="h-[400px] w-full rounded-[2.5rem]" />
                </div>
            </div>
        );
    }

    if (isError || !insightsResponse?.success) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center space-y-4">
                    <div className="p-4 bg-red-50 rounded-full w-fit mx-auto">
                        <ShieldAlert className="w-10 h-10 text-red-500" />
                    </div>
                    <p className="text-slate-900 font-bold uppercase tracking-widest text-sm">System Outage: Analytics Offline</p>
                </div>
            </div>
        );
    }

    const insights = insightsResponse.insights;

    return (
        <motion.div 
            variants={container}
            initial="hidden"
            animate="show"
            className="space-y-10 max-w-[1600px] mx-auto pb-10"
        >
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                <div>
                    <h1 className="text-4xl font-black tracking-tight text-slate-900">
                        Operational <span className="premium-gradient-text italic">Intelligence</span>
                    </h1>
                    <p className="text-slate-500 mt-2 font-medium tracking-wide">
                        Real-time synchronization of global logistics and sales metrics.
                    </p>
                </div>
                <div className="flex gap-3">
                    <div className="glass-card px-6 py-3 rounded-2xl flex items-center gap-3 border-none shadow-xl shadow-indigo-500/5">
                        <Globe className="w-5 h-5 text-indigo-600 animate-pulse" />
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Global Coverage</span>
                    </div>
                </div>
            </div>

            {/* Top Insight Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <motion.div variants={item} className="glass-card p-8 rounded-[2.5rem] border-none shadow-xl shadow-indigo-500/5 group hover:bg-slate-900 transition-all duration-500">
                    <div className="flex justify-between items-start mb-6">
                        <div className="p-3 bg-indigo-500/10 text-indigo-600 rounded-2xl group-hover:bg-indigo-500 group-hover:text-white transition-colors duration-500 shadow-sm">
                            <ShoppingCart className="w-6 h-6" />
                        </div>
                        <div className="text-emerald-500 flex items-center gap-1 text-[10px] font-black">
                            <ArrowUpRight className="w-4 h-4" /> +12%
                        </div>
                    </div>
                    <div className="text-[10px] font-black text-slate-400 group-hover:text-slate-400 uppercase tracking-widest mb-1">Today's Pipeline</div>
                    <div className="text-3xl font-black text-slate-900 group-hover:text-white tracking-tighter">{insights.totalOrdersToday || 0} <span className="text-sm font-bold tracking-normal text-slate-300">Orders</span></div>
                </motion.div>

                <motion.div variants={item} className="glass-card p-8 rounded-[2.5rem] border-none shadow-xl shadow-indigo-500/5 group transition-all duration-500">
                    <div className="flex justify-between items-start mb-6">
                        <div className="p-3 bg-emerald-500/10 text-emerald-600 rounded-2xl group-hover:bg-emerald-500 group-hover:text-white transition-colors duration-500 shadow-sm">
                            <DollarSign className="w-6 h-6" />
                        </div>
                        <div className="text-emerald-500 flex items-center gap-1 text-[10px] font-black">
                            <ArrowUpRight className="w-4 h-4" /> +8.4%
                        </div>
                    </div>
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Gross Inflow</div>
                    <div className="text-3xl font-black text-slate-900 tracking-tighter">${(insights.revenueToday || 0).toLocaleString()}</div>
                </motion.div>

                <motion.div variants={item} className="glass-card p-8 rounded-[2.5rem] border-none shadow-xl shadow-indigo-500/5 group transition-all duration-500">
                    <div className="flex justify-between items-start mb-6">
                        <div className="p-3 bg-amber-500/10 text-amber-600 rounded-2xl group-hover:bg-amber-500 group-hover:text-white transition-colors duration-500 shadow-sm">
                            <Activity className="w-6 h-6" />
                        </div>
                        <div className="text-slate-300 flex items-center gap-1 text-[10px] font-black uppercase">
                            Pending
                        </div>
                    </div>
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Awaiting Fulfillment</div>
                    <div className="text-3xl font-black text-slate-900 tracking-tighter">{insights.pendingOrders || 0} <span className="text-sm font-bold tracking-normal text-slate-300">Active</span></div>
                </motion.div>

                <motion.div variants={item} className="glass-card p-8 rounded-[2.5rem] border-none shadow-xl shadow-indigo-500/5 group hover:bg-red-500 transition-all duration-500">
                    <div className="flex justify-between items-start mb-6">
                        <div className="p-3 bg-red-500/10 text-red-600 rounded-2xl group-hover:bg-white group-hover:text-red-500 transition-colors duration-500 shadow-sm">
                            <ShieldAlert className="w-6 h-6" />
                        </div>
                        <div className="text-red-500 group-hover:text-white flex items-center gap-1 text-[10px] font-black animate-pulse">
                            <ArrowDownRight className="w-4 h-4" /> Urgent
                        </div>
                    </div>
                    <div className="text-[10px] font-black text-slate-400 group-hover:text-red-100 uppercase tracking-widest mb-1">Critical Stock Level</div>
                    <div className="text-3xl font-black text-slate-900 group-hover:text-white tracking-tighter">{insights.lowStockItems || 0} <span className="text-sm font-bold tracking-normal text-slate-300 group-hover:text-red-100">Depleted</span></div>
                </motion.div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <motion.div variants={item} className="glass-card p-10 rounded-[2.5rem] border-none shadow-xl shadow-indigo-500/5 relative overflow-hidden bg-white">
                    <div className="flex items-center justify-between mb-10 relative z-10">
                        <div>
                            <h2 className="text-sm font-black uppercase tracking-[0.35em] text-slate-400">Revenue Flow</h2>
                            <p className="text-xl font-black text-slate-900 mt-1">Historical Scalability</p>
                        </div>
                        <div className="p-2 bg-indigo-50 rounded-xl text-indigo-600">
                            <TrendingUp className="w-5 h-5" />
                        </div>
                    </div>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={MOCK_HISTORICAL_DATA}>
                                <defs>
                                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 900, fill: '#94a3b8' }} />
                                <YAxis hide />
                                <Tooltip 
                                    contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', fontWeight: 900 }}
                                />
                                <Area type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={4} fillOpacity={1} fill="url(#colorRev)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                <motion.div variants={item} className="glass-card p-10 rounded-[2.5rem] border-none shadow-xl shadow-indigo-500/5 relative overflow-hidden bg-white">
                    <div className="flex items-center justify-between mb-10 relative z-10">
                        <div>
                            <h2 className="text-sm font-black uppercase tracking-[0.35em] text-slate-400">Order Volume</h2>
                            <p className="text-xl font-black text-slate-900 mt-1">Daily Logistical Pulse</p>
                        </div>
                        <div className="p-2 bg-emerald-50 rounded-xl text-emerald-600">
                            <BarChart3 className="w-5 h-5" />
                        </div>
                    </div>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={MOCK_HISTORICAL_DATA}>
                                <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', fontWeight: 900 }} />
                                <Bar dataKey="orders" fill="#10b981" radius={[10, 10, 0, 0]} />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 900, fill: '#94a3b8' }} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>
            </div>

            {/* Tactical Overview */}
            <motion.div variants={item} className="glass-card p-10 rounded-[2.5rem] border-none shadow-xl shadow-indigo-500/5 bg-white overflow-hidden">
                <div className="flex items-center justify-between mb-10">
                    <div>
                        <h2 className="text-sm font-black uppercase tracking-[0.35em] text-slate-400">Operational Integrity</h2>
                        <p className="text-xl font-black text-slate-900 mt-1">Consolidated Health Metrics</p>
                    </div>
                    <div className="p-3 bg-indigo-600 rounded-2xl text-white shadow-lg shadow-indigo-600/30">
                        <Zap className="w-5 h-5" />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="p-8 rounded-[2rem] bg-slate-50 border border-slate-100 group hover:border-indigo-200 transition-all duration-500">
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                             Full Fulfillment Rate <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                        </div>
                        <div className="text-4xl font-black text-slate-900 tracking-tighter">
                            {Math.round((insights.completedOrders / (insights.totalOrdersToday || 1)) * 100)}%
                        </div>
                        <div className="w-full h-1 bg-slate-200 rounded-full mt-4 overflow-hidden">
                            <div 
                                className="h-full bg-emerald-500 transition-all duration-1000" 
                                style={{ width: `${(insights.completedOrders / (insights.totalOrdersToday || 1)) * 100}%` }}
                            />
                        </div>
                    </div>

                    <div className="p-8 rounded-[2rem] bg-slate-50 border border-slate-100 group hover:border-indigo-200 transition-all duration-500">
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                             Inventory Stability <Package className="w-3.5 h-3.5 text-indigo-500" />
                        </div>
                        <div className="text-4xl font-black text-slate-900 tracking-tighter">
                            {100 - (insights.lowStockItems || 0)}%
                        </div>
                        <div className="w-full h-1 bg-slate-200 rounded-full mt-4 overflow-hidden">
                            <div 
                                className="h-full bg-indigo-500 transition-all duration-1000" 
                                style={{ width: `${100 - (insights.lowStockItems || 0)}%` }}
                            />
                        </div>
                    </div>

                    <div className="p-8 rounded-[2rem] bg-slate-50 border border-slate-100 group hover:border-indigo-200 transition-all duration-500">
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                             Real-time Throttling <Activity className="w-3.5 h-3.5 text-amber-500" />
                        </div>
                        <div className="text-4xl font-black text-slate-900 tracking-tighter">
                            Nominal
                        </div>
                        <div className="mt-4 flex gap-1">
                            {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                                <div key={i} className="h-1 flex-1 bg-emerald-500 rounded-full" />
                            ))}
                        </div>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}

