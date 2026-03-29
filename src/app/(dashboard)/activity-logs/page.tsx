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
    XCircle,
    Zap,
    Fingerprint,
    ShieldCheck
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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
    hidden: { opacity: 0, x: -10 },
    show: { opacity: 1, x: 0 }
};

export default function ActivityLogsPage() {
    const { data: activityData, isLoading } = useGetRecentActivitiesQuery(undefined);
    const activities = activityData?.activities || [];

    const getActionIcon = (action: string) => {
        const lowerAction = action.toLowerCase();
        if (lowerAction.includes("order")) return <ShoppingCart className="w-5 h-5 text-indigo-500" />;
        if (lowerAction.includes("stock") || lowerAction.includes("restock")) return <ArrowUpCircle className="w-5 h-5 text-emerald-500" />;
        if (lowerAction.includes("product")) return <Package className="w-5 h-5 text-amber-500" />;
        if (lowerAction.includes("user")) return <User className="w-5 h-5 text-indigo-500" />;
        if (lowerAction.includes("shipped")) return <Truck className="w-5 h-5 text-indigo-400" />;
        if (lowerAction.includes("delivered")) return <CheckCircle2 className="w-5 h-5 text-emerald-400" />;
        if (lowerAction.includes("cancelled")) return <XCircle className="w-5 h-5 text-red-500" />;
        return <PlusCircle className="w-5 h-5 text-slate-400" />;
    };

    return (
        <motion.div 
            variants={container}
            initial="hidden"
            animate="show"
            className="space-y-10 max-w-[1200px] mx-auto pb-10"
        >
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                <div>
                    <h1 className="text-4xl font-black tracking-tight text-slate-900">
                        Audit <span className="premium-gradient-text italic">Protocol</span>
                    </h1>
                    <p className="text-slate-500 mt-2 font-medium tracking-wide">
                        Immutable ledger of all organizational operations and system events.
                    </p>
                </div>
                <div className="glass-card px-6 py-4 rounded-[1.5rem] flex items-center gap-4 border-none shadow-xl shadow-indigo-500/5">
                    <Fingerprint className="w-6 h-6 text-indigo-600" />
                    <div className="flex flex-col">
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Status</div>
                        <div className="text-sm font-black text-emerald-600 leading-none flex items-center gap-1">
                            <ShieldCheck className="w-3.5 h-3.5" /> Synchronized
                        </div>
                    </div>
                </div>
            </div>

            <motion.div variants={item} className="glass-card rounded-[2.5rem] border-none shadow-xl shadow-indigo-500/5 overflow-hidden bg-white">
                <div className="p-10">
                    {isLoading ? (
                        <div className="space-y-10">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <Skeleton key={i} className="h-24 w-full rounded-3xl" />
                            ))}
                        </div>
                    ) : activities.length > 0 ? (
                        <div className="space-y-0 relative before:absolute before:left-[27px] before:top-4 before:bottom-4 before:w-[1px] before:bg-slate-100">
                            {activities.map((activity: any, index: number) => (
                                <motion.div 
                                    key={index}
                                    variants={item}
                                    className="relative pl-16 pb-12 group last:pb-0"
                                >
                                    <div className="absolute left-0 top-1 p-3 bg-white rounded-2xl border border-slate-50 shadow-sm group-hover:scale-110 group-hover:shadow-indigo-500/10 transition-all duration-500 z-10">
                                        {getActionIcon(activity.action)}
                                    </div>
                                    <div className="bg-slate-50/30 p-8 rounded-[2rem] border border-transparent hover:border-indigo-100 hover:bg-white hover:shadow-2xl hover:shadow-indigo-500/5 transition-all duration-500 group">
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                                            <div>
                                                <div className="text-lg font-black text-slate-900 leading-tight group-hover:text-indigo-600 transition-colors uppercase tracking-tight">
                                                    {activity.action}
                                                </div>
                                                <div className="flex items-center gap-2 mt-2">
                                                    <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest bg-indigo-50 px-2 py-0.5 rounded-lg flex items-center gap-1">
                                                        <User className="w-3 h-3" /> {activity.metadata?.user || "System Root"}
                                                    </span>
                                                    <span className="w-1 h-1 rounded-full bg-slate-200" />
                                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                                        ID: 0x{index.toString(16).padStart(4, '0')}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-50">
                                                {new Date(activity.createdAt).toLocaleDateString('en-GB')} / {new Date(activity.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 text-xs text-slate-500 font-bold">
                                            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                            <span className="uppercase tracking-widest opacity-60">Status: Operations Synchronized</span>
                                            <ArrowRight className="w-4 h-4 text-slate-300 ml-auto group-hover:translate-x-2 transition-transform duration-500" />
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <div className="py-32 text-center">
                            <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center mx-auto mb-6 text-slate-200 shadow-inner">
                                <History className="w-10 h-10" />
                            </div>
                            <h3 className="text-slate-900 font-black text-2xl tracking-tight opacity-40">Zero Operations Detected</h3>
                            <p className="text-slate-400 text-xs mt-3 uppercase tracking-[0.3em] font-bold">The ledger currently holds no event records.</p>
                        </div>
                    )}
                </div>
            </motion.div>
        </motion.div>
    );
}

