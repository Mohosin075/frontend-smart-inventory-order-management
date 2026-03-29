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
    useCreateCategoryMutation, 
    useUpdateCategoryMutation 
} from "@/redux/features/product/productApi";
import { toast } from "sonner";
import { Layers, Plus, Edit3, Loader2 } from "lucide-react";

const categorySchema = z.object({
    name: z.string().min(2, "Name is too short"),
});

type CategoryFormData = z.infer<typeof categorySchema>;

interface CategoryFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialData?: any;
}

export default function CategoryFormModal({ isOpen, onClose, initialData }: CategoryFormModalProps) {
    const [createCategory, { isLoading: isCreating }] = useCreateCategoryMutation();
    const [updateCategory, { isLoading: isUpdating }] = useUpdateCategoryMutation();
    
    const isEditMode = !!initialData;
    const isLoading = isCreating || isUpdating;

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm<CategoryFormData>({
        resolver: zodResolver(categorySchema),
    });

    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                reset({ name: initialData.name });
            } else {
                reset({ name: "" });
            }
        }
    }, [initialData, isOpen, reset]);

    const onSubmit = async (data: CategoryFormData) => {
        try {
            if (isEditMode) {
                await updateCategory({ id: initialData._id, ...data }).unwrap();
                toast.success("Classification updated", {
                    description: `Primary node has been renamed to ${data.name}.`
                });
            } else {
                await createCategory(data).unwrap();
                toast.success("New structure established", {
                    description: `${data.name} has been added to the hierarchy.`
                });
            }
            onClose();
        } catch (error: any) {
            toast.error(error?.data?.message || `Failed to ${isEditMode ? 'update' : 'create'} classification`);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[450px] p-0 overflow-hidden rounded-[2.5rem] border-none shadow-2xl bg-white/95 backdrop-blur-xl">
                <div className={`p-10 text-white text-center flex flex-col items-center ${isEditMode ? 'bg-indigo-600' : 'bg-slate-900'}`}>
                    <DialogHeader>
                        <div className="w-16 h-16 bg-white/10 rounded-[1.5rem] flex items-center justify-center mb-6 shadow-inner ring-1 ring-white/20">
                            {isEditMode ? <Edit3 className="w-8 h-8" /> : <Layers className="w-8 h-8" />}
                        </div>
                        <DialogTitle className="text-2xl font-black uppercase tracking-wider">
                            {isEditMode ? "Modify Node" : "New Structure"}
                        </DialogTitle>
                        <p className="text-white/60 text-[10px] mt-2 uppercase tracking-[0.3em] font-black">
                            {isEditMode ? "Updating logical domain parameters" : "Establish a new hierarchical classification"}
                        </p>
                    </DialogHeader>
                </div>
                
                <form onSubmit={handleSubmit(onSubmit)} className="p-10 space-y-8 bg-white">
                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                            <Plus className="w-3 h-3 text-indigo-500" /> Nomenclature
                        </label>
                        <input
                            {...register("name")}
                            className="w-full px-6 py-5 bg-slate-50 border-none rounded-[1.5rem] focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition-all outline-none text-sm font-bold text-slate-700 placeholder:text-slate-300 shadow-inner"
                            placeholder="e.g. LOGISTICS_HUB_ALPHA"
                        />
                        {errors.name && <p className="text-[10px] text-red-500 font-black uppercase tracking-tighter px-2">{errors.name.message}</p>}
                    </div>

                    <DialogFooter className="pt-4 flex flex-col sm:flex-row gap-4">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={onClose}
                            className="w-full h-14 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 hover:bg-slate-50 transition-all"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={isLoading}
                            className={`w-full h-14 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-white shadow-xl transition-all ${
                                isEditMode ? 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200' : 'bg-slate-900 hover:bg-black shadow-slate-200'
                            }`}
                        >
                            {isLoading ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : isEditMode ? "Commit Changes" : "Initialize Node"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
