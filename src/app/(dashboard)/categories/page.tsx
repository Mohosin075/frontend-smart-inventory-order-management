"use client";

import { useState } from "react";
import { 
    useGetCategoriesQuery, 
    useDeleteCategoryMutation 
} from "@/redux/features/product/productApi";
import { Button } from "@/components/ui/button";
import { 
    Plus, 
    Layers, 
    Edit, 
    Trash2, 
    ArrowUpRight,
    Activity,
    FolderKanban,
    Loader2,
    History
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import CategoryFormModal from "@/components/categories/CategoryFormModal";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

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
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0 }
};

export default function CategoriesPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<any>(null);
    
    const { data: categoriesData, isLoading } = useGetCategoriesQuery(undefined);
    const [deleteCategory, { isLoading: isDeleting }] = useDeleteCategoryMutation();

    const categories = categoriesData?.data || [];

    const handleEdit = (category: any) => {
        setEditingCategory(category);
        setIsModalOpen(true);
    };

    const handleDelete = async (id: string, name: string) => {
        toast.custom((t) => (
            <div className="bg-white/95 backdrop-blur-xl border border-slate-100 p-8 rounded-[2rem] shadow-2xl flex flex-col gap-6 min-w-[340px]">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center text-red-500 shadow-inner">
                        <Trash2 className="w-7 h-7" />
                    </div>
                    <div>
                        <h4 className="font-bold text-slate-900 text-lg">Delete Category?</h4>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-1">{name}</p>
                    </div>
                </div>
                <p className="text-xs text-slate-500 font-medium leading-relaxed">
                    This will permanently remove this category. Linked products will become unassigned.
                </p>
                <div className="flex gap-3">
                    <button 
                        onClick={() => toast.dismiss(t)}
                        className="flex-1 h-12 rounded-xl text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={async () => {
                            toast.dismiss(t);
                            try {
                                await deleteCategory(id).unwrap();
                                toast.success("Category deleted", {
                                    description: `${name} has been removed from the list.`
                                });
                            } catch (error: any) {
                                toast.error("Error", {
                                    description: error?.data?.message || "Failed to delete category"
                                });
                            }
                        }}
                        className="flex-1 h-12 rounded-xl bg-red-600 text-white text-[10px] font-bold uppercase tracking-widest shadow-lg shadow-red-200 hover:bg-red-700 transition-all"
                    >
                        Confirm
                    </button>
                </div>
            </div>
        ), { duration: 5000 });
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingCategory(null);
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
                    <h1 className="text-4xl font-bold tracking-tight text-slate-900">
                        Product <span className="premium-gradient-text italic">Categories</span>
                    </h1>
                    <p className="text-slate-500 mt-2 font-medium">
                        Organize your products into easy-to-manage groups.
                    </p>
                </div>
                <Button 
                    onClick={() => setIsModalOpen(true)}
                    className="h-14 px-8 rounded-[1.25rem] bg-indigo-600 hover:bg-indigo-700 text-white shadow-xl shadow-indigo-600/20 font-bold uppercase tracking-wider text-[11px] gap-3 transition-all duration-300"
                >
                    <Plus className="w-5 h-5" /> New Category
                </Button>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <AnimatePresence mode="popLayout">
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
                                layout
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="glass-card p-8 rounded-[3rem] border-none shadow-xl shadow-indigo-500/5 group transition-all duration-500 relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-100 transition-all transform translate-x-4 group-hover:translate-x-0 z-20">
                                    <div className="flex gap-3">
                                        <button 
                                            onClick={() => handleEdit(category)}
                                            className="p-3 bg-white shadow-xl rounded-xl text-slate-400 hover:text-indigo-600 hover:scale-110 transition-all"
                                            title="Edit"
                                        >
                                            <Edit className="w-4 h-4" />
                                        </button>
                                        <button 
                                            onClick={() => handleDelete(category._id, category.name)}
                                            disabled={isDeleting}
                                            className="p-3 bg-white shadow-xl rounded-xl text-slate-400 hover:text-red-600 hover:scale-110 transition-all"
                                            title="Delete"
                                        >
                                            {isDeleting ? <Loader2 className="w-4 h-4 animate-spin text-red-600" /> : <Trash2 className="w-4 h-4" />}
                                        </button>
                                    </div>
                                </div>

                                <div className="flex items-center gap-6 mb-10 relative z-10">
                                    <div className="p-5 bg-indigo-50 rounded-[2rem] text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500 shadow-sm ring-1 ring-indigo-500/5 group-hover:rotate-6">
                                        <FolderKanban className="w-10 h-10" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-900 text-2xl tracking-tight group-hover:text-indigo-600 transition-colors uppercase">{category.name}</h3>
                                        <div className="flex items-center gap-2 mt-2 opacity-60">
                                            <Activity className="w-3.5 h-3.5 text-emerald-500" />
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active Category</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-8 relative z-10">
                                    <div className="bg-slate-50/50 p-6 rounded-[2rem] flex items-center justify-between group-hover:bg-white group-hover:shadow-lg transition-all shadow-inner">
                                        <div className="space-y-1">
                                            <div className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.2em]">Products</div>
                                            <div className="text-3xl font-bold text-slate-900 tracking-tighter group-hover:text-indigo-600 transition-colors">
                                                {category.productCount || 0} <span className="text-[10px] text-slate-300 font-bold uppercase tracking-widest ml-1">Items</span>
                                            </div>
                                        </div>
                                        <Button variant="ghost" size="sm" className="h-12 w-12 rounded-2xl bg-white shadow-md border-none p-0 text-indigo-600 hover:bg-indigo-600 hover:text-white transition-all">
                                            <ArrowUpRight className="w-6 h-6" />
                                        </Button>
                                    </div>

                                    <div className="flex justify-between items-center text-[10px] font-bold text-slate-300 uppercase tracking-[0.3em] px-4">
                                        <div className="flex items-center gap-2">
                                            <History className="w-3 h-3" />
                                            <span>Est. {new Date(category.createdAt).getFullYear()}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-indigo-500/5 rounded-full blur-3xl group-hover:bg-indigo-500/10 transition-all duration-700" />
                            </motion.div>
                        ))
                    ) : (
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="col-span-full py-40 text-center"
                        >
                            <div className="w-32 h-32 bg-slate-50 rounded-[3rem] flex items-center justify-center mx-auto mb-10 text-slate-200 shadow-inner group transition-all duration-700 hover:bg-indigo-50 hover:text-indigo-200">
                                <Layers className="w-16 h-16 transform group-hover:rotate-12 transition-transform duration-700" />
                            </div>
                            <h3 className="text-slate-900 font-bold text-3xl tracking-tight italic opacity-30">No Categories Found</h3>
                            <p className="text-slate-400 text-xs mt-4 font-medium max-w-[400px] mx-auto leading-relaxed">You haven&apos;t created any categories yet. Create one to get started.</p>
                            <Button 
                                onClick={() => setIsModalOpen(true)}
                                variant="outline"
                                className="mt-10 h-12 rounded-xl px-8 border-slate-100 uppercase tracking-widest font-bold text-[10px] text-slate-400 hover:text-indigo-600 hover:bg-indigo-50"
                            >
                                Create First Category
                            </Button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <CategoryFormModal 
                isOpen={isModalOpen} 
                onClose={closeModal} 
                initialData={editingCategory}
            />
        </motion.div>
    );
}
