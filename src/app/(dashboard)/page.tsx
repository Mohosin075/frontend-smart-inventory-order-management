"use client";

import { Button } from "@/components/ui/button";
import { 
    ShoppingCart, 
    Clock, 
    AlertTriangle, 
    DollarSign, 
    ArrowUpRight, 
    CheckCircle2 
} from "lucide-react";
import { useGetDashboardInsightsQuery } from "@/redux/features/dashboard/dashboardApi";
import { useGetRecentActivitiesQuery } from "@/redux/features/activity/activityApi";
import { Skeleton } from "@/components/ui/skeleton";
import dynamic from "next/dynamic";

// Dynamic import for Recharts to avoid SSR issues
const OrderRevenueChart = dynamic(() => import("@/components/dashboard/OrderRevenueChart"), { ssr: false });

export default function Dashboard() {
    const { data: insightsData, isLoading: insightsLoading } = useGetDashboardInsightsQuery(undefined);
    const { data: activityData, isLoading: activityLoading } = useGetRecentActivitiesQuery(undefined);

    if (insightsLoading || activityLoading) {
        return (
            <div className="p-6 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map((i) => (
                        <Skeleton key={i} className="h-32 w-full rounded-xl" />
                    ))}
                </div>
                <Skeleton className="h-[400px] w-full rounded-xl" />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Skeleton className="h-80 w-full rounded-xl" />
                    <Skeleton className="h-80 w-full rounded-xl" />
                </div>
            </div>
        );
    }

    const insights = insightsData?.data || {
        totalOrdersToday: 0,
        pendingOrders: 0,
        completedOrders: 0,
        lowStockItemsCount: 0,
        revenueToday: 0,
        productSummary: [],
    };

    const activities = activityData?.data || [];

    return (
        <div className="p-6 space-y-8 max-w-[1600px] mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Inventory Dashboard</h1>
                    <p className="text-gray-500 mt-1">Real-time overview of your warehouse and sales activity.</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="shadow-sm">
                        Export Data
                    </Button>
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-all duration-200">
                        Create New Order
                    </Button>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                            <ShoppingCart className="w-5 h-5" />
                        </div>
                        <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full flex items-center gap-1">
                            <ArrowUpRight className="w-3 h-3" /> +12%
                        </span>
                    </div>
                    <p className="text-sm font-medium text-gray-500">Total Orders Today</p>
                    <h2 className="text-3xl font-bold text-gray-900 mt-1">{insights.totalOrdersToday}</h2>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 bg-orange-50 rounded-lg text-orange-600">
                            <Clock className="w-5 h-5" />
                        </div>
                    </div>
                    <p className="text-sm font-medium text-gray-500">Pending Orders</p>
                    <h2 className="text-3xl font-bold text-gray-900 mt-1">{insights.pendingOrders}</h2>
                    <p className="text-xs text-gray-400 mt-2">{insights.completedOrders} Completed</p>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 bg-red-50 rounded-lg text-red-600">
                            <AlertTriangle className="w-5 h-5" />
                        </div>
                    </div>
                    <p className="text-sm font-medium text-gray-500">Low Stock Items</p>
                    <h2 className="text-3xl font-bold text-gray-900 mt-1 text-red-600">{insights.lowStockItemsCount}</h2>
                    <p className="text-xs text-red-400 mt-2 font-medium">Requires attention</p>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 bg-green-50 rounded-lg text-green-600">
                            <DollarSign className="w-5 h-5" />
                        </div>
                    </div>
                    <p className="text-sm font-medium text-gray-500">Revenue Today</p>
                    <h2 className="text-3xl font-bold text-gray-900 mt-1">${insights.revenueToday.toLocaleString()}</h2>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Operations Overview</h2>
                        <p className="text-sm text-gray-500 mt-1">Order volume and revenue performance.</p>
                    </div>
                    <select className="text-sm border-gray-200 rounded-lg focus:ring-blue-500">
                        <option>Last 7 Days</option>
                        <option>Last 30 Days</option>
                    </select>
                </div>
                <div className="h-[350px] w-full">
                    {/* Component to be created */}
                    <OrderRevenueChart />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Product Summary */}
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-bold text-gray-900">Product Summary</h2>
                        <Button variant="ghost" size="sm" className="text-blue-600 text-xs font-bold uppercase tracking-wider">
                            View Inventory
                        </Button>
                    </div>
                    <div className="space-y-3">
                        {insights.productSummary.length > 0 ? (
                            insights.productSummary.map((product: any, index: number) => (
                                <div
                                    key={index}
                                    className="flex items-center justify-between p-4 rounded-xl border border-gray-50 bg-gray-50/30 hover:bg-gray-50 transition-colors"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`w-2 h-2 rounded-full ${product.stock <= product.threshold ? 'bg-red-500 animate-pulse' : 'bg-green-500'}`} />
                                        <div>
                                            <div className="text-sm font-bold text-gray-900">{product.name}</div>
                                            <div className="text-xs text-gray-500">Stock: {product.stock} units</div>
                                        </div>
                                    </div>
                                    <div className={`text-xs font-bold px-3 py-1 rounded-full ${
                                        product.stock <= product.threshold 
                                        ? 'bg-red-50 text-red-600' 
                                        : 'bg-green-50 text-green-600'
                                    }`}>
                                        {product.stock <= product.threshold ? 'LOW STOCK' : 'OK'}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-sm text-gray-400 text-center py-8 italic">No products recorded.</p>
                        )}
                    </div>
                </div>

                {/* Activity Feed */}
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-bold text-gray-900">Recent Activity</h2>
                    </div>
                    <div className="relative space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-[1px] before:bg-gray-100">
                        {activities.length > 0 ? (
                            activities.slice(0, 8).map((activity: any, index: number) => (
                                <div key={index} className="relative pl-8">
                                    <div className="absolute left-0 top-1.5 w-4 h-4 rounded-full border-2 border-white bg-blue-500 shadow-sm" />
                                    <div className="flex flex-col">
                                        <p className="text-sm text-gray-800 leading-relaxed font-medium">
                                            {activity.action}
                                        </p>
                                        <p className="text-xs text-gray-400 mt-1">
                                            {new Date(activity.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} — {activity.user || 'System'}
                                        </p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-sm text-gray-400 text-center py-8 italic">No recent activity.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
