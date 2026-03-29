"use client";

import { useGetProductsQuery, useRestockProductMutation } from "@/redux/features/product/productApi";
import { Button } from "@/components/ui/button";
import { 
    AlertTriangle, 
    ArrowUpCircle, 
    Search, 
    RefreshCcw, 
    ShieldAlert,
    Zap,
    Warehouse,
    Filter,
    ArrowUpRight,
    ChevronDown,
    Loader2
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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

type PriorityFilter = "ALL" | "VITAL" | "HIGH" | "STABLE";

export default function RestockQueuePage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedPriority, setSelectedPriority] = useState<PriorityFilter>("ALL");
    
    const { data: productsData, isLoading } = useGetProductsQuery({ search: "" });
    const [restockProduct] = useRestockProductMutation();

    const filteredItems = useMemo(() => {
        const allProducts = productsData?.data || [];
        // Only items below threshold
        const restockItems = allProducts.filter((p: any) => p.stockQuantity <= (p.minStockThreshold || 5));
        
        return restockItems.filter((p: any) => {
            const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
            
            const ratio = p.stockQuantity / (p.minStockThreshold || 1);
            let pPriority: PriorityFilter = "STABLE";
            if (ratio <= 0.2) pPriority = "VITAL";
            else if (ratio <= 0.5) pPriority = "HIGH";

            const matchesPriority = selectedPriority === "ALL" || pPriority === selectedPriority;
            
            return matchesSearch && matchesPriority;
        });
    }, [productsData, searchTerm, selectedPriority]);

    const handleRestock = async (id: string, name: string) => {
        const quantity = prompt(`Enter restock quantity for "${name}":`, "100");
        if (!quantity || isNaN(Number(quantity))) return;

        try {
            await restockProduct({ id, quantity: Number(quantity) }).unwrap();
            toast.success("Restock Successful", {
                description: `Successfully added ${quantity} units to ${name}.`
            });
        } catch (error: any) {
            toast.error("Restock Failed", {
                description: error?.data?.message || "Something went wrong while restocking."
            });
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
                    <h1 className="text-4xl font-bold tracking-tight text-slate-900">
                        Restock <span className="premium-gradient-text italic">Queue</span>
                    </h1>
                    <p className="text-slate-500 mt-2 font-medium">
                        Monitor and restock items that are running low on inventory.
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="glass-card px-8 py-4 rounded-[2rem] flex items-center gap-5 border-none shadow-xl shadow-indigo-500/5 bg-white/50">
                        <div className="p-3 bg-rose-500 text-white rounded-2xl shadow-lg shadow-rose-200">
                            <ShieldAlert className="w-6 h-6" />
                        </div>
                        <div>
                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1.5">Low Stock</div>
                            <div className="text-2xl font-bold text-slate-900 leading-none flex items-baseline gap-2">
                                {filteredItems.length} <span className="text-[10px] text-slate-300 uppercase tracking-widest font-bold">Items to Restock</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Controls */}
            <motion.div variants={item} className="flex flex-col md:flex-row gap-6 items-center justify-between bg-white p-6 rounded-[2.5rem] shadow-xl shadow-indigo-500/5">
                <div className="relative w-full md:w-[500px] group">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-indigo-600 transition-colors" />
                    <input
                        type="text"
                        placeholder="Search items in restock queue..."
                        className="w-full pl-16 pr-8 py-5 bg-slate-50 border-none rounded-[1.75rem] text-sm font-medium text-slate-700 placeholder:text-slate-300 focus:ring-2 focus:ring-indigo-500/10 focus:bg-white transition-all outline-none"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex gap-4 w-full md:w-auto">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button className="h-16 px-8 rounded-3xl bg-slate-900 hover:bg-black text-white font-bold text-[10px] uppercase tracking-wider shadow-xl shadow-slate-200 transition-all gap-4">
                                <Filter className="w-4 h-4" /> Priority: {selectedPriority} <ChevronDown className="w-4 h-4 opacity-50" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-64 p-2 rounded-2xl border-none shadow-2xl bg-white/95 backdrop-blur-xl">
                            <DropdownMenuItem onClick={() => setSelectedPriority("ALL")} className="rounded-xl px-4 py-3 text-[10px] font-bold uppercase tracking-widest focus:bg-slate-50">Show All</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setSelectedPriority("VITAL")} className="rounded-xl px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-rose-600 focus:bg-rose-50">Critical (≤20%)</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setSelectedPriority("HIGH")} className="rounded-xl px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-orange-500 focus:bg-orange-50">High (≤50%)</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setSelectedPriority("STABLE")} className="rounded-xl px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-emerald-600 focus:bg-emerald-50">Low but Stable (&gt;50%)</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </motion.div>

            {/* Queue List */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                <AnimatePresence mode="popLayout" initial={false}>
                    {isLoading ? (
                        [1, 2, 3, 4, 5, 6].map((i) => (
                            <Skeleton key={i} className="h-[300px] w-full rounded-[3rem]" />
                        ))
                    ) : filteredItems.length > 0 ? (
                        filteredItems.map((item: any) => {
                            const ratio = item.stockQuantity / (item.minStockThreshold || 1);
                            let priority = "STABLE";
                            let color = "emerald";
                            
                            if (ratio <= 0.2) {
                                priority = "VITAL";
                                color = "red";
                            } else if (ratio <= 0.5) {
                                priority = "HIGH";
                                color = "orange";
                            }

                            return (
                                <motion.div 
                                    key={item._id}
                                    variants={item}
                                    layout
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    whileHover={{ y: -10 }}
                                    className="glass-card rounded-[3rem] border-none shadow-xl shadow-indigo-500/5 overflow-hidden group transition-all duration-500 bg-white"
                                >
                                    <div className="p-10 space-y-8">
                                        <div className="flex justify-between items-start">
                                            <div className={`px-5 py-2 rounded-2xl text-[9px] font-bold uppercase tracking-wider shadow-sm flex items-center gap-2 border ${
                                                color === 'red' ? 'bg-rose-50 border-rose-100 text-rose-600 animate-pulse' : 
                                                color === 'orange' ? 'bg-orange-50 border-orange-100 text-orange-500' : 
                                                'bg-emerald-50 border-emerald-100 text-emerald-500'
                                            }`}>
                                                <div className={`w-1.5 h-1.5 rounded-full ${color === 'red' ? 'bg-rose-500' : color === 'orange' ? 'bg-orange-500' : 'bg-emerald-500'}`} />
                                                Priority: {priority}
                                            </div>
                                            <div className="p-3 bg-slate-50 rounded-2xl text-slate-300 group-hover:text-indigo-600 group-hover:bg-white group-hover:shadow-lg transition-all duration-500">
                                                <Warehouse className="w-6 h-6" />
                                            </div>
                                        </div>
                                        
                                        <div>
                                            <h3 className="text-2xl font-bold text-slate-900 leading-tight group-hover:text-indigo-600 transition-colors tracking-tight">{item.name}</h3>
                                            <div className="flex items-center gap-3 mt-3">
                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 py-1 bg-slate-50 rounded-lg">{item.category?.name || 'Other'}</span>
                                                <span className="text-[10px] font-medium text-indigo-400 uppercase tracking-widest flex items-center gap-1.5">
                                                    <Zap className="w-3.5 h-3.5" /> ID: {item._id.slice(-6)}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="bg-slate-50/50 p-6 rounded-[2rem] flex items-center justify-between group-hover:bg-white group-hover:shadow-inner transition-all">
                                            <div className="space-y-1.5">
                                                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Current Stock</div>
                                                <div className={`text-4xl font-bold tracking-tighter ${color === 'red' ? 'text-rose-600' : 'text-slate-900'}`}>
                                                    {item.stockQuantity} <span className="text-[10px] text-slate-300 font-bold uppercase ml-1">/ {item.minStockThreshold} Min</span>
                                                </div>
                                            </div>
                                            <div className="text-right space-y-1.5">
                                                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</div>
                                                <div className={`text-xs font-bold uppercase tracking-wider ${
                                                    color === 'red' ? 'text-rose-500' : color === 'orange' ? 'text-orange-500' : 'text-emerald-500'
                                                }`}>
                                                    {Math.round(ratio * 100)}% Stock
                                                </div>
                                            </div>
                                        </div>

                                        <Button 
                                            onClick={() => handleRestock(item._id, item.name)}
                                            className={`w-full h-16 rounded-[1.75rem] shadow-2xl transition-all font-bold text-[11px] uppercase tracking-widest gap-4 ${
                                                color === 'red' ? 'bg-slate-900 hover:bg-black text-white shadow-slate-200' : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-100'
                                            }`}
                                        >
                                            <RefreshCcw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-700" />
                                            Restock Now
                                        </Button>
                                    </div>
                                    <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-indigo-500/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                                </motion.div>
                            );
                        })
                    ) : (
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="col-span-full py-48 text-center"
                        >
                            <div className="w-32 h-32 bg-indigo-50 rounded-[3rem] flex items-center justify-center mx-auto mb-10 text-indigo-500 shadow-2xl shadow-indigo-500/5 rotate-12">
                                <ShieldAlert className="w-14 h-14 opacity-20" />
                            </div>
                            <h3 className="text-slate-900 font-bold text-3xl tracking-tight">Stock Levels Healthy</h3>
                            <p className="text-slate-400 text-xs mt-4 font-medium max-w-[450px] mx-auto leading-relaxed">All items are currently above their minimum stock thresholds.</p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
}
