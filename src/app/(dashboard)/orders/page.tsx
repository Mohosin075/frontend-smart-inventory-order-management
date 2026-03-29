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
    Filter, 
    MoreVertical, 
    CheckCircle2, 
    XCircle, 
    Truck, 
    Package, 
    Clock
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

const STATUS_COLORS: Record<string, string> = {
    Pending: "bg-orange-100 text-orange-700 border-orange-200",
    Confirmed: "bg-blue-100 text-blue-700 border-blue-200",
    Shipped: "bg-purple-100 text-purple-700 border-purple-200",
    Delivered: "bg-green-100 text-green-700 border-green-200",
    Cancelled: "bg-red-100 text-red-700 border-red-200",
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
    const { data: ordersData, isLoading } = useGetOrdersQuery({ searchTerm });
    const [updateStatus] = useUpdateOrderStatusMutation();
    const [cancelOrder] = useCancelOrderMutation();

    const orders = ordersData?.data || [];

    const handleUpdateStatus = async (id: string, status: string) => {
        try {
            await updateStatus({ orderId: id, status }).unwrap();
            toast.success(`Order status updated to ${status}`);
        } catch (error: any) {
            toast.error(error?.data?.message || "Failed to update status");
        }
    };

    const handleCancelOrder = async (id: string) => {
        if (!confirm("Are you sure you want to cancel this order?")) return;
        try {
            await cancelOrder(id).unwrap();
            toast.success("Order cancelled successfully");
        } catch (error: any) {
            toast.error(error?.data?.message || "Failed to cancel order");
        }
    };

    return (
        <div className="p-6 space-y-6 max-w-[1600px] mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Orders</h1>
                    <p className="text-gray-500 text-sm">Monitor and process customer orders.</p>
                </div>
                <Button 
                    onClick={() => setIsModalOpen(true)}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-all rounded-xl"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Create Order
                </Button>
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search by customer name..."
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 transition-all outline-none"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Orders Table */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-100">
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-center">Order ID / Date</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-center">Customer</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-center">Products</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-center">Amount</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-center">Status</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 font-medium">
                            {isLoading ? (
                                [1, 2, 3, 4, 5].map((i) => (
                                    <tr key={i}><td colSpan={6} className="px-6 py-4"><Skeleton className="h-10 w-full rounded-lg" /></td></tr>
                                ))
                            ) : orders.length > 0 ? (
                                orders.map((order: any) => {
                                    const StatusIcon = STATUS_ICONS[order.status] || Clock;
                                    return (
                                        <tr key={order._id} className="hover:bg-gray-50/30 transition-colors">
                                            <td className="px-6 py-4 text-center">
                                                <div className="text-sm font-bold text-gray-900 uppercase">#{order._id.slice(-6)}</div>
                                                <div className="text-[10px] text-gray-400 mt-0.5">{new Date(order.createdAt).toLocaleDateString()}</div>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <div className="text-sm text-gray-900">{order.customerName}</div>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <div className="text-sm text-gray-600">
                                                    {order.products.length} item{order.products.length !== 1 ? 's' : ''}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <div className="text-sm font-bold text-gray-900">${order.totalPrice.toFixed(2)}</div>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${STATUS_COLORS[order.status] || "bg-gray-100 text-gray-700"}`}>
                                                    <StatusIcon className="w-3 h-3" />
                                                    {order.status}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                                                            <MoreVertical className="w-5 h-5" />
                                                        </button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="w-48 rounded-xl p-1 border-gray-100 shadow-xl">
                                                        <DropdownMenuItem onClick={() => handleUpdateStatus(order._id, 'Confirmed')} className="rounded-lg text-xs font-bold uppercase tracking-wider text-blue-600 focus:text-blue-700">Confirm Order</DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => handleUpdateStatus(order._id, 'Shipped')} className="rounded-lg text-xs font-bold uppercase tracking-wider text-purple-600 focus:text-purple-700">Mark as Shipped</DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => handleUpdateStatus(order._id, 'Delivered')} className="rounded-lg text-xs font-bold uppercase tracking-wider text-green-600 focus:text-green-700">Mark as Delivered</DropdownMenuItem>
                                                        <div className="h-px bg-gray-50 my-1" />
                                                        <DropdownMenuItem onClick={() => handleCancelOrder(order._id)} className="rounded-lg text-xs font-bold uppercase tracking-wider text-red-600 focus:text-red-700 focus:bg-red-50">Cancel Order</DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan={6} className="px-6 py-20 text-center text-gray-400 italic bg-gray-50/20">No orders placed yet.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <CreateOrderModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
            />
        </div>
    );
}
