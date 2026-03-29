"use client";

import { useState } from "react";
import { 
    useGetOrdersQuery, 
    useUpdateOrderStatusMutation, 
    useCancelOrderMutation 
} from "@/redux/features/order/orderApi";
import { Button } from "@/components/ui/button";
import { 
    Plus, 
    Search, 
    CheckCircle2, 
    XCircle, 
    Truck, 
    Package, 
    Clock,
    MoreHorizontal,
    ShoppingBag,
    Calendar,
    User,
    ArrowRight,
    Loader2
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import CreateOrderModal from "@/components/orders/CreateOrderModal";
import { 
    DropdownMenu, 
    DropdownMenuContent, 
    DropdownMenuItem, 
    DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
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

const STATUS_COLORS: Record<string, string> = {
    Pending: "bg-amber-50 text-amber-600 border-amber-100",
    Confirmed: "bg-indigo-50 text-indigo-600 border-indigo-100",
    Shipped: "bg-purple-50 text-purple-600 border-purple-100",
    Delivered: "bg-emerald-50 text-emerald-600 border-emerald-100",
    Cancelled: "bg-rose-50 text-rose-600 border-rose-100",
};

const STATUS_ICONS: Record<string, any> = {
    Pending: Clock,
    Confirmed: CheckCircle2,
    Shipped: Truck,
    Delivered: Package,
    Cancelled: XCircle,
};

export default function OrdersPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    // Sync search parameter key to "search" instead of "searchTerm"
    const { data: ordersData, isLoading, isFetching } = useGetOrdersQuery({ search: searchTerm });
    const [updateStatus, { isLoading: isUpdating }] = useUpdateOrderStatusMutation();
    const [cancelOrder] = useCancelOrderMutation();

    const orders = ordersData?.data || [];

    const handleUpdateStatus = async (id: string, status: string) => {
        try {
            await updateStatus({ orderId: id, status }).unwrap();
            toast.success("Order status updated", {
                description: `Order #${id.slice(-6)} is now ${status}.`
            });
        } catch (error: any) {
            toast.error("Error", {
                description: error?.data?.message || "Failed to update status"
            });
        }
    };

    const handleCancelOrder = async (id: string) => {
        toast.custom((t) => (
            <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-2xl flex flex-col gap-4">
                <div className="flex items-center gap-3 text-rose-600">
                    <XCircle className="w-5 h-5" />
                    <h4 className="font-bold text-sm">Cancel Order?</h4>
                </div>
                <div className="flex gap-2">
                    <button onClick={() => toast.dismiss(t)} className="flex-1 py-2 text-[10px] font-bold uppercase text-slate-400">Close</button>
                    <button 
                        onClick={async () => {
                            toast.dismiss(t);
                            try {
                                await cancelOrder(id).unwrap();
                                toast.success("Order Cancelled", { description: "Items have been returned to stock." });
                            } catch (error: any) {
                                toast.error("Cancellation failed");
                            }
                        }}
                        className="flex-1 py-2 bg-rose-600 text-white rounded-xl text-[10px] font-bold uppercase"
                    >
                        Confirm
                    </button>
                </div>
            </div>
        ));
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
                        Order <span className="premium-gradient-text italic">History</span>
                    </h1>
                    <p className="text-slate-500 mt-2 font-medium">
                        Track and manage all customer orders and shipments in real-time.
                    </p>
                </div>
                <Button 
                    onClick={() => setIsModalOpen(true)}
                    className="h-14 px-8 rounded-[1.25rem] bg-indigo-600 hover:bg-indigo-700 text-white shadow-xl shadow-indigo-600/20 font-bold uppercase tracking-wider text-[11px] gap-3 transition-all duration-300"
                >
                    <Plus className="w-5 h-5" /> Create New Order
                </Button>
            </div>

            {/* Filters */}
            <motion.div variants={item} className="bg-white p-6 rounded-[2rem] shadow-xl shadow-indigo-500/5 flex flex-col md:flex-row gap-6 items-center justify-between">
                <div className="relative w-full md:w-[450px] group">
                    <Search className={`absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${isFetching ? 'text-indigo-600 animate-pulse' : 'text-slate-300 group-focus-within:text-indigo-600'}`} />
                    <input
                        type="text"
                        placeholder="Search by customer name or order ID..."
                        className="w-full pl-14 pr-6 py-5 bg-slate-50 border-none rounded-[1.5rem] text-sm font-medium text-slate-700 placeholder:text-slate-300 focus:ring-2 focus:ring-indigo-500/10 focus:bg-white transition-all outline-none"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex gap-4">
                    <div className="flex -space-x-3">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="w-10 h-10 rounded-full border-4 border-white bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-400">
                                {i}
                            </div>
                        ))}
                    </div>
                </div>
            </motion.div>

            {/* Table */}
            <motion.div variants={item} className="glass-card rounded-[2.5rem] border-none shadow-xl shadow-indigo-500/5 overflow-hidden">
                <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100">
                                <th className="px-8 py-6 text-[10px] font-bold text-slate-400 uppercase tracking-[0.25em]">Order ID</th>
                                <th className="px-8 py-6 text-[10px] font-bold text-slate-400 uppercase tracking-[0.25em]">Customer Name</th>
                                <th className="px-8 py-6 text-[10px] font-bold text-slate-400 uppercase tracking-[0.25em] text-center">Products</th>
                                <th className="px-8 py-6 text-[10px] font-bold text-slate-400 uppercase tracking-[0.25em] text-center">Total Value</th>
                                <th className="px-8 py-6 text-[10px] font-bold text-slate-400 uppercase tracking-[0.25em] text-center">Status</th>
                                <th className="px-8 py-6 text-[10px] font-bold text-slate-400 uppercase tracking-[0.25em] text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            <AnimatePresence mode="popLayout">
                                {isLoading ? (
                                    [1, 2, 3, 4, 5].map((i) => (
                                        <tr key={i}><td colSpan={6} className="px-8 py-6"><Skeleton className="h-10 w-full rounded-2xl" /></td></tr>
                                    ))
                                ) : orders.length > 0 ? (
                                    orders.map((order: any) => {
                                        const StatusIcon = STATUS_ICONS[order.status] || Clock;
                                        return (
                                            <motion.tr 
                                                key={order._id}
                                                layout
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                className="hover:bg-slate-50/50 transition-all duration-300 group"
                                            >
                                                <td className="px-8 py-6">
                                                    <div className="flex items-center gap-3">
                                                        <div className="p-2.5 rounded-xl bg-slate-50 text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-all">
                                                            <ShoppingBag className="w-4 h-4" />
                                                        </div>
                                                        <div>
                                                            <div className="text-sm font-bold text-slate-900 uppercase tracking-tighter">#{order._id.slice(-8)}</div>
                                                            <div className="flex items-center gap-1.5 mt-1">
                                                                <Calendar className="w-3 h-3 text-slate-300" />
                                                                <span className="text-[9px] font-medium text-slate-400 uppercase tracking-widest">{new Date(order.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                                                            <User className="w-4 h-4" />
                                                        </div>
                                                        <div className="text-sm font-bold text-slate-700 group-hover:text-indigo-600 transition-colors">{order.customerName}</div>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6 text-center">
                                                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-50 rounded-lg">
                                                        <span className="text-xs font-bold text-slate-900">{order.products.length}</span>
                                                        <span className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">Items</span>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6 text-center">
                                                    <div className="text-sm font-bold text-slate-900">${order.totalPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
                                                </td>
                                                <td className="px-8 py-6 text-center">
                                                    <div className={`mx-auto inline-flex items-center gap-2 px-4 py-1.5 rounded-xl text-[9px] font-bold uppercase tracking-wider border shadow-sm ${STATUS_COLORS[order.status] || "bg-gray-100 text-gray-700"}`}>
                                                        <StatusIcon className="w-3 h-3" />
                                                        {order.status}
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6 text-center">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <button className="p-2.5 rounded-xl bg-slate-50 text-slate-400 hover:text-indigo-600 hover:bg-white hover:shadow-lg transition-all" title="Actions">
                                                                {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : <MoreHorizontal className="w-5 h-5" />}
                                                            </button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end" className="w-56 p-2 rounded-2xl border-none shadow-2xl bg-white/95 backdrop-blur-xl">
                                                            <DropdownMenuItem onClick={() => handleUpdateStatus(order._id, 'Confirmed')} className="rounded-xl px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-indigo-600 focus:bg-indigo-50 cursor-pointer flex justify-between">
                                                                Confirm Order <ArrowRight className="w-3 h-3" />
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem onClick={() => handleUpdateStatus(order._id, 'Shipped')} className="rounded-xl px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-purple-600 focus:bg-purple-50 cursor-pointer flex justify-between">
                                                                Mark Shipped <ArrowRight className="w-3 h-3" />
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem onClick={() => handleUpdateStatus(order._id, 'Delivered')} className="rounded-xl px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-emerald-600 focus:bg-emerald-50 cursor-pointer flex justify-between">
                                                                Mark Delivered <ArrowRight className="w-3 h-3" />
                                                            </DropdownMenuItem>
                                                            <div className="h-px bg-slate-50 my-2" />
                                                            <DropdownMenuItem onClick={() => handleCancelOrder(order._id)} className="rounded-xl px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-rose-600 focus:bg-rose-50 cursor-pointer flex justify-between">
                                                                Cancel Order <XCircle className="w-3 h-3" />
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </td>
                                            </motion.tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan={6} className="px-8 py-32 text-center">
                                            <div className="flex flex-col items-center gap-4 opacity-30">
                                                <ShoppingBag className="w-16 h-16 text-slate-200" />
                                                <div className="space-y-1">
                                                    <p className="font-bold text-slate-500">No orders found</p>
                                                    <p className="text-xs text-slate-300">Try adjusting your search or create a new order</p>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </AnimatePresence>
                        </tbody>
                    </table>
                </div>
            </motion.div>

            <CreateOrderModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
            />
        </motion.div>
    );
}
