"use client";

import { useState } from "react";
import { 
    useGetCategoriesQuery, 
    useCreateCategoryMutation 
} from "@/redux/features/product/productApi";
import { Button } from "@/components/ui/button";
import { 
    Plus, 
    Layers, 
    Edit, 
    Trash2, 
    Search,
    ArrowUpRight,
    Activity,
    FolderKanban
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import CategoryFormModal from "@/components/categories/CategoryFormModal";
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
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
};

export default function CategoriesPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { data: categoriesData, isLoading } = useGetCategoriesQuery(undefined);

    const categories = categoriesData?.data || [];

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
                        Classification <span className="premium-gradient-text italic">Architecture</span>
                    </h1>
                    <p className="text-slate-500 mt-2 font-medium tracking-wide">
                        Organize your ecosystem into high-level logical domains.
                    </p>
                </div>
                <Button 
                    onClick={() => setIsModalOpen(true)}
                    className="h-14 px-8 rounded-[1.25rem] bg-indigo-600 hover:bg-indigo-700 text-white shadow-xl shadow-indigo-600/20 font-black uppercase tracking-[0.2em] text-[11px] gap-3 transition-all duration-300"
                >
                    <Plus className="w-5 h-5" /> New Structure
                </Button>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <AnimatePresence>
                    {isLoading ? (
                        [1, 2, 3, 4, 5, 6].map((i) => (
                            <Skeleton key={i} className="h-64 w-full rounded-[2.5rem]" />
                        ))
                    ) : categories.length > 0 ? (
                        categories.map((category: any) => (
                            <motion.div 
                                key={category._id}
                                variants={item}
                                whileHover={{ y: -8 }}
                                className="glass-card p-8 rounded-[2.5rem] border-none shadow-xl shadow-indigo-500/5 group transition-all duration-500 relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-all transform translate-x-4 group-hover:translate-x-0">
                                    <div className="flex gap-2">
                                        <button className="p-2.5 bg-white shadow-lg rounded-xl text-slate-400 hover:text-indigo-600 transition-all">
                                            <Edit className="w-4 h-4" />
                                        </button>
                                        <button className="p-2.5 bg-white shadow-lg rounded-xl text-slate-400 hover:text-red-600 transition-all">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>

                                <div className="flex items-center gap-6 mb-8">
                                    <div className="p-4 bg-indigo-50 rounded-[1.5rem] text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500 shadow-sm">
                                        <FolderKanban className="w-8 h-8" />
                                    </div>
                                    <div>
                                        <h3 className="font-black text-slate-900 text-xl tracking-tight group-hover:text-indigo-600 transition-colors">{category.name}</h3>
                                        <div className="flex items-center gap-2 mt-1.5 opacity-60">
                                            <Activity className="w-3 h-3 text-emerald-500" />
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Master Node</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="bg-slate-50/50 p-5 rounded-[1.5rem] flex items-center justify-between">
                                        <div className="space-y-1">
                                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Mapped Assets</div>
                                            <div className="text-2xl font-black text-slate-900 tracking-tighter">
                                                {category.productCount || 0} <span className="text-[10px] text-slate-300 font-bold uppercase">Linked</span>
                                            </div>
                                        </div>
                                        <Button variant="ghost" size="sm" className="h-10 w-10 rounded-xl bg-white shadow-sm border-none p-0 text-indigo-600 hover:bg-indigo-50">
                                            <ArrowUpRight className="w-5 h-5" />
                                        </Button>
                                    </div>

                                    <div className="flex justify-between items-center text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] px-2">
                                        <span>EST. {new Date(category.createdAt).getFullYear()}</span>
                                        <span className="text-indigo-400 font-black group-hover:underline cursor-pointer">Protocol: SHA-256</span>
                                    </div>
                                </div>
                            </motion.div>
                        ))
                    ) : (
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="col-span-full py-32 text-center"
                        >
                            <div className="w-24 h-24 bg-slate-50 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 text-slate-200 shadow-inner">
                                <Layers className="w-12 h-12" />
                            </div>
                            <h3 className="text-slate-900 font-black text-2xl tracking-tight italic">Void Architecture</h3>
                            <p className="text-slate-400 text-xs mt-3 uppercase font-bold tracking-[0.3em]">No logical domains established in the current cluster.</p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <CategoryFormModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
            />
        </motion.div>
    );
}

