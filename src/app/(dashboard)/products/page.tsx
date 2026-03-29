"use client";

import { useState } from "react";
import { 
    useGetProductsQuery, 
    useGetCategoriesQuery,
    useDeleteProductMutation 
} from "@/redux/features/product/productApi";
import { Button } from "@/components/ui/button";
import { 
    Plus, 
    Search, 
    Filter, 
    Edit, 
    Trash2, 
    Package,
    ChevronDown,
    X,
    Loader2
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import ProductFormModal from "@/components/products/ProductFormModal";
import { motion, AnimatePresence } from "framer-motion";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
    DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";

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
    const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<any>(null);
    
    // API Hooks
    const { data: productsData, isLoading, isFetching } = useGetProductsQuery({ 
        search: searchTerm, 
        category: selectedCategory 
    });
    const { data: categoriesData } = useGetCategoriesQuery(undefined);
    const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();

    const products = productsData?.data || [];
    const categories = categoriesData?.data || [];

    const handleEdit = (product: any) => {
        setEditingProduct(product);
        setIsModalOpen(true);
    };

    const handleDelete = async (id: string, name: string) => {
        toast.custom((t) => (
            <div className="bg-white border border-slate-100 p-6 rounded-[1.5rem] shadow-2xl flex flex-col gap-4 min-w-[320px]">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center text-red-500">
                        <Trash2 className="w-5 h-5" />
                    </div>
                    <div>
                        <h4 className="font-black text-slate-900 uppercase tracking-tight text-sm">Decommission Asset?</h4>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">{name}</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button 
                        onClick={() => toast.dismiss(t)}
                        className="flex-1 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:bg-slate-50 transition-all"
                    >
                        Abort
                    </button>
                    <button 
                        onClick={async () => {
                            toast.dismiss(t);
                            try {
                                await deleteProduct(id).unwrap();
                                toast.success("Asset decommissioned", {
                                    description: `${name} has been removed from active inventory.`
                                });
                            } catch (error: any) {
                                toast.error("Decommissioning failed", {
                                    description: error?.data?.message || "Internal system error"
                                });
                            }
                        }}
                        className="flex-1 py-2 rounded-xl bg-red-600 text-white text-[10px] font-black uppercase tracking-widest shadow-lg shadow-red-200 hover:bg-red-700 transition-all"
                    >
                        Confirm
                    </button>
                </div>
            </div>
        ), { duration: 5000 });
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingProduct(null);
    };

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
            <motion.div variants={item} className="flex flex-col lg:flex-row gap-6 items-center justify-between">
                <div className="relative w-full lg:w-[550px] group">
                    <Search className={`absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${isFetching ? 'text-indigo-600 animate-pulse' : 'text-slate-300 group-focus-within:text-indigo-600'}`} />
                    <input
                        type="text"
                        placeholder="Search system assets using nomenclature or serial..."
                        className="w-full pl-14 pr-12 py-5 bg-white border-none rounded-[1.5rem] text-sm font-bold text-slate-700 placeholder:text-slate-300 shadow-xl shadow-indigo-500/5 focus:ring-2 focus:ring-indigo-500/10 transition-all outline-none"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    {searchTerm && (
                        <button 
                            onClick={() => setSearchTerm("")}
                            className="absolute right-5 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-slate-100 text-slate-400 transition-all"
                        >
                            <X className="w-3 h-3" />
                        </button>
                    )}
                </div>
                
                <div className="flex items-center gap-4 w-full lg:w-auto">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button 
                                variant="outline" 
                                className={`h-14 px-6 rounded-[1.25rem] border-none bg-white font-black text-[10px] uppercase tracking-widest transition-all gap-3 shadow-xl shadow-indigo-500/5 ${selectedCategory ? 'text-indigo-600 ring-2 ring-indigo-500/10' : 'text-slate-400 hover:text-indigo-600'}`}
                            >
                                <Filter className="w-4 h-4" /> 
                                {selectedCategory ? categories.find(c => c._id === selectedCategory)?.name : "Filter by Class"}
                                <ChevronDown className="w-3 h-3 ml-2 opacity-50" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-64 p-2 rounded-2xl border-none shadow-2xl bg-white/95 backdrop-blur-xl">
                            <DropdownMenuLabel className="text-[9px] font-black uppercase tracking-[0.2em] px-4 py-3 text-slate-400">Inventory Classification</DropdownMenuLabel>
                            <DropdownMenuSeparator className="bg-slate-50" />
                            <DropdownMenuItem 
                                onClick={() => setSelectedCategory(undefined)}
                                className={`rounded-xl px-4 py-3 text-[10px] uppercase tracking-widest font-black transition-all cursor-pointer ${!selectedCategory ? 'bg-indigo-50 text-indigo-600' : 'text-slate-500 hover:bg-slate-50 hover:text-indigo-600'}`}
                            >
                                All Assets
                            </DropdownMenuItem>
                            {categories.map((cat: any) => (
                                <DropdownMenuItem 
                                    key={cat._id}
                                    onClick={() => setSelectedCategory(cat._id)}
                                    className={`rounded-xl px-4 py-3 text-[10px] uppercase tracking-widest font-black transition-all cursor-pointer ${selectedCategory === cat._id ? 'bg-indigo-50 text-indigo-600' : 'text-slate-500 hover:bg-slate-50 hover:text-indigo-600'}`}
                                >
                                    {cat.name}
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>

                    {(searchTerm || selectedCategory) && (
                        <button 
                            onClick={() => {
                                setSearchTerm("");
                                setSelectedCategory(undefined);
                            }}
                            className="h-14 px-6 rounded-[1.25rem] text-[9px] font-black uppercase tracking-widest text-slate-300 hover:text-red-500 hover:bg-red-50 transition-all flex items-center gap-2"
                        >
                            Reset System
                        </button>
                    )}
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
                                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] text-center">Cost Matrix</th>
                                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] text-center">Stock Volume</th>
                                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] text-center">Operational Status</th>
                                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] text-center">Interface</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            <AnimatePresence mode="popLayout">
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
                                                    <span className="text-[10px] font-black text-slate-400 border border-slate-100 px-3 py-1 rounded-lg uppercase tracking-widest bg-white shadow-sm transition-all group-hover:border-indigo-200 group-hover:text-indigo-600">
                                                        {product.category?.name || "Global"}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 text-center">
                                                <div className="font-mono font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">${product.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex flex-col items-center">
                                                    <div className={`text-sm font-black transition-all ${product.stockQuantity <= (product.minStockThreshold || 5) ? 'text-red-600 animate-pulse scale-110' : 'text-slate-900'}`}>
                                                        {product.stockQuantity} <span className="text-[10px] text-slate-300 font-bold uppercase">Units</span>
                                                    </div>
                                                    <div className="w-20 h-1 bg-slate-100 rounded-full mt-2 overflow-hidden shadow-inner">
                                                        <div 
                                                            className={`h-full transition-all duration-1000 ${product.stockQuantity <= (product.minStockThreshold || 5) ? 'bg-red-500' : 'bg-emerald-500'}`}
                                                            style={{ width: `${Math.min((product.stockQuantity / 100) * 100, 100)}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex justify-center">
                                                    <span className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] shadow-sm transition-all ${
                                                        product.stockQuantity > (product.minStockThreshold || 5)
                                                        ? 'bg-emerald-50 text-emerald-600 border border-emerald-100 group-hover:bg-emerald-500 group-hover:text-white' 
                                                        : product.stockQuantity > 0 
                                                        ? 'bg-amber-50 text-amber-600 border border-amber-100 group-hover:bg-amber-500 group-hover:text-white'
                                                        : 'bg-red-50 text-red-600 border border-red-100 group-hover:bg-red-500 group-hover:text-white'
                                                    }`}>
                                                        {product.stockQuantity > (product.minStockThreshold || 5) ? 'Nominal' : product.stockQuantity > 0 ? 'Critical' : 'Depleted'}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex items-center justify-center gap-3">
                                                    <motion.button 
                                                        whileHover={{ scale: 1.1 }} 
                                                        onClick={() => handleEdit(product)}
                                                        className="p-3 rounded-xl bg-slate-50 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 hover:shadow-lg transition-all"
                                                        title="Edit Asset"
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                    </motion.button>
                                                    <motion.button 
                                                        whileHover={{ scale: 1.1 }} 
                                                        onClick={() => handleDelete(product._id, product.name)}
                                                        disabled={isDeleting}
                                                        className="p-3 rounded-xl bg-slate-50 text-slate-400 hover:text-red-600 hover:bg-red-50 hover:shadow-lg transition-all"
                                                        title="Decommission Asset"
                                                    >
                                                        {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                                                    </motion.button>
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={6} className="px-8 py-32 text-center">
                                            <div className="flex flex-col items-center gap-6 opacity-40">
                                                <div className="w-20 h-20 rounded-full bg-slate-50 flex items-center justify-center text-slate-200">
                                                    <Package className="w-10 h-10" />
                                                </div>
                                                <div className="space-y-2">
                                                    <p className="font-black uppercase tracking-[0.4em] text-xs text-slate-500">Zero matches found in repository</p>
                                                    <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Adjust search parameters or classification filters</p>
                                                </div>
                                                <Button 
                                                    variant="outline" 
                                                    onClick={() => {
                                                        setSearchTerm("");
                                                        setSelectedCategory(undefined);
                                                    }}
                                                    className="mt-4 rounded-xl text-[10px] font-black uppercase tracking-widest border-slate-100"
                                                >
                                                    Clear All System Filters
                                                </Button>
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
                onClose={closeModal} 
                categories={categories}
                initialData={editingProduct}
            />
        </motion.div>
    );
}
