"use client";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { menuItems } from "@/lib/navigation/MenuItems";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { logout, selectRole } from "@/redux/features/auth/authSlice";
import { useGetUserProfileQuery } from "@/redux/features/user/userApi";
import { getImageUrl } from "@/utils/imageUrl";
import { baseApi } from "@/redux/api/baseApi";

export function AppSidebar() {
    const pathname = usePathname();
    const role = useAppSelector(selectRole);
    // Default to admin items if role not found or just use admin items for now as requested
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
        <Sidebar className="border-r border-sidebar-border bg-sidebar">
            <SidebarContent className="bg-secondary p-4 h-full flex flex-col justify-between">
                <div>
                    <div className="p-4 pb-8">
                        <Link href="/" className="block">
                            <h1 className="font-serif text-xl text-foreground uppercase tracking-widest">ASCELA ADMIN</h1>
                            <p className="text-xs text-muted-foreground mt-1">Dashboard Control Center</p>
                        </Link>
                    </div>
                    <SidebarGroup>
                        <SidebarGroupContent>
                            <SidebarMenu className="space-y-2">
                                {items.map((item) => {
                                    const isActive = pathname === item.url;
                                    return (
                                        <SidebarMenuItem key={item.title}>
                                            <SidebarMenuButton asChild className="h-16 py-1">
                                                <Link href={item.url} className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${isActive ? "bg-primary text-white shadow-md" : "text-foreground hover:bg-white/50"}`}>
                                                    <item.icon className={`w-5 h-5 ${isActive ? "text-white" : "text-foreground"}`} />
                                                    <span className="font-medium uppercase text-sm tracking-wide">{item.title}</span>
                                                </Link>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    );
                                })}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                </div>
                
                <div className="mt-auto pt-4 border-t border-sidebar-border/50">
                    <div className="flex items-center gap-3 mb-4 px-2">
                        <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-primary/60 shadow-sm">
                            <Image
                                // src={getImageUrl(myProfile?.data?.profile) || "/user.png"}
                                src={"/user.png"}
                                alt="Profile"
                                fill
                                className="object-cover"
                            />
                        </div>
                        <div className="overflow-hidden">
                            <h2 className="text-sm font-serif uppercase tracking-widest text-primary truncate">
                                {myProfile?.data?.name || "Admin User"}
                            </h2>
                            <p className="text-xs text-muted-foreground truncate">
                                {myProfile?.data?.email || "admin@platform.dk"}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="mt-1 flex items-center justify-center gap-2 px-4 py-2 rounded-full transition-colors duration-200 bg-white text-primary hover:bg-primary hover:text-primary-foreground w-full cursor-pointer text-xs font-semibold tracking-[0.18em] uppercase border border-sidebar-border/60"
                    >
                        <span>Logout</span>
                    </button>
                </div>
            </SidebarContent>
        </Sidebar>
    );
}
