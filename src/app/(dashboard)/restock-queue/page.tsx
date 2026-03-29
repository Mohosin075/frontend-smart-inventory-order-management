"use client";

import { useGetProductsQuery, useRestockProductMutation } from "@/redux/features/product/productApi";
import { Button } from "@/components/ui/button";
import { 
    AlertTriangle, 
    ArrowUpCircle, 
    Search, 
    RefreshCcw, 
    Clock, 
    ShieldAlert
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { useState } from "react";

export default function RestockQueuePage() {
    const { data: productsData, isLoading } = useGetProductsQuery({ searchTerm: "" });
    const [restockProduct] = useRestockProductMutation();
    const [searchTerm, setSearchTerm] = useState("");

    const restockItems = productsData?.data?.filter((p: any) => p.stockQuantity <= p.minStockThreshold) || [];

    const filteredItems = restockItems.filter((p: any) => p.name.toLowerCase().includes(searchTerm.toLowerCase()));

    const handleRestock = async (id: string, name: string) => {
        const quantity = prompt(`Enter restock quantity for "${name}":`, "50");
        if (!quantity || isNaN(Number(quantity))) return;

        try {
            await restockProduct({ id, quantity: Number(quantity) }).unwrap();
            toast.success(`Restocked ${quantity} units for ${name}`);
        } catch (error: any) {
            toast.error(error?.data?.message || "Failed to restock");
        }
    };

    return (
        <div className="p-6 space-y-6 max-w-[1400px] mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Restock Queue</h1>
                    <p className="text-gray-500 text-sm italic font-medium">Auto-generated priority list of items with low stock.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="bg-red-50 text-red-600 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest border border-red-100 flex items-center gap-2">
                        <ShieldAlert className="w-4 h-4" />
                        {restockItems.length} Urgent Actions
                    </div>
                </div>
            </div>

            {/* Search */}
            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search queue..."
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-lg text-sm focus:ring-2 focus:ring-red-500 transition-all outline-none"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Queue List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {isLoading ? (
                    [1, 2, 3, 4, 5, 6].map((i) => (
                        <Skeleton key={i} className="h-48 w-full rounded-2xl" />
                    ))
                ) : filteredItems.length > 0 ? (
                    filteredItems.map((item: any) => {
                        const priority = item.stockQuantity <= 2 ? "High" : item.stockQuantity <= 5 ? "Medium" : "Low";

                        const priorityColor = priority === "High" ? "text-red-600 bg-red-50 border-red-100" : priority === "Medium" ? "text-orange-600 bg-orange-50 border-orange-100" : "text-blue-600 bg-blue-50 border-blue-100";
                        
                        return (
                            <div key={item._id} className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden relative">
                                <div className="p-6 space-y-4">
                                    <div className="flex justify-between items-start mb-2">
                                        <div className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${priorityColor}`}>
                                            {priority} Priority
                                        </div>
                                        <div className="text-[10px] text-gray-400 font-bold uppercase flex items-center gap-1">
                                            <Clock className="w-3 h-3" /> Updated Today
                                        </div>
                                    </div>
                                    
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900 leading-tight">{item.name}</h3>
                                        <p className="text-xs text-gray-400 uppercase tracking-widest font-bold mt-1">{item.category?.name}</p>
                                    </div>

                                    <div className="flex items-center gap-4 bg-gray-50/50 p-3 rounded-xl">
                                        <div className="flex-1">
                                            <div className="text-[10px] text-gray-400 font-bold uppercase mb-1">Stock Left</div>
                                            <div className="text-xl font-bold text-red-600">{item.stockQuantity} <span className="text-xs text-gray-400">/ {item.minStockThreshold}</span></div>

                                        </div>
                                        <div className="w-px h-8 bg-gray-200" />
                                        <div className="flex-1">
                                            <div className="text-[10px] text-gray-400 font-bold uppercase mb-1">Status</div>
                                            <div className="text-xs font-bold text-gray-900 flex items-center gap-1">
                                                <AlertTriangle className="w-3.5 h-3.5 text-orange-500" /> Critical
                                            </div>
                                        </div>
                                    </div>

                                    <Button 
                                        onClick={() => handleRestock(item._id, item.name)}
                                        className="w-full bg-red-600 hover:bg-red-700 text-white rounded-xl shadow-lg shadow-red-50 transition-all font-bold group-hover:scale-[1.02] active:scale-[0.98]"
                                    >
                                        <ArrowUpCircle className="w-4 h-4 mr-2" />
                                        Restock Manual
                                    </Button>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="col-span-full py-20 text-center bg-green-50/30 rounded-3xl border-2 border-dashed border-green-100">
                        <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4 text-green-500">
                            <RefreshCcw className="w-8 h-8 opacity-40 animate-spin-slow" />
                        </div>
                        <h3 className="text-green-800 font-bold text-lg">Inventory Healthy</h3>
                        <p className="text-green-600 text-sm mt-1">No items currently require restocking.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
