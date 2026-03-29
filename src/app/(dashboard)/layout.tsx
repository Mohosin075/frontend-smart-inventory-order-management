import { AppSidebar } from "@/components/app-sidebar";
// import { RoleSwitcher } from "@/components/RoleSwitcher";
import { SidebarProvider } from "@/components/ui/sidebar";
import AuthenticatedGuard from "@/Provider/AuthenticatedGuard";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <AuthenticatedGuard>
            <SidebarProvider className="bg-[#F7FAFC]">
                <AppSidebar />
                <main className="w-full p-4">
                    {children}
                    {/* <RoleSwitcher /> */}
                </main>
            </SidebarProvider>
        </AuthenticatedGuard>
    );
}
