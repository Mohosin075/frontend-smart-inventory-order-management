"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { 
    Dialog, 
    DialogContent, 
    DialogHeader, 
    DialogTitle, 
    DialogFooter 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { 
    useCreateProductMutation, 
    useUpdateProductMutation 
} from "@/redux/features/product/productApi";
import { toast } from "sonner";
import { Package, Tag, DollarSign, Database, Activity, Plus, Edit3 } from "lucide-react";

const productSchema = z.object({
    name: z.string().min(2, "Name is too short"),
    categoryId: z.string().min(1, "Please select a category"),
    price: z.coerce.number().positive("Price must be positive"),
    stockQuantity: z.coerce.number().int().nonnegative("Stock cannot be negative"),
    minStockThreshold: z.coerce.number().int().nonnegative("Threshold cannot be negative"),
});

type ProductFormData = z.infer<typeof productSchema>;

interface ProductFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    categories: any[];
    initialData?: any; // To support edit mode
}

export default function ProductFormModal({ isOpen, onClose, categories, initialData }: ProductFormModalProps) {
    const [createProduct, { isLoading: isCreating }] = useCreateProductMutation();
    const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();
    
    const isEditMode = !!initialData;
    const isLoading = isCreating || isUpdating;

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm<ProductFormData>({
        resolver: zodResolver(productSchema) as any,
        defaultValues: {
            stockQuantity: 0,
            minStockThreshold: 5
        }
    });

    // Reset form when initialData changes or modal opens/closes
    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                reset({
                    name: initialData.name,
                    categoryId: initialData.category?._id || initialData.category,
                    price: initialData.price,
                    stockQuantity: initialData.stockQuantity,
                    minStockThreshold: initialData.minStockThreshold,
                });
            } else {
                reset({
                    name: "",
                    categoryId: "",
                    price: 0,
                    stockQuantity: 0,
                    minStockThreshold: 5
                });
            }
        }
    }, [initialData, isOpen, reset]);

    const onSubmit = async (data: ProductFormData) => {
        try {
            if (isEditMode) {
                await updateProduct({ id: initialData._id, ...data }).unwrap();
                toast.success("Asset updated successfully!", {
                    description: `${data.name} has been modified in the repository.`
                });
            } else {
                await createProduct(data).unwrap();
                toast.success("New asset registered!", {
                    description: `${data.name} has been added to the repository.`
                });
            }
            onClose();
        } catch (error: any) {
            toast.error(error?.data?.message || `Failed to ${isEditMode ? 'update' : 'create'} asset`);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden rounded-[2rem] border-none shadow-2xl bg-white/95 backdrop-blur-xl">
                <div className={`p-8 text-white ${isEditMode ? 'bg-indigo-600' : 'bg-slate-900'}`}>
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-black flex items-center gap-3 uppercase tracking-wider">
                            {isEditMode ? <Edit3 className="w-6 h-6" /> : <Plus className="w-6 h-6" />}
                            {isEditMode ? "Modify Asset" : "Register Asset"}
                        </DialogTitle>
                        <p className="text-white/60 text-[11px] font-bold uppercase tracking-[0.2em] mt-2 leading-relaxed">
                            {isEditMode 
                                ? `Updating technical specifications for ${initialData.name}` 
                                : "Initialize new inventory item for global synchronization"}
                        </p>
                    </DialogHeader>
                </div>
                
                <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-8">
                    <div className="space-y-6">
                        {/* Name */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 px-1">
                                <Package className="w-3 h-3 text-indigo-500" />
                                Asset Nomenclature
                            </label>
                            <input
                                {...register("name")}
                                className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition-all outline-none text-sm font-bold text-slate-700 placeholder:text-slate-300 shadow-inner"
                                placeholder="e.g. CORE-RTX-4090-INDUSTRIAL"
                            />
                            {errors.name && <p className="text-[10px] text-red-500 font-black uppercase tracking-tighter px-1 mt-1">{errors.name.message}</p>}
                        </div>

                        {/* Category */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 px-1">
                                <Tag className="w-3 h-3 text-amber-500" />
                                Classification
                            </label>
                            <div className="relative">
                                <select
                                    {...register("categoryId")}
                                    className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition-all outline-none text-sm font-bold text-slate-700 appearance-none shadow-inner cursor-pointer"
                                >
                                    <option value="">Select Asset Class</option>
                                    {categories.map((cat) => (
                                        <option key={cat._id} value={cat._id}>{cat.name}</option>
                                    ))}
                                </select>
                                <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-300">
                                    <Plus className="w-4 h-4 rotate-45" />
                                </div>
                            </div>
                            {errors.categoryId && <p className="text-[10px] text-red-500 font-black uppercase tracking-tighter px-1 mt-1">{errors.categoryId.message}</p>}
                        </div>

                        {/* Price & Stock Row */}
                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 px-1">
                                    <DollarSign className="w-3 h-3 text-emerald-500" />
                                    Cost Matrix
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    {...register("price")}
                                    className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition-all outline-none text-sm font-bold text-slate-700 shadow-inner"
                                    placeholder="0.00"
                                />
                                {errors.price && <p className="text-[10px] text-red-500 font-black uppercase tracking-tighter px-1 mt-1">{errors.price.message}</p>}
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 px-1">
                                    <Database className="w-3 h-3 text-indigo-500" />
                                    Volume
                                </label>
                                <input
                                    type="number"
                                    {...register("stockQuantity")}
                                    className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition-all outline-none text-sm font-bold text-slate-700 shadow-inner"
                                    placeholder="0"
                                />
                                {errors.stockQuantity && <p className="text-[10px] text-red-500 font-black uppercase tracking-tighter px-1 mt-1">{errors.stockQuantity.message}</p>}
                            </div>
                        </div>

                        {/* Threshold */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 px-1">
                                <Activity className="w-3 h-3 text-rose-500" />
                                Critical Threshold
                            </label>
                            <input
                                type="number"
                                {...register("minStockThreshold")}
                                className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition-all outline-none text-sm font-bold text-slate-700 shadow-inner"
                                placeholder="5"
                            />
                            {errors.minStockThreshold && <p className="text-[10px] text-red-500 font-black uppercase tracking-tighter px-1 mt-1">{errors.minStockThreshold.message}</p>}
                        </div>
                    </div>

                    <DialogFooter className="gap-3 sm:gap-0 pt-4 border-t border-slate-50">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={onClose}
                            className="h-14 px-6 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-all"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={isLoading}
                            className={`h-14 px-10 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-white shadow-xl transition-all ${
                                isEditMode 
                                ? 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200' 
                                : 'bg-slate-900 hover:bg-black shadow-slate-200'
                            }`}
                        >
                            {isLoading ? "Synchronizing..." : isEditMode ? "Commit Changes" : "Register Asset"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
