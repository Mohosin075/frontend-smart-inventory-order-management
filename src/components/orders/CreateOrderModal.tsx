"use client";

import { useForm, useFieldArray, useWatch } from "react-hook-form";
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
import { useCreateOrderMutation } from "@/redux/features/order/orderApi";
import { useGetProductsQuery } from "@/redux/features/product/productApi";
import { toast } from "sonner";
import { Plus, Trash2, User, ShoppingCart, Package, AlertTriangle, DollarSign } from "lucide-react";
import { useMemo } from "react";

const orderSchema = z.object({
    customerName: z.string().min(2, "Customer name is required"),
    products: z.array(z.object({
        productId: z.string().min(1, "Product is required"),
        quantity: z.coerce.number().int().positive("Quantity must be at least 1"),
    })).min(1, "At least one product is required"),
});

type OrderFormData = z.infer<typeof orderSchema>;

interface CreateOrderModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function CreateOrderModal({ isOpen, onClose }: CreateOrderModalProps) {
    const { data: productsData } = useGetProductsQuery({ searchTerm: "" });
    const [createOrder, { isLoading }] = useCreateOrderMutation();

    const availableProducts = productsData?.data || [];

    const {
        register,
        control,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm<OrderFormData>({
        resolver: zodResolver(orderSchema) as any,
        defaultValues: {
            customerName: "",
            products: [{ productId: "", quantity: 1 }],
        }
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "products",
    });

    const watchedProducts = useWatch({
        control,
        name: "products",
    }) as OrderFormData["products"] || [];

    // Calculate total price during render to avoid cascading renders warning
    const totalPrice = useMemo(() => {
        let total = 0;
        watchedProducts.forEach((item) => {
            const product = availableProducts.find((p: any) => p._id === item.productId);
            if (product && item.quantity) {
                total += product.price * item.quantity;
            }
        });
        return total;
    }, [watchedProducts, availableProducts]);

    const onSubmit = async (data: OrderFormData) => {
        // Additional Conflict Handling
        const productIds = data.products.map(p => p.productId);
        const hasDuplicates = new Set(productIds).size !== productIds.length;
        if (hasDuplicates) {
            toast.error("Duplicate product entries in the same order.");
            return;
        }

        // Stock check
        for (const item of data.products) {
            const product = availableProducts.find((p: any) => p._id === item.productId);
            if (!product) continue;
            if (item.quantity > product.stock) {
                toast.error(`Only ${product.stock} items available in stock for "${product.name}".`);
                return;
            }
            if (product.status === 'Out of Stock' || product.stock <= 0) {
                toast.error(`Product "${product.name}" is currently unavailable.`);
                return;
            }
        }

        try {
            await createOrder(data).unwrap();
            toast.success("Order created successfully! Stock deducted.");
            reset();
            onClose();
        } catch (error: any) {
            toast.error(error?.data?.message || "Failed to create order");
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[640px] p-0 overflow-hidden rounded-2xl border-none shadow-2xl">
                <div className="bg-emerald-600 p-6 text-white">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold flex items-center gap-2">
                            <ShoppingCart className="w-5 h-5" />
                            New Sales Order
                        </DialogTitle>
                        <p className="text-emerald-100 text-sm mt-1">Register a new customer order and manage fulfillment.</p>
                    </DialogHeader>
                </div>
                
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="p-8 space-y-6 bg-white max-h-[70vh] overflow-y-auto">
                        <div className="space-y-4">
                            {/* Customer Info */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1 flex items-center gap-1.5">
                                    <User className="w-3.5 h-3.5" />
                                    Customer Name
                                </label>
                                <input
                                    {...register("customerName")}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all outline-none text-sm font-medium"
                                    placeholder="e.g. John Doe"
                                />
                                {errors.customerName && <p className="text-xs text-red-500 font-medium">{errors.customerName.message}</p>}
                            </div>

                            <div className="h-px bg-gray-50 my-2" />

                            {/* Product Field Array */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between mb-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1 flex items-center gap-1.5">
                                        <Package className="w-3.5 h-3.5" />
                                        Order Items
                                    </label>
                                    <Button 
                                        type="button" 
                                        variant="ghost" 
                                        size="sm" 
                                        onClick={() => append({ productId: "", quantity: 1 })}
                                        className="text-emerald-600 font-bold text-xs uppercase hover:bg-emerald-50"
                                    >
                                        <Plus className="w-4 h-4 mr-1" /> Add Item
                                    </Button>
                                </div>

                                <div className="space-y-3">
                                    {fields.map((field, index) => {
                                        const selectedProductId = watchedProducts[index]?.productId || "";
                                        const selectedProduct = availableProducts.find((p: any) => p._id === selectedProductId);
                                        
                                        return (
                                            <div key={field.id} className="group flex flex-col sm:flex-row gap-3 p-4 rounded-xl border border-gray-100 bg-gray-50/20 hover:border-emerald-100 transition-all">
                                                <div className="flex-grow space-y-1.5">
                                                    <select
                                                        {...register(`products.${index}.productId`)}
                                                        className="w-full px-3 py-2 bg-white border border-gray-100 rounded-lg text-sm transition-all focus:ring-2 focus:ring-emerald-500 outline-none"
                                                    >
                                                        <option value="">Select Product...</option>
                                                        {availableProducts.map((p: any) => (
                                                            <option key={p._id} value={p._id} disabled={p.status === 'Out of Stock'}>
                                                                {p.name} (${p.price}) - {p.stock} left
                                                            </option>
                                                        ))}
                                                    </select>
                                                    {errors.products?.[index]?.productId && (
                                                        <p className="text-[10px] text-red-500 font-medium">{errors.products[index]?.productId?.message}</p>
                                                    )}
                                                    {selectedProduct && selectedProduct.stock <= 5 && (
                                                        <div className="text-[10px] text-orange-600 font-bold uppercase flex items-center gap-1 scale-95 origin-left">
                                                            <AlertTriangle className="w-3 h-3" /> 
                                                            Limited Stock Available ({selectedProduct.stock})
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="flex gap-2 items-center">
                                                    <div className="w-24 relative">
                                                        <input
                                                            type="number"
                                                            {...register(`products.${index}.quantity`)}
                                                            className="w-full px-3 py-2 bg-white border border-gray-100 rounded-lg text-sm text-center outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                                                            placeholder="Qty"
                                                        />
                                                        {errors.products?.[index]?.quantity && (
                                                            <p className="text-[10px] text-red-500 font-medium absolute -bottom-4 left-0 w-full text-center">{errors.products[index]?.quantity?.message}</p>
                                                        )}
                                                    </div>
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="sm"
                                                        disabled={fields.length === 1}
                                                        onClick={() => remove(index)}
                                                        className="text-red-400 hover:text-red-600 hover:bg-red-50 p-2 rounded-lg"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-8 border-t border-gray-50 bg-gray-50/10">
                        <div className="flex justify-between items-center mb-6">
                            <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">Estimated Total</div>
                            <div className="text-3xl font-bold text-gray-900 font-mono tracking-tighter flex items-center gap-1">
                                <DollarSign className="w-6 h-6 text-emerald-600" />
                                {totalPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </div>
                        </div>

                        <DialogFooter className="flex flex-col sm:flex-row gap-3">
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={onClose}
                                className="w-full sm:w-auto rounded-xl text-gray-500 font-medium"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-lg shadow-emerald-50 transition-all font-bold px-10 h-11"
                            >
                                {isLoading ? "Processing..." : "Finish & Create Order"}
                            </Button>
                        </DialogFooter>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
