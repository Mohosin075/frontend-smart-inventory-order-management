"use client";

import { useGetRecentActivitiesQuery } from "@/redux/features/activity/activityApi";
import { Skeleton } from "@/components/ui/skeleton";
import { 
    History, 
    ArrowRight, 
    ArrowUpCircle, 
    ShoppingCart, 
    Package, 
    User, 
    PlusCircle,
    Truck,
    CheckCircle2,
    XCircle
} from "lucide-react";

export default function ActivityLogsPage() {
    const { data: activityData, isLoading } = useGetRecentActivitiesQuery(undefined);
    const activities = activityData?.data || [];

    const getActionIcon = (action: string) => {
        const lowerAction = action.toLowerCase();
        if (lowerAction.includes("order")) return <ShoppingCart className="w-4 h-4 text-emerald-500" />;
        if (lowerAction.includes("stock") || lowerAction.includes("restock")) return <ArrowUpCircle className="w-4 h-4 text-blue-500" />;
        if (lowerAction.includes("product")) return <Package className="w-4 h-4 text-orange-500" />;
        if (lowerAction.includes("user")) return <User className="w-4 h-4 text-indigo-500" />;
        if (lowerAction.includes("shipped")) return <Truck className="w-4 h-4 text-purple-500" />;
        if (lowerAction.includes("delivered")) return <CheckCircle2 className="w-4 h-4 text-green-500" />;
        if (lowerAction.includes("cancelled")) return <XCircle className="w-4 h-4 text-red-500" />;
        return <PlusCircle className="w-4 h-4 text-gray-500" />;
    };

    return (
        <div className="p-6 space-y-6 max-w-[1000px] mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
                        <History className="w-6 h-6 text-gray-400" />
                        System Activity Logs
                    </h1>
                    <p className="text-gray-500 text-sm">Full audit trail of all actions performed in the system.</p>
                </div>
            </div>

            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-8">
                    {isLoading ? (
                        <div className="space-y-6">
                            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                                <Skeleton key={i} className="h-16 w-full rounded-2xl" />
                            ))}
                        </div>
                    ) : activities.length > 0 ? (
                        <div className="space-y-0 relative before:absolute before:left-[19px] before:top-2 before:bottom-2 before:w-[2px] before:bg-gray-50">
                            {activities.map((activity: any, index: number) => (
                                <div key={index} className="relative pl-12 pb-8 group last:pb-0">
                                    <div className="absolute left-0 top-1 p-2 bg-white rounded-full border border-gray-100 shadow-sm group-hover:scale-110 transition-transform duration-200 z-10">
                                        {getActionIcon(activity.action)}
                                    </div>
                                    <div className="bg-white p-5 rounded-2xl border border-gray-50 hover:border-gray-100 hover:shadow-md transition-all duration-300">
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                                            <div className="text-sm font-bold text-gray-900 leading-tight">
                                                {activity.action}
                                            </div>
                                            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-gray-50 px-2 py-1 rounded-md border border-gray-100">
                                                {new Date(activity.timestamp).toLocaleDateString()} at {new Date(activity.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 text-xs text-gray-500 font-medium">
                                            <span className="text-blue-600 font-bold uppercase tracking-wider">{activity.user || "System"}</span>
                                            <ArrowRight className="w-3 h-3 opacity-30" />
                                            <span>Action performed successfully.</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="py-20 text-center">
                            <History className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                            <h3 className="text-gray-400 font-medium italic">No activity logs found.</h3>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
