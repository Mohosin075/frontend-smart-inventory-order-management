"use client";

import { useState } from "react";
import { 
    useGetProductsQuery, 
    useCreateProductMutation, 
    useGetCategoriesQuery 
} from "@/redux/features/product/productApi";
import { Button } from "@/components/ui/button";
import { 
    Plus, 
    Search, 
    Filter, 
    Edit, 
    Trash2, 
    AlertCircle,
    Package,
    ArrowUpRight,
    Activity,
    MoreHorizontal
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import ProductFormModal from "@/components/products/ProductFormModal";
import { motion, AnimatePresence } from "framer-motion";

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.05
        }
    }
};

const item = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 }
};

export default function ProductsPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { data: productsData, isLoading } = useGetProductsQuery({ searchTerm });
    const { data: categoriesData } = useGetCategoriesQuery(undefined);

    const products = productsData?.data || [];

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
                        Asset <span className="premium-gradient-text italic">Repository</span>
                    </h1>
                    <p className="text-slate-500 mt-2 font-medium tracking-wide">
                        Global inventory master list and stock synchronization.
                    </p>
                </div>
                <div className="flex gap-4">
                    <Button 
                        onClick={() => setIsModalOpen(true)}
                        className="h-14 px-8 rounded-[1.25rem] bg-indigo-600 hover:bg-indigo-700 text-white shadow-xl shadow-indigo-600/20 font-black uppercase tracking-[0.2em] text-[11px] gap-3 transition-all duration-300"
                    >
                        <Plus className="w-5 h-5" /> Add New Asset
                    </Button>
                </div>
            </div>

            {/* Filters & Actions */}
            <motion.div variants={item} className="flex flex-col md:flex-row gap-6 items-center justify-between">
                <div className="relative w-full md:w-[450px]">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-indigo-400" />
                    <input
                        type="text"
                        placeholder="Search system assets..."
                        className="w-full pl-14 pr-6 py-5 bg-white border-none rounded-[1.5rem] text-sm font-bold text-slate-700 placeholder:text-slate-300 shadow-xl shadow-indigo-500/5 focus:ring-2 focus:ring-indigo-500/10 transition-all outline-none"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex gap-4">
                    <Button variant="outline" className="h-14 px-6 rounded-[1.25rem] border-slate-100 bg-white text-slate-400 font-black text-[10px] uppercase tracking-widest hover:text-indigo-600 transition-all gap-2">
                        <Filter className="w-4 h-4" /> Comprehensive Filters
                    </Button>
                </div>
            </motion.div>

            {/* Premium Table */}
            <motion.div variants={item} className="glass-card rounded-[2.5rem] border-none shadow-xl shadow-indigo-500/5 overflow-hidden">
                <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100">
                                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.25em]">Asset Nomenclature</th>
                                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] text-center">Classification</th>
                                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] text-center">Price Matrix</th>
                                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] text-center">Stock Volume</th>
                                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] text-center">Operational Status</th>
                                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] text-center">Interface</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            <AnimatePresence>
                                {isLoading ? (
                                    [1, 2, 3, 4, 5, 6].map((i) => (
                                        <tr key={i}>
                                            <td colSpan={6} className="px-8 py-6"><Skeleton className="h-8 w-full rounded-xl" /></td>
                                        </tr>
                                    ))
                                ) : products.length > 0 ? (
                                    products.map((product: any) => (
                                        <motion.tr 
                                            key={product._id} 
                                            layout
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="hover:bg-slate-50/50 transition-all duration-300 group"
                                        >
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600 transition-transform group-hover:scale-110">
                                                        <Package className="w-5 h-5" />
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors uppercase tracking-tight">{product.name}</div>
                                                        <div className="text-[9px] font-black text-slate-300 uppercase tracking-widest mt-1">UUID: {product._id?.slice(-8)}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex justify-center">
                                                    <span className="text-[10px] font-black text-slate-400 border border-slate-100 px-3 py-1 rounded-lg uppercase tracking-widest bg-white shadow-sm">
                                                        {product.category?.name || "Global"}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 text-center">
                                                <div className="font-mono font-bold text-slate-900">${product.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex flex-col items-center">
                                                    <div className={`text-sm font-black ${product.stockQuantity <= (product.minStockThreshold || 5) ? 'text-red-600 animate-pulse' : 'text-slate-900'}`}>
                                                        {product.stockQuantity} <span className="text-[10px] text-slate-300 font-bold uppercase">Units</span>
                                                    </div>
                                                    <div className="w-20 h-1 bg-slate-100 rounded-full mt-2 overflow-hidden">
                                                        <div 
                                                            className={`h-full transition-all duration-1000 ${product.stockQuantity <= (product.minStockThreshold || 5) ? 'bg-red-500' : 'bg-emerald-500'}`}
                                                            style={{ width: `${Math.min((product.stockQuantity / 20) * 100, 100)}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex justify-center">
                                                    <span className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] shadow-sm ${
                                                        product.status === 'Active' 
                                                        ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' 
                                                        : 'bg-red-50 text-red-600 border border-red-100'
                                                    }`}>
                                                        {product.status || (product.stockQuantity > 0 ? 'Active' : 'Depleted')}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex items-center justify-center gap-3">
                                                    <motion.button whileHover={{ scale: 1.1 }} className="p-2.5 rounded-xl bg-slate-50 text-slate-400 hover:text-indigo-600 hover:bg-white hover:shadow-lg transition-all">
                                                        <Edit className="w-4 h-4" />
                                                    </motion.button>
                                                    <motion.button whileHover={{ scale: 1.1 }} className="p-2.5 rounded-xl bg-slate-50 text-slate-400 hover:text-red-600 hover:bg-white hover:shadow-lg transition-all">
                                                        <Trash2 className="w-4 h-4" />
                                                    </motion.button>
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={6} className="px-8 py-24 text-center">
                                            <div className="flex flex-col items-center gap-4 opacity-30">
                                                <Package className="w-12 h-12" />
                                                <p className="font-black uppercase tracking-[0.3em] text-xs font-italic">No digital assets located.</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </AnimatePresence>
                        </tbody>
                    </table>
                </div>
            </motion.div>

            <ProductFormModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                categories={categoriesData?.data || []}
            />
        </motion.div>
    );
}

