"use client";

import { useGetProductsQuery, useRestockProductMutation } from "@/redux/features/product/productApi";
import { Button } from "@/components/ui/button";
import { 
    AlertTriangle, 
    ArrowUpCircle, 
    Search, 
    RefreshCcw, 
    Clock, 
    ShieldAlert,
    Zap,
    Warehouse,
    Filter
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { useState } from "react";
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
    hidden: { opacity: 0, scale: 0.95 },
    show: { opacity: 1, scale: 1 }
};

export default function RestockQueuePage() {
    const { data: productsData, isLoading } = useGetProductsQuery({ searchTerm: "" });
    const [restockProduct] = useRestockProductMutation();
    const [searchTerm, setSearchTerm] = useState("");

    const restockItems = productsData?.data?.filter((p: any) => p.stockQuantity <= p.minStockThreshold) || [];
    const filteredItems = restockItems.filter((p: any) => p.name.toLowerCase().includes(searchTerm.toLowerCase()));

    const handleRestock = async (id: string, name: string) => {
        const quantity = prompt(`Enter fulfillment volume for "${name}":`, "100");
        if (!quantity || isNaN(Number(quantity))) return;

        const toastId = toast.loading(`Initiating restock for ${name}...`);
        try {
            await restockProduct({ id, quantity: Number(quantity) }).unwrap();
            toast.success(`Successfully added ${quantity} units to ${name} inventory.`, { id: toastId });
        } catch (error: any) {
            toast.error(error?.data?.message || "Protocol failure: restock rejected.", { id: toastId });
        }
    };

    return (
        <motion.div 
            variants={container}
            initial="hidden"
            animate="show"
            className="space-y-10 max-w-[1600px] mx-auto pb-10"
        >
            {/* Header section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                <div>
                    <h1 className="text-4xl font-black tracking-tight text-slate-900">
                        Restock <span className="premium-gradient-text italic">Protocol</span>
                    </h1>
                    <p className="text-slate-500 mt-2 font-medium tracking-wide">
                        Automated fulfillment queue based on critical stock thresholds.
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="glass-card px-6 py-3 rounded-2xl flex items-center gap-4 border-none shadow-xl shadow-indigo-500/5">
                        <div className="p-2 bg-red-500/10 text-red-600 rounded-lg">
                            <ShieldAlert className="w-5 h-5" />
                        </div>
                        <div>
                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Active Alerts</div>
                            <div className="text-xl font-black text-red-600 leading-none">{restockItems.length} <span className="text-[10px] text-slate-400">Critical</span></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Controls */}
            <motion.div variants={item} className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="relative w-full md:w-[450px]">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-indigo-400" />
                    <input
                        type="text"
                        placeholder="Search inventory assets..."
                        className="w-full pl-14 pr-6 py-5 bg-white border-none rounded-[1.5rem] text-sm font-bold text-slate-700 placeholder:text-slate-300 shadow-xl shadow-indigo-500/5 focus:ring-2 focus:ring-indigo-500/10 transition-all outline-none"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="h-14 px-6 rounded-[1.25rem] border-slate-100 bg-white text-slate-400 font-black text-[10px] uppercase tracking-widest hover:text-indigo-600 transition-all gap-2">
                        <Filter className="w-4 h-4" /> Filter Priority
                    </Button>
                </div>
            </motion.div>

            {/* Queue List */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                <AnimatePresence mode="popLayout">
                    {isLoading ? (
                        [1, 2, 3, 4, 5, 6].map((i) => (
                            <Skeleton key={i} className="h-64 w-full rounded-[2.5rem]" />
                        ))
                    ) : filteredItems.length > 0 ? (
                        filteredItems.map((item: any) => {
                            const ratio = item.stockQuantity / (item.minStockThreshold || 1);
                            let priority = "LOW";
                            let color = "indigo";
                            
                            if (ratio <= 0.2) {
                                priority = "VITAL";
                                color = "red";
                            } else if (ratio <= 0.5) {
                                priority = "HIGH";
                                color = "orange";
                            } else {
                                priority = "STABLE";
                                color = "emerald";
                            }

                            return (
                                <motion.div 
                                    key={item._id}
                                    variants={item}
                                    whileHover={{ y: -8 }}
                                    className="glass-card rounded-[2.5rem] border-none shadow-xl shadow-indigo-500/5 overflow-hidden group transition-all duration-500"
                                >
                                    <div className="p-8 space-y-6">
                                        <div className="flex justify-between items-start">
                                            <div className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] border-none shadow-sm ${
                                                color === 'red' ? 'bg-red-500 text-white animate-pulse' : 
                                                color === 'orange' ? 'bg-orange-400 text-white' : 
                                                'bg-emerald-500 text-white'
                                            }`}>
                                                {priority} ATTENTION
                                            </div>
                                            <div className="p-2 bg-slate-50 rounded-xl text-slate-400 group-hover:text-indigo-600 transition-colors">
                                                <Warehouse className="w-5 h-5" />
                                            </div>
                                        </div>
                                        
                                        <div>
                                            <h3 className="text-xl font-black text-slate-900 leading-tight group-hover:text-indigo-600 transition-colors">{item.name}</h3>
                                            <div className="flex items-center gap-2 mt-2">
                                                <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{item.category?.name || 'Uncategorized'}</span>
                                                <span className="w-1 h-1 rounded-full bg-slate-200" />
                                                <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest flex items-center gap-1">
                                                    <Zap className="w-3 h-3" /> Auto-Generated
                                                </span>
                                            </div>
                                        </div>

                                        <div className="bg-slate-50/50 p-5 rounded-[1.5rem] flex items-center justify-between">
                                            <div className="space-y-1">
                                                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Available Units</div>
                                                <div className={`text-3xl font-black tracking-tighter ${color === 'red' ? 'text-red-600' : 'text-slate-900'}`}>
                                                    {item.stockQuantity} <span className="text-sm text-slate-300 font-bold tracking-normal">/ {item.minStockThreshold} Lim</span>
                                                </div>
                                            </div>
                                            <div className="h-10 w-px bg-slate-100" />
                                            <div className="text-right space-y-1">
                                                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Health</div>
                                                <div className={`text-xs font-black uppercase tracking-wider ${
                                                    color === 'red' ? 'text-red-500' : color === 'orange' ? 'text-orange-500' : 'text-emerald-500'
                                                }`}>
                                                    {Math.round(ratio * 100)}% Capacity
                                                </div>
                                            </div>
                                        </div>

                                        <Button 
                                            onClick={() => handleRestock(item._id, item.name)}
                                            className={`w-full h-14 rounded-2xl shadow-xl transition-all font-black text-[11px] uppercase tracking-[0.2em] gap-3 ${
                                                color === 'red' ? 'bg-slate-900 hover:bg-black text-white' : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                                            }`}
                                        >
                                            <RefreshCcw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-700" />
                                            Fulfill Inventory
                                        </Button>
                                    </div>
                                </motion.div>
                            );
                        })
                    ) : (
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="col-span-full py-32 text-center"
                        >
                            <div className="w-24 h-24 bg-indigo-50 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 text-indigo-500 shadow-xl shadow-indigo-500/5">
                                <Zap className="w-10 h-10 opacity-30" />
                            </div>
                            <h3 className="text-slate-900 font-black text-2xl tracking-tight">Ecosystem Stable</h3>
                            <p className="text-slate-400 text-sm mt-3 font-medium uppercase tracking-[0.2em]">All logistics nodes operating at peak capacity.</p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
}

