"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, Ban, Crown, BookOpen, Heart, Loader2 } from "lucide-react";
import Image from "next/image";
import { useGetUsersQuery, useUpdateUserStatusMutation, USER_STATUS } from "@/redux/features/user/userApi";
import { getImageUrl } from "@/utils/imageUrl";
import { toast } from "sonner";

export default function UserManagement() {
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [subscriptionFilter, setSubscriptionFilter] = useState<string>("all");
    const [page, setPage] = useState(1);

    const { data: usersResponse, isLoading, isFetching } = useGetUsersQuery({
        searchTerm: searchTerm || undefined,
        status: statusFilter !== "all" ? statusFilter as USER_STATUS : undefined,
        subscriptionTier: subscriptionFilter !== "all" ? subscriptionFilter : undefined,
        page,
        limit: 10,
    });

    const [updateUserStatus, { isLoading: isUpdating }] = useUpdateUserStatusMutation();

    const users = usersResponse?.data || [];
    const meta = usersResponse?.meta;

    const handleStatusUpdate = async (userId: string, currentStatus: string) => {
        try {
            const newStatus = currentStatus === USER_STATUS.ACTIVE ? USER_STATUS.INACTIVE : USER_STATUS.ACTIVE;
            await updateUserStatus({ id: userId, status: newStatus }).unwrap();
            toast.success(`User status updated to ${newStatus}`);
        } catch (error: any) {
            toast.error(error?.data?.message || "Failed to update status");
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
        <div className="p-6 space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-serif text-foreground uppercase tracking-widest">User Management</h1>
                <div className="flex gap-4 mt-2 text-sm text-muted-foreground">
                    <span>Total: <span className="font-bold text-foreground">{meta?.total || 0} users</span></span>
                    {/* These might need separate API calls or derived from data if meta doesn't provide them */}
                    {/* For now, showing total from meta */}
                </div>
            </div>

            {/* Filters */}
            <div className="flex gap-4">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input 
                        placeholder="Search User..." 
                        className="pl-10 bg-input border-none rounded-2xl" 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <Select value={subscriptionFilter} onValueChange={setSubscriptionFilter}>
                    <SelectTrigger className="w-[180px] bg-input border-none rounded-2xl">
                        <SelectValue placeholder="All Subscription" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Subscription</SelectItem>
                        <SelectItem value="free">Free</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="yearly">Yearly</SelectItem>
                    </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[180px] bg-input border-none rounded-2xl">
                        <SelectValue placeholder="All Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* User List */}
            <div className="space-y-4">
                {isLoading ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    </div>
                ) : users.length === 0 ? (
                    <div className="text-center py-20 text-muted-foreground bg-secondary rounded-xl">
                        No users found
                    </div>
                ) : (
                    users.map((user: any) => (
                        <div key={user._id} className="bg-secondary rounded-xl p-6 flex flex-col md:flex-row gap-6 items-start md:items-center relative">
                            <div className="relative w-16 h-16 bg-gray-300 rounded-full shrink-0 overflow-hidden">
                                {user.profile ? (
                                    <Image src={getImageUrl(user.profile)} alt={user.name || "User"} fill className="object-cover" />
                                ) : (
                                    <div className="w-full h-full bg-gray-400 flex items-center justify-center text-white text-xl font-bold">
                                        {(user.name || user.email || "?").charAt(0).toUpperCase()}
                                    </div>
                                )}
                            </div>
                            
                            <div className="flex-1 space-y-2">
                                <div className="flex items-center gap-2">
                                    <h3 className="font-serif text-lg font-medium text-foreground">{user.name || "N/A"}</h3>
                                    <Badge variant={user.status === 'active' ? 'default' : 'secondary'} className={`${user.status === 'active' ? 'bg-green-100 text-green-700 hover:bg-green-100' : 'bg-gray-200 text-gray-600 hover:bg-gray-200'} font-normal text-xs`}>
                                        {user.status}
                                    </Badge>
                                </div>
                                <div className="text-sm text-muted-foreground flex flex-col md:flex-row md:items-center gap-2 md:gap-6">
                                    <span>{user.email}</span>
                                </div>
                                <div className="text-xs text-muted-foreground flex flex-wrap gap-4 mt-1">
                                    <span className="flex items-center gap-1">📅 Joined {formatDate(user.createdAt)}</span>
                                    {/* lastActive is not in the model but we can show updatedAt if needed */}
                                    <span className="flex items-center gap-1">● Last active: {formatDate(user.updatedAt)}</span>
                                </div>
                                <div className="flex gap-4 mt-2">
                                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                        <BookOpen className="w-3 h-3" /> {user.savedRecipes?.length || 0} saved recipes
                                    </div>
                                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                        <Heart className="w-3 h-3 text-red-400" /> {user.favorites?.length || 0} favorites
                                    </div>
                                </div>
                            </div>

                            {/* Top Right Badges */}
                            <div className="absolute top-4 right-4 flex flex-col items-end gap-2">
                                <Badge className="bg-primary/20 text-primary hover:bg-primary/20 font-normal border-none flex items-center gap-1">
                                    <Crown className="w-3 h-3" /> {user.subscriptionTier || 'free'}
                                </Badge>
                                <Button 
                                    variant="outline" 
                                    size="sm" 
                                    className={`h-7 rounded-full px-4 text-xs ${user.status === 'inactive' ? 'border-green-200 text-green-500 hover:bg-green-50' : 'border-red-200 text-red-500 hover:bg-red-50 hover:text-red-600'}`}
                                    onClick={() => handleStatusUpdate(user._id, user.status)}
                                    disabled={isUpdating}
                                >
                                    <Ban className="w-3 h-3 mr-1" /> {user.status === 'inactive' ? 'Unban' : 'Ban'}
                                </Button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Pagination */}
            {meta && meta.totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-8">
                    <Button 
                        variant="outline" 
                        size="sm" 
                        disabled={page === 1 || isFetching} 
                        onClick={() => setPage(p => p - 1)}
                    >
                        Previous
                    </Button>
                    <span className="flex items-center px-4 text-sm font-medium">
                        Page {page} of {meta.totalPages}
                    </span>
                    <Button 
                        variant="outline" 
                        size="sm" 
                        disabled={page === meta.totalPages || isFetching} 
                        onClick={() => setPage(p => p + 1)}
                    >
                        Next
                    </Button>
                </div>
            )}
        </div>
    );
}
