"use client";

import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { Layers, LogOut, User } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { menuItems } from "@/lib/navigation/MenuItems";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { logout, selectRole } from "@/redux/features/auth/authSlice";
import { useGetUserProfileQuery } from "@/redux/features/user/userApi";
import { baseApi } from "@/redux/api/baseApi";
import { motion, AnimatePresence } from "framer-motion";

export function AppSidebar() {
    const pathname = usePathname();
    const role = useAppSelector(selectRole);
    // Default to admin items for now
    const items = menuItems["admin"]; 
    const router = useRouter();
    const dispatch = useAppDispatch();
    const { data: myProfile } = useGetUserProfileQuery();

    const handleLogout = () => {
        dispatch(logout());
        dispatch(baseApi.util.resetApiState());
        router.push("/auth/login");
        router.refresh();
    };

    return (
        <Sidebar className="border-r border-white/5 premium-sidebar shadow-2xl overflow-hidden">
            <SidebarContent className="p-0 h-full flex flex-col justify-between bg-transparent">
                <div className="flex flex-col h-full">
                    {/* Header/Branding */}
                    <div className="p-8 pb-10">
                        <Link href="/" className="flex items-center gap-4 group">
                            <motion.div 
                                whileHover={{ rotate: 180, scale: 1.1 }}
                                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                                className="w-12 h-12 bg-gradient-to-tr from-indigo-600 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/30 group-hover:shadow-indigo-500/50 transition-all duration-300"
                            >
                                <Layers className="w-7 h-7 text-white" />
                            </motion.div>
                            <div className="flex flex-col">
                                <h1 className="font-serif text-2xl text-white tracking-widest leading-none">SMART</h1>
                                <p className="text-[10px] text-indigo-300 font-bold uppercase tracking-[0.3em] mt-1.5 opacity-80">Inventory</p>
                            </div>
                        </Link>
                    </div>

                    {/* Navigation Menu */}
                    <SidebarGroup className="px-4">
                        <SidebarGroupContent>
                            <SidebarMenu className="space-y-1.5 focus:outline-none">
                                {items.map((item) => {
                                    const isActive = pathname === item.url;
                                    return (
                                        <SidebarMenuItem key={item.title} className="focus:outline-none">
                                            <SidebarMenuButton asChild className="h-12 p-0 focus:outline-none focus:ring-0">
                                                <Link 
                                                    href={item.url} 
                                                    className={`relative flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-300 group focus:outline-none ${
                                                        isActive 
                                                        ? "text-white" 
                                                        : "text-slate-400 hover:text-white hover:bg-white/5"
                                                    }`}
                                                >
                                                    {isActive && (
                                                        <motion.div
                                                            layoutId="sidebar-active"
                                                            className="absolute inset-0 bg-gradient-to-r from-indigo-600/90 to-indigo-600/40 rounded-xl -z-10 shadow-lg shadow-indigo-500/20"
                                                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                                        />
                                                    )}
                                                    <item.icon className={`w-5 h-5 transition-transform duration-300 ${isActive ? "scale-110" : "group-hover:scale-110"}`} />
                                                    <span className="font-medium text-sm tracking-wide uppercase opacity-90">{item.title}</span>
                                                    
                                                    {isActive && (
                                                        <motion.div 
                                                            initial={{ scale: 0 }}
                                                            animate={{ scale: 1 }}
                                                            className="ml-auto w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_white]"
                                                        />
                                                    )}
                                                </Link>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    );
                                })}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                </div>
                
                {/* Footer / Profile */}
                <div className="mt-auto p-6 space-y-4">
                    <div className="glass-card-dark p-4 rounded-2xl flex items-center gap-4 group/profile hover:bg-slate-800/80 transition-all duration-300">
                        <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-white/10 group-hover/profile:border-indigo-500/50 transition-colors">
                            <Image
                                src={"/user.png"}
                                alt="Profile"
                                fill
                                className="object-cover group-hover/profile:scale-110 transition-transform duration-500"
                            />
                        </div>
                        <div className="overflow-hidden">
                            <h2 className="text-sm font-bold text-white truncate group-hover/profile:text-indigo-300 transition-colors">
                                {myProfile?.data?.name || "Admin User"}
                            </h2>
                            <p className="text-[10px] text-slate-400 truncate uppercase tracking-wider font-medium">
                                {myProfile?.data?.email || "admin@platform.dk"}
                            </p>
                        </div>
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleLogout}
                        className="flex items-center justify-center gap-3 w-full py-3.5 rounded-xl text-[11px] font-bold uppercase tracking-[0.2em] transition-all duration-300 bg-white/5 hover:bg-red-500 hover:text-white border border-white/5 hover:shadow-lg hover:shadow-red-500/20 group text-slate-300"
                    >
                        <LogOut className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                        <span>Logout System</span>
                    </motion.button>
                </div>
            </SidebarContent>
        </Sidebar>
    );
}

