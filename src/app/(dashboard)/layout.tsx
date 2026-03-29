import { AppSidebar } from "@/components/app-sidebar";
// import { RoleSwitcher } from "@/components/RoleSwitcher";
import { SidebarProvider } from "@/components/ui/sidebar";
import AuthenticatedGuard from "@/Provider/AuthenticatedGuard";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <AuthenticatedGuard>
            <SidebarProvider className="bg-background">
                <AppSidebar />
                <main className="w-full">
                    <div className="min-h-screen bg-background p-4 md:p-8">
                        {children}
                    </div>
                    {/* <RoleSwitcher /> */}
                </main>
            </SidebarProvider>
        </AuthenticatedGuard>
    );
}
