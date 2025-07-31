import { AppSidebar } from "@/Components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/Components/ui/sidebar";
import { SiteHeader } from "@/Components/site-header";
import { ReactNode } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

interface AdminLayoutProps {
    children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
    const isMobile = useIsMobile();

    return (
        <SidebarProvider>
            <div className="flex min-h-screen w-full">
                
                <div className={isMobile ? "fixed inset-0 z-40" : "relative"}>
                    <AppSidebar variant="inset" />
                </div>

                {/* Main content */}
                <div className="flex flex-1 flex-col">
                    <SiteHeader />
                    <SidebarInset>
                        <main className="flex-1 p-4 md:p-6">{children}</main>
                    </SidebarInset>
                </div>
            </div>
        </SidebarProvider>
    );
}
