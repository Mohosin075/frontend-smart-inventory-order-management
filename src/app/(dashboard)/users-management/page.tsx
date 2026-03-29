"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, Ban, Crown, ShieldCheck, UserCheck, Loader2, Mail, Calendar, Activity, ShieldAlert } from "lucide-react";
import Image from "next/image";
import { useGetUsersQuery, useUpdateUserStatusMutation, USER_STATUS } from "@/redux/features/user/userApi";
import { getImageUrl } from "@/utils/imageUrl";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";

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
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0 }
};

export default function UserManagement() {
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [roleFilter, setRoleFilter] = useState<string>("all");
    const [page, setPage] = useState(1);

    const { data: usersResponse, isLoading, isFetching } = useGetUsersQuery({
        searchTerm: searchTerm || undefined,
        status: statusFilter !== "all" ? statusFilter as USER_STATUS : undefined,
        page,
        limit: 10,
    });

    const [updateUserStatus, { isLoading: isUpdating }] = useUpdateUserStatusMutation();

    const users = usersResponse?.data || [];
    const meta = usersResponse?.meta;

    const handleStatusUpdate = async (userId: string, currentStatus: string) => {
        try {
            const newStatus = currentStatus === USER_STATUS.ACTIVE ? USER_STATUS.INACTIVE : USER_STATUS.ACTIVE;
            const toastId = toast.loading(`Updating security clearance for user...`);
            await updateUserStatus({ id: userId, status: newStatus }).unwrap();
            toast.success(`Access level synchronized: User is now ${newStatus}`, { id: toastId });
        } catch (error: any) {
            toast.error(error?.data?.message || "Protocol rejection: Clearance update failed.");
        }
    };

    const formatDate = (dateString: string) => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
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
                    <h1 className="text-4xl font-black tracking-tight text-slate-900">
                        Personnel <span className="premium-gradient-text italic">Directory</span>
                    </h1>
                    <p className="text-slate-500 mt-2 font-medium tracking-wide">
                        Manage organizational access and security protocols.
                    </p>
                </div>
                <div className="glass-card px-6 py-4 rounded-[1.5rem] flex items-center gap-6 border-none shadow-xl shadow-indigo-500/5">
                    <div className="flex flex-col items-center">
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Personnel</div>
                        <div className="text-2xl font-black text-indigo-600">{meta?.total || 0}</div>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <motion.div variants={item} className="flex flex-wrap gap-4 items-center justify-between">
                <div className="flex flex-wrap gap-4 flex-1">
                    <div className="relative w-full md:w-[400px]">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-indigo-400" />
                        <Input 
                            placeholder="Search by identity or email..." 
                            className="w-full pl-14 pr-6 py-7 bg-white border-none rounded-[1.5rem] text-sm font-bold text-slate-700 placeholder:text-slate-300 shadow-xl shadow-indigo-500/5 focus:ring-2 focus:ring-indigo-500/10 transition-all outline-none h-auto" 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-[200px] h-[58px] bg-white border-none rounded-[1.5rem] shadow-xl shadow-indigo-500/5 font-bold text-slate-600 px-6">
                            <SelectValue placeholder="Access Level" />
                        </SelectTrigger>
                        <SelectContent className="rounded-2xl border-none shadow-2xl">
                            <SelectItem value="all">All Access</SelectItem>
                            <SelectItem value="active">Active Clearance</SelectItem>
                            <SelectItem value="inactive">Revoked</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </motion.div>

            {/* User List */}
            <div className="space-y-6">
                <AnimatePresence mode="popLayout">
                    {isLoading ? (
                        [1, 2, 3].map((i) => (
                            <Skeleton key={i} className="h-32 w-full rounded-[2.5rem]" />
                        ))
                    ) : users.length === 0 ? (
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center py-32 glass-card rounded-[2.5rem] border-none shadow-xl"
                        >
                            <ShieldAlert className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                            <h3 className="text-slate-900 font-black text-xl italic uppercase tracking-widest">No matching personnel</h3>
                        </motion.div>
                    ) : (
                        users.map((user: any) => (
                            <motion.div 
                                key={user._id} 
                                variants={item}
                                whileHover={{ x: 10 }}
                                className="glass-card rounded-[2.5rem] p-8 flex flex-col md:flex-row gap-8 items-start md:items-center relative border-none shadow-xl shadow-indigo-500/5 group group transition-all duration-300 overflow-hidden"
                            >
                                {/* Decorative gradient */}
                                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-indigo-500/10 transition-colors" />

                                <div className="relative shrink-0">
                                    <div className="w-20 h-20 rounded-[2rem] bg-indigo-100 p-1 group-hover:rotate-6 transition-transform duration-500">
                                        <div className="w-full h-full rounded-[1.8rem] overflow-hidden relative bg-white flex items-center justify-center">
                                            {user.profile ? (
                                                <Image src={getImageUrl(user.profile)} alt={user.name || "User"} fill className="object-cover" />
                                            ) : (
                                                <div className="text-2xl font-black text-indigo-400 uppercase">
                                                    {(user.name || user.email || "?").charAt(0)}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className={`absolute -bottom-1 -right-1 w-6 h-6 border-4 border-white rounded-full ${user.status === 'active' ? 'bg-emerald-500' : 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)] animate-pulse'}`} />
                                </div>
                                
                                <div className="flex-1 space-y-4">
                                    <div className="flex items-center gap-4">
                                        <h3 className="text-xl font-black text-slate-900 tracking-tight group-hover:text-indigo-600 transition-colors">{user.name || "Unknown Identity"}</h3>
                                        <div className={`px-4 py-1 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] border shadow-sm ${
                                            user.status === 'active' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-red-50 text-red-600 border-red-100'
                                        }`}>
                                            {user.status}
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap gap-8">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-slate-50 rounded-lg text-slate-400 group-hover:text-indigo-500 transition-colors">
                                                <Mail className="w-4 h-4" />
                                            </div>
                                            <span className="text-sm font-bold text-slate-500">{user.email}</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-slate-50 rounded-lg text-slate-400 group-hover:text-indigo-500 transition-colors">
                                                <Calendar className="w-4 h-4" />
                                            </div>
                                            <span className="text-sm font-bold text-slate-500">Member since {formatDate(user.createdAt)}</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-slate-50 rounded-lg text-slate-400 group-hover:text-indigo-500 transition-colors">
                                                <Activity className="w-4 h-4" />
                                            </div>
                                            <span className="text-sm font-bold text-slate-500 uppercase tracking-widest text-[10px]">Last Sync: {formatDate(user.updatedAt)}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex md:flex-col items-end gap-3 shrink-0 ml-auto pt-4 md:pt-0">
                                    <Badge className="bg-indigo-600/10 text-indigo-600 hover:bg-indigo-600/20 font-black uppercase tracking-widest text-[9px] px-4 py-2 rounded-xl border-none shadow-sm flex items-center gap-2">
                                        <ShieldCheck className="w-3.5 h-3.5" /> High Clearance
                                    </Badge>
                                    <Button 
                                        variant="outline" 
                                        size="sm" 
                                        className={`h-11 rounded-2xl px-6 font-black uppercase tracking-[0.2em] text-[10px] transition-all border-none shadow-xl ${
                                            user.status === 'inactive' 
                                            ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100' 
                                            : 'bg-red-50 text-red-600 hover:bg-red-100'
                                        }`}
                                        onClick={() => handleStatusUpdate(user._id, user.status)}
                                        disabled={isUpdating}
                                    >
                                        <Ban className="w-4 h-4 mr-2" /> {user.status === 'inactive' ? 'Restore Access' : 'Revoke Access'}
                                    </Button>
                                </div>
                            </motion.div>
                        ))
                    )}
                </AnimatePresence>
            </div>

            {/* Pagination */}
            {meta && meta.totalPages > 1 && (
                <div className="flex justify-center gap-4 mt-12 bg-white/50 p-4 rounded-[2rem] w-fit mx-auto shadow-xl shadow-indigo-500/5">
                    <Button 
                        variant="ghost" 
                        size="sm" 
                        disabled={page === 1 || isFetching} 
                        onClick={() => setPage(p => p - 1)}
                        className="h-12 px-6 rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-indigo-50 transition-all"
                    >
                        Previous Vector
                    </Button>
                    <div className="flex items-center px-6 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
                        Node {page} / {meta.totalPages}
                    </div>
                    <Button 
                        variant="ghost" 
                        size="sm" 
                        disabled={page === meta.totalPages || isFetching} 
                        onClick={() => setPage(p => p + 1)}
                        className="h-12 px-6 rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-indigo-50 transition-all"
                    >
                        Next Vector
                    </Button>
                </div>
            )}
        </motion.div>
    );
}

