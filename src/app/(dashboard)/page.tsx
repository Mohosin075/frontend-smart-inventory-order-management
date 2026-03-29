"use client";

import { Button } from "@/components/ui/button";
import { 
    ShoppingCart, 
    Clock, 
    AlertTriangle, 
    DollarSign, 
    ArrowUpRight, 
    Package,
    Activity,
    Plus
} from "lucide-react";
import { useGetDashboardInsightsQuery } from "@/redux/features/dashboard/dashboardApi";
import { useGetRecentActivitiesQuery } from "@/redux/features/activity/activityApi";
import { Skeleton } from "@/components/ui/skeleton";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";

// Dynamic import for Recharts to avoid SSR issues
const OrderRevenueChart = dynamic(() => import("@/components/dashboard/OrderRevenueChart"), { ssr: false });

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

export default function Dashboard() {
    const { data: insightsData, isLoading: insightsLoading } = useGetDashboardInsightsQuery(undefined);
    const { data: activityData, isLoading: activityLoading } = useGetRecentActivitiesQuery(undefined);

    if (insightsLoading || activityLoading) {
        return (
            <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map((i) => (
                        <Skeleton key={i} className="h-32 w-full rounded-3xl" />
                    ))}
                </div>
                <Skeleton className="h-[450px] w-full rounded-3xl" />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Skeleton className="h-96 w-full rounded-3xl" />
                    <Skeleton className="h-96 w-full rounded-3xl" />
                </div>
            </div>
        );
    }

    const insights = insightsData?.insights || {
        totalOrdersToday: 0,
        pendingOrders: 0,
        completedOrders: 0,
        lowStockItemsCount: 0,
        revenueToday: 0,
        productSummary: [],
    };

    const activities = activityData?.activities || [];

    const stats = [
        {
            label: "Total Orders Today",
            value: insights.totalOrdersToday,
            icon: ShoppingCart,
            color: "indigo",
            trend: "+12.5%",
            subtext: "vs yesterday"
        },
        {
            label: "Pending Orders",
            value: insights.pendingOrders,
            icon: Clock,
            color: "orange",
            trend: insights.completedOrders + " Completed",
            subtext: "Action required"
        },
        {
            label: "Low Stock Items",
            value: insights.lowStockItemsCount,
            icon: AlertTriangle,
            color: "red",
            trend: "Critical",
            subtext: "Check Restock Queue",
            isAlert: insights.lowStockItemsCount > 0
        },
        {
            label: "Revenue Today",
            value: `$${insights.revenueToday.toLocaleString()}`,
            icon: DollarSign,
            color: "emerald",
            trend: "+8.2%",
            subtext: "Real-time"
        }
    ];

    return (
        <motion.div 
            variants={container}
            initial="hidden"
            animate="show"
            className="space-y-10 max-w-[1600px] mx-auto pb-10"
        >
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-bold tracking-tight text-slate-900">
                        Dashboard <span className="premium-gradient-text italic">Overview</span>
                    </h1>
                    <p className="text-slate-500 mt-2 font-medium">Welcome back, here's what's happening with your inventory today.</p>
                </div>
                <div className="flex gap-4">
                    <Button variant="outline" className="h-12 px-6 rounded-xl border-slate-200 hover:bg-slate-50 font-bold uppercase tracking-wider text-[10px] transition-all duration-300">
                        Export Report
                    </Button>
                    {/* <Button className="h-12 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-xl shadow-indigo-600/20 font-bold uppercase tracking-wider text-[10px] gap-2 transition-all duration-300">
                        <Plus className="w-4 h-4" /> Create New Order
                    </Button> */}
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                    <motion.div 
                        key={i}
                        variants={item}
                        whileHover={{ y: -5 }}
                        className={`glass-card p-6 rounded-[2rem] premium-shadow border-none group cursor-default transition-all duration-500`}
                    >
                        <div className="flex justify-between items-start mb-6">
                            <div className={`p-3 rounded-2xl bg-${stat.color}-500/10 text-${stat.color}-600 group-hover:scale-110 transition-transform duration-500`}>
                                <stat.icon className="w-6 h-6" />
                            </div>
                            <span className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest ${
                                stat.color === 'red' && stat.isAlert ? 'bg-red-100 text-red-600 animate-pulse' : 'bg-slate-100 text-slate-500'
                            }`}>
                                {stat.trend}
                            </span>
                        </div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight">{stat.value}</h2>
                        <p className="text-[10px] text-slate-400 mt-3 flex items-center gap-1.5 font-medium">
                            <Activity className="w-3 h-3" /> {stat.subtext}
                        </p>
                    </motion.div>
                ))}
            </div>

            {/* Main Content Area */}
            <motion.div variants={item} className="glass-card p-8 rounded-[2.5rem] premium-shadow border-none">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Sales & Orders</h2>
                        <p className="text-sm text-slate-500 mt-1 font-medium">Visualization of your store's performance.</p>
                    </div>
                    <div className="flex bg-slate-100 p-1 rounded-xl">
                        {['7 Days', '30 Days', '90 Days'].map((range, i) => (
                            <button 
                                key={i}
                                className={`px-4 py-2 text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all ${
                                    i === 0 ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'
                                }`}
                            >
                                {range}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="h-[400px] w-full">
                    <OrderRevenueChart />
                </div>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Product Summary */}
                <motion.div variants={item} className="glass-card p-8 rounded-[2.5rem] premium-shadow border-none">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-indigo-50 rounded-xl text-indigo-600">
                                <Package className="w-5 h-5" />
                            </div>
                            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Stock Status</h2>
                        </div>
                        <Button variant="ghost" size="sm" className="text-indigo-600 hover:text-indigo-700 text-[10px] font-black uppercase tracking-[0.2em] px-0 hover:bg-transparent">
                            Full Catalog
                        </Button>
                    </div>
                    <div className="space-y-4">
                        {insights.productSummary.length > 0 ? (
                            insights.productSummary.map((product: any, index: number) => (
                                <motion.div
                                    key={index}
                                    whileHover={{ x: 10 }}
                                    className="flex items-center justify-between p-5 rounded-3xl border border-slate-50 bg-slate-50/50 hover:bg-white hover:shadow-md transition-all duration-300 group"
                                >
                                    <div className="flex items-center gap-5">
                                        <div className={`w-3 h-3 rounded-full ring-4 ${
                                            product.stock <= product.threshold 
                                            ? 'bg-red-500 ring-red-500/10 animate-pulse' 
                                            : 'bg-emerald-500 ring-emerald-500/10'
                                        }`} />
                                        <div>
                                            <div className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors uppercase tracking-wide">{product.name}</div>
                                            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">Avail: {product.stock} units</div>
                                        </div>
                                    </div>
                                    <div className={`text-[10px] font-black px-4 py-1.5 rounded-xl uppercase tracking-[0.15em] ${
                                        product.stock <= product.threshold 
                                        ? 'bg-red-50 text-red-600' 
                                        : 'bg-emerald-50 text-emerald-600'
                                    }`}>
                                        {product.stock <= product.threshold ? 'Low Stock' : 'Stable'}
                                    </div>
                                </motion.div>
                            ))
                        ) : (
                            <div className="flex flex-col items-center justify-center py-12 text-center opacity-40">
                                <Package className="w-12 h-12 mb-4" />
                                <p className="text-sm font-bold uppercase tracking-widest italic">No stock data available</p>
                            </div>
                        )}
                    </div>
                </motion.div>

                {/* Activity Feed */}
                <motion.div variants={item} className="glass-card p-8 rounded-[2.5rem] premium-shadow border-none">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-amber-50 rounded-xl text-amber-600">
                                <Activity className="w-5 h-5" />
                            </div>
                            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Recent Activities</h2>
                        </div>
                    </div>
                    <div className="relative space-y-8 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-100">
                        {activities.length > 0 ? (
                            activities.slice(0, 6).map((activity: any, index: number) => (
                                <motion.div 
                                    key={index} 
                                    whileHover={{ x: 5 }}
                                    className="relative pl-10"
                                >
                                    <div className="absolute left-1.5 top-1 w-3 h-3 rounded-full border-2 border-white bg-indigo-500 shadow-sm" />
                                    <div className="flex flex-col bg-slate-50/50 p-4 rounded-2xl hover:bg-white hover:shadow-md transition-all">
                                        <p className="text-sm text-slate-800 leading-relaxed font-bold tracking-tight">
                                            {activity.action}
                                        </p>
                                        <div className="flex items-center gap-3 mt-2">
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                                {new Date(activity.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                            <span className="w-1 h-1 rounded-full bg-slate-300" />
                                            <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">
                                                {activity.metadata?.user || 'System'}
                                            </span>
                                        </div>
                                    </div>
                                </motion.div>
                            ))
                        ) : (
                            <div className="flex flex-col items-center justify-center py-12 text-center opacity-40">
                                <Activity className="w-12 h-12 mb-4" />
                                <p className="text-sm font-bold uppercase tracking-widest italic">No activities recorded</p>
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
}

