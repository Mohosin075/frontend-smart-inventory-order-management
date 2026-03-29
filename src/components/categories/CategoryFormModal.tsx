"use client";

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
import { useCreateCategoryMutation } from "@/redux/features/product/productApi";
import { toast } from "sonner";
import { Layers, Plus } from "lucide-react";

const categorySchema = z.object({
    name: z.string().min(2, "Name is too short"),
});

type CategoryFormData = z.infer<typeof categorySchema>;

interface CategoryFormModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function CategoryFormModal({ isOpen, onClose }: CategoryFormModalProps) {
    const [createCategory, { isLoading }] = useCreateCategoryMutation();
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm<CategoryFormData>({
        resolver: zodResolver(categorySchema),
    });

    const onSubmit = async (data: CategoryFormData) => {
        try {
            await createCategory(data).unwrap();
            toast.success("Category created successfully!");
            reset();
            onClose();
        } catch (error: any) {
            toast.error(error?.data?.message || "Failed to create category");
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[420px] p-0 overflow-hidden rounded-2xl border-none shadow-2xl">
                <div className="bg-indigo-600 p-6 text-white text-center">
                    <DialogHeader>
                        <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Layers className="w-6 h-6" />
                        </div>
                        <DialogTitle className="text-xl font-bold">New Category</DialogTitle>
                        <p className="text-indigo-100 text-xs mt-1 uppercase tracking-widest font-bold">Group your inventory better.</p>
                    </DialogHeader>
                </div>
                
                <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-6 bg-white">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">
                            Category Name
                        </label>
                        <input
                            {...register("name")}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all outline-none text-sm placeholder:text-gray-400"
                            placeholder="e.g. Electronics, Furniture..."
                        />
                        {errors.name && <p className="text-xs text-red-500 font-medium">{errors.name.message}</p>}
                    </div>

                    <DialogFooter className="pt-4 flex flex-col sm:flex-row gap-3">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={onClose}
                            className="w-full sm:w-auto rounded-xl text-gray-400 hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-lg shadow-indigo-100 transition-all font-bold px-8"
                        >
                            {isLoading ? "Creating..." : "Save Category"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
