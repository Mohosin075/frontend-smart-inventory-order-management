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
import { Plus, Trash2, User, ShoppingCart, Package, AlertTriangle, DollarSign, Sparkles } from "lucide-react";
import { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

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
        const productIds = data.products.map(p => p.productId);
        const hasDuplicates = new Set(productIds).size !== productIds.length;
        if (hasDuplicates) {
            toast.error("Duplicate product entries detected.");
            return;
        }

        for (const item of data.products) {
            const product = availableProducts.find((p: any) => p._id === item.productId);
            if (!product) continue;
            if (item.quantity > product.stockQuantity) {
                toast.error(`Only ${product.stockQuantity} items available for "${product.name}".`);
                return;
            }
            if (product.status !== 'Active') {
                toast.error(`"${product.name}" is currently unavailable.`);
                return;
            }
        }

        try {
            await createOrder(data).unwrap();
            toast.success("Order processed successfully. Inventory updated.");
            reset();
            onClose();
        } catch (error: any) {
            toast.error(error?.data?.message || "Failed to process order.");
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[700px] p-0 overflow-hidden rounded-[2.5rem] border-none shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)] bg-white">
                <div className="premium-sidebar p-8 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl -mr-10 -mt-10" />
                    <DialogHeader className="relative z-10">
                        <DialogTitle className="text-2xl font-black flex items-center gap-3 tracking-tight">
                            <div className="p-2 bg-white/10 rounded-xl">
                                <ShoppingCart className="w-6 h-6" />
                            </div>
                            New Sales Pipeline
                        </DialogTitle>
                        <p className="text-indigo-200 text-[11px] font-bold uppercase tracking-[0.2em] mt-2 opacity-80">
                            Fulfillment Management System
                        </p>
                    </DialogHeader>
                </div>
                
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
                    <div className="p-10 space-y-10 max-h-[65vh] overflow-y-auto custom-scrollbar">
                        <div className="space-y-8">
                            {/* Customer Info */}
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-1 flex items-center gap-2">
                                    <User className="w-3.5 h-3.5" />
                                    Account Identity
                                </label>
                                <input
                                    {...register("customerName")}
                                    className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500/20 transition-all outline-none font-bold text-slate-900 placeholder:text-slate-300"
                                    placeholder="e.g. Corporate Client Alpha"
                                />
                                {errors.customerName && <p className="text-[10px] font-bold text-red-500 uppercase tracking-wide px-2">{errors.customerName.message}</p>}
                            </div>

                            <div className="h-px bg-slate-100/60" />

                            {/* Product Field Array */}
                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-1 flex items-center gap-2">
                                        <Package className="w-3.5 h-3.5" />
                                        Inventory Selection
                                    </label>
                                    <Button 
                                        type="button" 
                                        variant="ghost" 
                                        size="sm" 
                                        onClick={() => append({ productId: "", quantity: 1 })}
                                        className="text-indigo-600 font-black text-[10px] uppercase tracking-widest hover:bg-indigo-50 px-4 rounded-xl transition-all"
                                    >
                                        <Plus className="w-4 h-4 mr-1.5" /> Add Component
                                    </Button>
                                </div>

                                <div className="space-y-4">
                                    <AnimatePresence mode="popLayout">
                                        {fields.map((field, index) => {
                                            const selectedProductId = watchedProducts[index]?.productId || "";
                                            const selectedProduct = availableProducts.find((p: any) => p._id === selectedProductId);
                                            
                                            return (
                                                <motion.div 
                                                    key={field.id}
                                                    initial={{ opacity: 0, scale: 0.95 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    exit={{ opacity: 0, x: -20 }}
                                                    className="group flex flex-col sm:flex-row gap-4 p-6 rounded-[2rem] bg-slate-50/50 border border-transparent hover:border-indigo-100 hover:bg-white hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300"
                                                >
                                                    <div className="flex-grow space-y-2">
                                                        <select
                                                            {...register(`products.${index}.productId`)}
                                                            className="w-full px-5 py-3.5 bg-white border-none rounded-2xl text-sm font-bold text-slate-700 transition-all focus:ring-2 focus:ring-indigo-500/20 outline-none shadow-sm"
                                                        >
                                                            <option value="">Select Asset...</option>
                                                            {availableProducts.map((p: any) => (
                                                                <option key={p._id} value={p._id} disabled={p.status === 'Out of Stock' || p.stockQuantity <= 0}>
                                                                    {p.name} — ${p.price.toLocaleString()} [{p.stockQuantity} Unit]
                                                                </option>
                                                            ))}
                                                        </select>
                                                        {errors.products?.[index]?.productId && (
                                                            <p className="text-[10px] text-red-500 font-bold uppercase py-1">{errors.products[index]?.productId?.message}</p>
                                                        )}
                                                        {selectedProduct && selectedProduct.stockQuantity <= (selectedProduct.minStockThreshold || 5) && (
                                                            <div className="text-[9px] font-black text-amber-500 uppercase tracking-widest flex items-center gap-1.5 mt-2 px-1">
                                                                <AlertTriangle className="w-3.5 h-3.5" /> 
                                                                Inventory Critical ({selectedProduct.stockQuantity} left)
                                                            </div>
                                                        )}
                                                    </div>

                                                    <div className="flex gap-3 items-center">
                                                        <div className="w-28 relative">
                                                            <input
                                                                type="number"
                                                                {...register(`products.${index}.quantity`)}
                                                                className="w-full px-5 py-3.5 bg-white border-none rounded-2xl text-sm font-black text-center outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all shadow-sm"
                                                                placeholder="Qty"
                                                            />
                                                            {errors.products?.[index]?.quantity && (
                                                                <p className="text-[9px] text-red-500 font-bold absolute -bottom-5 left-0 w-full text-center uppercase">{errors.products[index]?.quantity?.message}</p>
                                                            )}
                                                        </div>
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="sm"
                                                            disabled={fields.length === 1}
                                                            onClick={() => remove(index)}
                                                            className="h-12 w-12 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-colors"
                                                        >
                                                            <Trash2 className="w-5 h-5" />
                                                        </Button>
                                                    </div>
                                                </motion.div>
                                            );
                                        })}
                                    </AnimatePresence>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-10 border-t border-slate-50 bg-slate-50/10">
                        <div className="flex items-center justify-between mb-10 p-6 bg-white rounded-[2rem] premium-shadow border-none">
                            <div className="space-y-1">
                                <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Gross Valuation</div>
                                <div className="text-sm font-bold text-indigo-500 uppercase tracking-widest flex items-center gap-2">
                                    <Sparkles className="w-4 h-4" /> Final Audit
                                </div>
                            </div>
                            <div className="text-4xl font-black text-slate-900 tracking-tighter flex items-center">
                                <DollarSign className="w-7 h-7 text-indigo-600 -mr-1" />
                                {totalPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </div>
                        </div>

                        <DialogFooter className="flex flex-col sm:flex-row gap-4">
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={onClose}
                                className="w-full sm:flex-1 h-14 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-slate-600 transition-all"
                            >
                                Void Order
                            </Button>
                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="w-full sm:flex-[2] h-14 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl shadow-2xl shadow-indigo-600/30 transition-all font-black uppercase tracking-[0.2em] text-[11px]"
                            >
                                {isLoading ? "Synchronizing Data..." : "Execute Shipment"}
                            </Button>
                        </DialogFooter>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}

