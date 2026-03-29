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
import { useCreateProductMutation } from "@/redux/features/product/productApi";
import { toast } from "sonner";
import { Package, Tag, DollarSign, Database, Activity } from "lucide-react";

const productSchema = z.object({
    name: z.string().min(2, "Name is too short"),
    categoryId: z.string().min(1, "Please select a category"),
    price: z.coerce.number().positive("Price must be positive"),
    stock: z.coerce.number().int().nonnegative("Stock cannot be negative"),
    threshold: z.coerce.number().int().nonnegative("Threshold cannot be negative"),
});

type ProductFormData = z.infer<typeof productSchema>;

interface ProductFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    categories: any[];
}

export default function ProductFormModal({ isOpen, onClose, categories }: ProductFormModalProps) {
    const [createProduct, { isLoading }] = useCreateProductMutation();
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm<ProductFormData>({
        resolver: zodResolver(productSchema),
        defaultValues: {
            stock: 0,
            threshold: 5
        }
    });

    const onSubmit = async (data: ProductFormData) => {
        try {
            await createProduct(data).unwrap();
            toast.success("Product created successfully!");
            reset();
            onClose();
        } catch (error: any) {
            toast.error(error?.data?.message || "Failed to create product");
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[480px] p-0 overflow-hidden rounded-2xl border-none shadow-2xl">
                <div className="bg-blue-600 p-6 text-white">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold flex items-center gap-2">
                            <PlusIcon className="w-5 h-5" />
                            Add New Product
                        </DialogTitle>
                        <p className="text-blue-100 text-sm mt-1">Fill in the details to add a new item to your inventory.</p>
                    </DialogHeader>
                </div>
                
                <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6 bg-white">
                    <div className="space-y-4">
                        {/* Name */}
                        <div className="space-y-1.5">
                            <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                                <Package className="w-4 h-4 text-blue-500" />
                                Product Name
                            </label>
                            <input
                                {...register("name")}
                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none text-sm placeholder:text-gray-400"
                                placeholder="e.g. iPhone 13 Pro"
                            />
                            {errors.name && <p className="text-xs text-red-500 font-medium">{errors.name.message}</p>}
                        </div>

                        {/* Category */}
                        <div className="space-y-1.5">
                            <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                                <Tag className="w-4 h-4 text-orange-500" />
                                Category
                            </label>
                            <select
                                {...register("categoryId")}
                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none text-sm appearance-none"
                            >
                                <option value="">Select Category</option>
                                {categories.map((cat) => (
                                    <option key={cat._id} value={cat._id}>{cat.name}</option>
                                ))}
                            </select>
                            {errors.categoryId && <p className="text-xs text-red-500 font-medium">{errors.categoryId.message}</p>}
                        </div>

                        {/* Price & Stock Row */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                                    <DollarSign className="w-4 h-4 text-green-500" />
                                    Price
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    {...register("price")}
                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none text-sm"
                                    placeholder="0.00"
                                />
                                {errors.price && <p className="text-xs text-red-500 font-medium">{errors.price.message}</p>}
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                                    <Database className="w-4 h-4 text-purple-500" />
                                    Stock
                                </label>
                                <input
                                    type="number"
                                    {...register("stock")}
                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none text-sm"
                                    placeholder="0"
                                />
                                {errors.stock && <p className="text-xs text-red-500 font-medium">{errors.stock.message}</p>}
                            </div>
                        </div>

                        {/* Threshold */}
                        <div className="space-y-1.5">
                            <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                                <Activity className="w-4 h-4 text-red-500" />
                                Minimum Threshold
                            </label>
                            <input
                                type="number"
                                {...register("threshold")}
                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none text-sm font-medium"
                                placeholder="Alert when stock is below..."
                            />
                            {errors.threshold && <p className="text-xs text-red-500 font-medium">{errors.threshold.message}</p>}
                            <p className="text-[10px] text-gray-400 italic mt-1">System will alert when stock reaches this level.</p>
                        </div>
                    </div>

                    <DialogFooter className="pt-4 border-t border-gray-50">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={onClose}
                            className="rounded-xl text-gray-500 hover:bg-gray-100"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md min-w-[120px] shadow-blue-200 transition-all font-bold"
                        >
                            {isLoading ? "Saving..." : "Create Product"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

function PlusIcon(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M5 12h14" />
            <path d="M12 5v14" />
        </svg>
    );
}
